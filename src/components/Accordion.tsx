/**
 * A brand-styled accordion built on native <details>/<summary> — no JS
 * needed for the open/close behaviour, keyboard and screen-reader support
 * come for free, and Tailwind's `group-open:` variant handles the icon.
 */
export default function Accordion({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <div className="divide-y hairline border-y hairline">
      {items.map((item, i) => (
        <details key={item.title} className="group py-6">
          <summary className="flex cursor-pointer list-none items-baseline gap-6 [&::-webkit-details-marker]:hidden">
            <span className="tag text-gold">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-serif text-2xl flex-1">{item.title}</span>
            <span
              aria-hidden="true"
              className="tag text-ink/50 transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 pl-[3.25rem] text-ink/65 leading-relaxed max-w-lg">{item.body}</p>
        </details>
      ))}
    </div>
  );
}
