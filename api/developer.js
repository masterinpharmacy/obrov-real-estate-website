export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { naam, bedrijf, locatie, omschrijving, email } = req.body || {};

  if (!naam || !email || !omschrijving) {
    return res.status(400).json({ error: "Verplichte velden ontbreken." });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "Server niet correct geconfigureerd." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Obrov Real Estate <noreply@obrovrealestate.nl>",
        to: ["info@obrovrealestate.nl"],
        reply_to: email,
        subject: `Nieuw projectvoorstel van ${escapeHtml(bedrijf || naam)}`,
        html: `
          <h2>Nieuw projectvoorstel via de website</h2>
          <p><strong>Naam:</strong> ${escapeHtml(naam)}</p>
          <p><strong>Bedrijf:</strong> ${escapeHtml(bedrijf || "—")}</p>
          <p><strong>Projectlocatie:</strong> ${escapeHtml(locatie || "—")}</p>
          <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
          <p><strong>Projectomschrijving:</strong></p>
          <p>${escapeHtml(omschrijving).replace(/\n/g, "<br/>")}</p>
        `,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Resend API error:", errorBody);
      return res.status(502).json({ error: "Versturen via Resend is mislukt." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Onverwachte serverfout." });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
