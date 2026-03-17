import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({
      status: "error",
      step: "env_vars",
      message: "Variables d'environnement manquantes",
      NEXT_PUBLIC_SUPABASE_URL: url ? "définie" : "MANQUANTE",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: key ? "définie" : "MANQUANTE",
    });
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("podcasts")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json({
        status: "error",
        step: "database_query",
        message: error.message,
        hint: "Le schéma SQL n'a probablement pas été exécuté sur Supabase.",
      });
    }

    return NextResponse.json({
      status: "ok",
      step: "all_good",
      podcasts_count: data?.length ?? 0,
    });
  } catch (e) {
    return NextResponse.json({
      status: "error",
      step: "connection",
      message: e instanceof Error ? e.message : String(e),
    });
  }
}
