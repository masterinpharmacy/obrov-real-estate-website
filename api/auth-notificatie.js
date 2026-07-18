// POST /api/auth-notificatie
// Stuurt een admin e-mail bij nieuwe registratie of woningplaatsing
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return res.status(500).json({ error: "RESEND_API_KEY ontbreekt" });

  const { type, naam, email, woning } = req.body || {};

  let subject, html;

  if (type === "registratie") {
    subject = `Nieuw account: ${naam} (${email})`;
    html = `
      <h2>Nieuw account aangemaakt op Obrov Real Estate</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <tr><td style="padding:6px 12px;font-weight:600;color:#0B2A52;">Naam</td><td style="padding:6px 12px;">${naam || "Niet ingevuld"}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#0B2A52;">E-mail</td><td style="padding:6px 12px;">${email}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#0B2A52;">Tijdstip</td><td style="padding:6px 12px;">${new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}</td></tr>
      </table>
      <p style="margin-top:16px;color:#666;font-size:13px;">Bekijk het Supabase dashboard voor meer details.</p>
    `;
  } else if (type === "plaatsing") {
    subject = `Nieuwe woning geplaatst: ${woning?.type} in ${woning?.stad}`;
    html = `
      <h2>Nieuwe woning geplaatst op Obrov Real Estate</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <tr><td style="padding:6px 12px;font-weight:600;color:#0B2A52;">Plaatser</td><td style="padding:6px 12px;">${naam || "Onbekend"} (${email})</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#0B2A52;">Type</td><td style="padding:6px 12px;">${woning?.type || "?"}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#0B2A52;">Stad</td><td style="padding:6px 12px;">${woning?.stad || "?"}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#0B2A52;">Vraagprijs</td><td style="padding:6px 12px;">€ ${parseInt(woning?.vraagprijs || 0).toLocaleString("nl-NL")}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600;color:#0B2A52;">Tijdstip</td><td style="padding:6px 12px;">${new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}</td></tr>
      </table>
      <p style="margin-top:16px;"><a href="https://www.obrovrealestate.nl/aanbod" style="color:#0B2A52;font-weight:600;">Bekijk op de website</a></p>
    `;
  } else {
    return res.status(400).json({ error: "Onbekend type" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@obrovrealestate.nl",
        to: ["info@obrovrealestate.nl"],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Resend error:", err);
      return res.status(502).json({ error: "E-mail verzenden mislukt" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Serverfout" });
  }
}
