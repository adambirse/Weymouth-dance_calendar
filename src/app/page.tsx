import { signOut } from "@/auth";
import Programme from "./Programme";

export default function Home() {
  return (
    <main className="container">
      <div className="topbar">
        <h1>Weymouth Dance Festival</h1>
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
      <Programme />
    </main>
  );
}
