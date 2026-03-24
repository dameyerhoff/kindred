import { SignUp } from "@clerk/nextjs";

// This page lets new people join the Kindred community for the first time
export default function SignUpPage() {
  return (
    /* This part makes the background dark green and puts the join box in the middle */
    <div className="flex items-center justify-center min-h-screen bg-[#061a06] p-4">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        /* Once they finish signing up, this takes them to the page to set up their profile */
        fallbackRedirectUrl="/setup"
      />
    </div>
  );
}
