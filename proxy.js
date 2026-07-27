import { clerkMiddleware } from "@clerk/nextjs/server";

// Attach Clerk authentication state to matched resources. Authorization is
// enforced inside each page and API handler, next to the protected data.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/workspace/:path*",
    "/api/:path*",
    "/trpc/:path*",
  ],
};
