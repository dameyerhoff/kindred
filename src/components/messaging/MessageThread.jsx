import * as Accordion from "@radix-ui/react-accordion";
import ReplyForm from "./ReplyForm";

export default function MessageThread({ message }) {
  return (
    <Accordion.Item
      value={message.id}
      className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:border-kindred-lime/50 data-[state=open]:border-kindred-lime data-[state=open]:bg-white/10 shadow-2xl"
    >
      <Accordion.Header className="flex">
        <Accordion.Trigger className="flex flex-1 items-center justify-between p-6 transition-colors text-left group-hover:bg-white/5">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-kindred-lime/70 transition-colors">
              From: {message.sender_id.slice(0, 8)}...
            </span>
            <span className="text-lg font-black text-white group-data-[state=open]:text-kindred-lime transition-colors">
              {message.subject || "Kindred Message"}
            </span>
          </div>
          <div className="text-[10px] font-black text-white/30 bg-white/5 border border-white/10 px-2 py-1 rounded-md uppercase">
            {new Date(message.created_at).toLocaleDateString()}
          </div>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="px-6 pb-6 overflow-hidden data-[state=open]:animate-slide-down">
        <div className="bg-black/40 p-5 rounded-2xl border border-white/10 text-sm text-white/80 leading-relaxed mb-6">
          {message.content}
        </div>
        <div className="mt-4 pt-6 border-t border-white/10">
          <ReplyForm
            receiverId={message.sender_id}
            originalSubject={message.subject}
          />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
