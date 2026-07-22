// POST /api/ai-omschrijving
// Genereert een professionele woningbeschrijving via Claude API in NL, EN, DE en CG.
// Engels is verplicht: de verkoop is internationaal.

const TALEN = ["nl", "en", "de", "cg"];

function extractJson(tekst) {
  const clean = tekst.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    // Val terug op het eerste JSON-object in de tekst
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { return null; }
    }
    return null;
  }
}

function isCompleet(obj) {
  if (!obj || typeof obj !== "object") return false;
  return TALEN.every((t) => typeof obj[t] === "string" && obj[t].trim().length > 50);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    return res.status(500).json({ error: "AI niet geconfigureerd." });
  }

  const {
    info, type, stad, regio, vraagprijs, oppervlakte_m2, slaapkamers, bouwjaar,
    zeezicht, bergzicht, rivierzicht, nieuwbouw, bestaande_bouw, renovatie_nodig,
  } = req.body || {};

  if (!info) return res.status(400).json({ error: "Geen informatie opgegeven." });

  const uitzicht = [
    zeezicht && "zeezicht",
    bergzicht && "bergzicht",
    rivierzicht && "rivieruitzicht",
  ].filter(Boolean).join(", ") || "niet opgegeven";

  const staat = [
    nieuwbouw && "nieuwbouw",
    bestaande_bouw && "bestaande woning",
    renovatie_nodig && "renovatie nodig",
  ].filter(Boolean).join(", ") || "niet opgegeven";

  const systemPrompt = `Je bent een vastgoedexpert die professionele woningbeschrijvingen schrijft voor Obrov Real Estate, een Europees platform voor Balkan-vastgoed. Het publiek is internationaal: Nederlandse kopers, Duitstalige kopers, de diaspora en Engelstalige kopers wereldwijd.

Schrijf aantrekkelijke, informatieve beschrijvingen op basis van de gegeven informatie. Verrijk de beschrijving met context over de locatie: natuur, inwoners, demografie, prijzen in de buurt, voorzieningen (treinstations, supermarkten, scholen, luchthavens), en toekomstige plannen voor de wijk, stad of regio.

Regels:
- Verzin geen kenmerken die niet in de gegevens staan. Locatiecontext mag je toevoegen, woningkenmerken niet.
- 120 tot 180 woorden per taal.
- Elke taal is een zelfstandige tekst, geen letterlijke vertaling. Pas de context aan op het publiek: verwijs voor Duitse lezers naar Duitstalige referentiepunten waar dat natuurlijk is.
- Professionele maar toegankelijke toon. Geen holle superlatieven.
- Gebruik geen em-dashes.

Geef UITSLUITEND een JSON-object terug, zonder markdown en zonder toelichting, met exact deze vier sleutels:
{"nl": "...", "en": "...", "de": "...", "cg": "..."}

nl = Nederlands, en = Engels, de = Duits, cg = Montenegrijns (latijns schrift). Alle vier de velden zijn verplicht en moeten gevuld zijn.`;

  const userPrompt = `Woning info: ${info}

Type: ${type || ""}
Stad: ${stad || ""}
Regio: ${regio || ""}
Vraagprijs: EUR ${vraagprijs || ""}
Oppervlakte: ${oppervlakte_m2 || ""} m2
Slaapkamers: ${slaapkamers || ""}
Bouwjaar: ${bouwjaar || ""}
Uitzicht: ${uitzicht}
Staat: ${staat}`;

  const callClaude = async (messages) => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 3000,
        system: systemPrompt,
        messages,
      }),
    });
    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic error:", response.status, err);
      throw new Error("upstream");
    }
    const data = await response.json();
    return data.content?.find((b) => b.type === "text")?.text || "";
  };

  try {
    const messages = [{ role: "user", content: userPrompt }];
    let tekst = await callClaude(messages);
    let parsed = extractJson(tekst);

    // Een retry als een taal ontbreekt of te kort is. Engels mag nooit ontbreken.
    if (!isCompleet(parsed)) {
      const ontbreekt = TALEN.filter(
        (t) => !parsed || typeof parsed[t] !== "string" || parsed[t].trim().length <= 50
      );
      console.warn("Onvolledige AI-respons, opnieuw proberen. Ontbreekt:", ontbreekt);

      const retry = await callClaude([
        ...messages,
        { role: "assistant", content: tekst },
        {
          role: "user",
          content: `De volgende talen ontbreken of zijn te kort: ${ontbreekt.join(", ")}. Geef het volledige JSON-object opnieuw met alle vier de sleutels nl, en, de en cg gevuld. Alleen JSON, geen toelichting.`,
        },
      ]);
      const parsedRetry = extractJson(retry);
      if (isCompleet(parsedRetry)) {
        parsed = parsedRetry;
      } else if (parsedRetry) {
        // Vul aan wat de retry wel heeft opgeleverd
        parsed = { ...(parsed || {}), ...Object.fromEntries(
          Object.entries(parsedRetry).filter(([k, v]) => TALEN.includes(k) && typeof v === "string" && v.trim())
        ) };
      }
    }

    if (!parsed || !parsed.en || !parsed.en.trim()) {
      return res.status(502).json({ error: "AI kon geen Engelse omschrijving genereren. Probeer het opnieuw." });
    }

    return res.status(200).json({
      nl: parsed.nl || "",
      en: parsed.en || "",
      de: parsed.de || "",
      cg: parsed.cg || "",
    });
  } catch (err) {
    if (err.message === "upstream") {
      return res.status(502).json({ error: "AI genereren mislukt." });
    }
    console.error(err);
    return res.status(500).json({ error: "Serverfout bij AI genereren." });
  }
}
