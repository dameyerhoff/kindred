import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  // Dave: This component handles the "Handshake" manually
  // to prevent the 404 on Vercel deployments.
  return <AuthenticateWithRedirectCallback />;
}
