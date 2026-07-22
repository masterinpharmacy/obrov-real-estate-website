// POST /api/admin
// Beveiligd met ADMIN_SECRET environment variable
import { createClient } from "@supabase/supabase-js";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "obrov-admin-2026";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { secret, actie, woning_id, status, factuur_id, factuur_status } = req.body || {};

  if (secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: "Niet geautoriseerd" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    if (actie === "statistieken") {
      const [woningenRes, gebruikersRes, factuurRes] = await Promise.all([
        supabase.from("woningen").select("id, status, created_at, stad, type, vraagprijs, verkoper_naam, verkoper_email, betaald, gesponsord, demo"),
        supabase.from("profielen").select("id, created_at, naam, email, account_type"),
        supabase.from("facturen").select("*").order("created_at", { ascending: false }),
      ]);
      return res.status(200).json({
        woningen: woningenRes.data || [],
        gebruikers: gebruikersRes.data || [],
        facturen: factuurRes.data || [],
      });
    }

    if (actie === "woning_status") {
      const { error } = await supabase
        .from("woningen")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", woning_id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (actie === "factuur_status") {
      const { error } = await supabase
        .from("facturen")
        .update({ status: factuur_status })
        .eq("id", factuur_id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (actie === "woning_verwijderen") {
      const { error } = await supabase.from("woningen").delete().eq("id", woning_id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Onbekende actie" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
