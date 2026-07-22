-- ============================================================
-- OBROV REAL ESTATE — Supabase Schema (conflict-vrij)
-- Voer dit uit in een NIEUW tabblad in de SQL Editor
-- ============================================================

-- 1. WONINGEN TABEL
CREATE TABLE IF NOT EXISTS woningen (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now(),
  user_id             UUID REFERENCES auth.users(id),
  type                TEXT NOT NULL DEFAULT 'appartement',
  stad                TEXT NOT NULL,
  regio               TEXT,
  adres               TEXT,
  lat                 NUMERIC(10,6),
  lng                 NUMERIC(10,6),
  vraagprijs          INTEGER NOT NULL,
  belasting_per_jaar  NUMERIC(10,2),
  oppervlakte_m2      INTEGER,
  perceel_m2          INTEGER,
  kamers              INTEGER,
  slaapkamers         INTEGER,
  badkamers           INTEGER,
  bouwjaar            INTEGER,
  omschrijving_nl     TEXT,
  omschrijving_en     TEXT,
  zeezicht            BOOLEAN DEFAULT false,
  bergzicht           BOOLEAN DEFAULT false,
  tuin                BOOLEAN DEFAULT false,
  terras              BOOLEAN DEFAULT false,
  zwembad             BOOLEAN DEFAULT false,
  garage              BOOLEAN DEFAULT false,
  airco               BOOLEAN DEFAULT false,
  verwarming          BOOLEAN DEFAULT false,
  lift                BOOLEAN DEFAULT false,
  kelder              BOOLEAN DEFAULT false,
  gemeubileerd        BOOLEAN DEFAULT false,
  water               BOOLEAN DEFAULT false,
  elektriciteit       BOOLEAN DEFAULT false,
  riolering           BOOLEAN DEFAULT false,
  geasfalteerde_weg   BOOLEAN DEFAULT false,
  legale_grond        BOOLEAN DEFAULT false,
  papieren_orde       BOOLEAN DEFAULT false,
  vergunning_aanwezig BOOLEAN DEFAULT false,
  nieuwbouw           BOOLEAN DEFAULT false,
  renovatie_nodig     BOOLEAN DEFAULT false,
  fotos               TEXT[],
  plattegronden       TEXT[],
  hoofdfoto           TEXT,
  verkoper_naam       TEXT,
  verkoper_email      TEXT,
  verkoper_telefoon   TEXT,
  verkoper_is_makelaar BOOLEAN DEFAULT false,
  makelaar_bedrijf    TEXT,
  status              TEXT DEFAULT 'concept',
  betaald             BOOLEAN DEFAULT false,
  gesponsord          BOOLEAN DEFAULT false,
  demo                BOOLEAN DEFAULT false
);

-- 2. PROFIELEN TABEL
CREATE TABLE IF NOT EXISTS profielen (
  id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at   TIMESTAMPTZ DEFAULT now(),
  naam         TEXT,
  email        TEXT,
  telefoon     TEXT,
  is_makelaar  BOOLEAN DEFAULT false,
  bedrijf      TEXT,
  account_type TEXT DEFAULT 'particulier'
);

-- 3. FACTUREN TABEL
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

-- 4. RLS AANZETTEN
ALTER TABLE woningen  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profielen ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturen  ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES — DROP eerst zodat er geen conflicten zijn
DROP POLICY IF EXISTS "Actieve woningen zijn publiek leesbaar"  ON woningen;
DROP POLICY IF EXISTS "Ingelogde gebruiker mag woning aanmaken" ON woningen;
DROP POLICY IF EXISTS "Eigenaar mag eigen woning bewerken"      ON woningen;
DROP POLICY IF EXISTS "Eigenaar mag eigen woning verwijderen"   ON woningen;
DROP POLICY IF EXISTS "Gebruiker ziet eigen profiel"            ON profielen;
DROP POLICY IF EXISTS "Gebruiker past eigen profiel aan"        ON profielen;
DROP POLICY IF EXISTS "Admin leest alle facturen"               ON facturen;

CREATE POLICY "Actieve woningen zijn publiek leesbaar"
  ON woningen FOR SELECT USING (status = 'actief');

CREATE POLICY "Ingelogde gebruiker mag woning aanmaken"
  ON woningen FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Eigenaar mag eigen woning bewerken"
  ON woningen FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Eigenaar mag eigen woning verwijderen"
  ON woningen FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Gebruiker ziet eigen profiel"
  ON profielen FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Gebruiker past eigen profiel aan"
  ON profielen FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin leest alle facturen"
  ON facturen FOR ALL USING (true);

-- 6. TRIGGER voor automatisch profiel aanmaken bij registratie
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profielen (id, email, naam, account_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'naam',
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'particulier')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. STORAGE bucket voor foto's
INSERT INTO storage.buckets (id, name, public)
VALUES ('woningfotos', 'woningfotos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Fotos zijn publiek leesbaar"         ON storage.objects;
DROP POLICY IF EXISTS "Ingelogde gebruiker mag fotos uploaden" ON storage.objects;

CREATE POLICY "Fotos zijn publiek leesbaar"
  ON storage.objects FOR SELECT USING (bucket_id = 'woningfotos');

CREATE POLICY "Ingelogde gebruiker mag fotos uploaden"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'woningfotos' AND auth.uid() IS NOT NULL);

-- Klaar
SELECT 'Schema succesvol aangemaakt' AS status;
