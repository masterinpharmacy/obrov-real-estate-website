// Gedeelde taalinstelling — leest uit localStorage, valt terug op domeindetectie
const GELDIGE_TALEN = ["nl","en","de","fr","sv","lb","me","bs","hr","sl"];

export function getLang() {
  if (typeof window === "undefined") return "nl";
  const saved = localStorage.getItem("obrov_lang");
  if (saved && GELDIGE_TALEN.includes(saved)) return saved;
  const host = window.location.hostname;
  if (host.endsWith(".me")) return "me";
  if (host.endsWith(".de")) return "de";
  if (host.endsWith(".fr")) return "fr";
  if (host.endsWith(".lu")) return "lb";
  if (host.endsWith(".se")) return "sv";
  if (host.endsWith(".hr")) return "hr";
  if (host.endsWith(".ba")) return "bs";
  if (host.endsWith(".si")) return "sl";
  if (host.endsWith(".com")) return "en";
  return "nl";
}

// Taalnamen voor weergave
export const TAAL_NAMEN = {
  nl: "Nederlands", en: "English", de: "Deutsch", fr: "Français",
  sv: "Svenska", lb: "Lëtzebuergesch", me: "Crnogorski",
  bs: "Bosanski", hr: "Hrvatski", sl: "Slovenščina",
};

