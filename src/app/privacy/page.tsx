import Link from "next/link";

export const metadata = { title: "Privacy policy · Weymouth Dance Festival" };

export default function PrivacyPage() {
  return (
    <main className="container prose">
      <h1>Privacy policy</h1>
      <p>
        This is a small private app that makes the Weymouth dance festival programme searchable.
        It is run by an individual for friends and family, not by the festival organisers.
      </p>
      <h2>What we collect</h2>
      <p>
        When you sign in with Google we receive your name, email address and profile picture.
        We use your email address only to check that you have been invited. Your sign-in is kept
        in a cookie on your device so you stay signed in.
      </p>
      <p>
        If you have been invited, your email address is stored on the invite list. Nothing else
        about you is stored, and we do not track what you search for.
      </p>
      <h2>Sharing</h2>
      <p>We do not sell or share your information with anyone.</p>
      <h2>Removing your data</h2>
      <p>
        Ask the person who invited you to remove your email address and it will be deleted from
        the invite list. You can also revoke this app&apos;s access in your Google account
        settings at any time.
      </p>
      <p>
        <Link href="/">Back to the app</Link>
      </p>
    </main>
  );
}
