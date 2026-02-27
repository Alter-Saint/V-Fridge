import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db/db";
import { chat as chatTable, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";
import { ratelimit } from "@/lib/ratelimit";
import { chatSchema } from "@/interfaces/schemas";
import { getErrorMessage } from "@/lib/utils";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json([]);

    const userId = Number(session.user.id);

    const history = await db.query.chat.findMany({
      where: eq(chatTable.userId, userId),
      orderBy: (chatTable, { asc }) => [asc(chatTable.createdAt)],
      limit: 50,
    });

    return NextResponse.json(history);
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("[CHAT_GET_ERROR]:", errorMessage);
    return NextResponse.json({ error: "Не вдалося завантажити історію." }, { status: 500 });
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

    const userProducts = await db.query.products.findMany({ where: eq(products.ownerId, userId) });
    const productsContext = userProducts.length > 0 
      ? userProducts.map(p => `${p.name} (${p.quantity} ${p.unit})`).join(", ")
      : "Холодильник порожній";

    const historyData = await db.query.chat.findMany({
      where: eq(chatTable.userId, userId),
      orderBy: (chatTable, { asc }) => [asc(chatTable.createdAt)],
      limit: 6,
    });

    const formattedHistory = historyData.map(m => ({
      role: m.role === "assistant" ? "model" : "user" as const,
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: [
        { role: "user", parts: [{ text: `Ти шеф-кухар V-Fridge. Продукти: ${productsContext}. Запит: ${content}` }] },
        ...formattedHistory
      ],
    });

    const aiResponse = response.text;

    await db.insert(chatTable).values({ userId, role: "user", content });
    const [aiMsg] = await db.insert(chatTable).values({
      userId,
      role: "assistant",
      content: aiResponse || "Вибачте, я не зміг сформувати відповідь.",
    }).returning();

    return NextResponse.json(aiMsg);

  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("[CHAT_POST_ERROR]:", errorMessage);
    return NextResponse.json({ role: "assistant", content: "⚠️ Вибачте, сталася внутрішня помилка сервісу." }, { status: 200 });
  }
}