import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signUpSchema } from "@/interfaces/schemas";
import { getErrorMessage } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = signUpSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const { email, username, password } = result.data;

    const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existingUser) return NextResponse.json({ error: "Користувач з таким email вже існує" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({ email, username, password: hashedPassword }).returning();

    return NextResponse.json({ id: newUser.id, username: newUser.username, email: newUser.email }, { status: 201 });

  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error("[SIGNUP_ERROR]:", errorMessage);
    return NextResponse.json({ error: "Помилка при реєстрації. Спробуйте пізніше." }, { status: 500 });
  }
}