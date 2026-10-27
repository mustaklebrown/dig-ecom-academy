"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Sun, Moon, Menu, X, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { data: session, isPending } = useSession();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  }

  function handleNavLinkClick() {
    setMobileMenuOpen(false);
  }

  return (
    <>
      <header>
        <div className="w nav">
          <Link href="#accueil" className="logo-link" aria-label="Dig e-com Academy - Accueil">
            <div className="logo-box">
              <Image
                src="/logo.png"
                alt="Dig e-com Academy"
                width={170}
                height={48}
                priority
                className="logo-img"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Navigation principale">
            <ul>
              <li><a href="#formations">Formations</a></li>
              <li><a href="#methode">Méthode</a></li>
              <li><a href="#pourquoi">Pourquoi nous</a></li>
              <li><a href="#formats">Formats</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>

          {/* Action buttons */}
          <div className="nav-actions">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-btn"
              title={theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
              aria-label="Changer de thème"
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>

            {/* Auth Session State */}
            {!isPending && session?.user ? (
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="btn btn-l btn-sm"
                  style={{ gap: 6 }}
                >
                  <UserIcon size={16} />
                  <span>{session.user.name?.split(" ")[0] || "Compte"}</span>
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      background: "var(--card)",
                      border: "1px solid var(--bd)",
                      borderRadius: 14,
                      padding: 8,
                      width: 200,
                      boxShadow: "var(--sh-lg)",
                      zIndex: 200,
                    }}
                  >
                    <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--bd)", marginBottom: 4 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, margin: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {session.user.name}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--mu)", margin: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {session.user.email}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        fontSize: 13.5,
                        fontWeight: 600,
                        borderRadius: 8,
                      }}
                      className="btn-ghost"
                    >
                      <LayoutDashboard size={15} /> Tableau de bord
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        await signOut();
                        setUserDropdownOpen(false);
                        window.location.reload();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        fontSize: 13.5,
                        fontWeight: 600,
                        width: "100%",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        color: "#ef4444",
                      }}
                      className="btn-ghost"
                    >
                      <LogOut size={15} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode("signin");
                  setAuthModalOpen(true);
                }}
                className="btn btn-ghost btn-sm"
              >
                Connexion
              </button>
            )}

            <a href="#contact" className="btn btn-o">
              S’inscrire
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="burger"
              aria-label="Ouvrir le menu mobile"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Navigation mobile">
            <ul>
              <li><a href="#formations" onClick={handleNavLinkClick}>Formations</a></li>
              <li><a href="#methode" onClick={handleNavLinkClick}>Méthode</a></li>
              <li><a href="#pourquoi" onClick={handleNavLinkClick}>Pourquoi nous</a></li>
              <li><a href="#formats" onClick={handleNavLinkClick}>Formats</a></li>
              <li><a href="#faq" onClick={handleNavLinkClick}>FAQ</a></li>
              <li><a href="#contact" onClick={handleNavLinkClick}>Contact</a></li>
            </ul>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <a
                href="#contact"
                className="btn btn-o"
                style={{ flex: 1 }}
                onClick={handleNavLinkClick}
              >
                S’inscrire
              </a>
              {!session?.user && (
                <button
                  type="button"
                  className="btn btn-l"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalMode("signin");
                    setAuthModalOpen(true);
                  }}
                >
                  Connexion
                </button>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </>
  );
}
