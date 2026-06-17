-- Update default brand values
ALTER TABLE public.site_settings
  ALTER COLUMN site_name SET DEFAULT 'RSLink - SMA RIYADHUSSHOLIHIIN',
  ALTER COLUMN copyright_text SET DEFAULT '© RSLink - SMA RIYADHUSSHOLIHIIN';

-- Refresh existing row if it still uses the old brand
UPDATE public.site_settings
SET
  site_name = 'RSLink - SMA RIYADHUSSHOLIHIIN',
  copyright_text = COALESCE(NULLIF(copyright_text, '© RSLink by Mulyawan'), '© RSLink - SMA RIYADHUSSHOLIHIIN')
WHERE id = 1 AND site_name = 'RSLink by Mulyawan';