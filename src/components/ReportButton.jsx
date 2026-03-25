"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { reportUserAction } from "@/lib/actions";

export default function ReportButton({ reportUserId, evidence }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors">
          🚩 Report
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md bg-kindred-dark border border-red-500/20 p-8 rounded-[2.5rem] shadow-2xl z-[101] animate-in zoom-in-95 duration-300">
          <AlertDialog.Title className="text-2xl font-black uppercase tracking-tighter text-red-500 mb-2">
            Unfavourable Behaviour
          </AlertDialog.Title>
          <AlertDialog.Description className="text-xs text-white/60 leading-relaxed mb-8 italic">
            "Kindred is built on trust. If a spirit has acted unfavouraby,
            report them to the Guardians for review."
          </AlertDialog.Description>

          <form action={reportUserAction} className="space-y-4">
            <input type="hidden" name="reportedUserId" value={reportUserId} />
            <input type="hidden" name="evidence" value={evidence} />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                Reason for report:
              </label>
              <select
                name="reason"
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:border-red-500/50 outline-none transition-all appearance-none"
              >
                <option value="" className="bg-kindred-dark">
                  Select a category...
                </option>
                <option value="profanity" className="bg-kindred-dark">
                  Inapropriate Language
                </option>
                <option value="unfavourable" className="bg-kindred-dark">
                  Unfavourable Request or Offer
                </option>
                <option value="harassment" className="bg-kindred-dark">
                  Harassment
                </option>
                <option value="scam" className="bg-kindred-dark">
                  Suspicious Activity
                </option>
              </select>
            </div>

            <div className="flex gap-3 pt-6">
              <AlertDialog.Cancel asChild>
                <button
                  type="button"
                  className="flex-1 px-4 py-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white/60"
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  Submit to Guardians
                </button>
              </AlertDialog.Action>
            </div>
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
