import { NextAuthOptions, DefaultSession, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { JWT } from "next-auth/jwt";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string | null;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.email = profile.email as string;
        token.id = account.access_token;
      }
      return token;
    },
    async session({ token, session }: { token: JWT; session: Session }) {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: token.email as string,
          },
        });

        if (user && session.user) {
          session.user = {
            ...session.user,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      } catch (error) {
        if (error instanceof PrismaClientInitializationError) {
          throw new Error("Internal server error");
        }
        console.log(error);
        throw error;
      }

      return session;
    },

    async signIn({ account, profile }) {
      if (!account || !profile) return false;

      try {
        if (account.provider === "google") {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: {
              email: profile.email || "",
            },
          });

          if (!existingUser) {
            // Create new user
            await prisma.user.create({
              data: {
                email: profile.email || "",
                name: profile.name || "",
                providers: "Google",
              },
            });
            return true;
          }

          return true;
        }
        return false;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
}; 