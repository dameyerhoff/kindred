import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Dave: Keeping your exact public route list
const isPublicRoute = createRouteMatcher([
  "/",
  "/setup",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // Dave: This 'await auth()' is the handshake.
  // We've seen it returning NULL, so we are keeping the log to verify the fix.
  const { userId } = await auth();

  if (request.nextUrl.pathname === "/setup") {
    console.log("DEBUG: Middleware checking /setup. UserID:", userId || "NULL");
  }

  // If it's not a public route, protect it.
  // If it IS a public route (like /setup), we still want the session to sync,
  // which is handled by the 'await auth()' call above.
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
