"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { finalizeMission, updateMissionTerms } from "../app/actions";

export default function NegotiationCard({ activeMission }) {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("mode") === "edit";

  async function handleSubmit(formData) {
    if (isEdit) {
      await updateMissionTerms(formData);
    } else {
      await finalizeMission(formData);
    }
  }

  return (
    <div className="bg-kindred-dark/50 border-2 border-kindred-lime p-8 rounded-[3rem] shadow-kindred animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-kindred-lime font-black uppercase text-[10px] tracking-widest">
          {isEdit ? "🔄 Re-negotiate Terms" : "🤝 Mission Negotiation"}
        </h2>
        <Link
          href="/"
          className="text-[10px] font-bold opacity-40 hover:opacity-100 uppercase"
        >
          Cancel ×
        </Link>
      </div>
      <p className="text-xl font-bold italic mb-6 text-white">
        &ldquo;{activeMission.favour_text}&rdquo;
      </p>
      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="favourId" value={activeMission.id} />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            required
            defaultValue={activeMission.scheduled_date || ""}
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white"
          />
          <input
            type="time"
            name="time"
            required
            defaultValue={activeMission.scheduled_time || ""}
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold text-white"
          />
        </div>
        <textarea
          name="exchange"
          placeholder="Details of favour in return..."
          defaultValue={activeMission.exchange_details || ""}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs h-24 text-white"
        />
        <button
          type="submit"
          className="w-full bg-kindred-lime text-kindred-dark py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:brightness-110 shadow-kindred/20 transition-all"
        >
          {isEdit ? "Update Agreement 🔄" : "Confirm Terms & Lock Mission 🔒"}
        </button>
      </form>
    </div>
  );
}
