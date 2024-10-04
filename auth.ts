import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";
import { compare, hash } from "bcrypt";
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Email from 'next-auth/providers/email';
import { env } from '@/env.mjs';
import { nanoid } from "./lib/utils";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string | null;
    bio?: string | null;
    website?: string | null;
    gender?: string | null;
    name?: string | null;
    token?: string | null; // Add token to JWT

  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser; // Use ExtendedUser instead of NextAuthUser
  }
}

// Define interface for the user object
export interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;

  // Add custom properties for NextAuth JWT and session
  token?: string | null; // Add token to JWT

}

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
  
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const response = await sql`
          SELECT * FROM users WHERE email=${credentials?.email}
        `;
        const user = response.rows[0];
        console.log('Database response user:', user); // Log the user object

        // Check if user and ID exist
        if (user && user.id) {
          const passwordCorrect = await compare(
            credentials?.password || "",
            user.password
          );
          console.log('Password correct:', passwordCorrect); // Log the password comparison result

          if (passwordCorrect) {
            // Return user object with ID
            return { id: user.id, email: user.email, name: user.name, image: user.image };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        // Check if the user exists
        const response = await sql`
          SELECT * FROM users WHERE email=${user?.email}
        `;
        let prismaUser = response.rows[0];

        // If the user does not exist, create a new user
        if (!prismaUser) {
          const id = nanoid(); // Generate unique id using nanoid
          const hashedPassword2 = await hash(id, 10);

          const insertResponse = await sql`
            INSERT INTO users (id, email, name, password, image) VALUES (${id}, ${user?.email}, ${user?.name}, ${hashedPassword2}, ${user?.image})
            RETURNING *
          `;
          prismaUser = insertResponse.rows[0];
        }

        // If the user exists but doesn't have a username, update it
       // if (prismaUser && !prismaUser.username) {
       //   const username = prismaUser.name?.split(' ').join('').toLowerCase();
       //   await sql`
       ///   UPDATE users SET username=${username} WHERE email=${user?.email}
     //     `;
     ///   }
      }
      return true;
    },
    async jwt({ token, user }) {
      console.log('JWT Callback - token before modification:', token); // Log the token before modification
      console.log('JWT Callback - user:', user); // Log the user

      if (user && user.id) {
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
      }
      console.log('JWT Callback - token after modification:', token); // Log the token after modification
      return token; // Return the token object after modifications
    },
    async session({ session, token }) {
      console.log('Session Callback - session before modification:', session); // Log the session before modification
      console.log('Session Callback - token:', token); // Log the token

      // If token exists and has an ID, add it to the session
      if (token && token.id) {
        session.user = {
          id: token.id,
          name: token.name || null,
          email: token.email || null,
        };
      }
      console.log('Session Callback - session after modification:', session); // Log the session after modification
      return session;
    },
  },
});

export { handler as GET, handler as POST };
