"use client";
import { useState } from "react";
import { sendMessageAction } from "@/lib/actions";
import { useTheme } from "@/components/ThemeProvider";

export default function ReplyForm({ receiverId, originalSubject, type }) {
  const { isDark } = useTheme();
  const isInbox = type === "inbox";
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

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
      <label
        className={`text-[8px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-white/30" : "text-kindred-dark/40"}`}
      >
        Your response
      </label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a thoughtful reply..."
        className={`w-full p-4 rounded-2xl text-sm transition-all resize-none h-32 outline-none ${isDark ? "bg-black/40 border-white/10 text-white focus:border-kindred-lime/50" : "bg-kindred-dark/5 border-kindred-dark/20 text-kindred-dark focus:border-kindred-dark"}`}
        disabled={isSending}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSending || !content.trim()}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isInbox ? "bg-kindred-lime text-kindred-dark hover:brightness-110 border-kindred-lime shadow-kindred" : "bg-kindred-blue-glow text-white hover:brightness-110 border-kindred-blue-glow shadow-kindred-blue"}`}
        >
          {isSending ? "Sending..." : "Send Reply"}
        </button>
      </div>
    </form>
  );
}
