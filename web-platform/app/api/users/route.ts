import { NextResponse } from "next/server";
import { db } from "@/lib/db/db"; 
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (email) {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      return NextResponse.json(user || { error: "User not found" });
    }

    const allUsers = await db.select().from(users);
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Помилка при отриманні користувачів:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}