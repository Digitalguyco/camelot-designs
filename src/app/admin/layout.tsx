import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const links = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // /admin/login renders its own minimal chrome (no session yet at that point).
  if (!session?.user) return <>{children}</>;

  return (
    <div className="min-h-screen">
      <header className="border-b hairline">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between gap-6">
          <div>
            <p className="eyebrow">Camelot Designs</p>
            <p className="font-serif text-xl mt-0.5">Studio Admin</p>
          </div>
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="tag text-ink/70 hover:text-gold transition-colors">
                {link.label}
              </Link>
            ))}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button type="submit" className="tag text-ink/50 hover:text-gold transition-colors">
                Log Out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
