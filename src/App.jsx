import React, { useState, useEffect, useRef, createContext, useContext } from "react";

// ---- Design tokens ----
// Navy:      #0B2A52  (deep navy, from logo)
// Navy-2:    #163A6B  (lighter navy variant)
// Gold:      #AC9362  (gold accent, from logo)
// Gold-2:    #C2A877  (lighter gold variant)
// Sand:      #C2A877
// Cream:     #FAF8F4
// Ink:       #1A1A1A
// Grey:      #6B6B6B

// ---------------------------------------------------------------------------
// CONTENT / TRANSLATIONS
// ---------------------------------------------------------------------------
const CONTENT = {
  nl: {
    langLabel: "NL",
    nav: { aanpak: "Aanpak", diensten: "Diensten", overOns: "Over ons", developers: "Ontwikkelaars", contact: "Contact" },
    navCta: "Plan een gesprek",
    heroBadge: "NEDERLANDS — MONTENEGRIJNS INVESTERINGSKANTOOR",
    heroTitle1: "Investeren in Montenegro,",
    heroTitle2: "zonder de gok.",
    heroText:
      "Wij begeleiden Nederlandse investeerders van eerste kennismaking tot notariële overdracht — met lokale ontwikkelaarscontacten, juridische zekerheid en fiscale begeleiding op maat. Geen tussenpersonen, één aanspreekpunt.",
    heroCta1: "Vraag een kennismaking aan",
    heroCta2: "Bekijk onze aanpak",
    stat1v: "100%", stat1l: "Euro-markt — geen wisselkoersrisico",
    stat2v: "3", stat2l: "Regio's met actieve contacten",
    stat3v: "1", stat3l: "Vast aanspreekpunt, heel het traject",
    whyTitle: "WAAROM MONTENEGRO",
    whyItems: [
      "EU-kandidaat-status — rechtszekerheid groeit mee",
      "Adriatische kust, lagere instapprijzen dan West-Europa",
      "Euro als de facto valuta — geen wisselkoersrisico",
      "Groeiend toerisme & jachthavens zoals Porto Montenegro",
    ],
    routeKicker: "HET TRAJECT",
    routeTitle: "Van Den Haag tot Budva, in één lijn",
    routeLeft: "Nederland",
    routeRight: "Montenegro",
    destinationsKicker: "DE MONTENEGRIJNSE KUST",
    destinationsTitle: "De hele kust, met focus op vijf kernplekken",
    destinationsIntro:
      "Onze contacten en projecten strekken zich uit over de volledige Montenegrijnse Adriatische kust. Vijf plekken vormen daarbinnen onze focus.",
    destinations: [
      { name: "Kotor", desc: "Historische baai, UNESCO werelderfgoed, omringd door bergen" },
      { name: "Budva", desc: "Levendige kustplaats met ommuurde oude stad en stranden" },
      { name: "Tivat", desc: "Thuis van jachthaven Porto Montenegro, internationale luchthaven" },
      { name: "Bar", desc: "Grootste jachthaven van Montenegro, groeiende stad aan zee" },
      { name: "Ulcinj", desc: "Zuidelijkste kustplaats, lange zandstranden richting Albanië" },
    ],
    stops: [
      { city: "Den Haag", sub: "Kennismaking & dossier", side: "nl" },
      { city: "Rotterdam", sub: "Juridisch & fiscaal traject", side: "nl" },
      { city: "Tivat", sub: "Bezichtiging & projectkeuze", side: "mne" },
      { city: "Kotor", sub: "Koopcontract & notaris", side: "mne" },
      { city: "Budva", sub: "Overdracht & sleuteloverdracht", side: "mne" },
    ],
    servicesKicker: "DIENSTVERLENING",
    servicesTitle: "Eén traject, volledig begeleid",
    services: [
      { num: "01", title: "Projectselectie", text: "Curatie van nieuwbouw- en bestaande projecten op basis van uw profiel, budget en doel — verhuur, lifestyle of vermogensspreiding." },
      { num: "02", title: "Off-plan aankoop", text: "Begeleiding bij de aankoop van nieuwbouw vóór of tijdens de bouw, vaak tegen een gunstigere instapprijs dan bij oplevering." },
      { num: "03", title: "Invest & flip", text: "Strategisch aan- en verkooptraject gericht op waardestijging — met of zonder renovatie, afgestemd op uw rendementsdoel." },
      { num: "04", title: "Verkenningsreis", text: "Persoonlijke bezichtigingsreis naar Montenegro, georganiseerd en begeleid, met directe toegang tot ontwikkelaars en locaties." },
      { num: "05", title: "Juridische begeleiding", text: "Vast netwerk van lokale advocaten voor contractcontrole, kadasteronderzoek en notariële overdracht." },
      { num: "06", title: "Fiscale afstemming", text: "Coördinatie met een Nederlandse fiscalist over de gevolgen voor box 3 en structurering van het eigendom." },
      { num: "07", title: "Transactiebegeleiding", text: "Van reservering tot sleuteloverdracht — wij bewaken elke stap en elke deadline namens u." },
      { num: "08", title: "Verhuurbeheer", text: "Optionele doorverwijzing naar of opzet van lokaal beheer voor wie het object (deels) wil verhuren." },
    ],
    aboutKicker: "OVER ONS",
    aboutTitle: "Toegewijd aan persoonlijke, kwalitatieve begeleiding",
    aboutQuote:
      "Wij geloven dat investeren in vastgoed pas goed voelt als elke stap persoonlijk begeleid en helder uitgelegd wordt.",
    aboutQuoteAttr: "— Obrov Real Estate",
    aboutP1:
      "Obrov Real Estate is toegewijd aan persoonlijke en kwalitatieve begeleiding bij de aan- en verkoop van nieuwbouwprojecten, investeringen en bestaande woningen in Montenegro. Wij combineren lokale marktkennis met een directe, persoonlijke aanpak, zodat elke klant precies weet waar hij aan toe is.",
    aboutP2:
      "Wij werken met een vast netwerk van lokale advocaten en een Nederlandse fiscalist, zodat elk traject niet alleen aantrekkelijk is, maar ook juridisch en fiscaal goed onderbouwd.",
    contactTitle: "Begin met een vrijblijvend gesprek",
    contactText: "Vertel ons uw situatie en doel. Binnen twee werkdagen nemen wij persoonlijk contact op.",
    formName: "Uw naam",
    formEmail: "E-mailadres",
    formMessage: "Wat is uw investeringsdoel of vraag?",
    formSubmit: "Verstuur aanvraag",
    formSending: "Versturen...",
    formErrorText: "Er ging iets mis bij het versturen. Probeer het opnieuw of mail ons direct op info@obrovrealestate.nl.",
    sentTitle: "Bericht verzonden",
    sentText: "Dank voor uw interesse. Wij nemen spoedig contact met u op.",
    devKicker: "VOOR PROJECTONTWIKKELAARS",
    devCta: "Bekijk de ontwikkelaarspagina",
    devTitle: "Breng uw project onder de aandacht van Nederlandse investeerders",
    devIntro: "Obrov Real Estate verbindt uw nieuwbouwproject rechtstreeks met een groeiende groep Nederlandse investeerders die actief zoeken naar vastgoed aan de Montenegrijnse kust. Wij treden op als uw exclusieve of preferred vertegenwoordiger in Nederland — persoonlijk, professioneel en gericht op resultaat.",
    devBenefits: [
      "Directe toegang tot gemotiveerde Nederlandse kopers",
      "Volledige begeleiding van kennismaking tot overdracht",
      "Vertegenwoordiging op bezoekreizen en informatieavonden",
      "Transparante samenwerking op basis van heldere afspraken",
    ],
    devFormTitle: "Stel uw project voor",
    devName: "Uw naam",
    devCompany: "Bedrijfsnaam",
    devLocation: "Projectlocatie (bijv. Budva, Kotor)",
    devDescription: "Korte omschrijving van het project",
    devEmail: "E-mailadres",
    devSubmit: "Stuur projectvoorstel",
    devSending: "Versturen...",
    devSent: "Voorstel ontvangen! Wij nemen binnen twee werkdagen contact op.",
    devError: "Er ging iets mis. Probeer opnieuw of mail naar info@obrovrealestate.nl.",
    footerTag: "Obrov Real Estate — Montenegro Investments",
    footerRights: "© 2026 Obrov Real Estate. Alle rechten voorbehouden.",
  },

  en: {
    langLabel: "EN",
    nav: { aanpak: "Approach", diensten: "Services", overOns: "About us", developers: "Developers", contact: "Contact" },
    navCta: "Book a call",
    heroBadge: "DUTCH — MONTENEGRIN INVESTMENT AGENCY",
    heroTitle1: "Investing in Montenegro,",
    heroTitle2: "without the guesswork.",
    heroText:
      "We guide Dutch investors from first introduction to notarial transfer — with local developer contacts, legal certainty and tailored tax guidance. No middlemen, one point of contact.",
    heroCta1: "Request an introduction",
    heroCta2: "See our approach",
    stat1v: "100%", stat1l: "Euro market — no exchange-rate risk",
    stat2v: "3", stat2l: "Regions with active contacts",
    stat3v: "1", stat3l: "One point of contact, throughout",
    whyTitle: "WHY MONTENEGRO",
    whyItems: [
      "EU candidate status — legal certainty growing alongside it",
      "Adriatic coastline, lower entry prices than Western Europe",
      "Euro as de facto currency — no exchange-rate risk",
      "Growing tourism & marinas such as Porto Montenegro",
    ],
    routeKicker: "THE JOURNEY",
    routeTitle: "From The Hague to Budva, in one line",
    routeLeft: "Netherlands",
    routeRight: "Montenegro",
    destinationsKicker: "THE MONTENEGRIN COAST",
    destinationsTitle: "The entire coastline, with a focus on five key spots",
    destinationsIntro:
      "Our contacts and projects span the full Montenegrin Adriatic coast. Within that, five places form our main focus.",
    destinations: [
      { name: "Kotor", desc: "Historic bay, UNESCO World Heritage site, surrounded by mountains" },
      { name: "Budva", desc: "Lively coastal town with a walled old town and beaches" },
      { name: "Tivat", desc: "Home of the Porto Montenegro marina and the international airport" },
      { name: "Bar", desc: "Montenegro's largest marina, a growing town on the sea" },
      { name: "Ulcinj", desc: "The southernmost coastal town, long sandy beaches towards Albania" },
    ],
    stops: [
      { city: "The Hague", sub: "Introduction & file setup", side: "nl" },
      { city: "Rotterdam", sub: "Legal & tax process", side: "nl" },
      { city: "Tivat", sub: "Viewing & project selection", side: "mne" },
      { city: "Kotor", sub: "Purchase contract & notary", side: "mne" },
      { city: "Budva", sub: "Transfer & key handover", side: "mne" },
    ],
    servicesKicker: "SERVICES",
    servicesTitle: "One journey, fully guided",
    services: [
      { num: "01", title: "Project selection", text: "Curated new-build and existing projects matched to your profile, budget and goal — rental, lifestyle, or wealth diversification." },
      { num: "02", title: "Off-plan purchase", text: "Guidance on buying new-build property before or during construction, often at a more favourable entry price than at completion." },
      { num: "03", title: "Invest & flip", text: "A strategic buy-and-sell process focused on value growth — with or without renovation, tailored to your return objective." },
      { num: "04", title: "Viewing trip", text: "A personally organised and guided viewing trip to Montenegro, with direct access to developers and locations." },
      { num: "05", title: "Legal guidance", text: "A fixed network of local lawyers for contract review, land registry checks and notarial transfer." },
      { num: "06", title: "Tax alignment", text: "Coordination with a Dutch tax adviser on the implications for box 3 and ownership structuring." },
      { num: "07", title: "Transaction guidance", text: "From reservation to key handover — we track every step and every deadline on your behalf." },
      { num: "08", title: "Rental management", text: "Optional referral to or setup of local rental management for those who wish to (partly) let their property." },
    ],
    aboutKicker: "ABOUT US",
    aboutTitle: "Dedicated to personal, quality guidance",
    aboutQuote:
      "We believe investing in real estate only feels right when every step is personally guided and clearly explained.",
    aboutQuoteAttr: "— Obrov Real Estate",
    aboutP1:
      "Obrov Real Estate is dedicated to personal and high-quality guidance in the purchase and sale of new-build projects, investments, and existing homes in Montenegro. We combine local market knowledge with a direct, personal approach, so every client knows exactly where they stand.",
    aboutP2:
      "We work with a fixed network of local lawyers and a Dutch tax adviser, so every transaction is not only attractive but also legally and fiscally sound.",
    contactTitle: "Start with a no-obligation conversation",
    contactText: "Tell us your situation and goal. We will personally get in touch within two business days.",
    formName: "Your name",
    formEmail: "Email address",
    formMessage: "What is your investment goal or question?",
    formSubmit: "Send request",
    formSending: "Sending...",
    formErrorText: "Something went wrong while sending. Please try again or email us directly at info@obrovrealestate.nl.",
    sentTitle: "Message sent",
    sentText: "Thank you for your interest. We will contact you shortly.",
    devKicker: "FOR PROJECT DEVELOPERS",
    devCta: "View the developer page",
    devTitle: "Bring your project to the attention of Dutch investors",
    devIntro: "Obrov Real Estate connects your new-build project directly with a growing group of Dutch investors actively looking for property on the Montenegrin coast. We act as your exclusive or preferred representative in the Netherlands — personal, professional and results-driven.",
    devBenefits: [
      "Direct access to motivated Dutch buyers",
      "Full guidance from introduction to transfer",
      "Representation on viewing trips and information evenings",
      "Transparent cooperation based on clear agreements",
    ],
    devFormTitle: "Introduce your project",
    devName: "Your name",
    devCompany: "Company name",
    devLocation: "Project location (e.g. Budva, Kotor)",
    devDescription: "Brief description of the project",
    devEmail: "Email address",
    devSubmit: "Send project proposal",
    devSending: "Sending...",
    devSent: "Proposal received! We will get in touch within two business days.",
    devError: "Something went wrong. Please try again or email info@obrovrealestate.nl.",
    footerTag: "Obrov Real Estate — Montenegro Investments",
    footerRights: "© 2026 Obrov Real Estate. All rights reserved.",
  },

  me: {
    langLabel: "CG",
    nav: { aanpak: "Pristup", diensten: "Usluge", overOns: "O nama", developers: "Investitori", contact: "Kontakt" },
    navCta: "Zakažite razgovor",
    heroBadge: "HOLANDSKO — CRNOGORSKA INVESTICIONA AGENCIJA",
    heroTitle1: "Ulaganje u Crnu Goru,",
    heroTitle2: "bez nagađanja.",
    heroText:
      "Vodimo holandske investitore od prvog upoznavanja do notarskog prenosa vlasništva — uz lokalne kontakte sa investitorima, pravnu sigurnost i poreske savjete prilagođene vama. Bez posrednika, jedna kontakt osoba.",
    heroCta1: "Zatražite upoznavanje",
    heroCta2: "Pogledajte naš pristup",
    stat1v: "100%", stat1l: "Evro kao valuta — nema kursnog rizika",
    stat2v: "3", stat2l: "Regije sa aktivnim kontaktima",
    stat3v: "1", stat3l: "Jedna kontakt osoba, tokom cijelog procesa",
    whyTitle: "ZAŠTO CRNA GORA",
    whyItems: [
      "Status kandidata za EU — pravna sigurnost raste",
      "Jadranska obala, niže ulazne cijene nego u zapadnoj Evropi",
      "Evro kao zvanična valuta — nema kursnog rizika",
      "Rast turizma i marina, kao što je Porto Montenegro",
    ],
    routeKicker: "PUTOVANJE",
    routeTitle: "Od Hag-a do Budve, u jednoj liniji",
    routeLeft: "Holandija",
    routeRight: "Crna Gora",
    destinationsKicker: "CRNOGORSKO PRIMORJE",
    destinationsTitle: "Cijela obala, sa fokusom na pet ključnih mjesta",
    destinationsIntro:
      "Naši kontakti i projekti pokrivaju cijelu crnogorsku jadransku obalu. U okviru toga, fokusiramo se na pet mjesta.",
    destinations: [
      { name: "Kotor", desc: "Istorijski zaliv, lokalitet UNESCO svjetske baštine, okružen planinama" },
      { name: "Budva", desc: "Živahan primorski grad sa starim gradom i plažama" },
      { name: "Tivat", desc: "Dom marine Porto Montenegro i međunarodnog aerodroma" },
      { name: "Bar", desc: "Najveća marina u Crnoj Gori, grad u rastu na moru" },
      { name: "Ulcinj", desc: "Najjužniji primorski grad, duge pješčane plaže prema Albaniji" },
    ],
    stops: [
      { city: "Hag", sub: "Upoznavanje i dokumentacija", side: "nl" },
      { city: "Roterdam", sub: "Pravni i poreski proces", side: "nl" },
      { city: "Tivat", sub: "Razgledanje i odabir projekta", side: "mne" },
      { city: "Kotor", sub: "Kupoprodajni ugovor i notar", side: "mne" },
      { city: "Budva", sub: "Prenos i predaja ključeva", side: "mne" },
    ],
    servicesKicker: "USLUGE",
    servicesTitle: "Jedan put, potpuna podrška",
    services: [
      { num: "01", title: "Odabir projekta", text: "Pažljiv izbor novogradnje i postojećih projekata prema vašem profilu, budžetu i cilju — iznajmljivanje, način života ili diverzifikacija imovine." },
      { num: "02", title: "Kupovina off-plan", text: "Podrška pri kupovini novogradnje prije ili tokom izgradnje, često po povoljnijoj ulaznoj cijeni nego nakon završetka." },
      { num: "03", title: "Invest & flip", text: "Strateški proces kupovine i prodaje usmjeren na rast vrijednosti — sa ili bez renoviranja, prilagođen vašem cilju prinosa." },
      { num: "04", title: "Putovanje razgledanja", text: "Lično organizovano i vođeno putovanje u Crnu Goru, sa direktnim pristupom investitorima i lokacijama." },
      { num: "05", title: "Pravna podrška", text: "Stalna mreža lokalnih advokata za provjeru ugovora, provjeru u katastru i notarski prenos." },
      { num: "06", title: "Poreska usklađenost", text: "Koordinacija sa holandskim poreskim savjetnikom o posljedicama za box 3 i strukturiranje vlasništva." },
      { num: "07", title: "Podrška u transakciji", text: "Od rezervacije do predaje ključeva — pratimo svaki korak i svaki rok u vaše ime." },
      { num: "08", title: "Upravljanje iznajmljivanjem", text: "Opciono upućivanje na ili organizacija lokalnog upravljanja za one koji žele (djelimično) iznajmiti nekretninu." },
    ],
    aboutKicker: "O NAMA",
    aboutTitle: "Posvećeni ličnoj i kvalitetnoj podršci",
    aboutQuote:
      "Vjerujemo da ulaganje u nekretnine ima smisla samo kada je svaki korak lično vođen i jasno objašnjen.",
    aboutQuoteAttr: "— Obrov Real Estate",
    aboutP1:
      "Obrov Real Estate je posvećen ličnoj i kvalitetnoj podršci u kupovini i prodaji novogradnje, investicija i postojećih nekretnina u Crnoj Gori. Kombinujemo poznavanje lokalnog tržišta sa direktnim, ličnim pristupom, tako da svaki klijent tačno zna na čemu je.",
    aboutP2:
      "Radimo sa stalnom mrežom lokalnih advokata i holandskim poreskim savjetnikom, tako da je svaka transakcija ne samo privlačna, već i pravno i poreski dobro utemeljena.",
    contactTitle: "Započnite razgovorom bez obaveza",
    contactText: "Recite nam vašu situaciju i cilj. Lično ćemo vas kontaktirati u roku od dva radna dana.",
    formName: "Vaše ime",
    formEmail: "Email adresa",
    formMessage: "Koji je vaš investicioni cilj ili pitanje?",
    formSubmit: "Pošaljite upit",
    formSending: "Slanje...",
    formErrorText: "Došlo je do greške prilikom slanja. Pokušajte ponovo ili nam pišite direktno na info@obrovrealestate.nl.",
    sentTitle: "Poruka poslata",
    sentText: "Hvala na interesovanju. Uskoro ćemo vas kontaktirati.",
    devKicker: "ZA PROJEKTNE INVESTITORE",
    devCta: "Pogledajte stranicu za investitore",
    devTitle: "Predstavite vaš projekat holandskim investitorima",
    devIntro: "Obrov Real Estate direktno povezuje vaš projekat novogradnje sa rastućom grupom holandskih investitora koji aktivno traže nekretnine na crnogorskom primorju. Nastupamo kao vaš ekskluzivni ili preferirani zastupnik u Holandiji — lično, profesionalno i orijentisano na rezultate.",
    devBenefits: [
      "Direktan pristup motivisanim holandskim kupcima",
      "Potpuna podrška od upoznavanja do prenosa vlasništva",
      "Zastupanje na putovanjima razgledanja i informativnim večerima",
      "Transparentna saradnja zasnovana na jasnim sporazumima",
    ],
    devFormTitle: "Predstavite vaš projekat",
    devName: "Vaše ime",
    devCompany: "Naziv kompanije",
    devLocation: "Lokacija projekta (npr. Budva, Kotor)",
    devDescription: "Kratak opis projekta",
    devEmail: "Email adresa",
    devSubmit: "Pošaljite prijedlog projekta",
    devSending: "Slanje...",
    devSent: "Prijedlog primljen! Kontaktiraćemo vas u roku od dva radna dana.",
    devError: "Došlo je do greške. Pokušajte ponovo ili pišite na info@obrovrealestate.nl.",
    footerTag: "Obrov Real Estate — Investicije u Crnoj Gori",
    footerRights: "© 2026 Obrov Real Estate. Sva prava zadržana.",
  },

  de: {
    langLabel: "DE",
    nav: { aanpak: "Vorgehen", diensten: "Leistungen", overOns: "Über uns", developers: "Entwickler", contact: "Kontakt" },
    navCta: "Gespräch vereinbaren",
    heroBadge: "NIEDERLÄNDISCH — MONTENEGRINISCHE INVESTMENTAGENTUR",
    heroTitle1: "In Montenegro investieren,",
    heroTitle2: "ohne Risiko einzugehen.",
    heroText:
      "Wir begleiten niederländische Investoren vom ersten Kennenlernen bis zur notariellen Übertragung — mit lokalen Bauträgerkontakten, Rechtssicherheit und maßgeschneiderter Steuerberatung. Kein Zwischenhändler, ein fester Ansprechpartner.",
    heroCta1: "Kennenlerngespräch anfragen",
    heroCta2: "Unser Vorgehen ansehen",
    stat1v: "100%", stat1l: "Euro-Markt — kein Wechselkursrisiko",
    stat2v: "3", stat2l: "Regionen mit aktiven Kontakten",
    stat3v: "1", stat3l: "Fester Ansprechpartner, während des gesamten Prozesses",
    whyTitle: "WARUM MONTENEGRO",
    whyItems: [
      "EU-Beitrittskandidat — wachsende Rechtssicherheit",
      "Adriaküste, niedrigere Einstiegspreise als in Westeuropa",
      "Euro als De-facto-Währung — kein Wechselkursrisiko",
      "Wachsender Tourismus & Marinas wie Porto Montenegro",
    ],
    routeKicker: "DER WEG",
    routeTitle: "Von Den Haag bis Budva, in einer Linie",
    routeLeft: "Niederlande",
    routeRight: "Montenegro",
    destinationsKicker: "DIE MONTENEGRINISCHE KÜSTE",
    destinationsTitle: "Die gesamte Küste, mit Fokus auf fünf Kernorte",
    destinationsIntro:
      "Unsere Kontakte und Projekte erstrecken sich über die gesamte montenegrinische Adriaküste. Innerhalb dieser bilden fünf Orte unseren Schwerpunkt.",
    destinations: [
      { name: "Kotor", desc: "Historische Bucht, UNESCO-Weltkulturerbe, umgeben von Bergen" },
      { name: "Budva", desc: "Lebendiger Küstenort mit ummauerter Altstadt und Strände" },
      { name: "Tivat", desc: "Heimat der Marina Porto Montenegro und des internationalen Flughafens" },
      { name: "Bar", desc: "Größter Yachthafen Montenegros, wachsende Stadt am Meer" },
      { name: "Ulcinj", desc: "Südlichster Küstenort, lange Sandstrände in Richtung Albanien" },
    ],
    stops: [
      { city: "Den Haag", sub: "Kennenlernen & Unterlagen", side: "nl" },
      { city: "Rotterdam", sub: "Rechtlicher & steuerlicher Prozess", side: "nl" },
      { city: "Tivat", sub: "Besichtigung & Projektauswahl", side: "mne" },
      { city: "Kotor", sub: "Kaufvertrag & Notar", side: "mne" },
      { city: "Budva", sub: "Übertragung & Schlüsselübergabe", side: "mne" },
    ],
    servicesKicker: "LEISTUNGEN",
    servicesTitle: "Ein Weg, vollständig begleitet",
    services: [
      { num: "01", title: "Projektauswahl", text: "Kuratierte Neubau- und Bestandsprojekte passend zu Ihrem Profil, Budget und Ziel — Vermietung, Lifestyle oder Vermögensdiversifikation." },
      { num: "02", title: "Off-Plan-Kauf", text: "Begleitung beim Kauf von Neubauimmobilien vor oder während der Bauphase, oft zu einem günstigeren Einstiegspreis als bei Fertigstellung." },
      { num: "03", title: "Invest & Flip", text: "Strategischer An- und Verkaufsprozess mit Fokus auf Wertsteigerung — mit oder ohne Renovierung, abgestimmt auf Ihr Renditeziel." },
      { num: "04", title: "Besichtigungsreise", text: "Persönlich organisierte und begleitete Besichtigungsreise nach Montenegro, mit direktem Zugang zu Bauträgern und Standorten." },
      { num: "05", title: "Rechtliche Begleitung", text: "Festes Netzwerk lokaler Anwälte für Vertragsprüfung, Grundbuchrecherche und notarielle Übertragung." },
      { num: "06", title: "Steuerliche Abstimmung", text: "Koordination mit einem niederländischen Steuerberater zu den Auswirkungen auf Box 3 und zur Eigentumsstruktur." },
      { num: "07", title: "Transaktionsbegleitung", text: "Von der Reservierung bis zur Schlüsselübergabe — wir überwachen jeden Schritt und jede Frist für Sie." },
      { num: "08", title: "Mietverwaltung", text: "Optionale Vermittlung an oder Einrichtung einer lokalen Verwaltung für alle, die ihre Immobilie (teilweise) vermieten möchten." },
    ],
    aboutKicker: "ÜBER UNS",
    aboutTitle: "Engagiert für persönliche, qualitative Begleitung",
    aboutQuote:
      "Wir glauben, dass sich eine Immobilieninvestition nur dann richtig anfühlt, wenn jeder Schritt persönlich begleitet und klar erklärt wird.",
    aboutQuoteAttr: "— Obrov Real Estate",
    aboutP1:
      "Obrov Real Estate engagiert sich für persönliche und qualitativ hochwertige Begleitung beim An- und Verkauf von Neubauprojekten, Investitionen und Bestandsimmobilien in Montenegro. Wir verbinden lokale Marktkenntnis mit einem direkten, persönlichen Ansatz, damit jeder Kunde genau weiß, woran er ist.",
    aboutP2:
      "Wir arbeiten mit einem festen Netzwerk lokaler Anwälte und einem niederländischen Steuerberater zusammen, damit jede Transaktion nicht nur attraktiv, sondern auch rechtlich und steuerlich fundiert ist.",
    contactTitle: "Beginnen Sie mit einem unverbindlichen Gespräch",
    contactText: "Erzählen Sie uns von Ihrer Situation und Ihrem Ziel. Wir melden uns innerhalb von zwei Werktagen persönlich bei Ihnen.",
    formName: "Ihr Name",
    formEmail: "E-Mail-Adresse",
    formMessage: "Was ist Ihr Investitionsziel oder Ihre Frage?",
    formSubmit: "Anfrage senden",
    formSending: "Wird gesendet...",
    formErrorText: "Beim Senden ist etwas schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@obrovrealestate.nl.",
    sentTitle: "Nachricht gesendet",
    sentText: "Vielen Dank für Ihr Interesse. Wir melden uns in Kürze bei Ihnen.",
    devKicker: "FÜR PROJEKTENTWICKLER",
    devCta: "Zur Entwicklerseite",
    devTitle: "Bringen Sie Ihr Projekt deutschen Investoren näher",
    devIntro: "Obrov Real Estate verbindet Ihr Neubauprojekt direkt mit einer wachsenden Gruppe niederländischer Investoren, die aktiv nach Immobilien an der montenegrinischen Küste suchen. Wir treten als Ihr exklusiver oder bevorzugter Vertreter in den Niederlanden auf — persönlich, professionell und ergebnisorientiert.",
    devBenefits: [
      "Direkter Zugang zu motivierten niederländischen Käufern",
      "Vollständige Begleitung von der Vorstellung bis zur Übertragung",
      "Vertretung auf Besichtigungsreisen und Informationsabenden",
      "Transparente Zusammenarbeit auf Basis klarer Vereinbarungen",
    ],
    devFormTitle: "Stellen Sie Ihr Projekt vor",
    devName: "Ihr Name",
    devCompany: "Firmenname",
    devLocation: "Projektstandort (z.B. Budva, Kotor)",
    devDescription: "Kurze Beschreibung des Projekts",
    devEmail: "E-Mail-Adresse",
    devSubmit: "Projektvorschlag senden",
    devSending: "Wird gesendet...",
    devSent: "Vorschlag erhalten! Wir melden uns innerhalb von zwei Werktagen.",
    devError: "Etwas ist schiefgelaufen. Bitte erneut versuchen oder an info@obrovrealestate.nl schreiben.",
    footerTag: "Obrov Real Estate — Montenegro Investments",
    footerRights: "© 2026 Obrov Real Estate. Alle Rechte vorbehalten.",
  },
};

