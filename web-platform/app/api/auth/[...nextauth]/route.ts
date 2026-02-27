import NextAuth, { NextAuthOptions, User } from "next-auth";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: (DrizzleAdapter(db) as unknown) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user || !user.password) return null;

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) return null;

        // Конвертуємо ID в string, щоб уникнути помилок типізації
        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
        } as User;
      }
    })
  ],
 callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.username = user.username;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id;
      session.user.username = token.username; 
    }
    return session;
  }
},
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };