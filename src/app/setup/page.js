"use client";
import { saveProfile, getProfiles } from "../actions";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";

const KINDRED_BANK = [
  { label: "Admin Support", slug: "admin-support" },
  { label: "Animal Care", slug: "animal-care" },
  { label: "Art & Illustration", slug: "art-illustration" },
  { label: "Baking", slug: "baking" },
  { label: "Bicycle Repair", slug: "bicycle-repair" },
  { label: "Bookkeeping", slug: "bookkeeping" },
  { label: "Car Washing", slug: "car-washing" },
  { label: "Cleaning", slug: "cleaning" },
  { label: "Cooking", slug: "cooking" },
  { label: "CV Writing", slug: "cv-writing" },
  { label: "DIY & Repairs", slug: "diy-repairs" },
  { label: "Dog Walking", slug: "dog-walking" },
  { label: "Driving", slug: "driving" },
  { label: "Electrician", slug: "electrician" },
  { label: "Event Planning", slug: "event-planning" },
  { label: "Furniture Assembly", slug: "furniture-assembly" },
  { label: "Gardening", slug: "gardening" },
  { label: "Graphic Design", slug: "graphic-design" },
  { label: "Heavy Lifting", slug: "heavy-lifting" },
  { label: "Ironing", slug: "ironing" },
  { label: "IT Support", slug: "it-support" },
  { label: "Language Lessons", slug: "language-lessons" },
  { label: "Music Lessons", slug: "music-lessons" },
  { label: "Painting", slug: "painting" },
  { label: "PC Repair", slug: "pc-repair" },
  { label: "Photography", slug: "photography" },
  { label: "Plumbing", slug: "plumbing" },
  { label: "Proofreading", slug: "proofreading" },
  { label: "Sewing", slug: "sewing" },
  { label: "Shopping", slug: "shopping" },
  { label: "Translation", slug: "translation" },
  { label: "Tutoring", slug: "tutoring" },
  { label: "Web Design", slug: "web-design" },
  { label: "Yoga Instruction", slug: "yoga-instruction" },
].sort((a, b) => a.label.localeCompare(b.label));

