import { getInboxAction } from "@/lib/actions";
import Inbox from "@/components/messaging/Inbox";

export default async function MessagesPage() {
  const messages = await getInboxAction();

  return (
    <main className="min-h-screen bg-kindred-dark p-8 text-white">
      <div className="max-w-3xl mx-auto pt-12">
        <header className="mb-12 text-center">
          <h1 className="text-2xl font-black uppercase tracking-widest text-kindred-lime">
            Inbox
          </h1>
          <p className="text-xs font-mono text-white/40 mt-1 uppercase tracking-tight">
            Kindred Messaging System v1.0
          </p>
        </header>
        <Inbox messages={messages} />
      </div>
    </main>
  );
}
