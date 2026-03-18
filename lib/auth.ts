import { createClient } from "@supabase/supabase-js";
import type { Friend } from "./supabase";

// Client côté serveur avec clé anon (pour les API routes authentifiées)
export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Variables d'environnement Supabase manquantes sur le serveur.");
  }
  return createClient(url, key);
}

// Client admin avec service role key (bypasse RLS et confirmation email)
export function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manquant dans les variables d'environnement.");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Récupère le profil ami à partir du JWT passé en Authorization header
export async function getFriendFromRequest(
  req: Request
): Promise<Friend | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);

  const supabase = getServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const { data: friend } = await supabase
    .from("friends")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  return friend ?? null;
}

// Vérifie si le profil est admin
export function isAdmin(friend: Friend | null): boolean {
  return friend?.is_admin === true;
}
