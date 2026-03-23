// import AboutUsAnimation from "./AboutUsAnimation";
import AboutUsAnimation from "@/components/AboutUsAnimation";
// import BackButton from "@/components/BackButton";
// import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen">
      {/* <BackButton href="/" label="← Back to your Profile" /> */}
      {/* <Link
        href="/"
        className="text-lime-400 text-xs font-black uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2 mb-8"
      >
        ← Back to your Profile
      </Link> */}
      <AboutUsAnimation />
    </div>
  );
}
