import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    /* Dave: Centers the Clerk box and matches your deep green aesthetic */
    <div className="flex items-center justify-center min-h-screen bg-[#061a06] p-4">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        /* Dave: This sends them straight to the profile setup after they join */
        fallbackRedirectUrl="/setup"
      />
    </div>
  );
}
