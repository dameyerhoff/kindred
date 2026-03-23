import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-[#061a06] text-white p-8 flex flex-col gap-8 shadow-xl min-h-screen sticky top-0">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lime-400 font-black tracking-tighter text-xl italic underline decoration-lime-400/30">
          Kindred
        </h2>
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">
          Admin Control Center
        </p>
      </div>
      <nav className="flex flex-col gap-6">
        <Link
          href="/admin"
          className="text-[10px] font-black uppercase tracking-widest hover:text-lime-400 transition-all flex items-center gap-3 group"
        >
          <span className="group-hover:scale-125 transition-transform">
            Home
          </span>
        </Link>
        <Link
          href="/admin/users"
          className="text-[10px] font-black uppercase tracking-widest hover:text-lime-400 transition-all flex items-center gap-3 group"
        >
          <span className="group-hover:scale-125 transition-transform">
            Members
          </span>
        </Link>
        <div className="mt-12 pt-6 border-t border-white/5">
          <Link
            href="/"
            className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all flex items-center gap-3"
          >
            Return to Site
          </Link>
        </div>
      </nav>
    </aside>
  );
}
