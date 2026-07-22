-- ============================================================
-- OBROV — FIX: "Could not find the 'airco' column in the schema cache"
-- ============================================================
-- Voer dit hele bestand uit in de Supabase SQL Editor.
-- Veilig herhaalbaar. Verwijdert niets.
--
-- De fout betekent bijna altijd één van twee dingen:
--   A) de kolom bestaat echt niet in de database, of
--   B) de kolom bestaat wel, maar PostgREST heeft een oude
--      kolomlijst in het geheugen (de "schema cache").
--
-- Dit script lost beide op en laat aan het eind zien welke
-- van de twee het was.
-- ============================================================


-- ============================================================
-- STAP 1 — Alle kolommen aanmaken die nog ontbreken
-- ============================================================
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS airco                BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS verwarming           BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS lift                 BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS terras               BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS kelder               BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS gemeubileerd         BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS tuin                 BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS zwembad              BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS garage               BOOLEAN DEFAULT false;

ALTER TABLE woningen ADD COLUMN IF NOT EXISTS zeezicht             BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS bergzicht            BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS rivierzicht          BOOLEAN DEFAULT false;

ALTER TABLE woningen ADD COLUMN IF NOT EXISTS water                BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS elektriciteit        BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS riolering            BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS geasfalteerde_weg    BOOLEAN DEFAULT false;

ALTER TABLE woningen ADD COLUMN IF NOT EXISTS legale_grond         BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS papieren_orde        BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS vergunning_aanwezig  BOOLEAN DEFAULT false;

ALTER TABLE woningen ADD COLUMN IF NOT EXISTS nieuwbouw            BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS bestaande_bouw       BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS renovatie_nodig      BOOLEAN DEFAULT false;

ALTER TABLE woningen ADD COLUMN IF NOT EXISTS omschrijving_nl      TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS omschrijving_en      TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS omschrijving_de      TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS omschrijving_cg      TEXT;

ALTER TABLE woningen ADD COLUMN IF NOT EXISTS belasting_per_jaar   NUMERIC(10,2);
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS lat                  NUMERIC(10,6);
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS lng                  NUMERIC(10,6);
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS regio                TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS adres                TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS oppervlakte_m2       INTEGER;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS perceel_m2           INTEGER;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS kamers               INTEGER;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS slaapkamers          INTEGER;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS badkamers            INTEGER;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS bouwjaar             INTEGER;

ALTER TABLE woningen ADD COLUMN IF NOT EXISTS fotos                TEXT[];
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS plattegronden        TEXT[];
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS hoofdfoto            TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS professionele_fotos  BOOLEAN DEFAULT false;

ALTER TABLE woningen ADD COLUMN IF NOT EXISTS verkoper_naam        TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS verkoper_email       TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS verkoper_telefoon    TEXT;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS verkoper_is_makelaar BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS makelaar_bedrijf     TEXT;

ALTER TABLE woningen ADD COLUMN IF NOT EXISTS status               TEXT DEFAULT 'concept';
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS betaald              BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS gesponsord           BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS demo                 BOOLEAN DEFAULT false;
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS user_id              UUID REFERENCES auth.users(id);
ALTER TABLE woningen ADD COLUMN IF NOT EXISTS updated_at           TIMESTAMPTZ DEFAULT now();


-- ============================================================
-- STAP 2 — Cache verversen, drie methodes achter elkaar
-- ============================================================
-- Methode 1: het standaard signaal.
NOTIFY pgrst, 'reload schema';

-- Methode 2: hetzelfde signaal via de functievorm. Werkt soms
-- wel waar de NOTIFY-vorm niets doet.
SELECT pg_notify('pgrst', 'reload schema');

-- Methode 3: een echte schemawijziging. PostgREST ververst zijn
-- cache ook bij DDL-events, en een COMMENT telt als DDL. Dit is
-- de methode die het vaakst werkt als de eerste twee niets doen.
COMMENT ON TABLE woningen IS 'Obrov woningaanbod';
NOTIFY pgrst, 'reload schema';


-- ============================================================
-- STAP 3 — Controle
-- ============================================================
-- Deze query telt hoeveel van de verwachte kolommen bestaan.
-- Uitkomst 51 van 51 betekent: database in orde. Blijft de fout
-- daarna komen, dan is het puur de cache en moet je het project
-- herstarten via Settings, General, Restart project.
SELECT
  count(*) FILTER (WHERE aanwezig) AS gevonden,
  count(*)                          AS verwacht,
  CASE
    WHEN count(*) FILTER (WHERE aanwezig) = count(*)
    THEN 'Alle kolommen bestaan. Komt de fout terug, herstart dan het project via Settings > General > Restart project.'
    ELSE 'Er ontbreken nog kolommen, zie de lijst hieronder.'
  END AS conclusie
FROM (
  SELECT k.naam,
         EXISTS (
           SELECT 1 FROM information_schema.columns c
            WHERE c.table_name = 'woningen'
              AND c.column_name = k.naam
         ) AS aanwezig
    FROM unnest(ARRAY[
      'id','created_at','updated_at','user_id','type','stad','regio','adres',
      'lat','lng','vraagprijs','belasting_per_jaar','oppervlakte_m2','perceel_m2',
      'kamers','slaapkamers','badkamers','bouwjaar',
      'omschrijving_nl','omschrijving_en','omschrijving_de','omschrijving_cg',
      'zeezicht','bergzicht','rivierzicht','tuin','terras','zwembad','garage',
      'airco','verwarming','lift','kelder','gemeubileerd',
      'water','elektriciteit','riolering','geasfalteerde_weg',
      'legale_grond','papieren_orde','vergunning_aanwezig',
      'nieuwbouw','bestaande_bouw','renovatie_nodig',
      'fotos','plattegronden','hoofdfoto',
      'verkoper_naam','verkoper_email','verkoper_telefoon','makelaar_bedrijf'
    ]) AS k(naam)
) t;


-- Eventueel ontbrekende kolommen, expliciet benoemd.
SELECT k.naam AS ontbrekende_kolom
  FROM unnest(ARRAY[
    'id','created_at','updated_at','user_id','type','stad','regio','adres',
    'lat','lng','vraagprijs','belasting_per_jaar','oppervlakte_m2','perceel_m2',
    'kamers','slaapkamers','badkamers','bouwjaar',
    'omschrijving_nl','omschrijving_en','omschrijving_de','omschrijving_cg',
    'zeezicht','bergzicht','rivierzicht','tuin','terras','zwembad','garage',
    'airco','verwarming','lift','kelder','gemeubileerd',
    'water','elektriciteit','riolering','geasfalteerde_weg',
    'legale_grond','papieren_orde','vergunning_aanwezig',
    'nieuwbouw','bestaande_bouw','renovatie_nodig',
    'fotos','plattegronden','hoofdfoto',
    'verkoper_naam','verkoper_email','verkoper_telefoon','makelaar_bedrijf'
  ]) AS k(naam)
 WHERE NOT EXISTS (
   SELECT 1 FROM information_schema.columns c
    WHERE c.table_name = 'woningen'
      AND c.column_name = k.naam
 );
