import Link from "next/link";
import { auth, signOut } from "@/auth";
import { isAdmin } from "@/lib/allowlist";
import Home from "./Home";

export default async function Page() {
  const session = await auth();

  return (
    <main className="container">
      <div className="topbar">
        <h1>Weymouth Dance Festival</h1>
        <div className="topbar-links">
          {isAdmin(session?.user?.email) && <Link href="/admin">Users</Link>}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="link">
              Sign out
            </button>
          </form>
        </div>
      </div>
      <Home />
    </main>
  );
}
