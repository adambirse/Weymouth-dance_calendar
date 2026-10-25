import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  addEmail,
  adminEmails,
  envAllowedEmails,
  isAdmin,
  listStoredEmails,
  removeEmail,
  storageConnected,
} from "@/lib/allowlist";

async function requireAdmin() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) notFound();
}

async function add(formData: FormData) {
  "use server";
  await requireAdmin();
  const email = String(formData.get("email") ?? "");
  if (/^\S+@\S+\.\S+$/.test(email.trim())) await addEmail(email);
  revalidatePath("/admin");
}

async function remove(formData: FormData) {
  "use server";
  await requireAdmin();
  await removeEmail(String(formData.get("email") ?? ""));
  revalidatePath("/admin");
}

export default async function AdminPage() {
  await requireAdmin();
  const stored = await listStoredEmails();

  return (
    <main className="container">
      <div className="topbar">
        <h1>Manage users</h1>
        <Link href="/">Back to programme</Link>
      </div>

      {!storageConnected ? (
        <p className="note">
          Storage isn&apos;t connected yet, so users can only be added through the
          ALLOWED_EMAILS setting in Vercel.
        </p>
      ) : (
        <>
          <form action={add} className="add-user">
            <input type="email" name="email" placeholder="name@gmail.com" required />
            <button type="submit">Add</button>
          </form>
          <p className="note">
            New users also need adding as a test user in Google Cloud while the app is in
            Testing mode.
          </p>
          <ul className="users">
            {stored.length === 0 && <li className="note">No users added here yet.</li>}
            {stored.map((email) => (
              <li key={email}>
                <span>{email}</span>
                <form action={remove}>
                  <input type="hidden" name="email" value={email} />
                  <button type="submit" className="link">
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Set in Vercel</h2>
      <p className="note">These can only be changed in Vercel&apos;s environment variables.</p>
      <ul className="users">
        {[...new Set([...adminEmails, ...envAllowedEmails])].map((email) => (
          <li key={email}>
            <span>{email}</span>
            <span className="note">{adminEmails.includes(email) ? "admin" : "user"}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
