ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS credit_prefix text DEFAULT 'Build by',
  ADD COLUMN IF NOT EXISTS credit_link_label text DEFAULT 'Mulyawan',
  ADD COLUMN IF NOT EXISTS credit_link_url text DEFAULT 'https://mulyawan.biz.id',
  ADD COLUMN IF NOT EXISTS credit_suffix text DEFAULT '';

UPDATE public.site_settings
SET credit_prefix = COALESCE(credit_prefix, 'Build by'),
    credit_link_label = COALESCE(credit_link_label, 'Mulyawan'),
    credit_link_url = COALESCE(credit_link_url, 'https://mulyawan.biz.id')
WHERE id = 1;