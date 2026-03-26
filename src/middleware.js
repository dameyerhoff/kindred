import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/setup",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const authObj = await auth();

  // If not public and no userId, protect the route
  if (!isPublicRoute(request) && !authObj.userId) {
    await authObj.protect();
  }

  // Debugging log using the already fetched auth object
  if (request.nextUrl.pathname === "/setup") {
    console.log(
      "DEBUG: Middleware checking /setup. UserID:",
      authObj.userId || "NULL",
    );
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
