export { auth as middleware } from "@/auth";

export const config = {
  runtime: "nodejs",
  // Protect every page except the auth routes and static assets
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
