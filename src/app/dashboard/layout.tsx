"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", shortLabel: "D" },
  { href: "/dashboard/biens", label: "Biens", shortLabel: "B" },
  { href: "/dashboard/locataires", label: "Locataires", shortLabel: "L" },
  { href: "/dashboard/bails", label: "Bails", shortLabel: "G" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

    return (
        <div className="flex min-h-screen">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-64 bg-slate-800 text-white p-6 flex-col fixed top-0 left-0 h-screen">
        <h1 className="text-xl font-bold mb-8">Gestion Locative</h1>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === link.href
                  ? "bg-slate-600 text-white"
                  : "hover:bg-slate-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
        
      {/* Contenu principal */}
      <main className="flex-1 p-6 md:p-8 bg-gray-50 pb-20 md:pb-8 md:ml-64 overflow-y-auto min-h-screen">
        {children}
      </main>
        
      {/* Bottom navbar — mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white flex justify-around items-center h-16 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center text-xs py-2 px-3 transition-colors ${
              pathname === link.href
                ? "text-white"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <span className={`text-lg font-bold ${
              pathname === link.href
                ? "bg-slate-600 w-8 h-8 rounded-full flex items-center justify-center"
                : ""
            }`}>
              {link.shortLabel}
            </span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
