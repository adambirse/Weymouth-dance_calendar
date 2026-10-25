import Link from "next/link";

export const metadata = { title: "Terms of service · Weymouth Dance Festival" };

export default function TermsPage() {
  return (
    <main className="container prose">
      <h1>Terms of service</h1>
      <p>
        This app is a free, private tool that makes the Weymouth dance festival programme
        searchable. It is only for people who have been invited.
      </p>
      <p>
        The programme is typed up from the printed festival programme and may contain mistakes
        or be out of date. Always check timings with the official programme and announcements on
        the day. The app is provided as it is, with no guarantees.
      </p>
      <p>Please don&apos;t share access with people who haven&apos;t been invited.</p>
      <p>
        <Link href="/">Back to the app</Link>
      </p>
    </main>
  );
}
