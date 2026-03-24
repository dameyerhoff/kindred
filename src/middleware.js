import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This list tells the website which pages anyone can see without logging in
const isPublicRoute = createRouteMatcher([
  "/",
  "/setup",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
]);

// This is the security guard for the website that checks every visitor
export default clerkMiddleware(async (auth, request) => {
  // If the page is not on the public list, make sure the user is logged in
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // This part helps us see if the setup page is working correctly for logged-in users
  const { userId } = await auth();

  if (request.nextUrl.pathname === "/setup") {
    console.log("DEBUG: Middleware checking /setup. UserID:", userId || "NULL");
  }
});

export const config = {
  // This tells the security guard exactly which files and folders to watch
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
