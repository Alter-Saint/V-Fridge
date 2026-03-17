import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db/db";
import { products } from "@/lib/db/schema";
import { productSchema, updateProductSchema } from "@/interfaces/schemas";
import { eq, and } from "drizzle-orm";
import { getErrorMessage } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userProducts = await db.query.products.findMany({
      where: eq(products.ownerId, Number(session.user.id)),
      orderBy: (products, { asc }) => [asc(products.expiryDate)],
    });

    return NextResponse.json(userProducts);
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("[PRODUCTS_GET_ERROR]:", errorMessage);
    return NextResponse.json({ error: "Не вдалося завантажити список продуктів." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const json = await req.json();
    const result = productSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const [newProduct] = await db.insert(products).values({
      ...result.data,
      quantity: String(result.data.quantity),
      expiryDate: result.data.expiryDate ? new Date(result.data.expiryDate).toISOString() : null,
      ownerId: Number(session.user.id),
    }).returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("[PRODUCTS_POST_ERROR]:", errorMessage);
    return NextResponse.json({ error: "Помилка при створенні продукту." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const json = await req.json();
    const result = updateProductSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const { id, ...updates } = result.data;

    const [updatedProduct] = await db
      .update(products)
      .set({
        ...updates,
       quantity: updates.quantity ? String(updates.quantity) : undefined,
       expiryDate: updates.expiryDate ? new Date(updates.expiryDate).toISOString() : undefined,
       ownerId: session.user.id ? Number(session.user.id) : undefined,
      })
      .where(and(eq(products.id, id), eq(products.ownerId, Number(session.user.id))))
      .returning();

    if (!updatedProduct) return NextResponse.json({ error: "Продукт не знайдено" }, { status: 404 });

    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("[PRODUCTS_PATCH_ERROR]:", errorMessage);
    return NextResponse.json({ error: "Не вдалося оновити продукт." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id || isNaN(id)) return NextResponse.json({ error: "Невірний ID" }, { status: 400 });

    const [deletedProduct] = await db
      .delete(products)
      .where(and(eq(products.id, id), eq(products.ownerId, Number(session.user.id))))
      .returning();

    if (!deletedProduct) return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("[PRODUCTS_DELETE_ERROR]:", errorMessage);
    return NextResponse.json({ error: "Помилка при видаленні." }, { status: 500 });
  }
}