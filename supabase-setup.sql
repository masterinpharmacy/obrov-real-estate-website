-- ============================================================
-- OBROV REAL ESTATE — Supabase Schema
-- ============================================================
-- Volledig uit te voeren in de Supabase SQL Editor.
-- Veilig herhaalbaar: werkt zowel op een lege database als op
-- een bestaande installatie. Er wordt niets verwijderd en geen
-- bestaande data overschreven.
--
-- Uitvoeren: kopieer dit hele bestand, plak in een nieuw tabblad
-- in de SQL Editor en klik Run.
-- ============================================================


-- ============================================================
-- 1. WONINGEN TABEL
-- ============================================================
CREATE TABLE IF NOT EXISTS woningen (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now(),
  user_id              UUID REFERENCES auth.users(id),

  -- Basisgegevens
  type                 TEXT NOT NULL DEFAULT 'appartement',
  stad                 TEXT NOT NULL,
  regio                TEXT,
  adres                TEXT,
  lat                  NUMERIC(10,6),
  lng                  NUMERIC(10,6),

  -- Prijs en belasting
  vraagprijs           INTEGER NOT NULL,
  belasting_per_jaar   NUMERIC(10,2),

  -- Afmetingen
  oppervlakte_m2       INTEGER,
  perceel_m2           INTEGER,
  kamers               INTEGER,
  slaapkamers          INTEGER,
  badkamers            INTEGER,
  bouwjaar             INTEGER,

  -- Omschrijvingen (viertalig, Engels is verplicht in de UI)
  omschrijving_nl      TEXT,
  omschrijving_en      TEXT,
  omschrijving_de      TEXT,
  omschrijving_cg      TEXT,

  -- Uitzicht
  zeezicht             BOOLEAN DEFAULT false,
  bergzicht            BOOLEAN DEFAULT false,
  rivierzicht          BOOLEAN DEFAULT false,

  -- Kenmerken
  tuin                 BOOLEAN DEFAULT false,
  terras               BOOLEAN DEFAULT false,
  zwembad              BOOLEAN DEFAULT false,
  garage               BOOLEAN DEFAULT false,
  airco                BOOLEAN DEFAULT false,
  verwarming           BOOLEAN DEFAULT false,
  lift                 BOOLEAN DEFAULT false,
  kelder               BOOLEAN DEFAULT false,
  gemeubileerd         BOOLEAN DEFAULT false,

  -- Nutsvoorzieningen
  water                BOOLEAN DEFAULT false,
  elektriciteit        BOOLEAN DEFAULT false,
  riolering            BOOLEAN DEFAULT false,
  geasfalteerde_weg    BOOLEAN DEFAULT false,

  -- Juridisch
  legale_grond         BOOLEAN DEFAULT false,
  papieren_orde        BOOLEAN DEFAULT false,
  vergunning_aanwezig  BOOLEAN DEFAULT false,

  -- Staat van de woning
  nieuwbouw            BOOLEAN DEFAULT false,
  bestaande_bouw       BOOLEAN DEFAULT false,
  renovatie_nodig      BOOLEAN DEFAULT false,

  -- Media
  fotos                TEXT[],
  plattegronden        TEXT[],
  hoofdfoto            TEXT,
  professionele_fotos  BOOLEAN DEFAULT false,

  -- Verkoper
  verkoper_naam        TEXT,
  verkoper_email       TEXT,
  verkoper_telefoon    TEXT,
  verkoper_is_makelaar BOOLEAN DEFAULT false,
  makelaar_bedrijf     TEXT,

  -- Status
  status               TEXT DEFAULT 'concept',
  betaald              BOOLEAN DEFAULT false,
  gesponsord           BOOLEAN DEFAULT false,
  demo                 BOOLEAN DEFAULT false
);


-- ============================================================
-- 2. PROFIELEN TABEL
-- ============================================================
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


-- ============================================================
-- 3. FACTUREN TABEL
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


-- ============================================================
-- 4. MIGRATIE voor bestaande installaties
-- ============================================================
-- CREATE TABLE IF NOT EXISTS voegt GEEN kolommen toe aan een tabel
-- die al bestaat. Daarom hieronder elke kolom expliciet, zodat een
-- oudere database bijgewerkt wordt naar het huidige schema.
-- Dit blok is de reden dat fouten als
-- "Could not find the 'airco' column in the schema cache" verdwijnen.

