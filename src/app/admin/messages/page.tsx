import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { toggleHandled } from "./actions";

export default async function AdminMessagesPage() {
  const items = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));

  return (
    <div>
      <h1 className="font-serif text-3xl">Messages</h1>

      <div className="mt-8 divide-y hairline border-t border-b hairline">
        {items.length === 0 && <p className="py-6 text-ink/60 text-sm">No messages yet.</p>}
        {items.map((msg) => (
          <div key={msg.id} className={`py-5 ${msg.handled ? "opacity-50" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-lg">{msg.name}</p>
                <p className="tag text-ink/55 mt-0.5">
                  {msg.email}
                  {msg.phone ? ` · ${msg.phone}` : ""} ·{" "}
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
              <form action={toggleHandled}>
                <input type="hidden" name="id" value={msg.id} />
                <input type="hidden" name="handled" value={String(msg.handled)} />
                <button type="submit" className="tag text-ink/70 hover:text-gold transition-colors whitespace-nowrap">
                  {msg.handled ? "Mark Unhandled" : "Mark Handled"}
                </button>
              </form>
            </div>
            <p className="mt-3 text-sm text-ink/80 leading-relaxed max-w-2xl whitespace-pre-wrap">
              {msg.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
