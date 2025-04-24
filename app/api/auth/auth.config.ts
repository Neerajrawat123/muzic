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
      try {
        if (account && profile) {
          if (!profile.email) {
            throw new Error("Email is required for authentication");
          }
          token.email = profile.email;
          token.id = account.access_token;
        }
        return token;
      } catch (error) {
        console.error("Error in jwt callback:", error);
        throw error;
      }
    },

    async session({ token, session }: { token: JWT; session: Session }) {
      try {
        if (!token.email) {
          throw new Error("Email is required for session");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: token.email,
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
          console.error("Database connection error:", error);
          throw new Error("Internal server error");
        }
        console.error("Error in session callback:", error);
        throw error;
      }

      return session;
    },

    async signIn({ account, profile }) {
      if (!account || !profile) {
        console.error("Missing account or profile information");
        return false;
      }

      try {
        if (account.provider === "google") {
          if (!profile.email) {
            throw new Error("Email is required for Google authentication");
          }

          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: {
              email: profile.email,
            },
          });

          if (!existingUser) {
            // Create new user
            await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || "",
                providers: "Google",
              },
            });
          }

          return true;
        }

        if (account.provider === "github") {
          if (!profile.email) {
            throw new Error("Email is required for GitHub authentication");
          }

          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: {
              email: profile.email,
            },
          });

          if (!existingUser) {
            // Create new user
            await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || "",
                providers: "Github",
              },
            });
          }

          return true;
        }

        console.error(`Unsupported provider: ${account.provider}`);
        return false;
      } catch (error) {
        if (error instanceof PrismaClientInitializationError) {
          console.error("Database connection error:", error);
          throw new Error("Internal server error");
        }
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
}; 