export default function SetupPage() {
  const { userId, isLoaded } = useAuth();
  const [myProfile, setMyProfile] = useState(null);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (userId) {
        // FIXED: Dynamically import to separate client and server boundaries
        const { getProfiles } = await import("../actions");
        const profiles = await getProfiles();
        const found = profiles?.find((p) => p.clerk_id === userId);
        if (found) {
          setMyProfile(found);
          let savedTags = found.tags || [];
          if (typeof savedTags === "string") {
            try {
              savedTags = JSON.parse(savedTags);
            } catch (e) {
              savedTags = [];
            }
          }
          setTags(Array.isArray(savedTags) ? savedTags : []);
        }
      }
      setLoading(false);
    }
    if (isLoaded) {
      loadData();
    }
  }, [userId, isLoaded]);

  const addTag = (item) => {
    if (!tags.find((t) => t.slug === item.slug)) {
      setTags([...tags, item]);
    }
    setSearch("");
  };

  const removeTag = (slugToRemove) => {
    setTags(tags.filter((t) => t.slug !== slugToRemove));
  };

  const createCustomTag = (name) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    addTag({ label: name, slug: slug });
  };

  const onFormSubmit = (e) => {
    const hiddenInput = e.currentTarget.querySelector('input[name="tags"]');
    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(tags);
    }
    await saveProfile(formData);
  };

  if (!isLoaded || loading) return null;

  if (!userId) {
    return (
      <main className="min-h-screen bg-kindred-bg flex items-center justify-center p-6 text-kindred-text text-center transition-colors duration-300">
        <div className="w-full max-w-md bg-black/5 dark:bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-black/10 dark:border-white/10">
          <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">
            Identity Required
          </h2>
          <SignInButton mode="modal">
            <button className="w-full bg-kindred-lime hover:bg-kindred-text dark:hover:bg-white text-kindred-dark dark:hover:text-kindred-dark font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-sm shadow-kindred">
              Log In to Kindred
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden flex items-center justify-center transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10">
        <Link
          href="/"
          className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-kindred-lime hover:opacity-70 transition-all mb-8 border border-kindred-lime/20 px-4 py-2 rounded-full hover:bg-kindred-lime/10"
        >
          &larr; Back to Dashboard
        </Link>

        {/* This is the main box for the profile form */}
        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-3xl border border-black/10 dark:border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl">
          <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">
            {myProfile ? "Manage Profile" : "Create Profile"}
          </h2>
          <p className="text-kindred-lime/60 text-xs font-bold uppercase tracking-[0.2em] mb-10">
            {myProfile
              ? "Update your kindred spirit details"
              : "Join the kindred guardian network"}
          </p>

          <form
            action={saveProfile}
            onSubmit={onFormSubmit}
            className="space-y-6"
          >
            <input type="hidden" name="tags" value={JSON.stringify(tags)} />

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-40">
                Full Name
              </label>
              <input
                name="full_name"
                defaultValue={myProfile?.full_name || ""}
                className="w-full p-4 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 focus:border-kindred-lime/50 outline-none text-kindred-text font-bold transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-40">
                  City
                </label>
                <input
                  name="city"
                  defaultValue={myProfile?.city || ""}
                  className="w-full p-4 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 focus:border-kindred-lime/50 outline-none text-kindred-text font-bold transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-40">
                  Postcode
                </label>
                <input
                  name="postcode"
                  defaultValue={myProfile?.postcode || ""}
                  className="w-full p-4 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 focus:border-kindred-lime/50 outline-none text-kindred-text font-bold transition-colors"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-40">
                Skills & Interests (Your Offerings)
              </label>

              <div className="flex flex-wrap gap-2 mb-4">
                {tags
                  .filter((tag) => tag && tag.slug)
                  .map((tag, index) => (
                    <button
                      key={`${tag.slug}-${index}`}
                      type="button"
                      onClick={() => removeTag(tag.slug)}
                      className="bg-kindred-lime text-kindred-dark text-[10px] font-black px-3 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all uppercase flex items-center gap-2 group"
                    >
                      {tag.label}{" "}
                      <span className="opacity-50 group-hover:opacity-100">
                        &times;
                      </span>
                    </button>
                  ))}
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search (e.g. Gardening, Baking...)"
                className="w-full p-4 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 focus:border-kindred-lime/50 outline-none text-kindred-text font-bold transition-all placeholder:opacity-30"
              />

              {search && (
                <div className="absolute z-20 w-full mt-2 bg-kindred-bg dark:bg-kindred-dark border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-48 overflow-y-auto">
                  {KINDRED_BANK.filter(
                    (item) =>
                      item.label.toLowerCase().includes(search.toLowerCase()) &&
                      !tags.some((t) => t?.slug === item.slug),
                  ).map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => addTag(item)}
                      className="w-full text-left p-4 hover:bg-kindred-lime hover:text-kindred-dark font-bold text-sm transition-colors border-b border-black/5 dark:border-white/5 last:border-0"
                    >
                      + {item.label}
                    </button>
                  ))}
                  {search.length > 2 &&
                    !KINDRED_BANK.some(
                      (i) => i.label.toLowerCase() === search.toLowerCase(),
                    ) && (
                      <button
                        type="button"
                        onClick={() => createCustomTag(search)}
                        className="w-full text-left p-4 bg-black/5 dark:bg-white/5 hover:bg-kindred-lime hover:text-kindred-dark font-bold text-xs italic transition-colors"
                      >
                        Add custom: "{search}"
                      </button>
                    )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-kindred-text dark:bg-white text-kindred-bg dark:text-kindred-dark hover:bg-kindred-lime dark:hover:bg-kindred-lime font-black py-5 rounded-[2rem] shadow-2xl transition-all active:scale-95 uppercase tracking-widest text-sm"
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
