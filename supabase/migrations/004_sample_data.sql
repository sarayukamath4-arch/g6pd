-- Insert sample substances
INSERT INTO public.substances (canonical_name, category, description) VALUES
-- Medications (High Risk)
('Primaquine', 'Medication', 'An antimalarial medication known to cause hemolysis in G6PD-deficient individuals'),
('Dapsone', 'Medication', 'An antibiotic used for leprosy and certain skin conditions, associated with oxidative stress'),
('Sulfonamides', 'Medication', 'A class of antibiotics that can trigger hemolytic episodes in susceptible individuals'),
('Nitrofurantoin', 'Medication', 'Antibiotic used for urinary tract infections, can cause hemolysis in G6PD deficiency'),
('Methylene Blue', 'Medication', 'Used to treat methemoglobinemia but can cause hemolysis in G6PD deficiency'),
('Chloramphenicol', 'Medication', 'Broad-spectrum antibiotic with potential hemolytic risk in G6PD deficiency'),
('Phenazopyridine', 'Medication', 'Urinary analgesic that can induce hemolysis in susceptible individuals'),

-- Medications (Low Risk/Context Dependent)
('Aspirin', 'Medication', 'Common pain reliever and anti-inflammatory; risk may depend on dose and individual sensitivity'),
('Ibuprofen', 'Medication', 'NSAID pain reliever; generally considered safe but caution advised at high doses'),
('Acetaminophen', 'Medication', 'Common pain and fever reducer; generally considered safe for G6PD deficiency'),
('Vitamin C (Ascorbic Acid)', 'Supplement', 'Antioxidant supplement; high doses may be problematic for some individuals'),
('Vitamin E', 'Supplement', 'Antioxidant supplement; generally considered safe in recommended amounts'),
('Vitamin K', 'Supplement', 'Important for blood clotting; generally safe for G6PD deficiency'),

-- Foods (High Risk)
('Fava Beans', 'Food', 'Broad beans known to cause favism in many G6PD-deficient individuals'),
('Bitter Melon', 'Food', 'May contain compounds that can trigger oxidative stress in susceptible individuals'),
('Legumes', 'Food', 'Various beans and peas; some may be problematic depending on individual sensitivity'),

-- Foods (Low Risk/Context Dependent)
('Citrus Fruits', 'Food', 'Oranges, lemons, grapefruits; generally safe but individual sensitivity varies'),
('Berries', 'Food', 'Strawberries, blueberries, raspberries; generally considered safe'),
('Leafy Greens', 'Food', 'Spinach, kale, lettuce; generally safe and nutritious'),
('Tomatoes', 'Food', 'Generally safe for most G6PD-deficient individuals'),
('Whole Grains', 'Food', 'Brown rice, quinoa, oats; generally safe and recommended'),

-- Chemicals (High Risk)
('Naphthalene', 'Chemical', 'Found in mothballs; can cause severe hemolysis through oxidative stress'),
('Henna', 'Chemical', 'Natural dye used in hair coloring; some preparations may pose risk'),
('Toluidine Blue', 'Chemical', 'Dye used in medical procedures; can trigger hemolysis'),
('Phenylhydrazine', 'Chemical', 'Industrial chemical with strong hemolytic properties'),

-- Chemicals (Low Risk/Context Dependent)
('Menthol', 'Chemical', 'Common in mint products; generally safe in typical amounts'),
('Sodium Benzoate', 'Chemical', 'Food preservative; generally considered safe in regulated amounts'),
('Citric Acid', 'Chemical', 'Common food additive; generally safe for G6PD deficiency'),
('Artificial Food Colors', 'Chemical', 'Various food dyes; generally safe but individual sensitivity varies')
ON CONFLICT (canonical_name) DO NOTHING;

-- Insert substance aliases
INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'Primaquine phosphate' FROM public.substances WHERE canonical_name = 'Primaquine'
ON CONFLICT (alias_name) DO NOTHING;

INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'Primaquine diphosphate' FROM public.substances WHERE canonical_name = 'Primaquine'
ON CONFLICT (alias_name) DO NOTHING;

INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'Diaminodiphenyl sulfone' FROM public.substances WHERE canonical_name = 'Dapsone'
ON CONFLICT (alias_name) DO NOTHING;

INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'DDS' FROM public.substances WHERE canonical_name = 'Dapsone'
ON CONFLICT (alias_name) DO NOTHING;

INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'Broad beans' FROM public.substances WHERE canonical_name = 'Fava Beans'
ON CONFLICT (alias_name) DO NOTHING;

INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'Faba beans' FROM public.substances WHERE canonical_name = 'Fava Beans'
ON CONFLICT (alias_name) DO NOTHING;

INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'Field beans' FROM public.substances WHERE canonical_name = 'Fava Beans'
ON CONFLICT (alias_name) DO NOTHING;

INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'Vicia faba' FROM public.substances WHERE canonical_name = 'Fava Beans'
ON CONFLICT (alias_name) DO NOTHING;

INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'Acetylsalicylic acid' FROM public.substances WHERE canonical_name = 'Aspirin'
ON CONFLICT (alias_name) DO NOTHING;

INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'ASA' FROM public.substances WHERE canonical_name = 'Aspirin'
ON CONFLICT (alias_name) DO NOTHING;

INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'Ascorbic acid' FROM public.substances WHERE canonical_name = 'Vitamin C (Ascorbic Acid)'
ON CONFLICT (alias_name) DO NOTHING;

INSERT INTO public.substance_aliases (substance_id, alias_name)
SELECT id, 'Ascorbate' FROM public.substances WHERE canonical_name = 'Vitamin C (Ascorbic Acid)'
ON CONFLICT (alias_name) DO NOTHING;

-- Insert clinical evidence
INSERT INTO public.condition_evidence (substance_id, evidence_level, clinical_summary, source_citation)
SELECT 
  s.id,
  CASE 
    WHEN s.canonical_name IN ('Primaquine', 'Dapsone', 'Sulfonamides', 'Nitrofurantoin', 'Methylene Blue', 'Chloramphenicol', 'Phenazopyridine', 'Fava Beans', 'Bitter Melon', 'Naphthalene', 'Henna', 'Toluidine Blue', 'Phenylhydrazine') 
    THEN 'High Risk'
    WHEN s.canonical_name IN ('Aspirin', 'Ibuprofen', 'Vitamin C (Ascorbic Acid)', 'Legumes', 'Citrus Fruits', 'Menthol') 
    THEN 'Low Risk'
    ELSE 'No Documented Relation'
  END,
  CASE 
    WHEN s.canonical_name = 'Primaquine' THEN 'Primaquine is well-documented to cause acute hemolytic anemia in G6PD-deficient individuals. Avoidance is generally recommended.'
    WHEN s.canonical_name = 'Dapsone' THEN 'Dapsone can induce hemolysis in G6PD deficiency. Regular blood monitoring is recommended if use is medically necessary.'
    WHEN s.canonical_name = 'Fava Beans' THEN 'Fava beans (favism) are a classic trigger for hemolysis in G6PD deficiency, particularly in Mediterranean variants.'
    WHEN s.canonical_name = 'Aspirin' THEN 'Evidence varies; low doses may be tolerated, but high doses or individual sensitivity may cause issues.'
    WHEN s.canonical_name = 'Vitamin C (Ascorbic Acid)' THEN 'Generally safe at normal doses, but very high doses may cause oxidative stress in susceptible individuals.'
    ELSE 'Limited or conflicting evidence. Individual sensitivity varies. Consult healthcare provider for personalized guidance.'
  END,
  'General medical literature and clinical guidelines for G6PD deficiency management'
FROM public.substances s
ON CONFLICT DO NOTHING;