import * as Accordion from "@radix-ui/react-accordion";
import ReplyForm from "./ReplyForm";
import ReportButton from "../ReportButton";

export default function MessageThread({ message, type }) {
  const isGiving = type === "outbox";

  return (
    <Accordion.Item
      value={message.id}
      className={`group bg-white/5 border rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl ${
        isGiving
          ? "border-white/10 hover:border-kindred-lime/50 data-[state=open]:border-kindred-lime data-[state=open]:bg-white/10"
          : "border-white/10 hover:border-kindred-blue-glow/50 data-[state=open]:border-kindred-blue-glow data-[state=open]:bg-white/10"
      }`}
    >
      <Accordion.Header className="flex">
        <Accordion.Trigger className="flex flex-1 items-center justify-between p-6 transition-colors text-left group-hover:bg-white/5">
          <div className="flex flex-col gap-1">
            <span
              className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isGiving ? "text-white/40 group-hover:text-kindred-lime/70" : "text-white/40 group-hover:text-kindred-blue-glow/70"}`}
            >
              {isGiving ? "Offering Help" : "Requesting Help"}
            </span>
            <span
              className={`text-lg font-black text-white transition-colors ${isGiving ? "group-data-[state=open]:text-kindred-lime" : "group-data-[state=open]:text-kindred-blue-glow"}`}
            >
              {isGiving ? "📤 " : "📩 "} {message.subject || "Kindred Message"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-black text-white/30 bg-white/5 border border-white/10 px-2 py-1 rounded-md uppercase">
              {new Date(message.created_at).toLocaleDateString()}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <ReportButton
                reportUserId={message.sender_id}
                evidence={message.content}
              />
            </div>
          </div>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="px-6 pb-6 overflow-hidden data-[state=open]:animate-slide-down">
        <div
          className={`bg-black/40 p-5 rounded-2xl border text-sm text-white/80 leading-relaxed mb-6 ${isGiving ? "border-kindred-lime/10" : "border-kindred-blue-glow/10"}`}
        >
          {message.content}
        </div>
        <div className="mt-4 pt-6 border-t border-white/10">
          <ReplyForm
            receiverId={message.sender_id}
            originalSubject={message.subject}
            type={type}
          />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
