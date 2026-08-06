import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Database sessions don't expose the User row's id on session.user by
    // default (Auth.js's default session callback only copies name/email/
    // image). Vocabulary and Play Session ownership scoping both need it.
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
