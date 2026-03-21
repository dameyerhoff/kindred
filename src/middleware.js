import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Dave: Adding /__clerk to the public routes so the proxy can load scripts!
const isPublicRoute = createRouteMatcher([
  "/",
  "/setup",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/__clerk(.*)", // <--- THIS IS THE KEY FIX FOR THE 404s
]);

export default clerkMiddleware(async (auth, request) => {
  // Dave: Check if it's a private route FIRST.
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // Dave: Diagnostic tracer for the /setup flow
  const { userId } = await auth();

  if (request.nextUrl.pathname === "/setup") {
    console.log("DEBUG: Middleware checking /setup. UserID:", userId || "NULL");
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
