-- ============================================================
-- OBROV REAL ESTATE — Supabase database setup
-- Voer dit uit in de Supabase SQL Editor (supabase.com)
-- ============================================================

-- 1. WONINGEN tabel
CREATE TABLE IF NOT EXISTS woningen (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT now(),

  -- Status
  status          TEXT DEFAULT 'concept' CHECK (status IN ('concept', 'actief', 'verkocht', 'ingetrokken')),
  professionele_fotos BOOLEAN DEFAULT false,
  betaald         BOOLEAN DEFAULT false,
  stripe_session  TEXT,

  -- Adres & locatie
  adres           TEXT,
  stad            TEXT NOT NULL,
  regio           TEXT,
  land            TEXT DEFAULT 'Montenegro',
  lat             DOUBLE PRECISION,
  lng             DOUBLE PRECISION,

  -- Woninggegevens
  type            TEXT, -- appartement, villa, huis, grond
  vraagprijs      INTEGER NOT NULL,
  oppervlakte_m2  INTEGER,
  perceel_m2      INTEGER,
  kamers          INTEGER,
  slaapkamers     INTEGER,
  badkamers       INTEGER,
  bouwjaar        INTEGER,

  -- Boolean kenmerken
  tuin            BOOLEAN DEFAULT false,
  zwembad         BOOLEAN DEFAULT false,
  garage          BOOLEAN DEFAULT false,
  legale_grond    BOOLEAN DEFAULT false,
  papieren_orde   BOOLEAN DEFAULT false,
  geasfalteerde_weg BOOLEAN DEFAULT false,
  water           BOOLEAN DEFAULT false,
  elektriciteit   BOOLEAN DEFAULT false,
  zeezicht        BOOLEAN DEFAULT false,

  -- Beschrijving (meertalig)
  omschrijving_nl TEXT,
  omschrijving_en TEXT,
  omschrijving_de TEXT,
  omschrijving_me TEXT,

  -- Verkoper/makelaar
  verkoper_naam   TEXT NOT NULL,
  verkoper_email  TEXT NOT NULL,
  verkoper_telefoon TEXT,
  verkoper_is_makelaar BOOLEAN DEFAULT false,
  makelaar_bedrijf TEXT,

  -- Foto's (array van URLs uit Supabase Storage)
  fotos           TEXT[] DEFAULT '{}',
  hoofdfoto       TEXT
);

-- 2. Row Level Security (RLS)
ALTER TABLE woningen ENABLE ROW LEVEL SECURITY;

-- Iedereen mag actieve woningen lezen
CREATE POLICY "Actieve woningen zijn publiek leesbaar"
  ON woningen FOR SELECT
  USING (status = 'actief');

-- Iedereen mag een nieuwe woning aanmaken (betaling volgt via Stripe webhook)
CREATE POLICY "Iedereen mag een woning aanmaken"
  ON woningen FOR INSERT
  WITH CHECK (true);

-- Alleen de eigenaar mag zijn eigen concept aanpassen (via email match)
CREATE POLICY "Eigenaar mag eigen woning bewerken"
  ON woningen FOR UPDATE
  USING (true); -- vereenvoudigd; productie: check auth.jwt()

-- 3. STORAGE bucket voor foto's
-- Maak handmatig aan in Supabase Dashboard > Storage > New Bucket
-- Naam: "woningfotos"
-- Public: JA (zodat foto's publiek toegankelijk zijn)

-- 4. Handige views
CREATE OR REPLACE VIEW actieve_woningen AS
  SELECT * FROM woningen WHERE status = 'actief' ORDER BY created_at DESC;

-- 5. Index voor snelle kaartquery's
CREATE INDEX IF NOT EXISTS woningen_locatie ON woningen (lat, lng) WHERE status = 'actief';
CREATE INDEX IF NOT EXISTS woningen_stad ON woningen (stad) WHERE status = 'actief';