// FAQ en AV vertalingen
export const FAQ_VERTALINGEN = {
  nl: {
    titel: "Veelgestelde vragen",
    hero: "Hoe werkt Obrov Real Estate?",
    heroSub: "Alles over kosten, plaatsen, begeleiding en het platform.",
    aiTitel: "AI-assistent",
    aiSub: "Niet gevonden wat u zoekt? Onze AI beantwoordt uw vraag direct.",
    aiPlaceholder: "Bijv. 'Wat kost het om een woning te plaatsen?'",
    aiKnop: "Vraag stellen",
    aiBezig: "Bezig...",
    tariefTitel: "Tarieven in een oogopslag",
    gratisBanner: "Account aanmaken is altijd gratis",
    gratisSubtitel: "U betaalt alleen als u een woning wilt plaatsen of begeleiding aanvraagt.",
    contactTitel: "Staat uw vraag er niet bij?",
    contactSub: "Wij reageren binnen twee werkdagen.",
    contactKnop: "Mail ons: info@obrovrealestate.nl",
    secties: [
      {
        titel: "Woning plaatsen",
        items: [
          { v: "Hoeveel kost het om een woning te plaatsen?", a: "Tot en met 31 oktober 2026 is plaatsen gratis. Daarna betaalt u als particulier een eenmalig bedrag van EUR 195 per woning. Makelaars en professionele verkopers kiezen een maandelijks abonnement." },
          { v: "Wat krijg ik voor EUR 195 (na de testfase)?", a: "Uw woning wordt direct zichtbaar voor Europese kopers en de Balkan-diaspora in 10 talen. U krijgt een eigen advertentiepagina met fotos, exacte locatie op de kaart, al uw contactgegevens en een directe contactknop." },
          { v: "Ik ben makelaar of wil meerdere woningen plaatsen. Wat zijn de kosten?", a: "Makelaar Starter: EUR 250 per maand voor maximaal 5 woningen. Makelaar Pro: EUR 450 per maand voor onbeperkt woningen. Betaling via automatische incasso op de 1e van elke maand." },
          { v: "Is een account aanmaken gratis?", a: "Ja, volledig gratis. U betaalt alleen als u een woning wilt plaatsen." },
          { v: "Is een plattegrond verplicht?", a: "Ja. Een plattegrond of situatietekening is verplicht bij iedere advertentie. Kopers willen de indeling kennen voordat zij interesse tonen." },
          { v: "Is de GPS-locatie verplicht?", a: "Ja. Exacte locatie is een kernwaarde van ons platform. Wij laten zien wat anderen verbergen." },
        ]
      },
      {
        titel: "Begeleiding bij aan- en verkoop",
        items: [
          { v: "Wat kost het begeleidingspakket?", a: "Pakket Basis: EUR 2.500 vast (orientatie, selectie, bezichtigingsreis). Pakket Volledig: EUR 4.500 vast (tot notariele overdracht). Of 1,5% van aankoopprijs met minimum EUR 2.500. Fiscale coordinatie EUR 750 extra." },
          { v: "Hoe vraag ik begeleiding aan?", a: "Via het contactformulier op de homepage of via info@obrovrealestate.nl. Wij nemen binnen twee werkdagen contact op." },
        ]
      },
      {
        titel: "Het platform",
        items: [
          { v: "In welke landen is vastgoed beschikbaar?", a: "Montenegro, Kroatie, Bosnie-Herzegovina en Slovenie." },
          { v: "In hoeveel talen is de website beschikbaar?", a: "10 talen: Nederlands, Engels, Duits, Frans, Luxemburgs, Zweeds, Montenegrijns, Bosnisch, Kroatisch en Sloveens." },
          { v: "Hoe kan ik contact opnemen met een verkoper?", a: "Op elke advertentiepagina staan de contactgegevens van de verkoper zichtbaar. U kunt direct contact opnemen zonder tussenpersoon." },
        ]
      },
    ],
    avTitel: "Algemene Voorwaarden",
  },
  en: {
    titel: "Frequently Asked Questions",
    hero: "How does Obrov Real Estate work?",
    heroSub: "Everything about costs, listing, guidance and the platform.",
    aiTitel: "AI Assistant",
    aiSub: "Can't find what you're looking for? Our AI answers your question directly.",
    aiPlaceholder: "E.g. 'How much does it cost to list a property?'",
    aiKnop: "Ask question",
    aiBezig: "Loading...",
    tariefTitel: "Pricing at a glance",
    gratisBanner: "Creating an account is always free",
    gratisSubtitel: "You only pay when you want to list a property or request guidance.",
    contactTitel: "Can't find your answer?",
    contactSub: "We respond within two business days.",
    contactKnop: "Email us: info@obrovrealestate.nl",
    secties: [
      {
        titel: "Listing a property",
        items: [
          { v: "How much does it cost to list a property?", a: "Until 31 October 2026, listing is free. After that, private sellers pay a one-time fee of EUR 195 per property. Agents and professional sellers choose a monthly subscription." },
          { v: "What do I get for EUR 195 (after the test phase)?", a: "Your property becomes immediately visible to European buyers and the Balkan diaspora in 10 languages, with photos, exact map location, your contact details and a direct contact button." },
          { v: "I am an agent or want to list multiple properties. What are the costs?", a: "Agent Starter: EUR 250 per month for up to 5 properties. Agent Pro: EUR 450 per month for unlimited properties. Payment via automatic direct debit on the 1st of each month." },
          { v: "Is creating an account free?", a: "Yes, completely free. You only pay when you want to list a property." },
          { v: "Is a floor plan mandatory?", a: "Yes. A floor plan or site plan is required for every listing. Buyers want to know the layout before showing interest." },
          { v: "Is the GPS location mandatory?", a: "Yes. Exact location is a core value of our platform. We show what others hide." },
        ]
      },
      {
        titel: "Guidance services",
        items: [
          { v: "What does the guidance package cost?", a: "Basic Package: EUR 2,500 fixed (orientation, selection, viewing trip). Full Package: EUR 4,500 fixed (through to notarial transfer). Or 1.5% of purchase price with a minimum of EUR 2,500. Tax coordination EUR 750 extra." },
          { v: "How do I request guidance?", a: "Via the contact form on the homepage or via info@obrovrealestate.nl. We will contact you within two business days." },
        ]
      },
      {
        titel: "The platform",
        items: [
          { v: "In which countries is property available?", a: "Montenegro, Croatia, Bosnia-Herzegovina and Slovenia." },
          { v: "In how many languages is the website available?", a: "10 languages: Dutch, English, German, French, Luxembourgish, Swedish, Montenegrin, Bosnian, Croatian and Slovenian." },
          { v: "How can I contact a seller?", a: "The seller's contact details are visible on every listing page. You can contact them directly without an intermediary." },
        ]
      },
    ],
    avTitel: "Terms and Conditions",
  },
  de: {
    titel: "Häufig gestellte Fragen",
    hero: "Wie funktioniert Obrov Real Estate?",
    heroSub: "Alles über Kosten, Inserieren, Begleitung und die Plattform.",
    aiTitel: "KI-Assistent",
    aiSub: "Nicht gefunden, was Sie suchen? Unsere KI beantwortet Ihre Frage direkt.",
    aiPlaceholder: "Z.B. 'Was kostet es, eine Immobilie zu inserieren?'",
    aiKnop: "Frage stellen",
    aiBezig: "Laden...",
    tariefTitel: "Preise auf einen Blick",
    gratisBanner: "Ein Konto zu erstellen ist immer kostenlos",
    gratisSubtitel: "Sie zahlen nur, wenn Sie eine Immobilie inserieren oder Begleitung anfragen.",
    contactTitel: "Ihre Frage nicht dabei?",
    contactSub: "Wir antworten innerhalb von zwei Werktagen.",
    contactKnop: "Schreiben Sie uns: info@obrovrealestate.nl",
    secties: [
      {
        titel: "Immobilie inserieren",
        items: [
          { v: "Was kostet es, eine Immobilie zu inserieren?", a: "Bis zum 31. Oktober 2026 ist das Inserieren kostenlos. Danach zahlen Privatpersonen eine einmalige Gebühr von EUR 195 pro Objekt. Makler und professionelle Verkäufer wählen ein monatliches Abonnement." },
          { v: "Was bekomme ich für EUR 195?", a: "Ihre Immobilie wird sofort in 10 Sprachen für europäische Käufer und die Balkan-Diaspora sichtbar, mit Fotos, genauer Kartenlage, Ihren Kontaktdaten und einem direkten Kontaktbutton." },
          { v: "Ich bin Makler oder möchte mehrere Immobilien inserieren. Was sind die Kosten?", a: "Makler Starter: EUR 250 pro Monat für bis zu 5 Immobilien. Makler Pro: EUR 450 pro Monat für unbegrenzte Immobilien." },
          { v: "Ist ein Grundriss Pflicht?", a: "Ja. Ein Grundriss oder Lageplan ist bei jedem Inserat Pflicht." },
          { v: "Ist der GPS-Standort Pflicht?", a: "Ja. Der genaue Standort ist ein Kernwert unserer Plattform." },
        ]
      },
      {
        titel: "Begleitungsleistungen",
        items: [
          { v: "Was kosten die Begleitungspakete?", a: "Basispaket: EUR 2.500 fest (Orientierung, Auswahl, Besichtigungsreise). Vollständiges Paket: EUR 4.500 fest (bis zur notariellen Übertragung). Oder 1,5% des Kaufpreises, mindestens EUR 2.500. Steuerkoordination EUR 750 extra." },
        ]
      },
      {
        titel: "Die Plattform",
        items: [
          { v: "In welchen Ländern sind Immobilien verfügbar?", a: "Montenegro, Kroatien, Bosnien-Herzegowina und Slowenien." },
          { v: "In wie vielen Sprachen ist die Website verfügbar?", a: "10 Sprachen: Niederländisch, Englisch, Deutsch, Französisch, Luxemburgisch, Schwedisch, Montenegrinisch, Bosnisch, Kroatisch und Slowenisch." },
        ]
      },
    ],
    avTitel: "Allgemeine Geschäftsbedingungen",
  },
};

