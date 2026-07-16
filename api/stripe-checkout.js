// POST /api/stripe-checkout
// Maakt een Stripe Checkout sessie aan voor de €500 plaatsingskosten
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { woningId, verkoperEmail } = req.body || {};
  if (!woningId || !verkoperEmail) return res.status(400).json({ error: "woningId en verkoperEmail verplicht" });

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) return res.status(500).json({ error: "Stripe niet geconfigureerd" });

  const origin = req.headers.origin || "https://www.obrovrealestate.nl";

  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[]": "card",
        "line_items[0][price_data][currency]": "eur",
        "line_items[0][price_data][product_data][name]": "Woning plaatsen op Obrov Real Estate",
        "line_items[0][price_data][product_data][description]": "Inclusief professionele fotosessie ter plekke in Montenegro",
        "line_items[0][price_data][unit_amount]": "50000", // €500 in centen
        "line_items[0][quantity]": "1",
        mode: "payment",
        customer_email: verkoperEmail,
        "success_url": `${origin}/woning-plaatsen/succes?session_id={CHECKOUT_SESSION_ID}&woning_id=${woningId}`,
        "cancel_url": `${origin}/woning-plaatsen?woning_id=${woningId}`,
        "metadata[woning_id]": woningId,
      }).toString(),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Stripe error:", err);
      return res.status(502).json({ error: "Stripe sessie aanmaken mislukt" });
    }

    const session = await response.json();
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Serverfout" });
  }
}
