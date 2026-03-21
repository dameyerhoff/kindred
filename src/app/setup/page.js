import { saveProfile, getProfiles } from "../actions";
import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function SetupPage() {
  const { userId } = await auth();

  // Dave: Fetching all profiles and finding yours to "Auto-Fill" the form
  const profiles = (await getProfiles()) || [];
  const myProfile = profiles.find((p) => p.clerk_id === userId);

  if (!userId) {
    return (
      <main className="min-h-screen bg-[#061a06] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 text-center">
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">
            Identity Required
          </h2>
          <SignInButton mode="modal">
            <button className="w-full bg-lime-400 hover:bg-white text-green-950 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(163,230,53,0.3)]">
              Log In to Kindred
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#061a06] p-4 md:p-8 text-white relative overflow-hidden flex items-center justify-center">
      {/* Dave: Signature green glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-green-500/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10">
        <Link
          href="/"
          className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-lime-400 hover:text-white transition-all mb-8 border border-lime-400/20 px-4 py-2 rounded-full hover:bg-lime-400/10"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl">
          <h2 className="text-4xl font-black mb-2 text-white tracking-tighter uppercase">
            {myProfile ? "Manage Profile" : "Create Profile"}
          </h2>
          <p className="text-lime-400/60 text-xs font-bold uppercase tracking-[0.2em] mb-10">
            {myProfile
              ? "Update your kindred spirit details"
              : "Join the kindred guardian network"}
          </p>

          <form action={saveProfile} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-white/40">
                Full Name
              </label>
              <input
                name="full_name"
                defaultValue={myProfile?.full_name || ""}
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 focus:border-lime-400/50 outline-none text-white transition-all font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-white/40">
                  City
                </label>
                <input
                  name="city"
                  defaultValue={myProfile?.city || ""}
                  className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 focus:border-lime-400/50 outline-none text-white transition-all font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-white/40">
                  Postcode
                </label>
                <input
                  name="postcode"
                  defaultValue={myProfile?.postcode || ""}
                  className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 focus:border-lime-400/50 outline-none text-white transition-all font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-white/40">
                Skills (What you offer)
              </label>
              <input
                name="skills"
                defaultValue={myProfile?.skills?.join(", ") || ""}
                placeholder="Painting, Baking, Coding"
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 focus:border-lime-400/50 outline-none text-white transition-all font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-white/40">
                Interests (What you seek)
              </label>
              <input
                name="interests"
                defaultValue={myProfile?.interests?.join(", ") || ""}
                placeholder="Gardening, Dogs, Music"
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 focus:border-lime-400/50 outline-none text-white transition-all font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-white text-green-900 hover:bg-lime-400 font-black py-5 rounded-[2rem] shadow-2xl transition-all active:scale-95 uppercase tracking-widest text-sm"
            >
              {myProfile
                ? "Update Guardian Details 😇"
                : "Save & Join Kindred 😇"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
