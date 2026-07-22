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

-- ============================================================
-- AUTH UITBREIDING — gebruikersprofielen
-- ============================================================

-- Profiel tabel (wordt automatisch aangemaakt bij registratie via trigger)
CREATE TABLE IF NOT EXISTS profielen (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now(),
  naam        TEXT,
  email       TEXT,
  telefoon    TEXT,
  is_makelaar BOOLEAN DEFAULT false,
  bedrijf     TEXT
);

ALTER TABLE profielen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gebruiker ziet eigen profiel"
  ON profielen FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Gebruiker past eigen profiel aan"
  ON profielen FOR UPDATE USING (auth.uid() = id);

-- Trigger: maak profiel aan bij nieuwe gebruiker
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profielen (id, email, naam)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'naam');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Woningen koppelen aan auth gebruiker
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Eigen woningen aanpassen
DROP POLICY IF EXISTS "Eigenaar mag eigen woning bewerken" ON woningen;
CREATE POLICY "Eigenaar mag eigen woning bewerken"
  ON woningen FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Ingelogde gebruiker mag woning aanmaken"
  ON woningen FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- FACTUREN TABEL
-- ============================================================
CREATE TABLE IF NOT EXISTS facturen (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now(),
  user_id     UUID REFERENCES auth.users(id),
  woning_id   UUID REFERENCES woningen(id),
  naam        TEXT,
  email       TEXT,
  bedrag      NUMERIC(10,2),
  type        TEXT DEFAULT 'plaatsing',
  status      TEXT DEFAULT 'open',
  periode     TEXT,
  notities    TEXT
);

ALTER TABLE facturen ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'facturen' AND policyname = 'Admin leest alle facturen') THEN
    EXECUTE 'CREATE POLICY "Admin leest alle facturen" ON facturen FOR ALL USING (true)';
  END IF;
END $$;
