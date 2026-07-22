// POST /api/register
// Server-side registratie via Supabase Admin API
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { naam, email, wachtwoord } = req.body || {};

  if (!email || !wachtwoord || !naam) {
    return res.status(400).json({ error: "Naam, e-mail en wachtwoord zijn verplicht." });
  }

  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Maak gebruiker aan via admin API
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: wachtwoord,
      user_metadata: { naam, account_type: "particulier" },
      email_confirm: false, // Stuur bevestigingsmail
    });

    if (error) {
      if (error.message?.includes("already been registered") || error.message?.includes("already registered")) {
        return res.status(400).json({ error: "Dit e-mailadres is al geregistreerd." });
      }
      return res.status(400).json({ error: error.message });
    }

    // Admin notificatie sturen
    try {
      await fetch(`${req.headers.origin}/api/auth-notificatie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "registratie", naam, email }),
      });
    } catch {}

    return res.status(200).json({ ok: true, user_id: data.user?.id });
  } catch (err) {
    console.error("Registratie fout:", err);
    return res.status(500).json({ error: "Serverfout bij registratie. Probeer opnieuw." });
  }
}
