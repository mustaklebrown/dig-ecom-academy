"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { X, Lock, Mail, User as UserIcon, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = "signin",
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await signUp.email({
          email,
          password,
          name,
        });
        if (res.error) {
          setError(res.error.message || "Erreur lors de l'inscription.");
        } else {
          setSuccess("Compte créé avec succès !");
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1000);
        }
      } else {
        const res = await signIn.email({
          email,
          password,
        });
        if (res.error) {
          setError(res.error.message || "Email ou mot de passe incorrect.");
        } else {
          setSuccess("Connexion réussie !");
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1000);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          <X size={18} />
        </button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(31, 46, 230, 0.1)",
              color: "var(--blue)",
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Espace Membres Dig e-com
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>
            {mode === "signin" ? "Connexion à votre espace" : "Créer un compte apprenant"}
          </h2>
          <p style={{ color: "var(--mu)", fontSize: 14.5, margin: 0 }}>
            {mode === "signin"
              ? "Accédez à vos attestations et ressources de formation."
              : "Rejoignez la communauté des futurs leaders du digital aux Comores."}
          </p>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            background: "var(--bg2)",
            padding: 4,
            borderRadius: 14,
            marginBottom: 20,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            style={{
              padding: "10px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              background: mode === "signin" ? "var(--card)" : "transparent",
              color: mode === "signin" ? "var(--tx)" : "var(--mu)",
              boxShadow: mode === "signin" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            style={{
              padding: "10px",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              background: mode === "signup" ? "var(--card)" : "transparent",
              color: mode === "signup" ? "var(--tx)" : "var(--mu)",
              boxShadow: mode === "signup" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            S&apos;inscrire
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              color: "#f87171",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              color: "#34d399",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13.5,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          {mode === "signup" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Nom complet
              </label>
              <div style={{ position: "relative" }}>
                <UserIcon
                  size={17}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--mu)",
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder="Ex: Ahmed Mohamed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 42px",
                    borderRadius: 12,
                    border: "1.5px solid var(--bd)",
                    background: "var(--card)",
                    color: "var(--tx)",
                    fontSize: 14.5,
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Adresse email
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={17}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--mu)",
                }}
              />
              <input
                type="email"
                required
                placeholder="votre.email@domaine.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: 12,
                  border: "1.5px solid var(--bd)",
                  background: "var(--card)",
                  color: "var(--tx)",
                  fontSize: 14.5,
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Mot de passe
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={17}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--mu)",
                }}
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: 12,
                  border: "1.5px solid var(--bd)",
                  background: "var(--card)",
                  color: "var(--tx)",
                  fontSize: 14.5,
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-p"
            style={{ width: "100%", marginTop: 8 }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Traitement...
              </>
            ) : mode === "signin" ? (
              "Se connecter"
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
