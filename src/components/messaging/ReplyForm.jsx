"use client";
import { useState } from "react";
import { sendMessageAction } from "@/lib/actions";

export default function ReplyForm({ receiverId, originalSubject, type }) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const isInbox = type === "inbox";

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);

    try {
      const subject = originalSubject?.startsWith("Re:")
        ? originalSubject
        : `Re: ${originalSubject || "Message"}`;

      await sendMessageAction(receiverId, content, subject);
      setContent("");
      alert("Reply sent!");
    } catch (err) {
      alert("Failed to send: " + err.message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="text-[8px] font-black uppercase tracking-widest text-white/30 ml-1">
        Your response
      </label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a thoughtful reply..."
        className={`w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all resize-none h-32 ${isInbox ? "focus:border-kindred-blue-glow/50" : "focus:border-kindred-lime/50"}`}
        disabled={isSending}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSending || !content.trim()}
          className={`px-8 py-3 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 disabled:opacity-30 ${isInbox ? "hover:bg-kindred-blue-glow text-white hover:border-kindred-blue-glow hover:shadow-kindred-blue" : "hover:bg-kindred-lime text-white hover:text-kindred-dark hover:border-kindred-lime hover:shadow-kindred"}`}
        >
          {isSending ? "Sending..." : "Send Reply"}
        </button>
      </div>
    </form>
  );
}
