import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

// This page acts like a secret handshake to let you back in after you log in with Google or Facebook
export default function SSOCallbackPage() {
  // This part finishes the login process so the website knows exactly who you are
  return <AuthenticateWithRedirectCallback />;
}
