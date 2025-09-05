import { api } from "@/utils/api";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const nextAuthOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Strapi",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const { data, success, status } = await api.post<{
          user: {
            id: number;
            username: string;
            email: string;
            blocked: boolean;
            confirmed: boolean;
          };
          jwt: string;
        }>(
          "/auth/local",
          {
            identifier: credentials?.email,
            password: credentials?.password,
          },
          {},
          ""
        );
        // Errors
        if (status >= 500) throw new Error("SERVER_ERROR");
        if (!success || !data || !data.user || !data.jwt) return null;
        if (data.user.blocked) throw new Error("BLOCKED");
        if (!data.user.confirmed) throw new Error("NOT_CONFIRMED");

        return {
          id: data.user.id.toString(),
          name: data.user.username,
          email: data.user.email,
          jwt: data.jwt,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = (user as any).jwt;
      }
      return token;
    },
    async session({ session, token }) {
      session.jwt = token.jwt;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 29 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default nextAuthOptions;
