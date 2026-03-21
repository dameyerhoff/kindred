"use client";

import { saveProfile } from "../actions";
import { SignInButton, useAuth } from "@clerk/nextjs";

export default function SetupPage() {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
        Loading Kindred...
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-2xl">
        {!userId && (
          <div className="mb-8 p-4 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col gap-2">
            <p className="text-sm text-slate-300">Already registered?</p>
            <SignInButton mode="modal">
              <button className="w-full bg-slate-700 hover:bg-slate-600 text-blue-400 font-bold py-2 rounded-lg transition-colors text-sm border border-slate-600">
                Log In to your account
              </button>
            </SignInButton>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-blue-500">
          Complete Your Profile
        </h2>

        <form action={saveProfile} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1 text-slate-400">
              Full Name
            </label>
            <input
              name="full_name"
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-white"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1 text-slate-400">City</label>
              <input
                name="city"
                className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-white"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-sm mb-1 text-slate-400">
                Postcode
              </label>
              <input
                name="postcode"
                className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-400">
              Skills (Offers)
            </label>
            <input
              name="skills"
              placeholder="Painting, Baking, Coding"
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-400">
              Interests (Seeking)
            </label>
            <input
              name="interests"
              placeholder="Gardening, Dogs, Music"
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-white"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95"
          >
            Save Profile & Join Kindred
          </button>
        </form>
      </div>
    </main>
  );
}