const LangContext = createContext({ lang: "nl", t: CONTENT.nl, setLang: () => {} });
const useLang = () => useContext(LangContext);

// ---------------------------------------------------------------------------
// SHARED COMPONENTS
// ---------------------------------------------------------------------------
function ArchMark({ size = 48, light = false }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 122 96" fill="none">
      <path
        d="M0 96 L25 51 L48 76 L70 34 L95 66 L120 96 Z"
        fill={light ? "#3A5578" : "#C2A877"}
        opacity="0.9"
      />
      <path d="M-2 96 L38 24 L62 58 L82 28 L122 96 Z" fill={light ? "#071A33" : "#0B2A52"} />
      <path d="M38 24 L47 37 L38 42 L29 37 Z" fill="#FAF8F4" />
      <path d="M82 28 L91 41 L82 46 L73 41 Z" fill={light ? "#D4BD8E" : "#AC9362"} />
      <rect x="-10" y="96" width="142" height="6" rx="1.5" fill={light ? "#D4BD8E" : "#AC9362"} />
    </svg>
  );
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}

// ---- Route bridge: NL <-> Montenegro signature element ----
function BridgeRoute() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const stops = t.stops;

  useEffect(() => {
    setActive(0);
    const id = setInterval(() => setActive((a) => (a + 1) % stops.length), 2600);
    return () => clearInterval(id);
  }, [stops]);

  return (
    <div style={{ width: "100%", maxWidth: 880, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          letterSpacing: 2,
          color: "#6B6B6B",
          textTransform: "uppercase",
        }}
      >
        <span>{t.routeLeft}</span>
        <span>{t.routeRight}</span>
      </div>
      <div style={{ position: "relative", height: 4, background: "#DCD4C2", borderRadius: 2 }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 4,
            borderRadius: 2,
            background: "linear-gradient(90deg, #0B2A52, #AC9362)",
            width: `${((active + 1) / stops.length) * 100}%`,
            transition: "width 0.6s ease",
          }}
        />
        {stops.map((s, i) => {
          const left = (i / (stops.length - 1)) * 100;
          const isActive = i <= active;
          return (
            <div
              key={s.city}
              style={{
                position: "absolute",
                top: "50%",
                left: `${left}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  width: i === active ? 18 : 12,
                  height: i === active ? 18 : 12,
                  borderRadius: "50%",
                  background: isActive ? (s.side === "nl" ? "#0B2A52" : "#AC9362") : "#fff",
                  border: `2px solid ${s.side === "nl" ? "#0B2A52" : "#AC9362"}`,
                  transition: "all 0.4s ease",
                  boxShadow: i === active ? "0 0 0 6px rgba(172,147,98,0.15)" : "none",
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
        {stops.map((s, i) => (
          <div
            key={s.city}
            style={{
              flex: 1,
              textAlign: i === 0 ? "left" : i === stops.length - 1 ? "right" : "center",
              opacity: i === active ? 1 : 0.45,
              transition: "opacity 0.4s ease",
            }}
          >
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 15, color: "#0B2A52" }}>
              {s.city}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#6B6B6B",
                marginTop: 2,
                maxWidth: 120,
                marginInline: i === 0 ? 0 : i === stops.length - 1 ? 0 : "auto",
              }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const options = [
    { code: "nl", label: "NL" },
    { code: "en", label: "EN" },
    { code: "de", label: "DE" },
    { code: "me", label: "CG" },
  ];
  return (
    <div style={{ display: "flex", gap: 2, background: "#EDE6D7", borderRadius: 20, padding: 3 }}>
      {options.map((o) => (
        <button
          key={o.code}
          onClick={() => setLang(o.code)}
          style={{
            border: "none",
            background: lang === o.code ? "#0B2A52" : "transparent",
            color: lang === o.code ? "#FAF8F4" : "#0B2A52",
            fontSize: 12.5,
            fontWeight: 700,
            padding: "6px 12px",
            borderRadius: 16,
            cursor: "pointer",
            letterSpacing: 0.5,
            transition: "all 0.25s ease",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NavBar() {
  const { t } = useLang();
  const navItems = [
    { key: "aanpak", href: "#aanpak" },
    { key: "diensten", href: "#diensten" },
    { key: "overOns", href: "#over-ons" },
    { key: "developers", href: "/developers" },
  ];
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(250,248,244,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #DCD4C2",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <a
          href="#"
          aria-label="Obrov Real Estate — home"
          style={{ display: "flex", alignItems: "center", flexShrink: 0, minWidth: 0 }}
        >
          <img
            src="/logo.png"
            alt="Obrov Real Estate"
            className="navbar-logo"
            style={{ height: 64, width: "auto", display: "block", maxWidth: "100%" }}
          />
        </a>
        <nav style={{ display: "none", gap: 32 }} className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              style={{ fontSize: 14, color: "#1A1A1A", textDecoration: "none", fontWeight: 500 }}
            >
              {t.nav[item.key]}
            </a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <LangSwitcher />
          <a
            href="#contact"
            className="navbar-cta"
            style={{
              background: "#0B2A52",
              color: "#FAF8F4",
              padding: "10px 20px",
              borderRadius: 2,
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: 0.3,
              whiteSpace: "nowrap",
            }}
          >
            {t.navCta}
          </a>
        </div>
      </div>
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 480px) {
          .navbar-logo { height: 44px !important; }
          .navbar-cta { display: none !important; }
        }
        @media (min-width: 481px) and (max-width: 640px) {
          .navbar-logo { height: 52px !important; }
        }
      `}</style>
    </header>
  );
}

function StatBlock({ value, label }) {
  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 34, fontWeight: 700, color: "#0B2A52" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#6B6B6B", marginTop: 4, maxWidth: 160 }}>{label}</div>
    </div>
  );
}

function ServiceCard({ num, title, text }) {
  return (
    <Reveal>
      <div
        style={{
          background: "#fff",
          border: "1px solid #DCD4C2",
          borderRadius: 4,
          padding: "28px 26px",
          height: "100%",
        }}
      >
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#AC9362", letterSpacing: 1, marginBottom: 14 }}>
          {num}
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 700, color: "#0B2A52", marginBottom: 10 }}>
          {title}
        </div>
        <div style={{ fontSize: 14.5, color: "#3D3D3D", lineHeight: 1.6 }}>{text}</div>
      </div>
    </Reveal>
  );
}

