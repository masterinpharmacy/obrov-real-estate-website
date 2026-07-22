// POST /api/auth-notificatie
// Admin notificaties bij registratie en woningplaatsing
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return res.status(500).json({ error: "RESEND_API_KEY ontbreekt" });

  const { type, naam, email, woning } = req.body || {};
  const nu = new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" });

  let subject, html;

  if (type === "registratie") {
    subject = `Nieuw account: ${naam || email}`;
    html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0B2A52;padding:20px 24px;border-radius:8px 8px 0 0">
          <h2 style="color:#fff;margin:0;font-size:18px">Nieuw account aangemaakt</h2>
        </div>
        <div style="background:#fff;border:1px solid #DCD4C2;border-top:none;padding:24px;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#888;width:140px">Naam</td><td style="padding:8px 0;color:#0B2A52;font-weight:600">${naam || "Niet ingevuld"}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">E-mail</td><td style="padding:8px 0">${email}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">Tijdstip</td><td style="padding:8px 0">${nu}</td></tr>
          </table>
          <div style="margin-top:20px">
            <a href="https://supabase.com/dashboard/project/cgmdaguudjqgcfciewbi/auth/users" style="background:#0B2A52;color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none;font-size:13px;font-weight:600">Bekijk in Supabase</a>
          </div>
        </div>
      </div>`;
  } else if (type === "plaatsing") {
    const w = woning || {};
    subject = `Nieuwe woning ter beoordeling: ${w.type || "?"} in ${w.stad || "?"}`;
    html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0B2A52;padding:20px 24px;border-radius:8px 8px 0 0">
          <h2 style="color:#fff;margin:0;font-size:18px">Nieuwe woning geplaatst — beoordeling vereist</h2>
        </div>
        <div style="background:#fff;border:1px solid #DCD4C2;border-top:none;padding:24px;border-radius:0 0 8px 8px">
          <div style="background:#FFF8E7;border:1px solid #F0C040;border-radius:6px;padding:12px 16px;margin-bottom:20px;font-size:13.5px;color:#7A5C00">
            <strong>Actie vereist:</strong> Ga naar het admin dashboard om deze woning goed of af te keuren.
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#888;width:160px">Type</td><td style="padding:8px 0;color:#0B2A52;font-weight:600">${w.type || "?"}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">Stad</td><td style="padding:8px 0">${w.stad || "?"}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">Regio</td><td style="padding:8px 0">${w.regio || "?"}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">Vraagprijs</td><td style="padding:8px 0">EUR ${parseInt(w.vraagprijs || 0).toLocaleString("nl-NL")}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">Oppervlakte</td><td style="padding:8px 0">${w.oppervlakte_m2 ? w.oppervlakte_m2 + " m2" : "Niet opgegeven"}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">Perceel</td><td style="padding:8px 0">${w.perceel_m2 ? w.perceel_m2 + " m2" : "Niet opgegeven"}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">Verkoper</td><td style="padding:8px 0">${naam || w.verkoper_naam || "?"}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">E-mail verkoper</td><td style="padding:8px 0">${email || w.verkoper_email || "?"}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">Telefoon</td><td style="padding:8px 0">${w.telefoon || w.verkoper_telefoon || "Niet opgegeven"}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">GPS</td><td style="padding:8px 0">${w.lat && w.lng ? `${w.lat}, ${w.lng}` : "Niet opgegeven"}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">Woning ID</td><td style="padding:8px 0;font-family:monospace;font-size:12px">${w.id || "?"}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:8px 0;color:#888">Tijdstip</td><td style="padding:8px 0">${nu}</td></tr>
          </table>
          <div style="margin-top:20px;display:flex;gap:10px">
            <a href="https://www.obrovrealestate.nl/admin" style="background:#0B2A52;color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none;font-size:13px;font-weight:600;display:inline-block">Admin dashboard</a>
            ${w.id ? `<a href="https://www.obrovrealestate.nl/aanbod/${w.id}" style="background:#AC9362;color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none;font-size:13px;font-weight:600;display:inline-block;margin-left:8px">Bekijk woning</a>` : ""}
          </div>
        </div>
      </div>`;
  } else {
    return res.status(400).json({ error: "Onbekend type" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
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
