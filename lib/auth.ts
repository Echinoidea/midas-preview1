// lib/auth.ts
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

interface CustomToken {
  id?: string;
  email?: string;
  username?: string;
  school_id?: string;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // Allow logging in with either a username or an email
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        let user;
        if (credentials?.username) {
          user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });
        } else if (credentials?.email) {
          user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
        }
        if (!user) return null;

        console.log("Comparing passwords")
        const passwordCorrect = await compare(credentials!.password, user.hashedPassword);
        if (!passwordCorrect) return null;

        // Return the user object expected by NextAuth.
        // we return false by default.
        return {
          id: user.id.toString(),
          email: user.email,
          username: user.username || "",
          school_id: user.schoolId ? user.schoolId.toString() : ""
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.school_id = user.school_id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        username: token.username as string,
        school_id: token.school_id as string,
      };
      return session;
    },
  },
};

export default authOptions;
