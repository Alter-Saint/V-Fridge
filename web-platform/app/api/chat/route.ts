import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db/db";
import { chat as chatTable, products } from "@/lib/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";
import { ratelimit } from "@/lib/ratelimit";
import { chatSchema } from "@/interfaces/schemas";
import { chatCache } from "@/lib/chat-cache";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = Number(session.user.id);
    const timeLimit = new Date();
    timeLimit.setHours(timeLimit.getHours() - 24);
    const isoLimit = timeLimit.toISOString();

    let history = await chatCache.get(userId);

    if (history.length === 0) {
      history = await db.query.chat.findMany({
        where: and(
          eq(chatTable.userId, userId),
          gte(chatTable.createdAt, isoLimit)
        ),
        orderBy: (chatTable, { asc }) => [asc(chatTable.createdAt)],
        limit: 20,
      });
      
      if (history.length > 0) {
        for (const msg of history) await chatCache.save(userId, msg);
      }
    }

    return NextResponse.json(history);
  } catch (error) {
    console.error("[CHAT_GET_ERROR]:", error);
    return NextResponse.json({ error: "Помилка завантаження." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = Number(session.user.id);
    const json = await req.json();
    const result = chatSchema.safeParse(json);
    if (!result.success) return NextResponse.json({ error: "Empty message" }, { status: 400 });
    
    const { content } = result.data;

    const { success } = await ratelimit.limit(session.user.id);
    if (!success) return NextResponse.json({ role: "assistant", content: "⚠️ Забагато запитів. Спробуйте через хвилину." }, { status: 429 });

    const timeLimit = new Date();
    timeLimit.setHours(timeLimit.getHours() - 24);
    const isoLimit = timeLimit.toISOString();

    const userProducts = await db.query.products.findMany({ where: eq(products.ownerId, userId) });
    const productsContext = userProducts.length > 0 
      ? userProducts.map(p => `${p.name} (${p.quantity} ${p.unit})`).join(", ")
      : "Холодильник порожній";

    const historyData = await db.query.chat.findMany({
      where: and(
        eq(chatTable.userId, userId),
        gte(chatTable.createdAt, isoLimit)
      ),
      orderBy: (chatTable, { asc }) => [asc(chatTable.createdAt)],
      limit: 6,
    });

    const formattedHistory = historyData.map(m => ({
      role: m.role === "assistant" ? "model" : ("user" as const),
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: `Ти шеф-кухар V-Fridge, твоя задача дати швидкий рецепт. Продукти: ${productsContext}. Запит: ${content}` }] }
      ],
    });

    const aiResponse = response.text;

    await db.delete(chatTable).where(
      and(
        eq(chatTable.userId, userId),
        lt(chatTable.createdAt, isoLimit)
      )
    );

    await db.insert(chatTable).values({ userId, role: "user", content });
    const [aiMsg] = await db.insert(chatTable).values({
      userId,
      role: "assistant",
      content: aiResponse || "Вибачте, я не зміг сформувати відповідь.",
    }).returning();

    return NextResponse.json(aiMsg);

  } catch (error: any) {
    const status = error.status || error.response?.status || 500;
    console.error(`[CHAT_POST_ERROR] Status: ${status}`, error);

    if (status === 429) {
        return NextResponse.json(
            { role: "assistant", content: "⚠️ Перевищено ліміт запитів (Free Tier). Зачекайте хвилину." },
            { status: 429 } 
        );
    }

    return NextResponse.json(
        { role: "assistant", content: "⚠️ Сталася внутрішня помилка сервісу." },
        { status: 500 }
    );
  }
}