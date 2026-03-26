import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";

export default function DiaryAccordion({
  myRequests = [],
  mySentRequests = [],
}) {
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
          className={`bg-white/5 border rounded-2xl overflow-hidden transition-all ${item.type === "inbox" ? "border-kindred-lime/20" : "border-kindred-blue-glow/20"}`}
        >
          <Accordion.Header>
            <Accordion.Trigger className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all text-left group">
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
                  <h3 className="font-bold text-white group-hover:text-white/100 transition-colors">
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
          <Accordion.Content className="px-6 pb-6 text-white/70 italic bg-black/10 animate-slide-down overflow-hidden">
            <div className="pt-4 border-t border-white/5">
              <p className="mb-4 leading-relaxed">
                &ldquo;{item.favour_text}&rdquo;
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-white/30 uppercase">
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
