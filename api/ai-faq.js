// POST /api/ai-faq
// Beantwoordt FAQ vragen via Claude API
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    return res.status(500).json({ error: "AI niet geconfigureerd." });
  }

  const { vraag, context } = req.body || {};
  if (!vraag) return res.status(400).json({ error: "Geen vraag opgegeven." });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 800,
        system: `Je bent een vriendelijke klantenservice medewerker van Obrov Real Estate, een Europees vastgoedplatform voor de Balkan. Beantwoord vragen uitsluitend op basis van de onderstaande FAQ. Als het antwoord niet in de FAQ staat, zeg dat dan eerlijk en verwijs naar info@obrovrealestate.nl. Antwoord altijd in de taal van de vraag. Wees beknopt en direct. Gebruik geen em-dashes.\n\nFAQ:\n${context || ""}`,
        messages: [{ role: "user", content: vraag }],
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ error: "AI niet beschikbaar." });
    }

    const data = await response.json();
    const antwoord = data.content?.find(b => b.type === "text")?.text || "Geen antwoord gevonden.";
    return res.status(200).json({ antwoord });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Serverfout." });
  }
}
