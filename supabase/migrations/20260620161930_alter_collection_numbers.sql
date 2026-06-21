-- 1. TRIM WHITE SPACES FROM ALL TEXT FIELDS
-- The 'coalesce' ensures that if the field is null, it remains null without breaking the update.
UPDATE public.cars
SET 
  model_name = TRIM(model_name),
  model_code = TRIM(model_code),
  color = TRIM(color),
  image_url = TRIM(image_url),
  series_title = TRIM(series_title),
  in_year_collection_number = TRIM(in_year_collection_number),
  in_series_collection_number = TRIM(in_series_collection_number);

-- 2. CREATE NEW COLUMNS
ALTER TABLE public.cars 
  ADD COLUMN year_collection_number integer NULL,
  ADD COLUMN year_collection_total integer NULL,
  ADD COLUMN series_collection_number integer NULL,
  ADD COLUMN series_collection_total integer NULL;

-- 3. MIGRATE EXISTING DATA (Separating the text by '/')
-- 'split_part' to get the text before and after the slash and convert it to an integer.
-- The 'NULLIF' handles cases where the field might be empty or lack the slash.
UPDATE public.cars
SET 
  year_collection_number = CASE 
    WHEN in_year_collection_number LIKE '%/%' THEN NULLIF(split_part(in_year_collection_number, '/', 1), '')::integer
    ELSE NULL
  END,
  year_collection_total = CASE 
    WHEN in_year_collection_number LIKE '%/%' THEN NULLIF(split_part(in_year_collection_number, '/', 2), '')::integer
    ELSE NULL
  END,
  series_collection_number = CASE 
    WHEN in_series_collection_number LIKE '%/%' THEN NULLIF(split_part(in_series_collection_number, '/', 1), '')::integer
    ELSE NULL
  END,
  series_collection_total = CASE 
    WHEN in_series_collection_number LIKE '%/%' THEN NULLIF(split_part(in_series_collection_number, '/', 2), '')::integer
    ELSE NULL
  END;

-- 4. ADD VALIDATION RULES (CONSTRAINTS)
-- Ensures the annual number is between 1 and 300
ALTER TABLE public.cars 
  ADD CONSTRAINT chk_year_collection_number CHECK (year_collection_number >= 1 AND year_collection_number <= 300),
  ADD CONSTRAINT chk_year_collection_total CHECK (year_collection_total >= 1 AND year_collection_total <= 300);

-- Ensures the series number is between 1 and 99
ALTER TABLE public.cars 
  ADD CONSTRAINT chk_series_collection_number CHECK (series_collection_number >= 1 AND series_collection_number <= 99),
  ADD CONSTRAINT chk_series_collection_total CHECK (series_collection_total >= 1 AND series_collection_total <= 99);

-- 5. REMOVE THE OLD COLUMNS
ALTER TABLE public.cars 
  DROP COLUMN in_year_collection_number,
  DROP COLUMN in_series_collection_number;