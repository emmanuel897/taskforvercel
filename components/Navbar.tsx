"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { getSupabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { friend, loading } = useAuth();

  async function handleLogout() {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-indigo-700 font-bold text-lg hover:opacity-80 transition-opacity shrink-0"
        >
          <span className="text-2xl">🎙️</span>
          <span className="hidden sm:inline">Ma Communauté</span>
        </Link>

        {/* Nav centrale */}
        <div className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            Podcasts
          </Link>
          <Link
            href="/mentions-legales"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/mentions-legales"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            Mentions légales
          </Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3 text-sm shrink-0">
          {loading ? (
            <span className="text-gray-400 text-xs">Chargement…</span>
          ) : friend ? (
            <>
              {friend.is_admin && (
                <Link
                  href="/admin"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    pathname === "/admin"
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/podcasts/nouveau"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                + Partager
              </Link>
              <Link
                href="/profil"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === "/profil"
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {friend.display_name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors px-2"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
