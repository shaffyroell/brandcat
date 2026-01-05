import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        let user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            brand: true
          }
        });

        // Auto-create user if doesn't exist (for demo purposes)
        if (!user) {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);

          // Check if this is the first user (make them brand owner)
          const userCount = await prisma.user.count();
          const isFirstUser = userCount === 0;

          // Create brand for first user
          let brandId = null;
          if (isFirstUser) {
            const brand = await prisma.brand.create({
              data: {
                name: "My Brand",
              },
            });
            brandId = brand.id;
          }

          user = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: credentials.email.split('@')[0],
              role: isFirstUser ? "BRAND_OWNER" : "USER",
              brandId: brandId,
            },
            include: {
              brand: true
            }
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            brandId: user.brandId,
          };
        }

        // Verify existing user password
        if (!user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          brandId: user.brandId,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.brandId = user.brandId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.brandId = token.brandId as string | null;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "brandcat-secret-key-change-in-production-please",
};
