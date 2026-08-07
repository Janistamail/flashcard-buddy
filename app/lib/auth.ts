import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Cloud Run terminates TLS at its own proxy and forwards plain HTTP, so
  // Auth.js can't verify the host itself. Without this it throws
  // UntrustedHost, which the client sees as this same generic config error.
  trustHost: true,
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
