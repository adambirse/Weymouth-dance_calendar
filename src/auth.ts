import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAllowed } from "@/lib/allowlist";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email;
      return Boolean(email && profile?.email_verified && (await isAllowed(email)));
    },
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
  },
});
