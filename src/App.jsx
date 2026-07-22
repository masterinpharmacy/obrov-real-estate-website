import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { Link } from "react-router-dom";
import { DEMO_WONINGEN } from "./demoData.js";
import { supabase, supabaseConfigured } from "./supabase.js";

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
    navLogin: "Inloggen",
    navMijnAccount: "Mijn account",
    navFaq: "FAQ",
    navAanbod: "Aanbod bekijken",
    heroBadge: "EUROPEES VASTGOEDPLATFORM VOOR DE BALKAN",
    heroTitle1: "Balkan vastgoed,",
    heroTitle2: "volledig transparant.",
    heroText:
      "Het eerste Europese platform dat Balkan vastgoed volledig transparant maakt, met exacte locaties, complete informatie en directe toegang voor kopers én verkopers uit heel Europa en de diaspora.",
    heroCta1: "Bekijk het aanbod",
    heroCta2: "Woning plaatsen",
    stat1v: "100%", stat1l: "Euro-markt, geen wisselkoersrisico",
    stat2v: "3", stat2l: "Regio's met actieve contacten",
    stat3v: "1", stat3l: "Vast aanspreekpunt, heel het traject",
    whyTitle: "WAAROM DE BALKAN",
    whyItems: [
      "Lagere vastgoedprijzen dan West-Europa, met groeipotentieel",
      "Exacte locaties, wij laten zien wat anderen verbergen",
      "Directe toegang tot verkopende partij zonder tussenpersoon",
      "Vier landen: Montenegro, Kroatië, Bosnië en Slovenië",
    ],
    routeKicker: "HET TRAJECT",
    routeTitle: "Van Den Haag tot Budva, in één lijn",
    routeLeft: "Nederland",
    routeRight: "Montenegro",
    destinationsKicker: "ONZE REGIO'S",
    destinationsTitle: "Montenegro & de Balkan",
    destinationsIntro:
      "Montenegro is onze kernmarkt. Onze contacten en projecten strekken zich ook uit naar buurlanden Kroatië, Bosnië-Herzegovina en Slovenië.",
    destinationLands: [
      {
        land: "Montenegro",
        flag: "🇲🇪",
        why: "EU-kandidaat, Adriatische kust, lage instapprijzen, euro als valuta.",
        spots: [
          { name: "Kotor", desc: "Historische baai, UNESCO werelderfgoed, omringd door bergen" },
          { name: "Budva", desc: "Levendige kustplaats met ommuurde oude stad en stranden" },
          { name: "Tivat", desc: "Thuis van jachthaven Porto Montenegro, internationale luchthaven" },
          { name: "Bar", desc: "Grootste jachthaven van Montenegro, groeiende stad aan zee" },
          { name: "Ulcinj", desc: "Zuidelijkste kustplaats, lange zandstranden richting Albanië" },
        ],
      },
      {
        land: "Kroatië",
        flag: "🇭🇷",
        why: "EU-lid, dalmatijnse kust, sterke toeristenmarkt, goede infrastructuur.",
        spots: [
          { name: "Split", desc: "Historische havenstad, directe vluchten vanuit NL, sterke verhuurmarkt" },
          { name: "Dubrovnik", desc: "Premium bestemming, hoge huurprijzen, UNESCO-beschermd" },
          { name: "Makarska", desc: "Populaire Riviera, groeiende nieuwbouwmarkt, strand en bergen" },
          { name: "Zadar", desc: "Bereikbaar, moderne marina, lagere instapprijs dan Split" },
        ],
      },
      {
        land: "Bosnië-Herzegovina",
        flag: "🇧🇦",
        why: "Laagste instapprijzen van de regio, groeiende toerismesector, EU-kandidaat.",
        spots: [
          { name: "Mostar", desc: "Iconische stad, snel groeiend toerisme, betaalbare woningprijzen" },
          { name: "Sarajevo", desc: "Hoofdstad, diverse vastgoedmarkt, EU-kandidaatperspectief" },
          { name: "Neum", desc: "Enige kuststad van BiH, groeiend toerisme aan de Adriatische zee" },
        ],
      },
      {
        land: "Slovenië",
        flag: "🇸🇮",
        why: "EU-lid, euro als valuta, stabiele rechtsstaat, populair bij Europese investeerders.",
        spots: [
          { name: "Ljubljana", desc: "Hoofdstad, stabiele vastgoedmarkt, sterk huurniveau" },
          { name: "Portorož", desc: "Adriatische kust, luxe resort-markt, sterke verhuurpotentie" },
          { name: "Bled", desc: "Iconisch meer, topbestemming, schaars aanbod = waardestijging" },
        ],
      },
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
      { num: "01", title: "Projectselectie", text: "Curatie van nieuwbouw- en bestaande projecten op basis van uw profiel, budget en doel, verhuur, lifestyle of vermogensspreiding." },
      { num: "02", title: "Off-plan aankoop", text: "Begeleiding bij de aankoop van nieuwbouw vóór of tijdens de bouw, vaak tegen een gunstigere instapprijs dan bij oplevering." },
      { num: "03", title: "Invest & flip", text: "Strategisch aan- en verkooptraject gericht op waardestijging, met of zonder renovatie, afgestemd op uw rendementsdoel." },
      { num: "04", title: "Verkenningsreis", text: "Persoonlijke bezichtigingsreis naar Montenegro, georganiseerd en begeleid, met directe toegang tot ontwikkelaars en locaties." },
      { num: "05", title: "Juridische begeleiding", text: "Vast netwerk van lokale advocaten voor contractcontrole, kadasteronderzoek en notariële overdracht." },
      { num: "06", title: "Fiscale afstemming", text: "Coördinatie met een Nederlandse fiscalist over de gevolgen voor box 3 en structurering van het eigendom." },
      { num: "07", title: "Transactiebegeleiding", text: "Van reservering tot sleuteloverdracht, wij bewaken elke stap en elke deadline namens u." },
      { num: "08", title: "Verhuurbeheer", text: "Optionele doorverwijzing naar of opzet van lokaal beheer voor wie het object (deels) wil verhuren." },
    ],
    aboutKicker: "OVER ONS",
    aboutTitle: "Twee rollen, één kantoor",
    aboutQuote:
      "Wij werken voor zowel de koper als de ontwikkelaar, transparant, persoonlijk en altijd met één vast aanspreekpunt.",
    aboutQuoteAttr: ", Obrov Real Estate",
    aboutP1:
      "Obrov Real Estate vervult twee complementaire rollen. Wij verbinden kopers uit heel Europa en de Balkan-diaspora met vastgoed op de Balkan. Via ons platform vinden verkopers en projectontwikkelaars een breed internationaal publiek. Voor wie persoonlijke begeleiding wil bij aan- of verkoop staan wij klaar: van eerste contact tot overdracht.",
    aboutP2:
      "Voor Montenegrijnse en Balkanse projectontwikkelaars zijn wij de exclusieve vertegenwoordiger in Nederland. Wij presenteren hun projecten aan ons netwerk van investeerders en ontvangen daarvoor een commissie per verkochte unit. Beide partijen weten vooraf precies hoe we verdienen, geen verborgen kosten, geen conflicterende belangen.",
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
    devCta: "Samenwerken als ontwikkelaar",
    devTitle: "Bereik Europese investeerders en de Balkan-diaspora",
    devIntro: "Obrov Real Estate verbindt uw project rechtstreeks met Europese investeerders en de Balkan-diaspora wereldwijd. Wij presenteren uw vastgoed aan een actief internationaal netwerk van kopers uit Nederland, Duitsland, Luxemburg, Zweden en de diasporagemeenschappen in heel Europa.",
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
    footerTag: "Obrov Real Estate, Montenegro Investments",
    platformKicker: "HOE HET WERKT",
    platformTitle: "Één platform, drie doelgroepen",
    platformIntro: "Obrov Real Estate maakt Balkan vastgoed transparant voor kopers, verkopers en ontwikkelaars uit heel Europa en de diaspora.",
    platformKoperTitle: "Voor de koper",
    platformKoperPunten: [
      "Exacte GPS-locatie van elke woning",
      "Volledige informatie: m², kamers, papieren, nutsvoorzieningen",
      "Direct contact met de verkopende partij",
      "Kaart- én lijstweergave voor eenvoudig vergelijken",
      "Aanbod in 10 Europese talen",
    ],
    platformVerkoperTitle: "Voor de verkoper",
    platformVerkoperPunten: [
      "Bereik kopers uit heel Europa en de diaspora",
      "Gratis plaatsen tijdens de testfase",
      "Later: €150/maand, significant hogere verkoopkans",
      "Eigen foto's uploaden, professionele sessie beschikbaar",
      "Contactgegevens zichtbaar op elke advertentie",
    ],
    platformOntwikkelaarTitle: "Voor ontwikkelaars",
    platformOntwikkelaarPunten: [
      "Bereik de wereldwijde markt én de Balkan-diaspora",
      "Platform in 10 talen, kopers uit heel Europa vinden u",
      "Vertegenwoordiging in NL, DE, LU en SE",
      "Commissie per verkochte unit, geen vaste kosten",
      "Commissie per unit, geen vaste kosten",
    ],
    searchKicker: "VASTGOED ZOEKEN",
    searchTitle: "Vind uw woning in Montenegro & de Balkan",
    searchPlaceholder: "Stad of regio (bijv. Kotor, Budva, Bar...)",
    searchStraal: "Straal (km)",
    searchBtn: "Zoeken",
    aanbodKicker: "ACTUEEL AANBOD",
    aanbodLink: "Volledig aanbod bekijken",
    footerRights: "© 2026 Obrov Real Estate. Alle rechten voorbehouden.",
  },

  en: {
    langLabel: "EN",
    nav: { aanpak: "Approach", diensten: "Services", overOns: "About us", developers: "Developers", contact: "Contact" },
    navCta: "Book a call",
    navLogin: "Log in",
    navMijnAccount: "My account",
    navFaq: "FAQ",
    navAanbod: "View listings",
    heroBadge: "EUROPEAN REAL ESTATE PLATFORM FOR THE BALKANS",
    heroTitle1: "Balkan real estate,",
    heroTitle2: "fully transparent.",
    heroText:
      "The first European platform making Balkan real estate fully transparent, with exact locations, complete information and direct access for buyers and sellers from across Europe and the diaspora.",
    heroCta1: "View listings",
    heroCta2: "List a property",
    stat1v: "100%", stat1l: "Euro market, no exchange-rate risk",
    stat2v: "3", stat2l: "Regions with active contacts",
    stat3v: "1", stat3l: "One point of contact, throughout",
    whyTitle: "WHY THE BALKANS",
    whyItems: [
      "EU candidate status, legal certainty growing alongside it",
      "Adriatic coastline, lower entry prices than Western Europe",
      "Euro as de facto currency, no exchange-rate risk",
      "Growing tourism & marinas such as Porto Montenegro",
    ],
    routeKicker: "THE JOURNEY",
    routeTitle: "From The Hague to Budva, in one line",
    routeLeft: "Netherlands",
    routeRight: "Montenegro",
    destinationsKicker: "OUR REGIONS",
    destinationsTitle: "Montenegro & the Balkans",
    destinationsIntro:
      "Montenegro is our core market. Our contacts and projects also extend to neighbouring Croatia, Bosnia-Herzegovina and Slovenia.",
    destinationLands: [
      {
        land: "Montenegro",
        flag: "🇲🇪",
        why: "EU candidate, Adriatic coast, low entry prices, euro as currency.",
        spots: [
          { name: "Kotor", desc: "Historic bay, UNESCO World Heritage site, surrounded by mountains" },
          { name: "Budva", desc: "Lively coastal town with a walled old town and beaches" },
          { name: "Tivat", desc: "Home of Porto Montenegro marina and the international airport" },
          { name: "Bar", desc: "Montenegro's largest marina, a growing town on the sea" },
          { name: "Ulcinj", desc: "The southernmost coastal town, long sandy beaches towards Albania" },
        ],
      },
      {
        land: "Croatia",
        flag: "🇭🇷",
        why: "EU member, Dalmatian coast, strong tourist market, good infrastructure.",
        spots: [
          { name: "Split", desc: "Historic port city, direct flights from NL, strong rental market" },
          { name: "Dubrovnik", desc: "Premium destination, high rental yields, UNESCO-protected" },
          { name: "Makarska", desc: "Popular Riviera, growing new-build market, beach and mountains" },
          { name: "Zadar", desc: "Accessible, modern marina, lower entry price than Split" },
        ],
      },
      {
        land: "Bosnia-Herzegovina",
        flag: "🇧🇦",
        why: "Lowest entry prices in the region, growing tourism sector, EU candidate.",
        spots: [
          { name: "Mostar", desc: "Iconic city, rapidly growing tourism, affordable property prices" },
          { name: "Sarajevo", desc: "Capital city, diverse real estate market, EU candidate perspective" },
          { name: "Neum", desc: "Bosnia's only coastal town, growing Adriatic tourism" },
        ],
      },
      {
        land: "Slovenia",
        flag: "🇸🇮",
        why: "EU member, euro as currency, stable rule of law, popular with European investors.",
        spots: [
          { name: "Ljubljana", desc: "Capital city, stable property market, strong rental yields" },
          { name: "Portorož", desc: "Adriatic coast, luxury resort market, strong rental potential" },
          { name: "Bled", desc: "Iconic lake, top destination, scarce supply = value growth" },
        ],
      },
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
      { num: "01", title: "Project selection", text: "Curated new-build and existing projects matched to your profile, budget and goal, rental, lifestyle, or wealth diversification." },
      { num: "02", title: "Off-plan purchase", text: "Guidance on buying new-build property before or during construction, often at a more favourable entry price than at completion." },
      { num: "03", title: "Invest & flip", text: "A strategic buy-and-sell process focused on value growth, with or without renovation, tailored to your return objective." },
      { num: "04", title: "Viewing trip", text: "A personally organised and guided viewing trip to Montenegro, with direct access to developers and locations." },
      { num: "05", title: "Legal guidance", text: "A fixed network of local lawyers for contract review, land registry checks and notarial transfer." },
      { num: "06", title: "Tax alignment", text: "Coordination with a Dutch tax adviser on the implications for box 3 and ownership structuring." },
      { num: "07", title: "Transaction guidance", text: "From reservation to key handover, we track every step and every deadline on your behalf." },
      { num: "08", title: "Rental management", text: "Optional referral to or setup of local rental management for those who wish to (partly) let their property." },
    ],
    aboutKicker: "ABOUT US",
    aboutTitle: "Two roles, one agency",
    aboutQuote:
      "We work for both the buyer and the developer, transparently, personally, and always with one fixed point of contact.",
    aboutQuoteAttr: ", Obrov Real Estate",
    aboutP1:
      "Obrov Real Estate fulfils two complementary roles. We connect buyers from across Europe and the Balkan diaspora with real estate on the Balkans. Through our platform, sellers and developers reach a broad international audience. For those seeking personal guidance in buying or selling, we are here from first contact to handover.",
    aboutP2:
      "For Montenegrin and Balkan project developers, we are the exclusive representative in the Netherlands. We present their projects to our investor network and receive a commission per unit sold. Both parties know in advance exactly how we earn, no hidden costs, no conflicting interests.",
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
    devTitle: "Reach European investors and the Balkan diaspora",
    devIntro: "Obrov Real Estate connects your project directly with European investors and the Balkan diaspora worldwide. We present your property to an active international network of buyers from the Netherlands, Germany, Luxembourg, Sweden and diaspora communities across Europe.",
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
    platformKicker: "HOW IT WORKS",
    platformTitle: "One platform, three audiences",
    platformIntro: "Obrov Real Estate makes Balkan real estate transparent for buyers, sellers and developers from across Europe and the diaspora.",
    platformKoperTitle: "For the buyer",
    platformKoperPunten: [
      "Exact GPS location of every property",
      "Full information: m², rooms, paperwork, utilities",
      "Direct contact with the selling party",
      "Map and list view for easy comparison",
      "Listings in 10 European languages",
    ],
    platformVerkoperTitle: "For the seller",
    platformVerkoperPunten: [
      "Reach buyers from across Europe and the diaspora",
      "Free listing during the test phase",
      "Later: €150/month, significantly higher chance of sale",
      "Upload your own photos, professional session available",
      "Contact details visible on every listing",
    ],
    platformOntwikkelaarTitle: "For developers",
    platformOntwikkelaarPunten: [
      "Reach the global market and the Balkan diaspora",
      "Exclusive representation in the Netherlands, Germany, Luxembourg and Sweden",
      "Presentation to an active European investment network",
      "Commission per unit sold, no fixed costs",
      "Clear contracts, no hidden fees",
    ],
    searchKicker: "PROPERTY SEARCH",
    searchTitle: "Find your property in Montenegro & the Balkans",
    searchPlaceholder: "City or region (e.g. Kotor, Budva, Bar...)",
    searchStraal: "Radius (km)",
    searchBtn: "Search",
    aanbodKicker: "CURRENT LISTINGS",
    aanbodLink: "View all listings",
    footerTag: "Obrov Real Estate, Montenegro Investments",
    footerRights: "© 2026 Obrov Real Estate. All rights reserved.",
  },

  me: {
    langLabel: "CG",
    nav: { aanpak: "Pristup", diensten: "Usluge", overOns: "O nama", developers: "Investitori", contact: "Kontakt" },
    navCta: "Zakažite razgovor",
    navLogin: "Prijava",
    navMijnAccount: "Moj nalog",
    navFaq: "FAQ",
    navAanbod: "Ponuda",
    heroBadge: "EVROPSKA PLATFORMA ZA NEKRETNINE NA BALKANU",
    heroTitle1: "Nekretnine na Balkanu,",
    heroTitle2: "potpuno transparentno.",
    heroText:
      "Prva evropska platforma koja čini nekretnine na Balkanu potpuno transparentnim, sa tačnim lokacijama, potpunim informacijama i direktnim pristupom za kupce i prodavce iz cijele Evrope i dijaspore.",
    heroCta1: "Pogledajte ponudu",
    heroCta2: "Oglasiti nekretninu",
    stat1v: "100%", stat1l: "Evro kao valuta, nema kursnog rizika",
    stat2v: "3", stat2l: "Regije sa aktivnim kontaktima",
    stat3v: "1", stat3l: "Jedna kontakt osoba, tokom cijelog procesa",
    whyTitle: "ZAŠTO BALKAN",
    whyItems: [
      "Status kandidata za EU, pravna sigurnost raste",
      "Jadranska obala, niže ulazne cijene nego u zapadnoj Evropi",
      "Evro kao zvanična valuta, nema kursnog rizika",
      "Rast turizma i marina, kao što je Porto Montenegro",
    ],
    routeKicker: "PUTOVANJE",
    routeTitle: "Od Hag-a do Budve, u jednoj liniji",
    routeLeft: "Holandija",
    routeRight: "Crna Gora",
    destinationsKicker: "NAŠI REGIONI",
    destinationsTitle: "Crna Gora i Balkan",
    destinationsIntro:
      "Crna Gora je naše osnovno tržište. Naši kontakti i projekti protežu se i na susjedne zemlje: Hrvatsku, Bosnu i Hercegovinu i Sloveniju.",
    destinationLands: [
      {
        land: "Crna Gora",
        flag: "🇲🇪",
        why: "Kandidat za EU, jadranska obala, niske ulazne cijene, evro kao valuta.",
        spots: [
          { name: "Kotor", desc: "Istorijski zaliv, lokalitet UNESCO svjetske baštine, okružen planinama" },
          { name: "Budva", desc: "Živahan primorski grad sa starim gradom i plažama" },
          { name: "Tivat", desc: "Dom marine Porto Montenegro i međunarodnog aerodroma" },
          { name: "Bar", desc: "Najveća marina u Crnoj Gori, grad u rastu na moru" },
          { name: "Ulcinj", desc: "Najjužniji primorski grad, duge pješčane plaže prema Albaniji" },
        ],
      },
      {
        land: "Hrvatska",
        flag: "🇭🇷",
        why: "Članica EU, dalmatinska obala, snažno turističko tržište, dobra infrastruktura.",
        spots: [
          { name: "Split", desc: "Istorijska luka, direktni letovi, snažno tržište iznajmljivanja" },
          { name: "Dubrovnik", desc: "Premium destinacija, visoki prihodi od najma, zaštićena UNESCO-om" },
          { name: "Makarska", desc: "Popularna Rivijera, rastuće tržište novogradnje, plaža i planine" },
          { name: "Zadar", desc: "Pristupačan grad, moderna marina, niža ulazna cijena od Splita" },
        ],
      },
      {
        land: "Bosna i Hercegovina",
        flag: "🇧🇦",
        why: "Najniže ulazne cijene u regiji, rastući turistički sektor, kandidat za EU.",
        spots: [
          { name: "Mostar", desc: "Ikonski grad, brzo rastući turizam, pristupačne cijene nekretnina" },
          { name: "Sarajevo", desc: "Glavni grad, raznovrsno tržište nekretnina, perspektiva EU" },
          { name: "Neum", desc: "Jedini primorski grad BiH, rastući turizam na Jadranu" },
        ],
      },
      {
        land: "Slovenija",
        flag: "🇸🇮",
        why: "Članica EU, evro kao valuta, stabilna pravna država, popularna kod investitora.",
        spots: [
          { name: "Ljubljana", desc: "Glavni grad, stabilno tržište nekretnina, snažan prihod od najma" },
          { name: "Portorož", desc: "Jadranska obala, luksuzno odmaralište, visok potencijal iznajmljivanja" },
          { name: "Bled", desc: "Ikonsko jezero, top destinacija, oskudna ponuda = rast vrijednosti" },
        ],
      },
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
      { num: "01", title: "Odabir projekta", text: "Pažljiv izbor novogradnje i postojećih projekata prema vašem profilu, budžetu i cilju, iznajmljivanje, način života ili diverzifikacija imovine." },
      { num: "02", title: "Kupovina off-plan", text: "Podrška pri kupovini novogradnje prije ili tokom izgradnje, često po povoljnijoj ulaznoj cijeni nego nakon završetka." },
      { num: "03", title: "Invest & flip", text: "Strateški proces kupovine i prodaje usmjeren na rast vrijednosti, sa ili bez renoviranja, prilagođen vašem cilju prinosa." },
      { num: "04", title: "Putovanje razgledanja", text: "Lično organizovano i vođeno putovanje u Crnu Goru, sa direktnim pristupom investitorima i lokacijama." },
      { num: "05", title: "Pravna podrška", text: "Stalna mreža lokalnih advokata za provjeru ugovora, provjeru u katastru i notarski prenos." },
      { num: "06", title: "Poreska usklađenost", text: "Koordinacija sa holandskim poreskim savjetnikom o posljedicama za box 3 i strukturiranje vlasništva." },
      { num: "07", title: "Podrška u transakciji", text: "Od rezervacije do predaje ključeva, pratimo svaki korak i svaki rok u vaše ime." },
      { num: "08", title: "Upravljanje iznajmljivanjem", text: "Opciono upućivanje na ili organizacija lokalnog upravljanja za one koji žele (djelimično) iznajmiti nekretninu." },
    ],
    aboutKicker: "O NAMA",
    aboutTitle: "Dvije uloge, jedna agencija",
    aboutQuote:
      "Radimo i za kupca i za investitora, transparentno, lično i uvijek sa jednom fiksnom kontakt osobom.",
    aboutQuoteAttr: ", Obrov Real Estate",
    aboutP1:
      "Obrov Real Estate ispunjava dvije komplementarne uloge. Za holandske investitore smo vodič: pronalazimo odgovarajuće nekretnine ili projekte, organizujemo putovanja razgledanja, vodimo pravni i poreski proces i pratimo svaki detalj do predaje ključeva. Naša naknada je transparentna naknada za vođenje ili procenat od kupoprodajne cijene.",
    aboutP2:
      "Za crnogorske i balkanske projektne investitore smo ekskluzivni zastupnik u Holandiji. Predstavljamo njihove projekte našoj mreži investitora i primamo proviziju po prodanoj jedinici. Obje strane unaprijed znaju tačno kako zarađujemo, bez skrivenih troškova, bez sukoba interesa.",
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
    devTitle: "Dosegnite evropske investitore i balkansku dijasporu",
    devIntro: "Obrov Real Estate direktno povezuje vaš projekat sa evropskim investitorima i balkanskom dijasporom širom svijeta. Predstavljamo vaše nekretnine aktivnoj međunarodnoj mreži kupaca iz Holandije, Njemačke, Luksemburga, Švedske i dijasporskih zajednica u cijeloj Evropi.",
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
    searchKicker: "PRETRAŽI NEKRETNINE",
    searchTitle: "Pronađite nekretninu u Crnoj Gori i na Balkanu",
    searchPlaceholder: "Grad ili region (npr. Kotor, Budva, Bar...)",
    searchStraal: "Radijus (km)",
    searchBtn: "Pretraži",
    aanbodKicker: "TRENUTNA PONUDA",
    aanbodLink: "Pogledajte svu ponudu",
    devError: "Došlo je do greške. Pokušajte ponovo ili pišite na info@obrovrealestate.nl.",
    platformKicker: "KAKO FUNKCIONIŠE",
    platformTitle: "Jedna platforma, tri ciljne grupe",
    platformIntro: "Obrov Real Estate čini nekretnine na Balkanu transparentnim za kupce, prodavce i investitore iz cijele Evrope i dijaspore.",
    platformKoperTitle: "Za kupca",
    platformKoperPunten: ["Tačna GPS lokacija svake nekretnine","Potpune informacije: m², sobe, dokumenti, komunalije","Direktan kontakt sa prodajnom stranom","Prikaz na karti i listi","Oglasi na 10 evropskih jezika"],
    platformVerkoperTitle: "Za prodavca",
    platformVerkoperPunten: ["Dosegnite kupce iz cijele Evrope i dijaspore","Besplatno oglašavanje u testnoj fazi","Kasnije: €150/mj, veća šansa za prodaju","Postavite vlastite fotografije","Kontakt podaci vidljivi na svakom oglasu"],
    platformOntwikkelaarTitle: "Za investitore",
    platformOntwikkelaarPunten: ["Dosegnite svjetsko tržište i balkansku dijasporu","Ekskluzivno zastupanje u zapadnoj Evropi","Prezentacija evropskoj investicionoj mreži","Provizija po prodanoj jedinici, bez fiksnih troškova","Jasni ugovori, bez skrivenih troškova"],
    footerTag: "Obrov Real Estate, Investicije u Crnoj Gori",
    footerRights: "© 2026 Obrov Real Estate. Sva prava zadržana.",
  },

  de: {
    langLabel: "DE",
    nav: { aanpak: "Vorgehen", diensten: "Leistungen", overOns: "Über uns", developers: "Entwickler", contact: "Kontakt" },
    navCta: "Gespräch vereinbaren",
    navLogin: "Anmelden",
    navMijnAccount: "Mein Konto",
    navFaq: "FAQ",
    navAanbod: "Angebote ansehen",
    heroBadge: "EUROPÄISCHE IMMOBILIENPLATTFORM FÜR DEN BALKAN",
    heroTitle1: "Balkan-Immobilien,",
    heroTitle2: "vollständig transparent.",
    heroText:
      "Die erste europäische Plattform, die Balkan-Immobilien vollständig transparent macht, mit genauen Standorten, vollständigen Informationen und direktem Zugang für Käufer und Verkäufer aus ganz Europa und der Diaspora.",
    heroCta1: "Angebote ansehen",
    heroCta2: "Immobilie inserieren",
    stat1v: "100%", stat1l: "Euro-Markt, kein Wechselkursrisiko",
    stat2v: "3", stat2l: "Regionen mit aktiven Kontakten",
    stat3v: "1", stat3l: "Fester Ansprechpartner, während des gesamten Prozesses",
    whyTitle: "WARUM DER BALKAN",
    whyItems: [
      "Niedrigere Immobilienpreise als in Westeuropa, mit Wachstumspotenzial",
      "Genaue Standorte, wir zeigen, was andere verbergen",
      "Direkter Zugang zur verkaufenden Partei ohne Zwischenhändler",
      "Vier Länder: Montenegro, Kroatien, Bosnien und Slowenien",
    ],
    routeKicker: "DER WEG",
    routeTitle: "Von Den Haag bis Budva, in einer Linie",
    routeLeft: "Niederlande",
    routeRight: "Montenegro",
    destinationsKicker: "UNSERE REGIONEN",
    destinationsTitle: "Montenegro & der Balkan",
    destinationsIntro:
      "Montenegro ist unser Kernmarkt. Unsere Kontakte und Projekte erstrecken sich auch auf die Nachbarländer Kroatien, Bosnien-Herzegowina und Slowenien.",
    destinationLands: [
      {
        land: "Montenegro",
        flag: "🇲🇪",
        why: "EU-Kandidat, Adriaküste, niedrige Einstiegspreise, Euro als Währung.",
        spots: [
          { name: "Kotor", desc: "Historische Bucht, UNESCO-Weltkulturerbe, umgeben von Bergen" },
          { name: "Budva", desc: "Lebendiger Küstenort mit ummauerter Altstadt und Stränden" },
          { name: "Tivat", desc: "Heimat der Marina Porto Montenegro und des internationalen Flughafens" },
          { name: "Bar", desc: "Größter Yachthafen Montenegros, wachsende Stadt am Meer" },
          { name: "Ulcinj", desc: "Südlichster Küstenort, lange Sandstrände in Richtung Albanien" },
        ],
      },
      {
        land: "Kroatien",
        flag: "🇭🇷",
        why: "EU-Mitglied, dalmatinische Küste, starker Tourismusmarkt, gute Infrastruktur.",
        spots: [
          { name: "Split", desc: "Historische Hafenstadt, Direktflüge aus NL, starker Mietmarkt" },
          { name: "Dubrovnik", desc: "Premium-Destination, hohe Mietrenditen, UNESCO-geschützt" },
          { name: "Makarska", desc: "Beliebte Riviera, wachsender Neubaumarkt, Strand und Berge" },
          { name: "Zadar", desc: "Gut erreichbar, moderner Yachthafen, niedrigerer Einstiegspreis" },
        ],
      },
      {
        land: "Bosnien-Herzegowina",
        flag: "🇧🇦",
        why: "Niedrigste Einstiegspreise der Region, wachsender Tourismus, EU-Kandidat.",
        spots: [
          { name: "Mostar", desc: "Ikonische Stadt, schnell wachsender Tourismus, erschwingliche Immobilien" },
          { name: "Sarajevo", desc: "Hauptstadt, vielfältiger Immobilienmarkt, EU-Kandidatenperspektive" },
          { name: "Neum", desc: "Bosniens einzige Küstenstadt, wachsender Adriatourismus" },
        ],
      },
      {
        land: "Slowenien",
        flag: "🇸🇮",
        why: "EU-Mitglied, Euro als Währung, stabiler Rechtsstaat, beliebt bei Investoren.",
        spots: [
          { name: "Ljubljana", desc: "Hauptstadt, stabiler Immobilienmarkt, starke Mietrenditen" },
          { name: "Portorož", desc: "Adriaküste, Luxus-Ferienmarkt, hohes Mietpotenzial" },
          { name: "Bled", desc: "Ikonischer See, Top-Destination, knappes Angebot = Wertsteigerung" },
        ],
      },
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
      { num: "01", title: "Projektauswahl", text: "Kuratierte Neubau- und Bestandsprojekte passend zu Ihrem Profil, Budget und Ziel, Vermietung, Lifestyle oder Vermögensdiversifikation." },
      { num: "02", title: "Off-Plan-Kauf", text: "Begleitung beim Kauf von Neubauimmobilien vor oder während der Bauphase, oft zu einem günstigeren Einstiegspreis als bei Fertigstellung." },
      { num: "03", title: "Invest & Flip", text: "Strategischer An- und Verkaufsprozess mit Fokus auf Wertsteigerung, mit oder ohne Renovierung, abgestimmt auf Ihr Renditeziel." },
      { num: "04", title: "Besichtigungsreise", text: "Persönlich organisierte und begleitete Besichtigungsreise nach Montenegro, mit direktem Zugang zu Bauträgern und Standorten." },
      { num: "05", title: "Rechtliche Begleitung", text: "Festes Netzwerk lokaler Anwälte für Vertragsprüfung, Grundbuchrecherche und notarielle Übertragung." },
      { num: "06", title: "Steuerliche Abstimmung", text: "Koordination mit einem niederländischen Steuerberater zu den Auswirkungen auf Box 3 und zur Eigentumsstruktur." },
      { num: "07", title: "Transaktionsbegleitung", text: "Von der Reservierung bis zur Schlüsselübergabe, wir überwachen jeden Schritt und jede Frist für Sie." },
      { num: "08", title: "Mietverwaltung", text: "Optionale Vermittlung an oder Einrichtung einer lokalen Verwaltung für alle, die ihre Immobilie (teilweise) vermieten möchten." },
    ],
    aboutKicker: "ÜBER UNS",
    aboutTitle: "Zwei Rollen, eine Agentur",
    aboutQuote:
      "Wir arbeiten sowohl für den Käufer als auch für den Bauträger, transparent, persönlich und immer mit einem festen Ansprechpartner.",
    aboutQuoteAttr: ", Obrov Real Estate",
    aboutP1:
      "Wir verbinden Käufer aus ganz Europa und der Balkan-Diaspora mit Immobilien auf dem Balkan. Über unsere Plattform erreichen Verkäufer und Projektentwickler ein breites internationales Publikum. Für persönliche Begleitung beim Kauf oder Verkauf stehen wir von der ersten Kontaktaufnahme bis zur Übergabe bereit.",
    aboutP2:
      "Für montenegrinische und balkanische Projektentwickler sind wir der exklusive Vertreter in den Niederlanden. Wir präsentieren ihre Projekte unserem Investorennetzwerk und erhalten dafür eine Provision pro verkaufter Einheit. Beide Parteien wissen im Voraus genau, wie wir verdienen, keine versteckten Kosten, keine Interessenkonflikte.",
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
    devIntro: "Obrov Real Estate verbindet Ihr Projekt direkt mit europäischen Investoren und der Balkan-Diaspora weltweit. Wir präsentieren Ihre Immobilien einem aktiven internationalen Netzwerk von Käufern aus den Niederlanden, Deutschland, Luxemburg, Schweden und den Diaspora-Gemeinschaften in ganz Europa.",
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
    platformKicker: "WIE ES FUNKTIONIERT",
    platformTitle: "Eine Plattform, drei Zielgruppen",
    platformIntro: "Obrov Real Estate macht Balkan-Immobilien transparent für Käufer, Verkäufer und Entwickler aus ganz Europa und der Diaspora.",
    platformKoperTitle: "Für den Käufer",
    platformKoperPunten: [
      "Genaue GPS-Lage jeder Immobilie",
      "Vollständige Informationen: m², Zimmer, Dokumente, Versorgung",
      "Direkter Kontakt mit der verkaufenden Partei",
      "Karten- und Listenansicht zum einfachen Vergleich",
      "Angebote in 10 europäischen Sprachen",
    ],
    platformVerkoperTitle: "Für den Verkäufer",
    platformVerkoperPunten: [
      "Käufer aus ganz Europa und der Diaspora erreichen",
      "Kostenlos inserieren in der Testphase",
      "Später: €150/Monat, deutlich höhere Verkaufschance",
      "Eigene Fotos hochladen, professionelle Session verfügbar",
      "Kontaktdaten auf jedem Inserat sichtbar",
    ],
    platformOntwikkelaarTitle: "Für Entwickler",
    platformOntwikkelaarPunten: [
      "Den Weltmarkt und die Balkan-Diaspora erreichen",
      "Exklusive Vertretung in den Niederlanden, Deutschland, Luxemburg und Schweden",
      "Präsentation an aktives europäisches Investitionsnetzwerk",
      "Provision pro verkaufter Einheit, keine Fixkosten",
      "Klare Verträge, keine versteckten Kosten",
    ],
    searchKicker: "IMMOBILIEN SUCHEN",
    searchTitle: "Finden Sie Ihre Immobilie in Montenegro & am Balkan",
    searchPlaceholder: "Stadt oder Region (z.B. Kotor, Budva, Bar...)",
    searchStraal: "Radius (km)",
    searchBtn: "Suchen",
    aanbodKicker: "AKTUELLES ANGEBOT",
    aanbodLink: "Alle Angebote ansehen",
    devSent: "Vorschlag erhalten! Wir melden uns innerhalb von zwei Werktagen.",
    devError: "Etwas ist schiefgelaufen. Bitte erneut versuchen oder an info@obrovrealestate.nl schreiben.",
    footerTag: "Obrov Real Estate, Montenegro Investments",
    footerRights: "© 2026 Obrov Real Estate. Alle Rechte vorbehalten.",
  },

  // ---- ZWEEDS ----
  sv: {
    langLabel: "SV",
    nav: { aanpak: "Tillvägagångssätt", diensten: "Tjänster", overOns: "Om oss", developers: "Utvecklare", contact: "Kontakt" },
    navCta: "Boka ett samtal",
    navLogin: "Logga in",
    navMijnAccount: "Mitt konto",
    navFaq: "FAQ",
    navAanbod: "Se utbud",
    heroBadge: "EUROPEISK FASTIGHETSPLATTFORM FÖR BALKAN",
    heroTitle1: "Balkanfastigheter,",
    heroTitle2: "helt transparent.",
    heroText:
      "Den första europeiska plattformen som gör balkanfastigheter helt transparenta, med exakta platser, fullständig information och direkt tillgång för köpare och säljare från hela Europa och diasporan.",
    heroCta1: "Se utbudet",
    heroCta2: "Annonsera en fastighet",
    stat1v: "100%", stat1l: "Euromarknad, ingen valutarisk",
    stat2v: "4", stat2l: "Balkanländer med aktiva kontakter",
    stat3v: "1", stat3l: "Fast kontaktperson genom hela processen",
    whyTitle: "VARFÖR MONTENEGRO",
    whyItems: [
      "EU-kandidat, rättssäkerheten växer",
      "Adriatiska kusten, lägre instegsättpriser än Västeuropa",
      "Euro som de facto valuta, ingen valutarisk",
      "Växande turism & marinor som Porto Montenegro",
    ],
    routeKicker: "RESAN",
    routeTitle: "Från Haag till Budva, i en linje",
    routeLeft: "Nederländerna",
    routeRight: "Montenegro",
    destinationsKicker: "VÅRA REGIONER",
    destinationsTitle: "Montenegro & Balkan",
    destinationsIntro: "Montenegro är vår kärnmarknad. Våra kontakter sträcker sig också till Kroatien, Bosnien-Hercegovina och Slovenien.",
    destinationLands: [
      { land: "Montenegro", flag: "🇲🇪", why: "EU-kandidat, Adriatiska kusten, låga instegsättpriser, euro som valuta.", spots: [
        { name: "Kotor", desc: "Historisk bukt, UNESCO-världsarv, omgiven av berg" },
        { name: "Budva", desc: "Livlig kuststad med ommurad gammal stad och stränder" },
        { name: "Tivat", desc: "Hem till Porto Montenegro-marina och internationell flygplats" },
        { name: "Bar", desc: "Montenegros största marina, växande stad vid havet" },
        { name: "Ulcinj", desc: "Sydligaste kuststaden, långa sandstränder mot Albanien" },
      ]},
      { land: "Kroatien", flag: "🇭🇷", why: "EU-medlem, dalmatinsk kust, stark turistmarknad, god infrastruktur.", spots: [
        { name: "Split", desc: "Historisk hamnstad, direktflyg, stark hyresmarknad" },
        { name: "Dubrovnik", desc: "Premium destination, hög hyresavkastning, UNESCO-skyddad" },
        { name: "Makarska", desc: "Populär Riviera, växande nybyggnadsmarknad" },
        { name: "Zadar", desc: "Tillgänglig stad, modern marina, lägre instegspris" },
      ]},
      { land: "Bosnien-Hercegovina", flag: "🇧🇦", why: "Lägsta instegsättpriser i regionen, växande turismsektor, EU-kandidat.", spots: [
        { name: "Mostar", desc: "Ikonisk stad, snabbt växande turism, prisvärda bostäder" },
        { name: "Sarajevo", desc: "Huvudstad, diversifierad fastighetsmarknad" },
        { name: "Neum", desc: "Bosniens enda kuststad, växande Adriatisk turism" },
      ]},
      { land: "Slovenien", flag: "🇸🇮", why: "EU-medlem, euro som valuta, stabil rättsstat, populär bland investerare.", spots: [
        { name: "Ljubljana", desc: "Huvudstad, stabil fastighetsmarknad, stark hyresavkastning" },
        { name: "Portorož", desc: "Adriatisk kust, lyxig semestermarknad" },
        { name: "Bled", desc: "Ikonisk sjö, toppdestination, knappt utbud = värdestegring" },
      ]},
    ],
    stops: [
      { city: "Haag", sub: "Introduktion & dokumentation", side: "nl" },
      { city: "Rotterdam", sub: "Juridisk & skatteprocess", side: "nl" },
      { city: "Tivat", sub: "Visning & projektval", side: "mne" },
      { city: "Kotor", sub: "Köpeavtal & notarie", side: "mne" },
      { city: "Budva", sub: "Överlåtelse & nyckelöverlämning", side: "mne" },
    ],
    servicesKicker: "TJÄNSTER",
    servicesTitle: "En resa, fullt guidad",
    services: [
      { num: "01", title: "Projektval", text: "Kurerade nybyggnadsprojekt och befintliga fastigheter matchade till din profil, budget och mål." },
      { num: "02", title: "Off-plan köp", text: "Vägledning vid köp av nybyggnationer före eller under byggfasen, ofta till ett fördelaktigare instegspris." },
      { num: "03", title: "Invest & flip", text: "Strategisk köp- och säljprocess med fokus på värdetillväxt, med eller utan renovering." },
      { num: "04", title: "Visningsresa", text: "Personligt organiserad och guidad visningsresa till Montenegro med direkt tillgång till byggherrar." },
      { num: "05", title: "Juridisk vägledning", text: "Fast nätverk av lokala jurister för kontraktsgranskning, fastighetsregisterkontroller och notariell överlåtelse." },
      { num: "06", title: "Skatteanpassning", text: "Samordning med en nederländsk skatterådgivare om konsekvenserna för box 3 och ägarstrukturering." },
      { num: "07", title: "Transaktionsvägledning", text: "Från reservation till nyckelöverlämning, vi spårar varje steg och deadline för din räkning." },
      { num: "08", title: "Hyresförvaltning", text: "Valfri hänvisning till eller uppstart av lokal förvaltning för den som vill hyra ut sin fastighet." },
    ],
    aboutKicker: "OM OSS",
    aboutTitle: "Två roller, ett företag",
    aboutQuote: "Vi arbetar för både köparen och byggherren, transparent, personligt och alltid med en fast kontaktperson.",
    aboutQuoteAttr: ", Obrov Real Estate",
    aboutP1: "Obrov Real Estate fyller två komplementära roller. För nederländska investerare är vi guiden: vi hittar lämpliga fastigheter eller projekt, organiserar visningsresor, hanterar den juridiska och skattemässiga processen och övervakar varje detalj fram till nyckelöverlämningen. Vår ersättning är en transparent vägledningsavgift eller en procentandel av köpeskillingen.",
    aboutP2: "För montenegrinska och balkanska projektbyggherrar är vi den exklusiva representanten i Nederländerna. Vi presenterar deras projekt för vårt investerarnätverk och får en provision per såld enhet. Båda parter vet i förväg exakt hur vi tjänar, inga dolda kostnader, inga intressekonflikter.",
    contactTitle: "Börja med ett förutsättningslöst samtal",
    contactText: "Berätta om din situation och ditt mål. Vi hör av oss personligen inom två arbetsdagar.",
    formName: "Ditt namn",
    formEmail: "E-postadress",
    formMessage: "Vad är ditt investeringsmål eller din fråga?",
    formSubmit: "Skicka förfrågan",
    formSending: "Skickar...",
    formErrorText: "Något gick fel. Försök igen eller mejla oss direkt på info@obrovrealestate.nl.",
    sentTitle: "Meddelande skickat",
    sentText: "Tack för ditt intresse. Vi hör av oss inom kort.",
    devKicker: "FÖR PROJEKTUTVECKLARE",
    devTitle: "Nå europeiska investerare och balkandriasporan",
    devIntro: "Obrov Real Estate kopplar ditt nybyggnadsprojekt direkt till en växande grupp nederländska investerare som aktivt söker fastigheter vid Montenegros kust.",
    devBenefits: ["Direkt tillgång till motiverade köpare","Fullständig vägledning från introduktion till överlåtelse","Representation på visningsresor och informationskvällar","Transparent samarbete baserat på tydliga avtal"],
    devFormTitle: "Presentera ditt projekt",
    devName: "Ditt namn", devCompany: "Företagsnamn", devLocation: "Projektplats", devDescription: "Kort beskrivning av projektet", devEmail: "E-postadress",
    devSubmit: "Skicka projektförslag", devSending: "Skickar...",
    devSent: "Förslag mottaget! Vi hör av oss inom två arbetsdagar.",
    devError: "Något gick fel. Försök igen eller skriv till info@obrovrealestate.nl.",
    devCta: "Se utvecklarsidan",
    platformKicker: "HUR DET FUNGERAR",
    platformTitle: "En plattform, tre målgrupper",
    platformIntro: "Obrov Real Estate gör balkanfastigheter transparenta för köpare, säljare och byggherrar från hela Europa och diasporan.",
    platformKoperTitle: "För köparen",
    platformKoperPunten: [
      "Exakt GPS-plats för varje fastighet",
      "Fullständig information: m², rum, dokument, försörjning",
      "Direkt kontakt med säljande part",
      "Kart- och listvy för enkel jämförelse",
      "Annonser på 10 europeiska språk",
    ],
    platformVerkoperTitle: "För säljaren",
    platformVerkoperPunten: [
      "Nå köpare från hela Europa och diasporan",
      "Gratis annonsering under testfasen",
      "Senare: €150/månad, väsentligt högre chans till försäljning",
      "Ladda upp egna foton, professionell session tillgänglig",
      "Kontaktuppgifter synliga på varje annons",
    ],
    platformOntwikkelaarTitle: "För byggherrar",
    platformOntwikkelaarPunten: [
      "Nå den globala marknaden och balkandiasporan",
      "Exklusiv representation i Nederländerna, Tyskland, Luxemburg och Sverige",
      "Presentation till ett aktivt europeiskt investeringsnätverk",
      "Provision per såld enhet, inga fasta kostnader",
      "Tydliga avtal, inga dolda avgifter",
    ],
    searchKicker: "SÖK FASTIGHETER",
    searchTitle: "Hitta din fastighet i Montenegro & Balkan",
    searchPlaceholder: "Stad eller region (t.ex. Kotor, Budva, Bar...)",
    searchStraal: "Radie (km)",
    searchBtn: "Sök",
    aanbodKicker: "AKTUELLT UTBUD",
    aanbodLink: "Se hela utbudet",
    footerTag: "Obrov Real Estate, Montenegro Investments",
    footerRights: "© 2026 Obrov Real Estate. Alla rättigheter förbehållna.",
  },

  // ---- FRANS ----
  fr: {
    langLabel: "FR",
    nav: { aanpak: "Approche", diensten: "Services", overOns: "À propos", developers: "Promoteurs", contact: "Contact" },
    navCta: "Prendre rendez-vous",
    navLogin: "Se connecter",
    navMijnAccount: "Mon compte",
    navFaq: "FAQ",
    navAanbod: "Voir l'offre",
    heroBadge: "PLATEFORME IMMOBILIÈRE EUROPÉENNE POUR LES BALKANS",
    heroTitle1: "Immobilier des Balkans,",
    heroTitle2: "totalement transparent.",
    heroText:
      "Nous accompagnons les investisseurs néerlandais de la première rencontre jusqu'au transfert notarié, avec des contacts locaux, une sécurité juridique et des conseils fiscaux sur mesure. Pas d'intermédiaires, un seul interlocuteur.",
    heroCta1: "Voir les offres",
    heroCta2: "Déposer une annonce",
    stat1v: "100%", stat1l: "Marché en euros, pas de risque de change",
    stat2v: "4", stat2l: "Pays des Balkans avec des contacts actifs",
    stat3v: "1", stat3l: "Interlocuteur fixe tout au long du processus",
    whyTitle: "POURQUOI LE MONTÉNÉGRO",
    whyItems: [
      "Candidat à l'UE, sécurité juridique croissante",
      "Côte Adriatique, prix d'entrée inférieurs à l'Europe occidentale",
      "L'euro comme monnaie de facto, pas de risque de change",
      "Tourisme en plein essor & marinas comme Porto Montenegro",
    ],
    routeKicker: "LE PARCOURS",
    routeTitle: "De La Haye à Budva, en une ligne",
    routeLeft: "Pays-Bas",
    routeRight: "Monténégro",
    destinationsKicker: "NOS RÉGIONS",
    destinationsTitle: "Monténégro & les Balkans",
    destinationsIntro: "Le Monténégro est notre marché principal. Nos contacts s'étendent également à la Croatie, la Bosnie-Herzégovine et la Slovénie.",
    destinationLands: [
      { land: "Monténégro", flag: "🇲🇪", why: "Candidat à l'UE, côte adriatique, prix d'entrée bas, euro comme monnaie.", spots: [
        { name: "Kotor", desc: "Baie historique, patrimoine mondial UNESCO, entourée de montagnes" },
        { name: "Budva", desc: "Ville côtière animée avec vieille ville fortifiée et plages" },
        { name: "Tivat", desc: "Siège de la marina Porto Montenegro et de l'aéroport international" },
        { name: "Bar", desc: "Plus grand port de plaisance du Monténégro, ville en plein essor" },
        { name: "Ulcinj", desc: "Ville côtière la plus au sud, longues plages de sable vers l'Albanie" },
      ]},
      { land: "Croatie", flag: "🇭🇷", why: "Membre de l'UE, côte dalmate, fort marché touristique, bonne infrastructure.", spots: [
        { name: "Split", desc: "Ville portuaire historique, vols directs, fort marché locatif" },
        { name: "Dubrovnik", desc: "Destination premium, rendements locatifs élevés, protégée par l'UNESCO" },
        { name: "Makarska", desc: "Riviera populaire, marché du neuf en croissance" },
        { name: "Zadar", desc: "Ville accessible, marina moderne, prix d'entrée plus bas que Split" },
      ]},
      { land: "Bosnie-Herzégovine", flag: "🇧🇦", why: "Prix d'entrée les plus bas de la région, secteur touristique en croissance, candidat à l'UE.", spots: [
        { name: "Mostar", desc: "Ville emblématique, tourisme en forte croissance, prix immobiliers abordables" },
        { name: "Sarajevo", desc: "Capitale, marché immobilier diversifié, perspective d'adhésion à l'UE" },
        { name: "Neum", desc: "Seule ville côtière de Bosnie, tourisme adriatique en croissance" },
      ]},
      { land: "Slovénie", flag: "🇸🇮", why: "Membre de l'UE, euro comme monnaie, État de droit stable, populaire auprès des investisseurs.", spots: [
        { name: "Ljubljana", desc: "Capitale, marché immobilier stable, bons rendements locatifs" },
        { name: "Portorož", desc: "Côte adriatique, marché de villégiature de luxe" },
        { name: "Bled", desc: "Lac emblématique, destination de premier plan, offre limitée = plus-value" },
      ]},
    ],
    stops: [
      { city: "La Haye", sub: "Introduction & dossier", side: "nl" },
      { city: "Rotterdam", sub: "Processus juridique & fiscal", side: "nl" },
      { city: "Tivat", sub: "Visite & sélection du projet", side: "mne" },
      { city: "Kotor", sub: "Compromis de vente & notaire", side: "mne" },
      { city: "Budva", sub: "Transfert & remise des clés", side: "mne" },
    ],
    servicesKicker: "SERVICES",
    servicesTitle: "Un parcours, entièrement accompagné",
    services: [
      { num: "01", title: "Sélection de projets", text: "Projets neufs et anciens sélectionnés selon votre profil, budget et objectif." },
      { num: "02", title: "Achat sur plan", text: "Accompagnement lors de l'achat d'immobilier neuf avant ou pendant la construction, souvent à un prix d'entrée plus avantageux." },
      { num: "03", title: "Invest & flip", text: "Processus stratégique d'achat-revente axé sur la plus-value, avec ou sans rénovation." },
      { num: "04", title: "Voyage de visite", text: "Voyage de visite organisé et guidé au Monténégro, avec accès direct aux promoteurs et aux sites." },
      { num: "05", title: "Accompagnement juridique", text: "Réseau fixe d'avocats locaux pour la vérification des contrats, du cadastre et du transfert notarié." },
      { num: "06", title: "Alignement fiscal", text: "Coordination avec un conseiller fiscal néerlandais sur les implications pour box 3 et la structuration de la propriété." },
      { num: "07", title: "Accompagnement de la transaction", text: "De la réservation à la remise des clés, nous suivons chaque étape et chaque délai en votre nom." },
      { num: "08", title: "Gestion locative", text: "Mise en relation optionnelle avec une gestion locative locale pour ceux qui souhaitent louer leur bien." },
    ],
    aboutKicker: "À PROPOS",
    aboutTitle: "Deux rôles, une agence",
    aboutQuote: "Nous travaillons à la fois pour l'acheteur et le promoteur, de manière transparente, personnelle et toujours avec un seul interlocuteur fixe.",
    aboutQuoteAttr: ", Obrov Real Estate",
    aboutP1: "Obrov Real Estate remplit deux rôles complémentaires. Pour les investisseurs néerlandais, nous sommes le guide : nous trouvons des biens ou des projets adaptés, organisons des voyages de visite, gérons le processus juridique et fiscal, et supervisons chaque détail jusqu'à la remise des clés. Notre rémunération est des honoraires d'accompagnement transparents ou un pourcentage du prix d'achat.",
    aboutP2: "Pour les promoteurs immobiliers du Monténégro et des Balkans, nous sommes le représentant exclusif aux Pays-Bas. Nous présentons leurs projets à notre réseau d'investisseurs et percevons une commission par unité vendue. Les deux parties savent à l'avance exactement comment nous gagnons, pas de frais cachés, pas de conflits d'intérêts.",
    contactTitle: "Commencez par une conversation sans engagement",
    contactText: "Parlez-nous de votre situation et de votre objectif. Nous vous contacterons personnellement dans les deux jours ouvrables.",
    formName: "Votre nom",
    formEmail: "Adresse e-mail",
    formMessage: "Quel est votre objectif d'investissement ou votre question ?",
    formSubmit: "Envoyer la demande",
    formSending: "Envoi en cours...",
    formErrorText: "Une erreur s'est produite. Veuillez réessayer ou nous écrire directement à info@obrovrealestate.nl.",
    sentTitle: "Message envoyé",
    sentText: "Merci pour votre intérêt. Nous vous contacterons prochainement.",
    devKicker: "POUR LES PROMOTEURS",
    devTitle: "Atteignez les investisseurs européens et la diaspora balkanique",
    devIntro: "Obrov Real Estate connecte votre projet directement aux investisseurs européens et à la diaspora balkanique dans le monde entier. Nous présentons vos biens à un réseau international actif d'acheteurs de toute l'Europe.",
    devBenefits: ["Accès direct à des acheteurs motivés","Accompagnement complet de l'introduction au transfert","Représentation lors des voyages de visite et soirées d'information","Coopération transparente basée sur des accords clairs"],
    devFormTitle: "Présentez votre projet",
    devName: "Votre nom", devCompany: "Nom de l'entreprise", devLocation: "Emplacement du projet", devDescription: "Brève description du projet", devEmail: "Adresse e-mail",
    devSubmit: "Envoyer la proposition de projet", devSending: "Envoi...",
    devSent: "Proposition reçue ! Nous vous contacterons dans les deux jours ouvrables.",
    devError: "Une erreur s'est produite. Réessayez ou écrivez à info@obrovrealestate.nl.",
    devCta: "Voir la page promoteurs",
    platformKicker: "COMMENT ÇA MARCHE",
    platformTitle: "Une plateforme, trois publics",
    platformIntro: "Obrov Real Estate rend l'immobilier balkanique transparent pour les acheteurs, vendeurs et promoteurs de toute l'Europe et de la diaspora.",
    platformKoperTitle: "Pour l'acheteur",
    platformKoperPunten: [
      "Emplacement GPS exact de chaque bien",
      "Informations complètes : m², pièces, documents, réseaux",
      "Contact direct avec la partie vendeuse",
      "Vue carte et liste pour une comparaison facile",
      "Annonces en 10 langues européennes",
    ],
    platformVerkoperTitle: "Pour le vendeur",
    platformVerkoperPunten: [
      "Atteignez des acheteurs de toute l'Europe et de la diaspora",
      "Annonce gratuite pendant la phase de test",
      "Ensuite : €150/mois, chance de vente significativement plus élevée",
      "Téléchargez vos propres photos, session professionnelle disponible",
      "Coordonnées visibles sur chaque annonce",
    ],
    platformOntwikkelaarTitle: "Pour les promoteurs",
    platformOntwikkelaarPunten: [
      "Atteignez le marché mondial et la diaspora balkanique",
      "Représentation exclusive aux Pays-Bas, en Allemagne, au Luxembourg et en Suède",
      "Présentation à un réseau d'investisseurs européens actif",
      "Commission par unité vendue, pas de frais fixes",
      "Contrats clairs, pas de frais cachés",
    ],
    searchKicker: "RECHERCHER UN BIEN",
    searchTitle: "Trouvez votre bien au Monténégro & dans les Balkans",
    searchPlaceholder: "Ville ou région (ex. Kotor, Budva, Bar...)",
    searchStraal: "Rayon (km)",
    searchBtn: "Rechercher",
    aanbodKicker: "OFFRE ACTUELLE",
    aanbodLink: "Voir toutes les offres",
    footerTag: "Obrov Real Estate, Investissements au Monténégro",
    footerRights: "© 2026 Obrov Real Estate. Tous droits réservés.",
  },

  // ---- LUXEMBURGS ----
  lb: {
    langLabel: "LB",
    nav: { aanpak: "Approche", diensten: "Servicer", overOns: "Iwwer eis", developers: "Promoteure", contact: "Kontakt" },
    navCta: "Rendez-vous maachen",
    navLogin: "Aloggen",
    navMijnAccount: "Mäi Kont",
    navFaq: "FAQ",
    navAanbod: "Offre kucken",
    heroBadge: "EUROPÄESCH IMMOBILIEN-PLATTFORM FIR DEN BALKAN",
    heroTitle1: "Balkan-Immobilien,",
    heroTitle2: "vollständeg transparent.",
    heroText:
      "Mir begleeden néierländesch Investisseuren vun der éischter Bekanntschaft bis zur notarielle Iwwerdroung, mat lokale Kontakter, juristesche Sécherheet a personaliséierte Steierberodung. Keen Zwëschenhändler, ee feste Kontakt.",
    heroCta1: "Offerten gesinn",
    heroCta2: "Immobilie aschalten",
    stat1v: "100%", stat1l: "Euromaart, kee Währungsrisiko",
    stat2v: "4", stat2l: "Balkanlänner mat aktive Kontakter",
    stat3v: "1", stat3l: "Ee feste Kontakt duerch de ganzen Prozess",
    whyTitle: "FIRWAT MONTENEGRO",
    whyItems: [
      "EU-Kandidat, juristesch Sécherheet wuesse mat",
      "Adriatesch Küst, méi niddreg Areesspräisser wéi Westeuropa",
      "Euro als de-facto Währung, kee Währungsrisiko",
      "Wuessenden Tourismus & Marinaen wéi Porto Montenegro",
    ],
    routeKicker: "DE WEE",
    routeTitle: "Vun Den Haag bis Budva, an enger Linn",
    routeLeft: "Néierland",
    routeRight: "Montenegro",
    destinationsKicker: "EIS REGIOUNEN",
    destinationsTitle: "Montenegro & de Balkan",
    destinationsIntro: "Montenegro ass eise Kärmaart. Eis Kontakter erstrecken sech och op Kroatien, Bosnien-Herzegowina a Slowenien.",
    destinationLands: [
      { land: "Montenegro", flag: "🇲🇪", why: "EU-Kandidat, adriatesch Küst, niddreg Areesspräisser, Euro als Währung.", spots: [
        { name: "Kotor", desc: "Historesche Bai, UNESCO-Welterbe, vu Bierger ëmginn" },
        { name: "Budva", desc: "Liewege Küstestad mat aler Stad a Stranden" },
        { name: "Tivat", desc: "Heem vun der Porto Montenegro Marina an dem internationale Fluchhafen" },
        { name: "Bar", desc: "Gréisste Jachthafen vu Montenegro, wuessend Stad um Mier" },
        { name: "Ulcinj", desc: "Südlechste Küstestad, laang Sandstranden a Richtung Albanien" },
      ]},
      { land: "Kroatien", flag: "🇭🇷", why: "EU-Memberland, dalmatinesch Küst, staarke Tourismusmaart.", spots: [
        { name: "Split", desc: "Historesch Hafenstad, Direktflucken, staarke Miétsmaart" },
        { name: "Dubrovnik", desc: "Premium-Destinatioun, héich Mietrenditen, UNESCO-geschützt" },
        { name: "Makarska", desc: "Populär Riviera, wuessende Neibaustoffmaart" },
        { name: "Zadar", desc: "Zougänglech, modern Marina, méi niddreg Areesspräis" },
      ]},
      { land: "Bosnien-Herzegowina", flag: "🇧🇦", why: "Déi niddregst Areesspräisser an der Regioun, EU-Kandidat.", spots: [
        { name: "Mostar", desc: "Ikonesch Stad, schnell wuessende Tourismus, erschwinglech Immobilien" },
        { name: "Sarajevo", desc: "Haaptstad, diversifizéierte Immobilienmaart" },
        { name: "Neum", desc: "Déi eenzeg Küstestad vu Bosnien" },
      ]},
      { land: "Slowenien", flag: "🇸🇮", why: "EU-Memberland, Euro als Währung, stabile Rechtsstaat.", spots: [
        { name: "Ljubljana", desc: "Haaptstad, stabille Immobilienmaart, staark Mietrenditen" },
        { name: "Portorož", desc: "Adriatesch Küst, Luxus-Ferienmaart" },
        { name: "Bled", desc: "Ikonesche Séi, Top-Destinatioun, knapp Offert = Wäertsteigerung" },
      ]},
    ],
    stops: [
      { city: "Den Haag", sub: "Presentatioun & Dossier", side: "nl" },
      { city: "Rotterdam", sub: "Juristesche & Steierprocessus", side: "nl" },
      { city: "Tivat", sub: "Besichtegung & Projettwiel", side: "mne" },
      { city: "Kotor", sub: "Kaafkontrakt & Notar", side: "mne" },
      { city: "Budva", sub: "Iwwerdroung & Schlësselübergab", side: "mne" },
    ],
    servicesKicker: "SERVICER",
    servicesTitle: "Ee Wee, komplett begleed",
    services: [
      { num: "01", title: "Projettwiel", text: "Kuratéiert Neibau- a Bestandsprojet deen zu ärem Profil, Budget a Zil passt." },
      { num: "02", title: "Off-plan Kaf", text: "Begleedung beim Kaf vu Neubauten virun oder wärend der Bouphas." },
      { num: "03", title: "Invest & flip", text: "Strategesche Kaf- a Verkaafsprozess mat Fokus op Wäertsteigerung." },
      { num: "04", title: "Besichtegreesees", text: "Perséinlech organiséiert a begleede Besichtegreesees op Montenegro." },
      { num: "05", title: "Juridesch Begleedung", text: "Festes Netzwierk vun lokale Juristen fir Kontrakter a notarielle Iwwerdroung." },
      { num: "06", title: "Steierharmonisatioun", text: "Koordinatioun mat engem néierländesche Steierberoder iwwer box 3 an d'Eegentumsstrukturierung." },
      { num: "07", title: "Transaktiounsbegleedung", text: "Vun der Reservatioun bis zur Schlësselübergab, mir suivéieren all Schrëtt." },
      { num: "08", title: "Miétverwaltung", text: "Optionell Referenz un eng lokal Verwaltung fir déi, déi wëllen verlounen." },
    ],
    aboutKicker: "IWWER EIS",
    aboutTitle: "Zwou Rollen, eng Agence",
    aboutQuote: "Mir schaffen souwuel fir de Käfer wéi fir den Investisseur, transparent, perséinlech a ëmmer mat enger fester Kontaktpersoun.",
    aboutQuoteAttr: ", Obrov Real Estate",
    aboutP1: "Obrov Real Estate erfëllt zwou komplementär Rollen. Fir néierländesch Investisseuren si mir de Guide: mir fannen passend Immobilien oder Projete, organiséieren Besichtereeser, begleeden de rechtlechen a steierleche Prozess an iwwerwaachen all Detail bis zur Schlësselübergab. Eis Honorar ass eng transparent Begleedungsgebühr oder e Prozentsatz vum Kaafschweis.",
    aboutP2: "Fir montenegreinesch a balkanesch Projektinvestisseuren si mir den exklusive Vertrieder an den Néierlänn. Mir presentéieren hir Projete eisem Investisseurnetzwierk a kréien dofir eng Provisioun pro verkaafte Eenheet. Béid Parteien wëssen am Viraus genau wéi mir verdéngen, keng verstoppte Käschten, keng Interessekonflikter.",
    contactTitle: "Fänkt mat engem onerglëchend Gespréich un",
    contactText: "Erzielt eis vun ärer Situatioun an ärem Zil. Mir mellen eis perséinlech bannent zwee Aarbechtsdeeg.",
    formName: "Äre Numm",
    formEmail: "E-Mail-Adress",
    formMessage: "Wat ass äert Investitiounszil oder är Fro?",
    formSubmit: "Ufro schécken",
    formSending: "Schéckt...",
    formErrorText: "Eppes ass falsch gaangen. Probéiert nach emol oder schreift eis op info@obrovrealestate.nl.",
    sentTitle: "Message geschéckt",
    sentText: "Merci fir äert Interesse. Mir mellen eis kuerz.",
    devKicker: "FIR PROMOTEUREN",
    devTitle: "Erreechen europäesch Investisseuren an d'Balkan-Diaspora",
    devIntro: "Obrov Real Estate verbënnt äre Neibauprojet direkt mat enger wuessender Grupp néierländesche Investisseuren.",
    devBenefits: ["Direkten Accès zu motivéierte Kefer","Komplett Begleedung vun der Presentatioun bis zur Iwwerdroung","Representatioun bei Besichtereeser an Informatiounsowenter","Transparent Zesummenaarbecht op Basis vu klore Ofkommen"],
    devFormTitle: "Presentéiert äre Projet",
    devName: "Äre Numm", devCompany: "Firmennumm", devLocation: "Projektstanduert", devDescription: "Kuerz Beschreiwung vum Projet", devEmail: "E-Mail-Adress",
    devSubmit: "Projetsufroo schécken", devSending: "Schéckt...",
    devSent: "Propositioun kritt! Mir mellen eis bannent zwee Aarbechtsdeeg.",
    devError: "Eppes ass falsch gaangen. Probéiert nach emol oder schreift un info@obrovrealestate.nl.",
    devCta: "Promoteurs-Säit gesinn",
    platformKicker: "WÉI ET FUNKTIONÉIERT",
    platformTitle: "Eng Plattform, dräi Zilgruppen",
    platformIntro: "Obrov Real Estate mécht Balkan-Immobilien transparent fir Kefer, Verkefer an Investisseuren aus ganz Europa an der Diaspora.",
    platformKoperTitle: "Fir de Kefer",
    platformKoperPunten: [
      "Exakt GPS-Lage vun all Immobilie",
      "Vollständeg Informatiounen: m², Zëmmer, Dokumenter, Versuergang",
      "Direkten Kontakt mat der Verkafssäit",
      "Kaart- an Listansicht fir einfachen Verglach",
      "Annoncen an 10 europäesche Sproochen",
    ],
    platformVerkoperTitle: "Fir de Verkefer",
    platformVerkoperPunten: [
      "Kefer aus ganz Europa an der Diaspora erreechen",
      "Gratis annoncéieren an der Testphas",
      "Spéider: €150/Mount, däitlech méi héich Verkafschance",
      "Eegen Fotoen eroplueden, professionell Sessioun disponibel",
      "Kontaktdaten op all Annonce siichtbar",
    ],
    platformOntwikkelaarTitle: "Fir Investisseuren",
    platformOntwikkelaarPunten: [
      "De Weltmaart an d'Balkan-Diaspora erreechen",
      "Exklusiv Vertrieder an den Néierlänn, Däitschland, Lëtzebuerg a Schweden",
      "Presentatioun un en aktiven europäesche Investitiounsnetzwierk",
      "Provisioun pro verkaafte Eenheet, keng Fixkäschten",
      "Klor Kontrakter, keng verstoppte Käschten",
    ],
    searchKicker: "IMMOBILIEN SICHEN",
    searchTitle: "Fannt Är Immobilie a Montenegro & um Balkan",
    searchPlaceholder: "Stad oder Regioun (z.B. Kotor, Budva, Bar...)",
    searchStraal: "Radius (km)",
    searchBtn: "Sichen",
    aanbodKicker: "AKTUELL OFFERT",
    aanbodLink: "All Offerten gesinn",
    footerTag: "Obrov Real Estate, Montenegro Investitiounen",
    footerRights: "© 2026 Obrov Real Estate. All Rechter virbehalten.",
  },

  // ---- BOSNISCH ----
  bs: {
    langLabel: "BS",
    nav: { aanpak: "Pristup", diensten: "Usluge", overOns: "O nama", developers: "Investitori", contact: "Kontakt" },
    navCta: "Zakažite razgovor",
    navLogin: "Prijava",
    navMijnAccount: "Moj nalog",
    navFaq: "FAQ",
    navAanbod: "Pogledajte ponudu",
    heroBadge: "EVROPSKA PLATFORMA ZA NEKRETNINE NA BALKANU",
    heroTitle1: "Ulaganje u Crnu Goru,",
    heroTitle2: "bez rizika.",
    heroText: "Prva evropska platforma koja čini nekretnine na Balkanu potpuno transparentnim, sa tačnim lokacijama, potpunim informacijama i direktnim pristupom za kupce i prodavce iz cijele Evrope i dijaspore.",
    heroCta1: "Pogledajte ponudu",
    heroCta2: "Oglasiti nekretninu",
    stat1v: "100%", stat1l: "Euro tržište, nema valutnog rizika",
    stat2v: "4", stat2l: "Balkanske zemlje sa aktivnim kontaktima",
    stat3v: "1", stat3l: "Jedna kontakt osoba tokom cijelog procesa",
    whyTitle: "ZAŠTO BALKAN",
    whyItems: [
      "Kandidat za EU, pravna sigurnost raste",
      "Jadranska obala, niže ulazne cijene nego u zapadnoj Evropi",
      "Euro kao zvanična valuta, nema valutnog rizika",
      "Rast turizma i marina kao što je Porto Montenegro",
    ],
    routeKicker: "PUTOVANJE",
    routeTitle: "Od Haga do Budve, u jednoj liniji",
    routeLeft: "Holandija",
    routeRight: "Crna Gora",
    destinationsKicker: "NAŠE REGIJE",
    destinationsTitle: "Crna Gora i Balkan",
    destinationsIntro: "Crna Gora je naše osnovno tržište. Naši kontakti protežu se i na Hrvatsku, Bosnu i Hercegovinu i Sloveniju.",
    destinationLands: [
      { land: "Crna Gora", flag: "🇲🇪", why: "Kandidat za EU, jadranska obala, niske ulazne cijene, euro kao valuta.", spots: [
        { name: "Kotor", desc: "Historijski zaljev, UNESCO svjetska baština, okružen planinama" },
        { name: "Budva", desc: "Živahni priobalni grad sa starim gradom i plažama" },
        { name: "Tivat", desc: "Dom marine Porto Montenegro i međunarodnog aerodroma" },
        { name: "Bar", desc: "Najveća marina u Crnoj Gori, grad u razvoju na moru" },
        { name: "Ulcinj", desc: "Najjužniji priobalni grad, duge pješčane plaže prema Albaniji" },
      ]},
      { land: "Hrvatska", flag: "🇭🇷", why: "Članica EU, dalmatinska obala, snažno turističko tržište.", spots: [
        { name: "Split", desc: "Historijska luka, direktni letovi, snažno tržište najma" },
        { name: "Dubrovnik", desc: "Premium destinacija, visoki prihodi od najma, UNESCO zaštita" },
        { name: "Makarska", desc: "Popularna rivijera, rastuće tržište novogradnje" },
        { name: "Zadar", desc: "Pristupačan grad, moderna marina, niža ulazna cijena" },
      ]},
      { land: "Bosna i Hercegovina", flag: "🇧🇦", why: "Najniže ulazne cijene u regiji, rastući turistički sektor, kandidat za EU.", spots: [
        { name: "Mostar", desc: "Ikonski grad, brzo rastući turizam, pristupačne cijene nekretnina" },
        { name: "Sarajevo", desc: "Glavni grad, raznovrsno tržište nekretnina" },
        { name: "Neum", desc: "Jedini priobalni grad BiH, rastući jadranski turizam" },
      ]},
      { land: "Slovenija", flag: "🇸🇮", why: "Članica EU, euro kao valuta, stabilna pravna država.", spots: [
        { name: "Ljubljana", desc: "Glavni grad, stabilno tržište nekretnina" },
        { name: "Portorož", desc: "Jadranska obala, luksuzno odmaralište" },
        { name: "Bled", desc: "Ikonsko jezero, top destinacija, ograničena ponuda = rast vrijednosti" },
      ]},
    ],
    stops: [
      { city: "Hag", sub: "Upoznavanje i dokumentacija", side: "nl" },
      { city: "Rotterdam", sub: "Pravni i porezni proces", side: "nl" },
      { city: "Tivat", sub: "Razgledanje i odabir projekta", side: "mne" },
      { city: "Kotor", sub: "Kupoprodajni ugovor i notar", side: "mne" },
      { city: "Budva", sub: "Prijenos i predaja ključeva", side: "mne" },
    ],
    servicesKicker: "USLUGE",
    servicesTitle: "Jedan put, potpuna podrška",
    services: [
      { num: "01", title: "Odabir projekta", text: "Pažljiv odabir novogradnje i postojećih projekata prema vašem profilu, budžetu i cilju." },
      { num: "02", title: "Kupovina off-plan", text: "Podrška pri kupovini novogradnje prije ili tokom izgradnje, često po povoljnijoj ulaznoj cijeni." },
      { num: "03", title: "Invest & flip", text: "Strateški proces kupovine i prodaje usmjeren na rast vrijednosti, sa ili bez renoviranja." },
      { num: "04", title: "Putovanje razgledanja", text: "Lično organizovano i vođeno putovanje u Crnu Goru sa direktnim pristupom investitorima." },
      { num: "05", title: "Pravna podrška", text: "Stalna mreža lokalnih advokata za provjeru ugovora, katastra i notarskog prijenosa." },
      { num: "06", title: "Porezna usklađenost", text: "Koordinacija sa holandskim poreznim savjetnikom o posledicama za box 3." },
      { num: "07", title: "Podrška u transakciji", text: "Od rezervacije do predaje ključeva, pratimo svaki korak u vaše ime." },
      { num: "08", title: "Upravljanje najmom", text: "Opciono upućivanje na lokalnu upravu za one koji žele iznajmiti nekretninu." },
    ],
    aboutKicker: "O NAMA",
    aboutTitle: "Dvije uloge, jedna agencija",
    aboutQuote: "Radimo i za kupca i za investitora, transparentno, lično i uvijek sa jednom kontakt osobom.",
    aboutQuoteAttr: ", Obrov Real Estate",
    aboutP1: "Obrov Real Estate ispunjava dvije komplementarne uloge. Za holandske investitore smo vodič: pronalazimo odgovarajuće nekretnine ili projekte, organizujemo putovanja razgledanja, vodimo pravni i porezni proces i pratimo svaki detalj do predaje ključeva. Naša naknada je transparentna naknada za vođenje ili procenat od kupoprodajne cijene.",
    aboutP2: "Za crnogorske i balkanske projektne investitore smo ekskluzivni zastupnik u Holandiji. Predstavljamo njihove projekte našoj mreži investitora i primamo proviziju po prodanoj jedinici. Obje strane unaprijed znaju tačno kako zarađujemo, bez skrivenih troškova, bez sukoba interesa.",
    contactTitle: "Započnite razgovorom bez obaveza",
    contactText: "Recite nam vašu situaciju i cilj. Lično ćemo vas kontaktirati u roku od dva radna dana.",
    formName: "Vaše ime",
    formEmail: "Email adresa",
    formMessage: "Koji je vaš investicioni cilj ili pitanje?",
    formSubmit: "Pošaljite upit",
    formSending: "Slanje...",
    formErrorText: "Došlo je do greške. Pokušajte ponovo ili nam pišite na info@obrovrealestate.nl.",
    sentTitle: "Poruka poslana",
    sentText: "Hvala na interesovanju. Uskoro ćemo vas kontaktirati.",
    devKicker: "ZA PROJEKTNE INVESTITORE",
    devTitle: "Dosegnite evropske investitore i balkansku dijasporu",
    devIntro: "Obrov Real Estate direktno povezuje vaš projekat novogradnje sa rastućom grupom holandskih investitora koji traže nekretnine na jadranskoj obali.",
    devBenefits: ["Direktan pristup motivisanim kupcima","Potpuna podrška od upoznavanja do prijenosa","Zastupanje na putovanjima razgledanja","Transparentna saradnja na osnovu jasnih sporazuma"],
    devFormTitle: "Predstavite vaš projekat",
    devName: "Vaše ime", devCompany: "Naziv kompanije", devLocation: "Lokacija projekta", devDescription: "Kratak opis projekta", devEmail: "Email adresa",
    devSubmit: "Pošaljite prijedlog projekta", devSending: "Slanje...",
    devSent: "Prijedlog primljen! Kontaktiraćemo vas u roku od dva radna dana.",
    devError: "Greška. Pokušajte ponovo ili pišite na info@obrovrealestate.nl.",
    devCta: "Stranica za investitore",
    platformKicker: "KAKO FUNKCIONIŠE",
    platformTitle: "Jedna platforma, tri ciljne grupe",
    platformIntro: "Obrov Real Estate čini nekretnine na Balkanu transparentnim za kupce, prodavce i investitore iz cijele Evrope i dijaspore.",
    platformKoperTitle: "Za kupca",
    platformKoperPunten: ["Tačna GPS lokacija svake nekretnine","Potpune informacije: m², sobe, dokumenti, komunalije","Direktan kontakt sa prodajnom stranom","Prikaz na karti i listi za lako poređenje","Oglasi na 10 evropskih jezika"],
    platformVerkoperTitle: "Za prodavca",
    platformVerkoperPunten: ["Dosegnite kupce iz cijele Evrope i dijaspore","Besplatno oglašavanje u testnoj fazi","Kasnije: €150/mj, veća šansa za prodaju","Postavite vlastite fotografije","Kontakt podaci vidljivi na svakom oglasu"],
    platformOntwikkelaarTitle: "Za investitore",
    platformOntwikkelaarPunten: ["Dosegnite svjetsko tržište i balkansku dijasporu","Ekskluzivno zastupanje u zapadnoj Evropi","Prezentacija evropskoj investicionoj mreži","Provizija po prodanoj jedinici, bez fiksnih troškova","Jasni ugovori, bez skrivenih troškova"],
    searchKicker: "PRETRAŽI NEKRETNINE",
    searchTitle: "Pronađite nekretninu u Crnoj Gori i na Balkanu",
    searchPlaceholder: "Grad ili region (npr. Kotor, Budva, Bar...)",
    searchStraal: "Radijus (km)",
    searchBtn: "Pretraži",
    aanbodKicker: "TRENUTNA PONUDA",
    aanbodLink: "Pogledajte svu ponudu",
    footerTag: "Obrov Real Estate, Investicije u Crnoj Gori",
    footerRights: "© 2026 Obrov Real Estate. Sva prava zadržana.",
  },

  // ---- KROATISCH ----
  hr: {
    langLabel: "HR",
    nav: { aanpak: "Pristup", diensten: "Usluge", overOns: "O nama", developers: "Investitori", contact: "Kontakt" },
    navCta: "Zakažite razgovor",
    navAanbod: "Pogledajte ponudu",
    heroBadge: "EUROPSKA PLATFORMA ZA NEKRETNINE NA BALKANU",
    heroTitle1: "Ulaganje u Crnu Goru,",
    heroTitle2: "bez rizika.",
    heroText: "Prva europska platforma koja čini nekretnine na Balkanu potpuno transparentnima, s točnim lokacijama, potpunim informacijama i izravnim pristupom za kupce i prodavače iz cijele Europe i dijaspore.",
    heroCta1: "Pogledajte ponudu",
    heroCta2: "Oglasiti nekretninu",
    stat1v: "100%", stat1l: "Euro tržište, nema valutnog rizika",
    stat2v: "4", stat2l: "Balkanske zemlje s aktivnim kontaktima",
    stat3v: "1", stat3l: "Jedna kontakt osoba kroz cijeli proces",
    whyTitle: "ZAŠTO BALKAN",
    whyItems: [
      "Kandidat za EU, pravna sigurnost raste",
      "Jadranska obala, niže ulazne cijene nego u zapadnoj Europi",
      "Euro kao de facto valuta, nema valutnog rizika",
      "Rast turizma i marina poput Porto Montenegra",
    ],
    routeKicker: "PUTOVANJE",
    routeTitle: "Od Haaga do Budve, u jednoj liniji",
    routeLeft: "Nizozemska",
    routeRight: "Crna Gora",
    destinationsKicker: "NAŠE REGIJE",
    destinationsTitle: "Crna Gora i Balkan",
    destinationsIntro: "Crna Gora je naše osnovno tržište. Naši kontakti protežu se i na Hrvatsku, Bosnu i Hercegovinu te Sloveniju.",
    destinationLands: [
      { land: "Crna Gora", flag: "🇲🇪", why: "Kandidat za EU, jadranska obala, niske ulazne cijene, euro kao valuta.", spots: [
        { name: "Kotor", desc: "Povijesni zaljev, UNESCO svjetska baština, okružen planinama" },
        { name: "Budva", desc: "Živahni priobalni grad sa starim gradom i plažama" },
        { name: "Tivat", desc: "Dom marine Porto Montenegro i međunarodne zračne luke" },
        { name: "Bar", desc: "Najveća marina u Crnoj Gori, grad u razvoju na moru" },
        { name: "Ulcinj", desc: "Najjužniji priobalni grad, duge pješčane plaže prema Albaniji" },
      ]},
      { land: "Hrvatska", flag: "🇭🇷", why: "Članica EU, dalmatinska obala, snažno turističko tržište, dobra infrastruktura.", spots: [
        { name: "Split", desc: "Povijesna luka, izravni letovi, snažno tržište najma" },
        { name: "Dubrovnik", desc: "Premium destinacija, visoki prihodi od najma, UNESCO zaštita" },
        { name: "Makarska", desc: "Popularna rivijera, rastuće tržište novogradnje" },
        { name: "Zadar", desc: "Pristupačan grad, moderna marina, niža ulazna cijena od Splita" },
      ]},
      { land: "Bosna i Hercegovina", flag: "🇧🇦", why: "Najniže ulazne cijene u regiji, rastući turistički sektor, kandidat za EU.", spots: [
        { name: "Mostar", desc: "Ikonski grad, brzo rastući turizam, pristupačne cijene nekretnina" },
        { name: "Sarajevo", desc: "Glavni grad, raznovrsno tržište nekretnina" },
        { name: "Neum", desc: "Jedini priobalni grad BiH, rastući jadranski turizam" },
      ]},
      { land: "Slovenija", flag: "🇸🇮", why: "Članica EU, euro kao valuta, stabilna pravna država.", spots: [
        { name: "Ljubljana", desc: "Glavni grad, stabilno tržište nekretnina, snažni prihodi od najma" },
        { name: "Portorož", desc: "Jadranska obala, luksuzno odmaralište" },
        { name: "Bled", desc: "Ikonsko jezero, top destinacija, ograničena ponuda = rast vrijednosti" },
      ]},
    ],
    stops: [
      { city: "Haag", sub: "Upoznavanje i dokumentacija", side: "nl" },
      { city: "Rotterdam", sub: "Pravni i porezni proces", side: "nl" },
      { city: "Tivat", sub: "Razgledanje i odabir projekta", side: "mne" },
      { city: "Kotor", sub: "Kupoprodajni ugovor i javni bilježnik", side: "mne" },
      { city: "Budva", sub: "Prijenos i predaja ključeva", side: "mne" },
    ],
    servicesKicker: "USLUGE",
    servicesTitle: "Jedno putovanje, potpuno vođeno",
    services: [
      { num: "01", title: "Odabir projekta", text: "Pažljivo odabrani projekti novogradnje i postojećih nekretnina prema vašem profilu, proračunu i cilju." },
      { num: "02", title: "Kupnja off-plan", text: "Podrška pri kupnji novogradnje prije ili tijekom izgradnje, često po povoljnijoj ulaznoj cijeni." },
      { num: "03", title: "Invest & flip", text: "Strateški proces kupnje i prodaje usmjeren na rast vrijednosti, sa ili bez obnove." },
      { num: "04", title: "Putovanje razgledavanja", text: "Osobno organizirano i vođeno putovanje u Crnu Goru s izravnim pristupom investitorima." },
      { num: "05", title: "Pravna podrška", text: "Stalna mreža lokalnih odvjetnika za provjeru ugovora, katastra i javnobilježničkog prijenosa." },
      { num: "06", title: "Porezna usklađenost", text: "Koordinacija s nizozemskim poreznim savjetnikom o posljedicama za box 3." },
      { num: "07", title: "Podrška u transakciji", text: "Od rezervacije do predaje ključeva, pratimo svaki korak i rok u vaše ime." },
      { num: "08", title: "Upravljanje najmom", text: "Opcionalno upućivanje na lokalnu upravu za one koji žele iznajmiti nekretninu." },
    ],
    aboutKicker: "O NAMA",
    aboutTitle: "Dvije uloge, jedna agencija",
    aboutQuote: "Radimo i za kupca i za investitora, transparentno, osobno i uvijek s jednom fiksnom kontakt osobom.",
    aboutQuoteAttr: ", Obrov Real Estate",
    aboutP1: "Obrov Real Estate ispunjava dvije komplementarne uloge. Za nizozemske investitore smo vodič: pronalazimo odgovarajuće nekretnine ili projekte, organiziramo putovanja razgledavanja, vodimo pravni i porezni proces i pratimo svaki detalj do predaje ključeva. Naša naknada je transparentna naknada za vođenje ili postotak od kupoprodajne cijene.",
    aboutP2: "Za crnogorske i balkanske projektne investitore smo ekskluzivni zastupnik u Nizozemskoj. Predstavljamo njihove projekte našoj mreži investitora i primamo proviziju po prodanoj jedinici. Obje strane unaprijed znaju točno kako zarađujemo, bez skrivenih troškova, bez sukoba interesa.",
    contactTitle: "Započnite razgovorom bez obveza",
    contactText: "Recite nam vašu situaciju i cilj. Osobno ćemo vas kontaktirati u roku od dva radna dana.",
    formName: "Vaše ime",
    formEmail: "Email adresa",
    formMessage: "Koji je vaš investicijski cilj ili pitanje?",
    formSubmit: "Pošaljite upit",
    formSending: "Slanje...",
    formErrorText: "Došlo je do greške. Pokušajte ponovo ili nam pišite na info@obrovrealestate.nl.",
    sentTitle: "Poruka poslana",
    sentText: "Hvala na interesu. Uskoro ćemo vas kontaktirati.",
    devKicker: "ZA PROJEKTNE INVESTITORE",
    devTitle: "Dosegnite europske investitore i balkansku dijasporu",
    devIntro: "Obrov Real Estate izravno povezuje vaš projekt novogradnje s rastućom grupom nizozemskih investitora koji traže nekretnine na jadranskoj obali.",
    devBenefits: ["Izravan pristup motiviranim kupcima","Potpuna podrška od upoznavanja do prijenosa","Zastupanje na putovanjima razgledavanja","Transparentna suradnja na temelju jasnih dogovora"],
    devFormTitle: "Predstavite svoj projekt",
    devName: "Vaše ime", devCompany: "Naziv tvrtke", devLocation: "Lokacija projekta", devDescription: "Kratak opis projekta", devEmail: "Email adresa",
    devSubmit: "Pošaljite prijedlog projekta", devSending: "Slanje...",
    devSent: "Prijedlog primljen! Kontaktirat ćemo vas u roku od dva radna dana.",
    devError: "Greška. Pokušajte ponovo ili pišite na info@obrovrealestate.nl.",
    devCta: "Stranica za investitore",
    platformKicker: "KAKO FUNKCIONIŠE",
    platformTitle: "Jedna platforma, tri ciljne grupe",
    platformIntro: "Obrov Real Estate čini nekretnine na Balkanu transparentnim za kupce, prodavce i investitore iz cijele Evrope i dijaspore.",
    platformKoperTitle: "Za kupca",
    platformKoperPunten: ["Tačna GPS lokacija svake nekretnine","Potpune informacije: m², sobe, dokumenti, komunalije","Direktan kontakt sa prodajnom stranom","Prikaz na karti i listi za lako poređenje","Oglasi na 10 evropskih jezika"],
    platformVerkoperTitle: "Za prodavca",
    platformVerkoperPunten: ["Dosegnite kupce iz cijele Evrope i dijaspore","Besplatno oglašavanje u testnoj fazi","Kasnije: €150/mj, veća šansa za prodaju","Postavite vlastite fotografije","Kontakt podaci vidljivi na svakom oglasu"],
    platformOntwikkelaarTitle: "Za investitore",
    platformOntwikkelaarPunten: ["Dosegnite svjetsko tržište i balkansku dijasporu","Ekskluzivno zastupanje u zapadnoj Evropi","Prezentacija evropskoj investicionoj mreži","Provizija po prodanoj jedinici, bez fiksnih troškova","Jasni ugovori, bez skrivenih troškova"],
    searchKicker: "PRETRAŽI NEKRETNINE",
    searchTitle: "Pronađite nekretninu u Crnoj Gori i na Balkanu",
    searchPlaceholder: "Grad ili regija (npr. Kotor, Budva, Bar...)",
    searchStraal: "Polumjer (km)",
    searchBtn: "Pretraži",
    aanbodKicker: "TRENUTNA PONUDA",
    aanbodLink: "Pogledajte svu ponudu",
    footerTag: "Obrov Real Estate, Ulaganja u Crnoj Gori",
    footerRights: "© 2026 Obrov Real Estate. Sva prava pridržana.",
  },

  // ---- SLOVEENS ----
  sl: {
    langLabel: "SL",
    nav: { aanpak: "Pristop", diensten: "Storitve", overOns: "O nas", developers: "Investitorji", contact: "Kontakt" },
    navCta: "Dogovorite sestanek",
    navLogin: "Prijava",
    navLogin: "Prijava",
    navMijnAccount: "Moj račun",
    navFaq: "FAQ",
    navAanbod: "Oglejte si ponudbo",
    heroBadge: "EVROPSKA PLATFORMA ZA NEPREMIČNINE NA BALKANU",
    heroTitle1: "Balkanske nepremičnine,",
    heroTitle2: "popolnoma pregledno.",
    heroText: "Prva evropska platforma, ki naredi balkanske nepremičnine popolnoma pregledne, z natančnimi lokacijami, popolnimi informacijami in neposrednim dostopom za kupce in prodajalce iz vse Evrope in diaspore.",
    heroCta1: "Oglejte si ponudbo",
    heroCta2: "Oglasite nepremičnino",
    stat1v: "100%", stat1l: "Tržišče v eurih, brez valutnega tveganja",
    stat2v: "4", stat2l: "Balkanske države z aktivnimi stiki",
    stat3v: "1", stat3l: "Ena kontaktna oseba skozi celoten proces",
    whyTitle: "ZAKAJ ČRNA GORA",
    whyItems: [
      "Kandidatka za EU, pravna varnost se povečuje",
      "Jadranska obala, nižje vstopne cene kot v zahodni Evropi",
      "Euro kot de facto valuta, brez valutnega tveganja",
      "Rastoči turizem in marine kot Porto Montenegro",
    ],
    routeKicker: "POT",
    routeTitle: "Od Haaga do Budve, v eni liniji",
    routeLeft: "Nizozemska",
    routeRight: "Črna gora",
    destinationsKicker: "NAŠE REGIJE",
    destinationsTitle: "Črna gora in Balkan",
    destinationsIntro: "Črna gora je naše osrednje tržišče. Naši stiki segajo tudi v Hrvaško, Bosno in Hercegovino ter Slovenijo.",
    destinationLands: [
      { land: "Črna gora", flag: "🇲🇪", why: "Kandidatka za EU, jadranska obala, nizke vstopne cene, euro kot valuta.", spots: [
        { name: "Kotor", desc: "Zgodovinska zaliv, UNESCO svetovna dediščina, obdana z gorami" },
        { name: "Budva", desc: "Živahno obalno mesto s starim mestom in plažami" },
        { name: "Tivat", desc: "Dom marine Porto Montenegro in mednarodnega letališča" },
        { name: "Bar", desc: "Največja marina v Črni gori, rastoče mesto ob morju" },
        { name: "Ulcinj", desc: "Najjužnejše obalno mesto, dolge peščene plaže proti Albaniji" },
      ]},
      { land: "Hrvaška", flag: "🇭🇷", why: "Članica EU, dalmatinska obala, močan turistični trg.", spots: [
        { name: "Split", desc: "Zgodovinsko pristanišče, neposredni leti, močen najemni trg" },
        { name: "Dubrovnik", desc: "Premium destinacija, visoki najemninski donosi, zaščita UNESCO" },
        { name: "Makarska", desc: "Priljubljena riviera, rastoči trg novogradenj" },
        { name: "Zadar", desc: "Dostopno mesto, moderna marina, nižja vstopna cena" },
      ]},
      { land: "Bosna in Hercegovina", flag: "🇧🇦", why: "Najnižje vstopne cene v regiji, rastoči turistični sektor, kandidatka za EU.", spots: [
        { name: "Mostar", desc: "Ikonično mesto, hitro rastoči turizem, dostopne cene nepremičnin" },
        { name: "Sarajevo", desc: "Prestolnica, raznovrsten trg nepremičnin" },
        { name: "Neum", desc: "Edino obalno mesto BiH, rastoči jadranski turizem" },
      ]},
      { land: "Slovenija", flag: "🇸🇮", why: "Članica EU, euro kot valuta, stabilna pravna država, priljubljena med vlagatelji.", spots: [
        { name: "Ljubljana", desc: "Prestolnica, stabilen trg nepremičnin, močni najemninski donosi" },
        { name: "Portorož", desc: "Jadranska obala, luksuzni počitniški trg" },
        { name: "Bled", desc: "Ikonično jezero, vrhunska destinacija, omejena ponudba = rast vrednosti" },
      ]},
    ],
    stops: [
      { city: "Haag", sub: "Spoznavanje in dokumentacija", side: "nl" },
      { city: "Rotterdam", sub: "Pravni in davčni postopek", side: "nl" },
      { city: "Tivat", sub: "Ogled in izbor projekta", side: "mne" },
      { city: "Kotor", sub: "Prodajna pogodba in notar", side: "mne" },
      { city: "Budva", sub: "Prenos in izročitev ključev", side: "mne" },
    ],
    servicesKicker: "STORITVE",
    servicesTitle: "Ena pot, v celoti vodena",
    services: [
      { num: "01", title: "Izbor projekta", text: "Skrbno izbrani projekti novogradenj in obstoječih nepremičnin glede na vaš profil, proračun in cilj." },
      { num: "02", title: "Nakup off-plan", text: "Podpora pri nakupu novogradnje pred ali med gradnjo, pogosto po ugodnejši vstopni ceni." },
      { num: "03", title: "Invest & flip", text: "Strateški postopek nakupa in prodaje z osredotočenostjo na rast vrednosti, z ali brez obnove." },
      { num: "04", title: "Ogled potovanje", text: "Osebno organizirano in vodeno potovanje v Črno goro z neposrednim dostopom do investitorjev." },
      { num: "05", title: "Pravna podpora", text: "Stalna mreža lokalnih odvetnikov za pregled pogodb, zemljiške knjige in notarskega prenosa." },
      { num: "06", title: "Davčna uskladitev", text: "Koordinacija z nizozemskim davčnim svetovalcem o posledicah za box 3 in strukturiranje lastništva." },
      { num: "07", title: "Podpora pri transakciji", text: "Od rezervacije do izročitve ključev, sledimo vsakemu koraku in roku v vašem imenu." },
      { num: "08", title: "Upravljanje najema", text: "Opcijsko napotilo na lokalno upravljanje za tiste, ki želijo oddati nepremičnino v najem." },
    ],
    aboutKicker: "O NAS",
    aboutTitle: "Dve vlogi, ena agencija",
    aboutQuote: "Delamo tako za kupca kot za investitorja, transparentno, osebno in vedno z eno fiksno kontaktno osebo.",
    aboutQuoteAttr: ", Obrov Real Estate",
    aboutP1: "Obrov Real Estate ima dve komplementarni vlogi. Za nizozemske vlagatelje smo vodič: iščemo ustrezne nepremičnine ali projekte, organiziramo ogledna potovanja, vodimo pravni in davčni proces ter nadziramo vsak detajl do izročitve ključev. Naše plačilo je transparentna vodstvena provizija ali delež od nakupne cene.",
    aboutP2: "Za črnogorske in balkanske projektne investitorje smo ekskluzivni zastopnik v Nizozemski. Njihove projekte predstavljamo naši mreži vlagateljev in za to prejemamo provizijo na prodano enoto. Obe strani vnaprej vesta natanko, kako zaslužimo, brez skritih stroškov, brez nasprotja interesov.",
    contactTitle: "Začnite s pogovorom brez obveznosti",
    contactText: "Povejte nam o svoji situaciji in cilju. Osebno vas bomo kontaktirali v dveh delovnih dneh.",
    formName: "Vaše ime",
    formEmail: "E-poštni naslov",
    formMessage: "Kakšen je vaš naložbeni cilj ali vprašanje?",
    formSubmit: "Pošljite povpraševanje",
    formSending: "Pošiljanje...",
    formErrorText: "Prišlo je do napake. Poskusite znova ali nam pišite na info@obrovrealestate.nl.",
    sentTitle: "Sporočilo poslano",
    sentText: "Hvala za vaše zanimanje. Kmalu vas bomo kontaktirali.",
    devKicker: "ZA PROJEKTNE INVESTITORJE",
    devTitle: "Dosezite evropske vlagatelje in balkansko diasporo",
    devIntro: "Obrov Real Estate neposredno povezuje vaš projekt novogradnje z rastočo skupino nizozemskih vlagateljev, ki aktivno iščejo nepremičnine na jadranski obali.",
    devBenefits: ["Neposreden dostop do motiviranih kupcev","Popolna podpora od predstavitve do prenosa","Zastopanje na oglednih potovanjih in informativnih večerih","Transparentno sodelovanje na podlagi jasnih dogovorov"],
    devFormTitle: "Predstavite svoj projekt",
    devName: "Vaše ime", devCompany: "Ime podjetja", devLocation: "Lokacija projekta", devDescription: "Kratek opis projekta", devEmail: "E-poštni naslov",
    devSubmit: "Pošljite predlog projekta", devSending: "Pošiljanje...",
    devSent: "Predlog prejet! Kontaktirali vas bomo v dveh delovnih dneh.",
    devError: "Napaka. Poskusite znova ali pišite na info@obrovrealestate.nl.",
    devCta: "Stran za investitorje",
    platformKicker: "KAKO DELUJE",
    platformTitle: "Ena platforma, tri ciljne skupine",
    platformIntro: "Obrov Real Estate naredi balkanske nepremičnine pregledne za kupce, prodajalce in investitorje iz vse Evrope in diaspore.",
    platformKoperTitle: "Za kupca",
    platformKoperPunten: ["Natančna GPS lokacija vsake nepremičnine","Popolne informacije: m², sobe, dokumenti, komunalne storitve","Neposreden stik s prodajno stranjo","Pogled na zemljevidu in seznamu za enostavno primerjavo","Oglasi v 10 evropskih jezikih"],
    platformVerkoperTitle: "Za prodajalca",
    platformVerkoperPunten: ["Dosezite kupce iz vse Evrope in diaspore","Brezplačno oglaševanje v testni fazi","Kasneje: €150/mesec, bistveno višja možnost prodaje","Naložite lastne fotografije, profesionalna seja na voljo","Kontaktni podatki vidni na vsakem oglasu"],
    platformOntwikkelaarTitle: "Za investitorje",
    platformOntwikkelaarPunten: ["Dosezite svetovni trg in balkansko diasporo","Ekskluzivno zastopanje v zahodni Evropi","Predstavitev aktivni evropski investicijski mreži","Provizija na prodano enoto, brez fiksnih stroškov","Jasne pogodbe, brez skritih stroškov"],
    searchKicker: "ISKANJE NEPREMIČNIN",
    searchTitle: "Poiščite svojo nepremičnino v Črni gori & na Balkanu",
    searchPlaceholder: "Mesto ali regija (npr. Kotor, Budva, Bar...)",
    searchStraal: "Polmer (km)",
    searchBtn: "Iskanje",
    aanbodKicker: "TRENUTNA PONUDBA",
    aanbodLink: "Oglejte si celotno ponudbo",
    footerTag: "Obrov Real Estate, Naložbe v Črni gori",
    footerRights: "© 2026 Obrov Real Estate. Vse pravice pridržane.",
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
function PlatformVoordelen() {
  const { t } = useLang();

  const kolommen = [
    {
      icon: "🏠",
      role: t.platformKoperTitle,
      punten: t.platformKoperPunten,
      kleur: "#0B2A52",
    },
    {
      icon: "📋",
      role: t.platformVerkoperTitle,
      punten: t.platformVerkoperPunten,
      kleur: "#AC9362",
    },
    {
      icon: "🌍",
      role: t.platformOntwikkelaarTitle,
      punten: t.platformOntwikkelaarPunten,
      kleur: "#1A5C3A",
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: 1080, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }} className="platform-grid">
        {kolommen.map((k) => (
          <div key={k.role} style={{ background: "#fff", border: "1px solid #DCD4C2", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ background: k.kleur, padding: "18px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{k.icon}</div>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: "#fff" }}>{k.role}</span>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {k.punten.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: k.kleur, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13.5, color: "#3D3D3D", lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{`@media (max-width: 700px) { .platform-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

// Alle talen met vlag en volledige naam voor de dropdown
const ALLE_TALEN = [
  { code: "nl", vlag: "🇳🇱", naam: "Nederlands",      groep: "Benelux" },
  { code: "fr", vlag: "🇫🇷", naam: "Français",        groep: "Benelux" },
  { code: "lb", vlag: "🇱🇺", naam: "Lëtzebuergesch",  groep: "Benelux" },
  { code: "de", vlag: "🇩🇪", naam: "Deutsch",          groep: "DACH" },
  { code: "sv", vlag: "🇸🇪", naam: "Svenska",          groep: "Scandinavisch" },
  { code: "en", vlag: "🇬🇧", naam: "English",          groep: "Internationaal" },
  { code: "me", vlag: "🇲🇪", naam: "Crnogorski",       groep: "Balkan" },
  { code: "bs", vlag: "🇧🇦", naam: "Bosanski",         groep: "Balkan" },
  { code: "hr", vlag: "🇭🇷", naam: "Hrvatski",         groep: "Balkan" },
  { code: "sl", vlag: "🇸🇮", naam: "Slovenščina",      groep: "Balkan" },
];

const GROEPEN = ["Benelux", "DACH", "Scandinavisch", "Internationaal", "Balkan"];

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const huidig = ALLE_TALEN.find((t) => t.code === lang) || ALLE_TALEN[0];

  return (
    <div style={{ position: "relative" }}>
      {/* Trigger knop */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: open ? "#0B2A52" : "#EDE6D7",
          color: open ? "#FAF8F4" : "#0B2A52",
          border: "none",
          borderRadius: 20,
          padding: "7px 14px 7px 10px",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 18 }}>{huidig.vlag}</span>
        <span className="lang-naam" style={{ }}>{huidig.naam.split(" ")[0]}</span>
        <span style={{ fontSize: 10, opacity: 0.7 }}>{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Overlay om te sluiten */}
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />
          <div style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "#fff",
            border: "1px solid #DCD4C2",
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(11,42,82,0.15)",
            zIndex: 99,
            minWidth: 240,
            overflow: "hidden",
          }}>
            {GROEPEN.map((groep) => {
              const talen = ALLE_TALEN.filter((t) => t.groep === groep);
              return (
                <div key={groep}>
                  <div style={{ padding: "10px 16px 5px", fontSize: 11, fontWeight: 700, color: "#9B9B9B", letterSpacing: 1, textTransform: "uppercase" }}>
                    {groep}
                  </div>
                  {talen.map((t) => (
                    <button
                      key={t.code}
                      onClick={() => { setLang(t.code); setOpen(false); }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                        padding: "9px 16px",
                        border: "none",
                        background: lang === t.code ? "#EDE6D7" : "transparent",
                        cursor: "pointer",
                        fontSize: 14,
                        color: lang === t.code ? "#0B2A52" : "#1A1A1A",
                        fontWeight: lang === t.code ? 700 : 400,
                        textAlign: "left",
                        transition: "background 0.15s",
                      }}
                      onMouseOver={(e) => { if (lang !== t.code) e.currentTarget.style.background = "#FAF8F4"; }}
                      onMouseOut={(e) => { if (lang !== t.code) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{ fontSize: 20 }}>{t.vlag}</span>
                      <span>{t.naam}</span>
                      {lang === t.code && <span style={{ marginLeft: "auto", color: "#AC9362", fontSize: 16 }}>✓</span>}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function NavAuthKnop() {
  const { t } = useLang();
  const [ingelogd, setIngelogd] = React.useState(false);
  React.useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setIngelogd(true);
    });
  }, []);
  return (
    <a
      href={ingelogd ? "/favorieten" : "/auth"}
      className="navbar-login"
      style={{ color: "#0B2A52", border: "1.5px solid #DCD4C2", padding: "8px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", background: "#fff" }}
    >
      {ingelogd ? (t.navMijnAccount || "Mijn account") : (t.navLogin || "Inloggen")}
    </a>
  );
}

function NavBar() {
  const { t } = useLang();
  const navItems = [
    { key: "aanpak", href: "#aanpak" },
    { key: "diensten", href: "#diensten" },
    { key: "overOns", href: "#over-ons" },
    { key: "developers", href: "/developers" },
    { key: "faq", href: "/faq" },
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
          aria-label="Obrov Real Estate, home"
          style={{ display: "flex", alignItems: "center", flexShrink: 0, minWidth: 0 }}
        >
          <img
            src="/logo.png"
            alt="Obrov Real Estate"
            className="navbar-logo"
            style={{ height: 52, width: "auto", display: "block", maxWidth: "160px" }}
          />
        </a>
        <nav style={{ display: "none", gap: 32 }} className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              style={{ fontSize: 14, color: "#1A1A1A", textDecoration: "none", fontWeight: 500 }}
            >
              {item.key === "faq" ? (t.navFaq || "FAQ") : t.nav[item.key]}
            </a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <LangSwitcher />
          <NavAuthKnop />
          <a
            href="#contact"
            className="navbar-cta"
            style={{
              background: "#0B2A52",
              color: "#FAF8F4",
              padding: "9px 16px",
              borderRadius: 2,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {t.navCta}
          </a>
          <a
            href="/aanbod"
            className="navbar-aanbod"
            style={{ background: "#AC9362", color: "#FAF8F4", padding: "9px 14px", borderRadius: 2, fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            {t.navAanbod || "Aanbod"}
          </a>
        </div>
      </div>
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 600px) {
          .navbar-logo { height: 38px !important; }
          .navbar-cta { display: none !important; }
          .navbar-login { font-size: 12px !important; padding: 7px 10px !important; }
          .navbar-aanbod { font-size: 12px !important; padding: 7px 10px !important; }
          .lang-naam { display: none !important; }
        }
        @media (max-width: 380px) {
          .navbar-aanbod { display: none !important; }
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
// Foto's per bekende plaatsnaam (Montenegro bevestigd, andere landen neutraal)
const DESTINATION_PHOTOS = {
  "Kotor": "https://images.unsplash.com/photo-1531778272849-d1dd22444c06?w=900&q=80&auto=format&fit=crop",
  "Budva": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&q=80&auto=format&fit=crop",
  "Tivat": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&q=80&auto=format&fit=crop",
  "Bar": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=80&auto=format&fit=crop",
  "Ulcinj": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80&auto=format&fit=crop",
  "Split": "https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=900&q=80&auto=format&fit=crop",
  "Dubrovnik": "https://images.unsplash.com/photo-1555990793-da11153b2473?w=900&q=80&auto=format&fit=crop",
  "Makarska": "https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=900&q=80&auto=format&fit=crop",
  "Zadar": "https://images.unsplash.com/photo-1555990793-da11153b2473?w=900&q=80&auto=format&fit=crop",
  "Mostar": "https://images.unsplash.com/photo-1555993539-1732b0258235?w=900&q=80&auto=format&fit=crop",
  "Sarajevo": "https://images.unsplash.com/photo-1610015891338-3fc01dfc9b89?w=900&q=80&auto=format&fit=crop",
  "Neum": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=80&auto=format&fit=crop",
  "Ljubljana": "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=900&q=80&auto=format&fit=crop",
  "Portorož": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=80&auto=format&fit=crop",
  "Bled": "https://images.unsplash.com/photo-1555648426-7f2f8e4e4c6a?w=900&q=80&auto=format&fit=crop",
};

// Landkleuren per land
const LAND_COLORS = {
  "Montenegro": "#0B2A52",
  "Crna Gora": "#0B2A52",
  "Kroatië": "#C3232B",
  "Croatia": "#C3232B",
  "Kroatien": "#C3232B",
  "Hrvatska": "#C3232B",
  "Bosnië-Herzegovina": "#0F6B3E",
  "Bosnia-Herzegovina": "#0F6B3E",
  "Bosnien-Herzegowina": "#0F6B3E",
  "Bosna i Hercegovina": "#0F6B3E",
  "Slovenië": "#003DA5",
  "Slovenia": "#003DA5",
  "Slowenien": "#003DA5",
  "Slovenija": "#003DA5",
};

function SpotCard({ name, desc, color }) {
  const photoUrl = DESTINATION_PHOTOS[name];
  return (
    <div style={{ borderRadius: 5, overflow: "hidden", background: "#fff", border: "1px solid #DCD4C2", height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          height: 130,
          flexShrink: 0,
          position: "relative",
          backgroundImage: photoUrl ? `url(${photoUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          background: photoUrl ? undefined : color || "#0B2A52",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7,26,51,0) 50%, rgba(7,26,51,0.65) 100%)" }} />
        <div style={{ position: "absolute", bottom: 10, left: 14, color: "#fff", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 17, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          {name}
        </div>
      </div>
      <div style={{ padding: "13px 15px 16px", flex: 1 }}>
        <div style={{ fontSize: 13, color: "#3D3D3D", lineHeight: 1.55 }}>{desc}</div>
      </div>
    </div>
  );
}

function DestinationsStrip() {
  const { t } = useLang();
  const [activeLand, setActiveLand] = useState(0);
  const lands = t.destinationLands;
  const current = lands?.[activeLand];

  if (!lands) return null;

  const color = LAND_COLORS[current?.land] || "#0B2A52";

  return (
    <section style={{ padding: "70px 24px", maxWidth: 1180, margin: "0 auto" }}>
      <Reveal>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{ fontSize: 12.5, color: "#AC9362", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
            {t.destinationsKicker}
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#0B2A52", margin: "0 0 12px", fontWeight: 700 }}>
            {t.destinationsTitle}
          </h2>
          <p style={{ fontSize: 15, color: "#6B6B6B", maxWidth: 560, margin: "0 auto" }}>{t.destinationsIntro}</p>
        </div>
      </Reveal>

      {/* Landtabs */}
      <Reveal delay={80}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {lands.map((land, i) => (
            <button
              key={land.land}
              onClick={() => setActiveLand(i)}
              style={{
                border: `2px solid ${i === activeLand ? LAND_COLORS[land.land] || "#0B2A52" : "#DCD4C2"}`,
                background: i === activeLand ? LAND_COLORS[land.land] || "#0B2A52" : "#fff",
                color: i === activeLand ? "#fff" : "#1A1A1A",
                padding: "9px 18px",
                borderRadius: 3,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              {land.land}
            </button>
          ))}
        </div>

        {/* Why-invest banner */}
        <div style={{ background: color, borderRadius: 4, padding: "14px 20px", marginBottom: 22, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 14, color: "#FAF8F4", lineHeight: 1.5 }}>{current.why}</span>
        </div>

        {/* Spots grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, gridAutoRows: "1fr" }}>
          {current.spots.map((s, i) => (
            <SpotCard key={s.name} name={s.name} desc={s.desc} color={color} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------
function AanbodPreview() {
  const { t } = useLang();
  const woningen = DEMO_WONINGEN.slice(0, 3);
  const [zoekStad, setZoekStad] = useState("");
  const [zoekKm, setZoekKm] = useState("");

  const handleZoek = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (zoekStad) params.set("stad", zoekStad);
    if (zoekKm) params.set("km", zoekKm);
    window.location.href = `/aanbod${params.toString() ? "?" + params.toString() : ""}`;
  };

  return (
    <section style={{ background: "#0B2A52", padding: "48px 24px 52px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>

        {/* Zoekbalk titel */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 12.5, color: "#AC9362", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>{t.searchKicker}</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", color: "#FAF8F4", margin: 0, fontWeight: 700 }}>
            {t.searchTitle}
          </h2>
        </div>

        {/* Zoekbalk */}
        <form onSubmit={handleZoek} style={{ display: "flex", gap: 0, background: "#fff", borderRadius: 8, overflow: "hidden", maxWidth: 860, margin: "0 auto 40px", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
          {/* Stad invoer */}
          <div style={{ display: "flex", alignItems: "center", flex: 2, padding: "0 16px", borderRight: "1px solid #DCD4C2" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" style={{ flexShrink: 0, marginRight: 10 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={zoekStad}
              onChange={(e) => setZoekStad(e.target.value)}
              list="home-stad-suggestions"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 15, padding: "16px 0", fontFamily: "inherit", background: "transparent", color: "#1A1A1A" }}
            />
            <datalist id="home-stad-suggestions">
              {["Kotor","Budva","Tivat","Bar","Ulcinj","Dobre Vode","Kolašin","Bijelo Polje","Podgorica","Herceg Novi","Split","Dubrovnik","Ljubljana","Mostar","Sarajevo"].map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            {zoekStad && (
              <button onClick={() => setZoekStad("")} type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 18, padding: "0 4px" }}>×</button>
            )}
          </div>

          {/* Km-straal */}
          <div style={{ display: "flex", alignItems: "center", padding: "0 14px", borderRight: "1px solid #DCD4C2", minWidth: 150 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" style={{ flexShrink: 0, marginRight: 8 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="12" x2="15" y2="15"/>
            </svg>
            <select
              value={zoekKm}
              onChange={(e) => setZoekKm(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", background: "transparent", color: "#1A1A1A", cursor: "pointer", padding: "16px 0", minWidth: 120 }}
            >
              <option value="">{t.searchStraal}</option>
              <option value="5">+ 5 km</option>
              <option value="10">+ 10 km</option>
              <option value="20">+ 20 km</option>
              <option value="30">+ 30 km</option>
              <option value="50">+ 50 km</option>
              <option value="100">+ 100 km</option>
            </select>
          </div>

          {/* Zoekknop */}
          <button
            type="submit"
            style={{ background: "#AC9362", color: "#fff", border: "none", padding: "0 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {t.searchBtn} →
          </button>
        </form>

        {/* Aanbod kaarten header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12.5, color: "#C2A877", fontWeight: 700, letterSpacing: 1.5 }}>{t.aanbodKicker}</div>
          <Link
            to="/aanbod"
            style={{ color: "#C2A877", fontSize: 13.5, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid #AC9362", paddingBottom: 1 }}
          >
            {t.aanbodLink} ({DEMO_WONINGEN.length}) →
          </Link>
        </div>
        {/* Woningkaarten grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {woningen.map((w) => (
            <Link key={w.id} to="/aanbod" style={{ textDecoration: "none", color: "inherit" }}>
              <div
                style={{ background: "#fff", border: "1px solid #DCD4C2", borderRadius: 8, overflow: "hidden", transition: "box-shadow 0.2s, transform 0.15s" }}
                onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(11,42,82,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                {/* Foto */}
                <div style={{ height: 200, background: "#E8E4DA", position: "relative", overflow: "hidden" }}>
                  {w.hoofdfoto && (
                    <img src={w.hoofdfoto} alt={w.stad} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  {/* Type badge */}
                  <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(11,42,82,0.88)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 12 }}>
                    {w.type === "project" ? "Off-plan project" : w.type?.charAt(0).toUpperCase() + w.type?.slice(1)}
                  </div>
                  {/* Hart */}
                  <div style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding: "14px 16px 18px" }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 700, color: "#0B2A52", marginBottom: 4 }}>
                    € {w.vraagprijs.toLocaleString("nl-NL")} k.k.
                  </div>
                  <div style={{ fontSize: 13.5, color: "#555", marginBottom: 8 }}>
                    {w.adres || w.stad}{w.regio ? `, ${w.regio}` : ""}
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 13, color: "#555", paddingTop: 8, borderTop: "1px solid #DCD4C2", flexWrap: "wrap" }}>
                    {w.oppervlakte_m2 && <span>{w.oppervlakte_m2} m²</span>}
                    {w.perceel_m2 && <span>{w.perceel_m2} m² perceel</span>}
                    {w.slaapkamers && <span>{w.slaapkamers} slaapk.</span>}
                    {w.zeezicht && <span style={{ color: "#AC9362", fontWeight: 600 }}>Zeezicht</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Onderste CTA */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <Link to="/aanbod" style={{ fontSize: 14, color: "#C2A877", fontWeight: 600, textDecoration: "none", borderBottom: "1.5px solid #AC9362", paddingBottom: 2 }}>
            {t.aanbodLink} ({DEMO_WONINGEN.length}) →
          </Link>
        </div>
      </div>
    </section>
  );
}

function DevelopersSection() {
  const { t } = useLang();
  return (
    <section id="developers" style={{ padding: "72px 24px", background: "#F2EDE0" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Kaart met twee kolommen */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 32px rgba(11,42,82,0.10)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
          className="dev-cta-grid"
        >
          {/* Links: tekst */}
          <div style={{ padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 12, color: "#AC9362", fontWeight: 700, letterSpacing: 1.5, marginBottom: 14, textTransform: "uppercase" }}>
              {t.devKicker}
            </div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 2.5vw, 28px)", color: "#0B2A52", margin: "0 0 16px", fontWeight: 700, lineHeight: 1.2 }}>
              {t.devTitle}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4A4A4A", margin: "0 0 28px" }}>
              {t.devIntro}
            </p>
            <a
              href="/developers"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0B2A52", color: "#fff", padding: "14px 24px", borderRadius: 4, fontWeight: 700, fontSize: 14.5, textDecoration: "none", alignSelf: "flex-start" }}
            >
              {t.devCta} →
            </a>
          </div>

          {/* Rechts: visueel accentblok */}
          <div
            style={{
              background: "linear-gradient(135deg, #0B2A52 0%, #163A6B 100%)",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 20,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decoratief element */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(172,147,98,0.12)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(172,147,98,0.08)" }} />

            {/* Voordelen */}
            {[
              { icon: null, tekst: "Europese investeerders en Balkan-diaspora bereiken" },
              { icon: null, tekst: "Platform in 10 talen, kopers uit heel Europa" },
              { icon: null, tekst: "Vertegenwoordiging in NL, DE, LU en SE" },
              { icon: null, tekst: "Heldere contracten, geen verborgen kosten" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, position: "relative" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#AC9362", flexShrink: 0, marginTop: 8 }} />
                <div style={{ fontSize: 14.5, color: "#EDE7DA", lineHeight: 1.5 }}>{item.tekst}</div>
              </div>
            ))}
          </div>
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

      {/* AANBOD PREVIEW, eerste sectie */}
      <AanbodPreview />

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
              "linear-gradient(160deg, rgba(11,42,82,0.93), rgba(7,26,51,0.93)), url(https://images.unsplash.com/photo-1531778272849-d1dd22444c06?w=900&q=80&auto=format&fit=crop)",
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

      {/* PLATFORM VOORDELEN */}
      <section id="aanpak" style={{ padding: "70px 24px", background: "#fff", borderTop: "1px solid #DCD4C2", borderBottom: "1px solid #DCD4C2" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 12.5, color: "#AC9362", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
                {t.platformKicker}
              </div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 30, color: "#0B2A52", margin: "0 0 12px", fontWeight: 700 }}>
                {t.platformTitle}
              </h2>
              <p style={{ fontSize: 15, color: "#6B6B6B", maxWidth: 600, margin: "0 auto" }}>{t.platformIntro}</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <PlatformVoordelen />
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
                  "linear-gradient(160deg, rgba(11,42,82,0.93), rgba(7,26,51,0.93)), url(https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&q=80&auto=format&fit=crop)",
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
      <section id="contact" style={{ padding: "80px 24px", background: "#071A33" }}>
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
              <a href="/adverteren" style={{ color: "#9FB0AE", fontSize: 13, textDecoration: "underline" }}>
                Adverteren
              </a>
              <a href="/faq" style={{ color: "#9FB0AE", fontSize: 13, textDecoration: "underline" }}>
                FAQ
              </a>
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
          Obrov Real Estate, <a href="mailto:info@obrovrealestate.nl" style={{ color: "#AC9362" }}>info@obrovrealestate.nl</a>
        </p>
      </div>
    </div>
  );
}

// Detect default language from domain
function detectDefaultLang() {
  if (typeof window === "undefined") return "nl";
  // Eerst localStorage checken
  const saved = localStorage.getItem("obrov_lang");
  if (saved && ["nl","en","de","fr","sv","lb","me","bs","hr","sl"].includes(saved)) return saved;
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

export default function App() {
  const [lang, setLangState] = useState(detectDefaultLang);
  const setLang = (l) => { setLangState(l); localStorage.setItem("obrov_lang", l); };
  const [showPrivacy, setShowPrivacy] = useState(false);
  const t = CONTENT[lang];

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      <Page onPrivacy={() => setShowPrivacy(true)} />
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </LangContext.Provider>
  );
}