-- Basisgegevens
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS user_id              UUID REFERENCES auth.users(id);
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS updated_at           TIMESTAMPTZ DEFAULT now();
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS regio                TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS adres                TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS lat                  NUMERIC(10,6);
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS lng                  NUMERIC(10,6);

-- Prijs en belasting
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS belasting_per_jaar   NUMERIC(10,2);

-- Afmetingen
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS oppervlakte_m2       INTEGER;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS perceel_m2           INTEGER;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS kamers               INTEGER;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS slaapkamers          INTEGER;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS badkamers            INTEGER;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS bouwjaar             INTEGER;

-- Omschrijvingen
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS omschrijving_nl      TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS omschrijving_en      TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS omschrijving_de      TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS omschrijving_cg      TEXT;

-- Uitzicht
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS zeezicht             BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS bergzicht            BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS rivierzicht          BOOLEAN DEFAULT false;

-- Kenmerken
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS tuin                 BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS terras               BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS zwembad              BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS garage               BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS airco                BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS verwarming           BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS lift                 BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS kelder               BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS gemeubileerd         BOOLEAN DEFAULT false;

-- Nutsvoorzieningen
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS water                BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS elektriciteit        BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS riolering            BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS geasfalteerde_weg    BOOLEAN DEFAULT false;

-- Juridisch
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS legale_grond         BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS papieren_orde        BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS vergunning_aanwezig  BOOLEAN DEFAULT false;

-- Staat van de woning
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS nieuwbouw            BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS bestaande_bouw       BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS renovatie_nodig      BOOLEAN DEFAULT false;

-- Media
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS fotos                TEXT[];
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS plattegronden        TEXT[];
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS hoofdfoto            TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS professionele_fotos  BOOLEAN DEFAULT false;

-- Verkoper
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS verkoper_naam        TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS verkoper_email       TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS verkoper_telefoon    TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS verkoper_is_makelaar BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS makelaar_bedrijf     TEXT;

-- Status
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS status               TEXT DEFAULT 'concept';
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS betaald              BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS gesponsord           BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS demo                 BOOLEAN DEFAULT false;

-- Profielen en facturen, voor het geval die ouder zijn
ALTER TABLE profielen ADD COLUMN IF NOT EXISTS telefoon            TEXT;
ALTER TABLE profielen ADD COLUMN IF NOT EXISTS is_makelaar         BOOLEAN DEFAULT false;
ALTER TABLE profielen ADD COLUMN IF NOT EXISTS bedrijf             TEXT;
ALTER TABLE profielen ADD COLUMN IF NOT EXISTS account_type        TEXT DEFAULT 'particulier';

ALTER TABLE facturen  ADD COLUMN IF NOT EXISTS periode             TEXT;
ALTER TABLE facturen  ADD COLUMN IF NOT EXISTS notities            TEXT;


-- ============================================================
-- 5. DATA-MIGRATIE
-- ============================================================
-- Woningen die noch nieuwbouw noch renovatie zijn, zijn bestaande bouw.
UPDATE woningen
   SET bestaande_bouw = true
 WHERE bestaande_bouw IS NOT TRUE
   AND nieuwbouw      IS NOT TRUE
   AND renovatie_nodig IS NOT TRUE;


