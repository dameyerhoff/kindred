import { SignIn } from "@clerk/nextjs";

// This page shows the login box so people can sign into their accounts
export default function SignInPage() {
  return (
    // This part makes the background dark and puts the login box right in the middle
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      {/* This is the special box from Clerk that handles the username and password */}
      <SignIn />
    </div>
  );
}