// Verified Unsplash CDN photo for each focus destination. Each URL was
// confirmed by fetching the photo's Unsplash page directly, so these point
// at real, currently-live images (not the discontinued Source redirect API).
const DESTINATION_PHOTOS = {
  "Kotor": "https://images.unsplash.com/photo-1614122027743-50a9e6e8002f?fm=jpg&q=75&w=900&auto=format&fit=crop",
  "Budva": "https://images.unsplash.com/photo-1682936770708-3a8d9301a151?fm=jpg&q=75&w=900&auto=format&fit=crop",
  "Tivat": "https://images.unsplash.com/photo-1634902252038-532bdbb280a6?fm=jpg&q=75&w=900&auto=format&fit=crop",
  "Bar": "https://images.unsplash.com/photo-1719772355253-cac25a978d76?fm=jpg&q=75&w=900&auto=format&fit=crop",
  "Ulcinj": "https://images.unsplash.com/photo-1668301157539-ede800d169d4?fm=jpg&q=75&w=900&auto=format&fit=crop",
};

function DestinationCard({ name, desc, index }) {
  const photoUrl = DESTINATION_PHOTOS[name];
  return (
    <Reveal delay={index * 80}>
      <div
        style={{
          borderRadius: 6,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid #DCD4C2",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 150,
            flexShrink: 0,
            position: "relative",
            backgroundImage: `url(${photoUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#0B2A52",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(7,26,51,0) 50%, rgba(7,26,51,0.6) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 16,
              color: "#fff",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              fontSize: 19,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            {name}
          </div>
        </div>
        <div style={{ padding: "16px 18px 20px" }}>
          <div style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.55 }}>{desc}</div>
        </div>
      </div>
    </Reveal>
  );
}

function DestinationsStrip() {
  const { t } = useLang();
  return (
    <section style={{ padding: "70px 24px", maxWidth: 1180, margin: "0 auto" }}>
      <Reveal>
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontSize: 12.5, color: "#AC9362", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
            {t.destinationsKicker}
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#0B2A52", margin: "0 0 14px", fontWeight: 700 }}>
            {t.destinationsTitle}
          </h2>
          <p style={{ fontSize: 15, color: "#6B6B6B", maxWidth: 560, margin: "0 auto" }}>{t.destinationsIntro}</p>
        </div>
      </Reveal>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gridAutoRows: "1fr",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        {t.destinations.map((d, i) => (
          <DestinationCard key={d.name} name={d.name} desc={d.desc} index={i} />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------
function DevelopersSection() {
  const { t } = useLang();
  return (
    <section id="developers" style={{ padding: "70px 24px", background: "#0B2A52" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }} className="dev-cta-grid">
        <div>
          <div style={{ fontSize: 12.5, color: "#AC9362", fontWeight: 700, letterSpacing: 1.5, marginBottom: 12 }}>
            {t.devKicker}
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", color: "#FAF8F4", margin: "0 0 14px", fontWeight: 700 }}>
            {t.devTitle}
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "#C9D2D0", maxWidth: 560, margin: 0 }}>
            {t.devIntro}
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <a
            href="/developers"
            style={{ display: "inline-block", background: "#AC9362", color: "#fff", padding: "16px 28px", borderRadius: 3, fontWeight: 700, fontSize: 15, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            {t.devCta} →
          </a>
        </div>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .dev-cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function Page({ onPrivacy }) {
  const { t } = useLang();
  const [formState, setFormState] = useState({ naam: "", email: "", bericht: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", color: "#1A1A1A", background: "#FAF8F4", overflowX: "hidden", width: "100%" }}>
      <style>{`
        html, body { overflow-x: hidden; max-width: 100%; }
        * { box-sizing: border-box; }
      `}</style>
      <NavBar />

      {/* HERO */}
      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "76px 24px 60px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 48,
          alignItems: "center",
        }}
        className="hero-grid"
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#EDE6D7",
              color: "#73602F",
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: 0.6,
              padding: "6px 14px",
              borderRadius: 20,
              marginBottom: 22,
            }}
          >
            <ArchMark size={14} /> {t.heroBadge}
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(34px, 5vw, 54px)",
              lineHeight: 1.1,
              color: "#0B2A52",
              margin: "0 0 22px",
              fontWeight: 700,
            }}
          >
            {t.heroTitle1}
            <br />
            <span style={{ color: "#AC9362" }}>{t.heroTitle2}</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#3D3D3D", maxWidth: 480, marginBottom: 32 }}>
            {t.heroText}
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a
              href="#contact"
              style={{
                background: "#AC9362",
                color: "#FAF8F4",
                padding: "14px 28px",
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 14.5,
                textDecoration: "none",
              }}
            >
              {t.heroCta1}
            </a>
            <a
              href="#aanpak"
              style={{
                border: "1.5px solid #0B2A52",
                color: "#0B2A52",
                padding: "14px 28px",
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 14.5,
                textDecoration: "none",
              }}
            >
              {t.heroCta2}
            </a>
          </div>

          <div style={{ display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap" }}>
            <StatBlock value={t.stat1v} label={t.stat1l} />
            <StatBlock value={t.stat2v} label={t.stat2l} />
            <StatBlock value={t.stat3v} label={t.stat3l} />
          </div>
        </div>

        <div
          style={{
            background: "#0B2A52",
            borderRadius: 6,
            padding: "40px 32px",
            position: "relative",
            overflow: "hidden",
            backgroundImage:
              "linear-gradient(160deg, rgba(11,42,82,0.93), rgba(7,26,51,0.93)), url(https://images.unsplash.com/photo-1614122027743-50a9e6e8002f?fm=jpg&q=70&w=1200&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={{ position: "absolute", top: -30, right: -30, opacity: 0.12 }}>
            <ArchMark size={220} light />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ color: "#C2A877", fontSize: 12, letterSpacing: 2, fontWeight: 600, marginBottom: 18 }}>
              {t.whyTitle}
            </div>
            {t.whyItems.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#AC9362",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ color: "#EDE7DA", fontSize: 14.5, lineHeight: 1.5 }}>{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ROUTE / BRIDGE SECTION */}
      <section id="aanpak" style={{ padding: "70px 24px", background: "#fff", borderTop: "1px solid #DCD4C2", borderBottom: "1px solid #DCD4C2" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <div style={{ fontSize: 12.5, color: "#AC9362", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
                {t.routeKicker}
              </div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#0B2A52", margin: 0, fontWeight: 700 }}>
                {t.routeTitle}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <BridgeRoute />
          </Reveal>
        </div>
      </section>

      <DestinationsStrip />

      {/* SERVICES */}
      <section id="diensten" style={{ padding: "80px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: 46 }}>
            <div style={{ fontSize: 12.5, color: "#AC9362", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
              {t.servicesKicker}
            </div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#0B2A52", margin: 0, fontWeight: 700, maxWidth: 560 }}>
              {t.servicesTitle}
            </h2>
          </div>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gridAutoRows: "1fr",
            gap: 20,
            alignItems: "stretch",
          }}
        >
          {t.services.map((s) => (
            <ServiceCard key={s.num} num={s.num} title={s.title} text={s.text} />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="over-ons" style={{ padding: "80px 24px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 56, alignItems: "center" }} className="about-grid">
          <Reveal>
            <div
              style={{
                background: "#0B2A52",
                borderRadius: 6,
                padding: 40,
                color: "#EDE7DA",
                position: "relative",
                overflow: "hidden",
                backgroundImage:
                  "linear-gradient(160deg, rgba(11,42,82,0.93), rgba(7,26,51,0.93)), url(https://images.unsplash.com/photo-1615352916571-99807ec84e29?fm=jpg&q=70&w=1200&auto=format&fit=crop)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div style={{ position: "absolute", bottom: -40, left: -40, opacity: 0.1 }}>
                <ArchMark size={200} light />
              </div>
              <div style={{ position: "relative", fontFamily: "Georgia, serif", fontSize: 20, lineHeight: 1.6, fontStyle: "italic" }}>
                "{t.aboutQuote}"
              </div>
              <div style={{ marginTop: 22, fontWeight: 700, color: "#fff" }}>{t.aboutQuoteAttr}</div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <div style={{ fontSize: 12.5, color: "#AC9362", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
                {t.aboutKicker}
              </div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#0B2A52", margin: "0 0 18px", fontWeight: 700 }}>
                {t.aboutTitle}
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#3D3D3D", marginBottom: 16 }}>{t.aboutP1}</p>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#3D3D3D" }}>{t.aboutP2}</p>
            </div>
          </Reveal>
        </div>
      </section>
      <style>{`
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* DEVELOPERS */}
      <DevelopersSection />

      {/* CONTACT */}
      <section id="contact" style={{ padding: "80px 24px", background: "#0B2A52" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <ArchMark size={44} light />
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#FAF8F4", margin: "20px 0 12px", fontWeight: 700 }}>
              {t.contactTitle}
            </h2>
            <p style={{ color: "#C9D2D0", fontSize: 15.5, marginBottom: 40 }}>{t.contactText}</p>
          </Reveal>
          <Reveal delay={100}>
            {sent ? (
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: 36, color: "#fff" }}>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{t.sentTitle}</div>
                <div style={{ color: "#C9D2D0", fontSize: 14.5 }}>{t.sentText}</div>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSending(true);
                  setSendError(false);
                  try {
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(formState),
                    });
                    if (!res.ok) throw new Error("Send failed");
                    setSent(true);
                  } catch (err) {
                    setSendError(true);
                  } finally {
                    setSending(false);
                  }
                }}
                style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}
              >
                {sendError && (
                  <div
                    style={{
                      background: "rgba(220,90,60,0.15)",
                      border: "1px solid rgba(220,90,60,0.4)",
                      color: "#FAF8F4",
                      padding: "10px 14px",
                      borderRadius: 3,
                      fontSize: 13.5,
                    }}
                  >
                    {t.formErrorText}
                  </div>
                )}
                <input
                  required
                  placeholder={t.formName}
                  value={formState.naam}
                  onChange={(e) => setFormState((s) => ({ ...s, naam: e.target.value }))}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#fff",
                    fontSize: 14.5,
                    outline: "none",
                  }}
                />
                <input
                  required
                  type="email"
                  placeholder={t.formEmail}
                  value={formState.email}
                  onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#fff",
                    fontSize: 14.5,
                    outline: "none",
                  }}
                />
                <textarea
                  placeholder={t.formMessage}
                  rows={4}
                  value={formState.bericht}
                  onChange={(e) => setFormState((s) => ({ ...s, bericht: e.target.value }))}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#fff",
                    fontSize: 14.5,
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    marginTop: 6,
                    background: "#AC9362",
                    color: "#fff",
                    border: "none",
                    padding: "15px 24px",
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: 14.5,
                    cursor: sending ? "default" : "pointer",
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  {sending ? t.formSending : t.formSubmit}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 24px", background: "#081D3D", color: "#9FB0AE", fontSize: 13 }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ArchMark size={20} light />
              <span>{t.footerTag}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
              <a
                href="mailto:info@obrovrealestate.nl"
                style={{ color: "#9FB0AE", textDecoration: "none", fontSize: 13 }}
              >
                info@obrovrealestate.nl
              </a>
              <a
                href="https://www.instagram.com/obrov_realestate/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: "#9FB0AE", display: "flex", alignItems: "center" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61591640245471"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{ color: "#9FB0AE", display: "flex", alignItems: "center" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M15 8.5h-2a1.5 1.5 0 0 0-1.5 1.5v2H15l-.5 3H11.5V21h-3v-6H6.5v-3H8.5V9.5A4 4 0 0 1 12.5 5.5H15z" />
                </svg>
              </a>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              paddingTop: 16,
              borderTop: "1px solid rgba(159,176,174,0.2)",
            }}
          >
            <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
              <span>{t.footerRights}</span>
              <button
                onClick={onPrivacy}
                style={{ background: "none", border: "none", color: "#9FB0AE", fontSize: 13, cursor: "pointer", padding: 0, textDecoration: "underline" }}
              >
                Privacybeleid
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PrivacyModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 6, padding: "36px 32px", maxWidth: 640, width: "100%", maxHeight: "80vh", overflowY: "auto", position: "relative" }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#6B6B6B" }}>×</button>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#0B2A52", margin: "0 0 18px" }}>Privacybeleid</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#3D3D3D", marginBottom: 14 }}>
          <strong>Obrov Real Estate</strong> respecteert uw privacy en verwerkt persoonsgegevens conform de Algemene Verordening Gegevensbescherming (AVG/GDPR).
        </p>
        <h3 style={{ fontSize: 15, color: "#0B2A52", margin: "18px 0 8px" }}>Welke gegevens verzamelen wij?</h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#3D3D3D" }}>
          Via het contactformulier verwerken wij uw naam, e-mailadres en het bericht dat u invult. Deze gegevens worden uitsluitend gebruikt om uw aanvraag te beantwoorden.
        </p>
        <h3 style={{ fontSize: 15, color: "#0B2A52", margin: "18px 0 8px" }}>Hoe lang bewaren wij uw gegevens?</h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#3D3D3D" }}>
          Wij bewaren uw gegevens niet langer dan noodzakelijk voor de afhandeling van uw aanvraag, en maximaal twee jaar.
        </p>
        <h3 style={{ fontSize: 15, color: "#0B2A52", margin: "18px 0 8px" }}>Delen wij uw gegevens?</h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#3D3D3D" }}>
          Wij delen uw gegevens niet met derden, behoudens de e-mailverzendservice (Resend) die wij gebruiken voor de afhandeling van contactverzoeken.
        </p>
        <h3 style={{ fontSize: 15, color: "#0B2A52", margin: "18px 0 8px" }}>Uw rechten</h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#3D3D3D" }}>
          U heeft het recht op inzage, correctie en verwijdering van uw persoonsgegevens. Neem hiervoor contact op via <a href="mailto:info@obrovrealestate.nl" style={{ color: "#AC9362" }}>info@obrovrealestate.nl</a>.
        </p>
        <h3 style={{ fontSize: 15, color: "#0B2A52", margin: "18px 0 8px" }}>Contact</h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "#3D3D3D" }}>
          Obrov Real Estate — <a href="mailto:info@obrovrealestate.nl" style={{ color: "#AC9362" }}>info@obrovrealestate.nl</a>
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("nl");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const t = CONTENT[lang];

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      <Page onPrivacy={() => setShowPrivacy(true)} />
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </LangContext.Provider>
  );
}
