// Vercel serverless function — handles the contact form submission and
// sends an email via the Resend API. The RESEND_API_KEY is read from a
// Vercel environment variable, never exposed to the browser.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { naam, email, bericht } = req.body || {};

  if (!naam || !email) {
    return res.status(400).json({ error: "Naam en e-mailadres zijn verplicht." });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "Server is niet correct geconfigureerd (ontbrekende API key)." });
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
        subject: `Nieuwe aanvraag via website — ${naam}`,
        html: `
          <h2>Nieuwe aanvraag via de website</h2>
          <p><strong>Naam:</strong> ${escapeHtml(naam)}</p>
          <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
          <p><strong>Bericht:</strong></p>
          <p>${escapeHtml(bericht || "(geen bericht ingevuld)").replace(/\n/g, "<br/>")}</p>
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
    console.error("Unexpected error sending email:", err);
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
