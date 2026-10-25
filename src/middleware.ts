export { auth as middleware } from "@/auth";

export const config = {
  runtime: "nodejs",
  // Protect every page except the auth routes, the public legal pages and static assets
  matcher: ["/((?!api/auth|privacy|terms|_next/static|_next/image|favicon.ico).*)"],
};
