import { User, usr } from "@/lib/firebase/users";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await usr.getUser(email, "email");
    if (!user) return null;

    return {
      ...user,
    };
  } catch (error) {
    throw new Error("Failed to fetch user.");
  }
}

// NextAuth configuration
const authConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          throw new Error("Invalid email or password format.");
        }

        const { email, password } = parsedCredentials.data;

        const user = await getUser(email);

        if (!user) {
          throw new Error("User not found.");
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          throw new Error("Invalid email or password.");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/admin-login", // Your custom sign-in page
    error: "/admin-login", // Redirect to login page on error
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ session, token, user }) {
      const data = {
        ...token,
        ...user,
        name: user?.name,
      };
      return data;
    },

    async session({ session, token }) {
      const user = await usr.getUser(token.id, "id");

      if (user) {
        const exclude: (keyof User)[] = ["password", "createdAt", "updatedAt"];
        exclude.forEach((key) => {
          delete user[key];
        });

        session.user = {
          ...user,
          name: user.username,
          image: null,
        };
      }

      return {
        user: session.user,
        expires: session.expires,
      };
    },
  },
  events: {
    // async session({ session, token }) {
    //   const id = token.id as string;
    //   if (token.session === "unauthenticated") {
    //     await usr.updateSession(id, "authenticated");
    //   }
    // },
    // async signIn({ user }) {
    //   const id = user.id as string;
    //   await usr.updateSession(id!, "authenticated");
    // },
    // async signOut({ token }) {
    //   await usr.updateSession(token.id!, "unauthenticated");
    // },
  },
} as NextAuthOptions;

export default authConfig;
