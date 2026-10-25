import { auth, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="container">
      <h1>Weymouth Dance Festival</h1>
      <p>Hello, {session?.user?.name ?? "dancer"}! The searchable programme is coming soon.</p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
