"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="7" height="8" rx="1.5" />
        <rect x="11" y="2" width="7" height="5" rx="1.5" />
        <rect x="2" y="12" width="7" height="6" rx="1.5" />
        <rect x="11" y="9" width="7" height="9" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/biens",
    label: "Biens",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10L10 4l7 6" />
        <path d="M5 9v7a1 1 0 001 1h8a1 1 0 001-1V9" />
      </svg>
    ),
  },
  {
    href: "/dashboard/locataires",
    label: "Locataires",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="7" r="3" />
        <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
  {
    href: "/dashboard/bails",
    label: "Baux",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
        <path d="M7 7h6M7 10h6M7 13h3" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  // Split links for mobile: 2 left, 2 right (profile in center)
  const leftLinks = navLinks.slice(0, 2);
  const rightLinks = navLinks.slice(2);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--background)" }}>
      {/* Sidebar — desktop */}
      <aside
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen z-30"
        style={{
          width: "var(--sidebar-width)",
          background: "linear-gradient(160deg, #1c1c1e 0%, #1c1c1e 40%, #14365d 75%, #0071e3 100%)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3"
          style={{ padding: "var(--space-6) var(--space-6) var(--space-8)" }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "var(--glass-on-gradient)",
              border: "1px solid var(--glass-on-gradient-border)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 9L9 3l7 6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 8v6a1 1 0 001 1h8a1 1 0 001-1V8"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: 18,
              lineHeight: "24px",
              color: "#ffffff",
              letterSpacing: "-0.01em",
            }}
          >
            AGL
          </span>
        </div>

        {/* Navigation */}
        <nav
          className="flex flex-col flex-1"
          style={{ padding: "0 var(--space-3)", gap: "var(--space-1)" }}
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="sidebar-link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  background: active ? "var(--glass-on-gradient-hover)" : "transparent",
                  border: active
                    ? "1px solid var(--glass-on-gradient-border)"
                    : "1px solid transparent",
                  color: active ? "#ffffff" : "rgba(255,255,255,0.65)",
                  fontFamily: "var(--font-body)",
                  fontWeight: active ? 700 : 400,
                  fontSize: 14,
                  lineHeight: "20px",
                  textDecoration: "none",
                  transition: `all var(--duration-normal) var(--ease-out)`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "var(--glass-on-gradient)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                  }
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div
          style={{
            padding: "var(--space-4) var(--space-6)",
            borderTop: "1px solid var(--glass-on-gradient-border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              lineHeight: "16px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            AGL v1.0
          </span>
        </div>
      </aside>

      {/*Contenu principal*/}
      <main
        className="flex-1 overflow-y-auto min-h-screen"
        style={{
          marginLeft: "var(--sidebar-width)",
          padding: "var(--space-8) var(--space-8) var(--space-8)",
          background: "var(--background)",
        }}
      >
        <style>{`
          @media (max-width: 767px) {
            main {
              margin-left: 0 !important;
              padding: var(--space-5) var(--space-4) calc(var(--space-16) + var(--space-8)) !important;
            }
          }
        `}</style>
        {children}
      </main>

      {/*Bottom navbar — mobile*/}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-end justify-around md:hidden z-40"
        style={{
          height: 64,
          background: "radial-gradient(ellipse 55% 120% at 50% 100%, #0071e3 0%, #14365d 40%, #1c1c1e 85%)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: "env(safe-area-inset-bottom, 6px)",
        }}
      >
        {/* 2 liens à gauche */}
        {leftLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                paddingBottom: 6,
                textDecoration: "none",
                color: active ? "#ffffff" : "rgba(255,255,255,0.55)",
                transition: `color var(--duration-normal) var(--ease-out)`,
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-md)",
                  background: active ? "var(--glass-on-gradient-hover)" : "transparent",
                  transition: `background var(--duration-normal) var(--ease-out)`,
                }}
              >
                {link.icon}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: active ? 700 : 400,
                  lineHeight: "14px",
                }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}

        {/* Bouton profil central */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: "var(--radius-full)",
            background: "#1c1c1e",
            border: "2px solid rgba(255,255,255,0.15)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
            cursor: "pointer",
            marginBottom: 10,
            padding: 0,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="10" cy="7" r="3.5" />
            <path d="M3.5 18c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
          </svg>
        </button>

        {/* 2 liens à droite */}
        {rightLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                paddingBottom: 6,
                textDecoration: "none",
                color: active ? "#ffffff" : "rgba(255,255,255,0.55)",
                transition: `color var(--duration-normal) var(--ease-out)`,
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-md)",
                  background: active ? "var(--glass-on-gradient-hover)" : "transparent",
                  transition: `background var(--duration-normal) var(--ease-out)`,
                }}
              >
                {link.icon}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: active ? 700 : 400,
                  lineHeight: "14px",
                }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}