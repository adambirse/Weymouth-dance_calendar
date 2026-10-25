import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Comma-separated list of emails allowed to sign in, e.g. "a@x.com,b@y.com"
const allowedEmails = (process.env.ALLOWED_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  callbacks: {
    signIn({ profile }) {
      const email = profile?.email?.toLowerCase();
      return Boolean(email && profile?.email_verified && allowedEmails.includes(email));
    },
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
  },
});
