import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Dave: Your exact public route list
const isPublicRoute = createRouteMatcher([
  "/",
  "/setup",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // Dave: Check if it's a private route FIRST.
  // If it's NOT public, protect it immediately.
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // Dave: Now that we've cleared the "Gatekeeper," we can safely check the userId
  // for your diagnostic logs without accidentally blocking the public homepage.
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