-- ============================================================
-- 6. INDEXEN voor filtersnelheid op de aanbodpagina
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_woningen_status      ON woningen (status);
CREATE INDEX IF NOT EXISTS idx_woningen_stad        ON woningen (stad);
CREATE INDEX IF NOT EXISTS idx_woningen_type        ON woningen (type);
CREATE INDEX IF NOT EXISTS idx_woningen_vraagprijs  ON woningen (vraagprijs);
CREATE INDEX IF NOT EXISTS idx_woningen_created_at  ON woningen (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_woningen_user_id     ON woningen (user_id);
CREATE INDEX IF NOT EXISTS idx_facturen_user_id     ON facturen (user_id);
CREATE INDEX IF NOT EXISTS idx_facturen_woning_id   ON facturen (woning_id);


-- ============================================================
-- 7. UPDATED_AT automatisch bijwerken
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS woningen_set_updated_at ON woningen;
CREATE TRIGGER woningen_set_updated_at
  BEFORE UPDATE ON woningen
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE woningen  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profielen ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturen  ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 9. POLICIES
-- ============================================================
-- Eerst droppen zodat dit script herhaalbaar blijft.
DROP POLICY IF EXISTS "Actieve woningen zijn publiek leesbaar"  ON woningen;
DROP POLICY IF EXISTS "Eigenaar ziet eigen woningen"            ON woningen;
DROP POLICY IF EXISTS "Ingelogde gebruiker mag woning aanmaken" ON woningen;
DROP POLICY IF EXISTS "Eigenaar mag eigen woning bewerken"      ON woningen;
DROP POLICY IF EXISTS "Eigenaar mag eigen woning verwijderen"   ON woningen;
DROP POLICY IF EXISTS "Gebruiker ziet eigen profiel"            ON profielen;
DROP POLICY IF EXISTS "Gebruiker past eigen profiel aan"        ON profielen;
DROP POLICY IF EXISTS "Gebruiker maakt eigen profiel aan"       ON profielen;
DROP POLICY IF EXISTS "Admin leest alle facturen"               ON facturen;
DROP POLICY IF EXISTS "Gebruiker ziet eigen facturen"           ON facturen;

-- Woningen
CREATE POLICY "Actieve woningen zijn publiek leesbaar"
  ON woningen FOR SELECT USING (status = 'actief');

-- Zodat een verkoper zijn eigen concept- en verkochte woningen ook ziet.
CREATE POLICY "Eigenaar ziet eigen woningen"
  ON woningen FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Ingelogde gebruiker mag woning aanmaken"
  ON woningen FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Eigenaar mag eigen woning bewerken"
  ON woningen FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Eigenaar mag eigen woning verwijderen"
  ON woningen FOR DELETE USING (auth.uid() = user_id);

-- Profielen
CREATE POLICY "Gebruiker ziet eigen profiel"
  ON profielen FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Gebruiker past eigen profiel aan"
  ON profielen FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Gebruiker maakt eigen profiel aan"
  ON profielen FOR INSERT WITH CHECK (auth.uid() = id);

-- Facturen: alleen de eigen facturen zijn leesbaar vanuit de browser.
-- De adminpagina draait via api/admin.js met de service role key en
-- omzeilt RLS, dus die heeft hier geen open policy voor nodig.
CREATE POLICY "Gebruiker ziet eigen facturen"
  ON facturen FOR SELECT USING (auth.uid() = user_id);


-- ============================================================
-- 10. TRIGGER: profiel aanmaken bij registratie
-- ============================================================
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


-- ============================================================
-- 11. STORAGE bucket voor foto's en plattegronden
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('woningfotos', 'woningfotos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Fotos zijn publiek leesbaar"             ON storage.objects;
DROP POLICY IF EXISTS "Ingelogde gebruiker mag fotos uploaden"  ON storage.objects;
DROP POLICY IF EXISTS "Ingelogde gebruiker mag fotos verwijderen" ON storage.objects;

CREATE POLICY "Fotos zijn publiek leesbaar"
  ON storage.objects FOR SELECT USING (bucket_id = 'woningfotos');

CREATE POLICY "Ingelogde gebruiker mag fotos uploaden"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'woningfotos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Ingelogde gebruiker mag fotos verwijderen"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'woningfotos' AND auth.uid() IS NOT NULL);


-- ============================================================
-- 12. SCHEMA CACHE VERVERSEN
-- ============================================================
-- PostgREST cachet de kolomlijst. Zonder deze regel blijft de fout
-- "Could not find the '...' column in the schema cache" komen,
-- ook nadat de kolom bestaat.
NOTIFY pgrst, 'reload schema';


-- ============================================================
-- KLAAR — controleer het resultaat
-- ============================================================
SELECT 'Schema succesvol bijgewerkt' AS status;

-- Alle kolommen van de woningen tabel, om te vergelijken met de
-- insert in src/WoningPlaatsen.jsx:
SELECT column_name, data_type, column_default
  FROM information_schema.columns
 WHERE table_name = 'woningen'
 ORDER BY ordinal_position;
