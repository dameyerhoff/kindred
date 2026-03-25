import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export default function DiaryAccordion({
  myRequests = [],
  mySentRequests = [],
}) {
  const { isDark } = useTheme();
  const textColor = isDark ? "text-white" : "text-kindred-dark";

  const diaryItems = [
    ...myRequests.map((r) => ({ ...r, type: "inbox" })),
    ...mySentRequests.map((r) => ({ ...r, type: "outbox" })),
  ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return (
    <Accordion.Root type="single" collapsible className="space-y-4">
      {diaryItems.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className={`bg-white/5 border rounded-2xl overflow-hidden transition-all ${isDark ? (item.type === "inbox" ? "border-kindred-lime/20" : "border-kindred-blue-glow/20") : item.type === "inbox" ? "border-kindred-lime/60" : "border-kindred-blue-glow/60"}`}
        >
          <Accordion.Header>
            <Accordion.Trigger
              className={`w-full flex items-center justify-between p-6 transition-all text-left group ${isDark ? "hover:bg-white/5" : "hover:bg-kindred-dark/5"}`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`text-xl ${item.type === "inbox" ? "text-kindred-lime" : "text-kindred-blue-glow"}`}
                >
                  {" "}
                  {item.type === "inbox" ? "📩" : "📤"}
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <h3
                    className={`font-bold transition-colors ${textColor} ${isDark ? "group-hover:text-white" : "group-hover:text-black"}`}
                  >
                    {item.category || "General Favour"}
                  </h3>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${item.type === "inbox" ? "bg-kindred-lime/10 border-kindred-lime/20 text-kindred-lime" : "bg-kindred-blue-glow/10 border-kindred-blue-glow/20 text-kindred-blue-glow"}`}
              >
                {item.type === "inbox" ? "Receiving Help" : "Giving Help"}
              </div>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            className={`px-6 pb-6 italic animate-slide-down overflow-hidden ${isDark ? "bg-black/10 text-white/70" : "bg-kindred-dark/5 text-kindred-dark/80"}`}
          >
            <div
              className={`pt-4 border-t ${isDark ? "border-white/5" : "border-kindred-dark/10"}`}
            >
              <p className="mb-4 leading-relaxed">
                &ldquo;{item.favour_text}&rdquo;
              </p>
              <div className="flex justify-between items-center">
                <span
                  className={`text-[9px] font-bold uppercase ${isDark ? "text-white/30" : "text-kindred-dark/40"}`}
                >
                  Location: {item.location_tag || "Community Hub"}
                </span>
                <Link
                  href="/messages"
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${item.type === "inbox" ? "bg-kindred-lime text-kindred-dark hover:bg-white" : "bg-kindred-blue-glow text-white hover:bg-white hover:text-kindred-dark shadow-kindred-blue"}`}
                >
                  <span>💬</span> Discuss Details
                </Link>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
