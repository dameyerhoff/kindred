"use client";
import * as Accordion from "@radix-ui/react-accordion";
import MessageThread from "./MessageThread";

export default function Inbox({ messages, userId }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="p-10 text-center border border-white/10 rounded-3xl bg-white/5 shadow-2xl">
        <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
          Your inbox is empty.
        </p>
      </div>
    );
  }

  return (
    <Accordion.Root
      type="single"
      collapsible
      className="w-full max-w-3xl mx-auto space-y-4"
    >
      {messages.map((msg) => (
        <MessageThread
          key={msg.id}
          message={msg}
          type={msg.sender_id === userId ? "outbox" : "inbox"}
        />
      ))}
    </Accordion.Root>
  );
}