// Vereenvoudigde vertalingen voor de overige 7 talen
const BASIS = {
  fr: { titel: "Questions fréquentes", hero: "Comment fonctionne Obrov Real Estate?", heroSub: "Tout sur les tarifs, la mise en ligne, l'accompagnement et la plateforme.", aiTitel: "Assistant IA", aiSub: "Vous ne trouvez pas ce que vous cherchez? Notre IA répond directement.", aiPlaceholder: "Ex. 'Combien coûte la mise en ligne d'un bien?'", aiKnop: "Poser une question", aiBezig: "Chargement...", tariefTitel: "Tarifs en un coup d'oeil", gratisBanner: "Créer un compte est toujours gratuit", gratisSubtitel: "Vous ne payez que si vous souhaitez mettre en ligne un bien ou demander un accompagnement.", contactTitel: "Votre question n'est pas là?", contactSub: "Nous répondons dans les deux jours ouvrés.", contactKnop: "Ecrivez-nous: info@obrovrealestate.nl", secties: [], avTitel: "Conditions générales" },
  sv: { titel: "Vanliga frågor", hero: "Hur fungerar Obrov Real Estate?", heroSub: "Allt om kostnader, annonsering, vägledning och plattformen.", aiTitel: "AI-assistent", aiSub: "Hittar du inte det du söker? Vår AI svarar direkt.", aiPlaceholder: "T.ex. 'Vad kostar det att annonsera en fastighet?'", aiKnop: "Ställ fråga", aiBezig: "Laddar...", tariefTitel: "Priser i korthet", gratisBanner: "Att skapa ett konto är alltid gratis", gratisSubtitel: "Du betalar bara när du vill annonsera en fastighet eller begära vägledning.", contactTitel: "Hittar du inte ditt svar?", contactSub: "Vi svarar inom två arbetsdagar.", contactKnop: "Maila oss: info@obrovrealestate.nl", secties: [], avTitel: "Allmänna villkor" },
  lb: { titel: "Dacks gestallt Froe", hero: "Wéi fonctionnéiert Obrov Real Estate?", heroSub: "Alles iwwer Käschten, Annoncen, Begleitung an d'Plattform.", aiTitel: "KI-Assistent", aiSub: "Net fonnt wat Dir sicht? Eise KI äntwert direkt.", aiPlaceholder: "Z.B. 'Wat kascht et eng Immobilie ze annoncéieren?'", aiKnop: "Fro stellen", aiBezig: "Lueden...", tariefTitel: "Präisser am iwwerbléck", gratisBanner: "E Kont unzeleeën ass ëmmer gratis", gratisSubtitel: "Dir bezuelt nëmmen wann Dir eng Immobilie annoncéiere wëllt.", contactTitel: "Är Fro net derbäi?", contactSub: "Mir äntweren bannent zwee Aarbechtsdeeg.", contactKnop: "Schreiwt eis: info@obrovrealestate.nl", secties: [], avTitel: "Allgemeng Bedingungen" },
  me: { titel: "Cesta pitanja", hero: "Kako funkcionise Obrov Real Estate?", heroSub: "Sve o cijenama, oglasavanju, pracenju i platformi.", aiTitel: "AI asistent", aiSub: "Niste nasli sto trazite? Nas AI odgovara direktno.", aiPlaceholder: "Npr. 'Koliko kosta postavljanje oglasa za nekretninu?'", aiKnop: "Postavi pitanje", aiBezig: "Ucitavanje...", tariefTitel: "Cijene na prvi pogled", gratisBanner: "Kreiranje naloga je uvijek besplatno", gratisSubtitel: "Placate samo kada zelite oglasiti nekretninu ili zatraziti pomoc.", contactTitel: "Vas pitanje nije ovdje?", contactSub: "Odgovaramo u roku od dva radna dana.", contactKnop: "Pisajte nam: info@obrovrealestate.nl", secties: [], avTitel: "Opsti uslovi" },
  bs: { titel: "Cesta pitanja", hero: "Kako funkcionise Obrov Real Estate?", heroSub: "Sve o cijenama, oglasavanju, savjetovanju i platformi.", aiTitel: "AI asistent", aiSub: "Niste nasli sto trazite? Nas AI odgovara direktno.", aiPlaceholder: "Npr. 'Koliko kosta postavljanje oglasa za nekretninu?'", aiKnop: "Postavi pitanje", aiBezig: "Ucitava se...", tariefTitel: "Cijene na prvi pogled", gratisBanner: "Kreiranje racuna je uvijek besplatno", gratisSubtitel: "Placate samo kada zelite oglasiti nekretninu ili zatraziti savjetovanje.", contactTitel: "Vase pitanje nije ovdje?", contactSub: "Odgovaramo u roku od dva radna dana.", contactKnop: "Pisajte nam: info@obrovrealestate.nl", secties: [], avTitel: "Opsti uslovi" },
  hr: { titel: "Cesta pitanja", hero: "Kako funkcionira Obrov Real Estate?", heroSub: "Sve o troskovim, oglasavanju, savjetovanju i platformi.", aiTitel: "AI asistent", aiSub: "Niste pronasli sto trazite? Nas AI odgovara izravno.", aiPlaceholder: "Npr. 'Koliko kosta postavljanje oglasa za nekretninu?'", aiKnop: "Postavi pitanje", aiBezig: "Ucitavanje...", tariefTitel: "Cijene na prvi pogled", gratisBanner: "Kreiranje racuna je uvijek besplatno", gratisSubtitel: "Placate samo kada zelite oglasiti nekretninu ili zatraziti savjetovanje.", contactTitel: "Vase pitanje nije ovdje?", contactSub: "Odgovaramo unutar dva radna dana.", contactKnop: "Pisajte nam: info@obrovrealestate.nl", secties: [], avTitel: "Opci uvjeti" },
  sl: { titel: "Pogosta vprasanja", hero: "Kako deluje Obrov Real Estate?", heroSub: "Vse o stroskih, objavljanju, svetovanju in platformi.", aiTitel: "AI asistent", aiSub: "Niste nasli, kar iscete? Nas AI odgovori neposredno.", aiPlaceholder: "Npr. 'Koliko stane objava nepremicnine?'", aiKnop: "Postavi vprasanje", aiBezig: "Nalaganje...", tariefTitel: "Cene na prvi pogled", gratisBanner: "Ustvarjanje racuna je vedno brezplacno", gratisSubtitel: "Placate le, ko zelite objaviti nepremicnino ali zaprositi za svetovanje.", contactTitel: "Vasega vprasanja ni tukaj?", contactSub: "Odgovorimo v dveh delovnih dneh.", contactKnop: "Pisajte nam: info@obrovrealestate.nl", secties: [], avTitel: "Splosni pogoji" },
};

// Voeg basis vertalingen toe aan export
Object.assign(FAQ_VERTALINGEN, BASIS);

// AV tekst kernartikelen vertaald
export const AV_KORT = {
  nl: { intro: "Versie 1.2 | Juli 2026 | Masters in Pharmacy B.V." },
  en: { intro: "Version 1.2 | July 2026 | Masters in Pharmacy B.V." },
  de: { intro: "Version 1.2 | Juli 2026 | Masters in Pharmacy B.V." },
  fr: { intro: "Version 1.2 | Juillet 2026 | Masters in Pharmacy B.V." },
  sv: { intro: "Version 1.2 | Juli 2026 | Masters in Pharmacy B.V." },
  lb: { intro: "Versioun 1.2 | Juli 2026 | Masters in Pharmacy B.V." },
  me: { intro: "Verzija 1.2 | Juli 2026 | Masters in Pharmacy B.V." },
  bs: { intro: "Verzija 1.2 | Juli 2026 | Masters in Pharmacy B.V." },
  hr: { intro: "Verzija 1.2 | Srpanj 2026 | Masters in Pharmacy B.V." },
  sl: { intro: "Razlicica 1.2 | Julij 2026 | Masters in Pharmacy B.V." },
};
