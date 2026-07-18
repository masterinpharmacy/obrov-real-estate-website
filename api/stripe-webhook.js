// POST /api/stripe-webhook
// Stripe stuurt hier een event naartoe zodra betaling succesvol is.
// Vercel: voeg STRIPE_WEBHOOK_SECRET en SUPABASE_URL + SUPABASE_SERVICE_KEY toe als env vars.
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!STRIPE_SECRET || !WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: "Omgevingsvariabelen ontbreken" });
  }

  const rawBody = await getRawBody(req);

  // Verify Stripe signature
  let event;
  try {
    const crypto = await import("crypto");
    const parts = sig.split(",").reduce((acc, part) => {
      const [k, v] = part.split("=");
      acc[k] = v;
      return acc;
    }, {});
    const timestamp = parts.t;
    const expectedSig = crypto
      .default.createHmac("sha256", WEBHOOK_SECRET)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");
    if (expectedSig !== parts.v1) {
      return res.status(400).json({ error: "Ongeldige handtekening" });
    }
    event = JSON.parse(rawBody.toString());
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Verificatie mislukt" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const woningId = session.metadata?.woning_id;

    if (woningId) {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/woningen?id=eq.${woningId}`,
          {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_SERVICE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              betaald: true,
              stripe_session: session.id,
              status: "actief", // Meteen zichtbaar na betaling; fotograaf volgt nog
            }),
          }
        );
        if (!response.ok) {
          const err = await response.text();
          console.error("Supabase update mislukt:", err);
        }
      } catch (err) {
        console.error("Database update error:", err);
      }
    }
  }

  return res.status(200).json({ received: true });
}
