// Comprehensive DMLT 1st Year Syllabus Knowledge Base & Offline Fallback Library

export interface KnowledgeTopic {
  keywords: string[];
  title: string;
  subject: string;
  response: string;
}

export const DMLT_KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    keywords: ['rbc', 'red blood cell', 'erythrocyte', 'erythrocytes', 'rbc count'],
    title: 'RBC (Red Blood Cells / Erythrocytes)',
    subject: 'Hematology and Blood Banking',
    response: `**1. Simple Meaning:**
RBCs (Red Blood Cells ya Erythrocytes) circular, biconcave disc shape ki non-nucleated cells hoti hain jo blood me oxygen aur nutrients ko pure body tissues tak carry karti hain.

**2. Detailed Explanation:**
- **Life Span:** 120 Days in humans.
- **Production (Erythropoiesis):** Red bone marrow me banti hain (regulated by Erythropoietin hormone released by kidneys).
- **Destruction:** Spleen me breakdown hota hai (isliye Spleen ko "Graveyard of RBC" kaha jata hai).
- **Shape:** Non-nucleated biconcave disc (surface area maximize karne aur capillaries se flexible flow ke liye).
- **Diluting Fluid Used in Lab:** Hayem's fluid or Gower's fluid (dilution 1:200).

**3. Normal Values:**
- **Adult Male:** 4.5 – 5.5 million / mm³ (μL)
- **Adult Female:** 4.0 – 5.0 million / mm³ (μL)
- **Newborn:** 6.0 – 7.0 million / mm³

**4. Clinical Significance:**
- **Anemia (Low RBC count):** Caused by iron deficiency, blood loss, or bone marrow depression.
- **Polycythemia (High RBC count):** Seen in hypoxia, high altitudes, or Polycythemia vera.

*Tip: Verify all normal ranges with your college's standard lab manual.*`,
  },
  {
    keywords: ['hb', 'hemoglobin', 'haemoglobin', 'sahli', 'acid hematin', 'cyanmethemoglobin'],
    title: 'Hemoglobin Estimation & Sahli Method',
    subject: 'Hematology and Blood Banking',
    response: `**1. Simple Meaning:**
Hemoglobin (Hb) RBC ke andar paya jane wala iron-containing respiratory pigment hai jo Lungs se O₂ bind karke tissues tak transport karta hai.

**2. Detailed Explanation & Sahli's Method:**
- **Principle:** Blood ko N/10 Hydrochloric Acid (HCl) ke sath mix karte hain, jisse Hemoglobin convert ho jata hai brown-colored **Acid Hematin** me. Phir use standard comparator tube ke brown glass standard ke sath distilled water daal-daal kar match kiya jata hai.
- **Time for reaction:** 10 minutes for complete color development.
- **Diluting fluid:** N/10 HCl (0.1 N HCl).
- **Gold Standard Method:** Drabkin's Cyanmethemoglobin method (read at 540 nm on spectrophotometer).

**3. Normal Ranges:**
- **Adult Males:** 13.0 – 17.0 g/dL
- **Adult Females:** 12.0 – 15.0 g/dL
- **Infants / Newborns:** 14.0 – 20.0 g/dL

**4. Clinical Significance:**
- Low Hb: Iron deficiency anemia, Thalassemia, hemorrhage.
- High Hb: Dehydration, congenital heart disease, polycythemia.`,
  },
  {
    keywords: ['wbc', 'white blood cell', 'leukocyte', 'tlc', 'dlc', 'differential', 'neutrophil', 'lymphocyte'],
    title: 'WBC (Leukocytes), TLC & DLC',
    subject: 'Hematology and Blood Banking',
    response: `**1. Simple Meaning:**
WBCs (White Blood Cells) hamari body ke defense cells hote hain jo infection, bacteria, viruses aur foreign invaders se protect karte hain (Immune system).

**2. Types & DLC (Differential Leukocyte Count):**
- **Granulocytes:**
  1. **Neutrophils (40–70%):** First line of defense against bacterial infections, phagocytosis.
  2. **Eosinophils (1–6%):** Allergy, parasitic infections, asthma me increase hote hain.
  3. **Basophils (0–1%):** Release histamine and heparin during allergic reactions.
- **Agranulocytes:**
  4. **Lymphocytes (20–40%):** Viral infections and immune antibody production (B & T cells).
  5. **Monocytes (2–8%):** Largest blood cells, mature into tissue macrophages.

**3. Total Leukocyte Count (TLC):**
- **Normal Range:** 4,000 – 11,000 / mm³ (μL).
- **Diluting Fluid:** Turk's fluid (contains 1% Glacial acetic acid + Gentian violet).
- **Dilution:** 1:20 using WBC pipette or bulb tube.

**4. Clinical Significance:**
- **Leukocytosis (>11,000):** Bacterial infection, leukemia, appendicitis.
- **Leukopenia (<4,000):** Typhoid, viral fever (Dengue), bone marrow failure.`,
  },
  {
    keywords: ['platelet', 'platelets', 'thrombocyte', 'thrombocytes', 'bleeding time', 'clotting time'],
    title: 'Platelets (Thrombocytes) & Hemostasis',
    subject: 'Hematology and Blood Banking',
    response: `**1. Simple Meaning:**
Platelets (Thrombocytes) bone marrow ke Megakaryocytes se banne wale chhote non-nucleated fragments hote hain jo blood clotting (coagulation) me primary role play karte hain.

**2. Laboratory Characteristics:**
- **Life Span:** 7 – 10 days.
- **Normal Count:** 1.5 – 4.5 Lakh / mm³ (150,000 – 450,000 / μL).
- **Diluting Fluid:** 1% Ammonium Oxalate (Rees-Ecker fluid).
- **Counting Chamber:** Improved Neubauer Chamber under 40x objective.

**3. Bleeding Time (BT) & Clotting Time (CT):**
- **Bleeding Time (Duke's method):** 1 – 5 minutes (tests platelet plug formation & capillary integrity).
- **Clotting Time (Lee-White method):** 4 – 9 minutes (tests intrinsic coagulation cascade).

**4. Clinical Significance:**
- **Thrombocytopenia (<150,000):** Dengue fever, ITP, Aplastic anemia (risk of spontaneous bleeding, petechiae).
- **Thrombocytosis (>450,000):** Splenectomy, chronic inflammation, essential thrombocythemia.`,
  },
  {
    keywords: ['blood group', 'blood grouping', 'abo', 'rh', 'cross match', 'landsteiner', 'antigen', 'antibody'],
    title: 'ABO & Rh Blood Grouping System',
    subject: 'Hematology and Blood Banking',
    response: `**1. Simple Meaning:**
RBCs ke surface par maujood carbohydrate antigens (A and B) aur serum me antibodies (anti-A and anti-B) ke basis par human blood ko 4 major groups me classify kiya jata hai.

**2. Landsteiner's Law:**
- Agar RBC par specific antigen present hai, to corresponding antibody serum me ABSENT hogi.
- Agar RBC par antigen ABSENT hai, to corresponding antibody serum me PRESENT hogi.

**3. The 4 Major Blood Groups:**
- **Group A:** Antigen A on RBC, Anti-B in plasma.
- **Group B:** Antigen B on RBC, Anti-A in plasma.
- **Group AB (Universal Recipient):** Both A & B antigens, NO antibodies.
- **Group O (Universal Donor):** NO A or B antigens, BOTH Anti-A & Anti-B in plasma.

**4. Rh System & Cross-matching:**
- **Rh Positive:** D Antigen present on RBCs (~85% population).
- **Rh Negative:** D Antigen absent.
- **Major Cross-match:** Donor's RBCs + Recipient's Serum (Most Critical!).
- **Minor Cross-match:** Donor's Serum + Recipient's RBCs.`,
  },
  {
    keywords: ['esr', 'erythrocyte sedimentation rate', 'westergren', 'wintrobe'],
    title: 'Erythrocyte Sedimentation Rate (ESR)',
    subject: 'Hematology and Blood Banking',
    response: `**1. Simple Meaning:**
ESR (Erythrocyte Sedimentation Rate) measure karta hai ki anticoagulated blood me RBCs 1 hour me vertically kitna settle (sediment) hoti hain. Yeh nonspecific indicator of inflammation hai.

**2. Methods & Tubes:**
- **Westergren Method (Recommended by ICSH):**
  - Tube length: 300 mm, bore: 2.5 mm, graduated 0 to 200 mm.
  - Anticoagulant: 3.8% Trisodium Citrate (Ratio 1:4; 1 part citrate + 4 parts blood).
- **Wintrobe Method:**
  - Tube length: 110 mm, graduated 0 to 100 mm in both directions.
  - Anticoagulant: EDTA or Double Oxalate.

**3. Stages of ESR:**
1. Rouleaux Formation (first 10 min)
2. Sinking / Rapid Settling (next 40 min)
3. Packing stage (final 10 min)

**4. Normal Values (Westergren at 1 hour):**
- **Male:** 0 – 15 mm / 1st hr
- **Female:** 0 – 20 mm / 1st hr

**5. Clinical Significance:**
- Elevated ESR: Tuberculosis, Rheumatic arthritis, Multiple Myeloma, Pregnancy, Systemic Infections.`,
  },
  {
    keywords: ['anticoagulant', 'edta', 'heparin', 'sodium fluoride', 'citrate', 'double oxalate'],
    title: 'Laboratory Anticoagulants & Vials',
    subject: 'Hematology and Blood Banking',
    response: `**1. Simple Meaning:**
Anticoagulants aise chemical agents hote hain jo blood sample ko lab testing ke dauran clot hone (coagulation) se rokte hain.

**2. Key Anticoagulants in DMLT:**
- **EDTA (Ethylene Diamine Tetra-acetic Acid):**
  - Purple/Lavender Top tube.
  - Mechanism: Chelates ionized Calcium (Ca²⁺).
  - Use: Routine CBC, Blood smears, Hb, DLC (preserves cell morphology best).
- **Sodium Citrate:**
  - Light Blue Top (1:9 ratio) for Coagulation tests (PT/INR, APTT).
  - Black Top (1:4 ratio) for Westergren ESR.
  - Mechanism: Binds Calcium into insoluble complex.
- **Sodium Fluoride + Potassium Oxalate:**
  - Grey Top tube.
  - Mechanism: Inhibits enolase enzyme to prevent glycolysis (glucose breakdown).
  - Use: Blood Glucose / Sugar estimation.
- **Heparin (Lithium or Sodium):**
  - Green Top tube.
  - Mechanism: Enhances Antithrombin III activity.
  - Use: Blood gas analysis (ABG), osmotic fragility test.`,
  },
  {
    keywords: ['urine', 'urine analysis', 'benedict', 'albumin', 'sugar', 'microscopic examination', 'casts'],
    title: 'Clinical Urine Examination',
    subject: 'Clinical Pathology',
    response: `**1. Examination Components:**
1. **Physical Examination:**
   - Volume: Normal 1000 – 1500 mL / 24 hrs.
   - Color: Pale yellow / Amber (due to Urochrome pigment).
   - Specific Gravity: 1.010 – 1.025 (tested with Urinometer or Refractometer).
   - pH: 4.5 – 8.0 (Average 6.0, slightly acidic).
2. **Chemical Examination:**
   - **Protein / Albumin:** Heat & Acetic Acid test or 20% Sulfosalicylic Acid test.
   - **Reducing Sugars (Glucose):** Benedict's Qualitative Test (Blue → Green → Yellow → Brick Red precipitate based on sugar concentration).
   - **Ketone Bodies:** Rothera's Nitroprusside Test (Purple ring indicates positive).
   - **Bile Salts:** Hay's Sulfur powder test.
   - **Bile Pigments:** Fouchet's Test (Green color on filter paper).
3. **Microscopic Examination of Centrifuged Deposit:**
   - Cells: Pus cells (leukocytes), RBCs, Epithelial cells.
   - Casts: Hyaline casts, Granular casts, RBC casts, WBC casts.
   - Crystals: Calcium oxalate (envelope shape), Uric acid (diamond shape), Triple phosphate.`,
  },
  {
    keywords: ['microscope', 'compound microscope', 'objective', 'eyepiece', 'oil immersion', 'magnification'],
    title: 'Compound Microscope Principles & Care',
    subject: 'MLT Instruments Practice Lab - 1',
    response: `**1. Simple Meaning:**
Compound Microscope optical lenses ka system use karta hai jisse minute microorganisms, blood cells, aur tissue structures ko magnify karke visualize kiya jata hai.

**2. Key Parts & Functions:**
- **Eyepiece (Ocular lens):** Usually 10x magnification.
- **Objective Lenses:**
  - 10x: Low power (field scanning, WBC counting chamber layout).
  - 40x: High dry power (urine deposits, parasitic ova/cysts).
  - 100x: Oil immersion (blood smears, bacteria, DLC counting).
- **Total Magnification Formula:** Eyepiece Magnification × Objective Magnification (e.g. 10 × 100 = 1000x).
- **Condenser & Iris Diaphragm:** Focuses light rays onto the specimen stage and adjusts contrast.

**3. Oil Immersion Technique (100x):**
- Cedarwood oil or synthetic immersion oil (Refractive index ~1.51, same as glass slide).
- Eliminates refraction and light scattering at glass-air interface, maximizing numerical aperture and resolution.
- Never use xylene excessively; clean lenses gently with lens paper after every use.`,
  },
  {
    keywords: ['leishman', 'romanowsky', 'stain', 'blood smear', 'giemsa'],
    title: 'Peripheral Blood Smear & Leishman Staining',
    subject: 'Clinical Practical Training',
    response: `**1. Principle of Romanowsky Stains:**
Leishman stain is an alcohol-based Romanowsky stain containing two key dyes:
- **Methylene Blue (Basic Dye):** Stains acidic cellular components (nuclei, RNA) blue or purple.
- **Eosin (Acidic Dye):** Stains basic components (hemoglobin, eosinophil granules) pink or reddish-orange.

**2. Step-by-Step Procedure:**
1. Prepare a thin blood film with a smooth, tongue-shaped feathered edge.
2. Air dry the slide completely (do not heat fix!).
3. Place on staining rack, add 8–10 drops of Leishman stain for 1–2 minutes (Methyl alcohol fixes the cells).
4. Add double quantity (16–20 drops) of buffered distilled water (pH 6.8).
5. Mix gently by blowing through a pipette until a metallic scum/sheen forms on top.
6. Allow to stain for 8–10 minutes.
7. Wash with gentle stream of water, wipe the back of the slide, and dry vertically.

**3. Microscopic Appearance:**
- RBCs: Uniform salmon pink.
- Neutrophil nuclei: Deep violet/purple; Cytoplasm: pale pink with fine granules.
- Eosinophil granules: Bright orange-red.
- Lymphocyte nuclei: Dark purple; Cytoplasm: sky blue.`,
  },
];

export function findSyllabusKnowledge(query: string): KnowledgeTopic | null {
  const normalized = query.toLowerCase().trim();
  for (const topic of DMLT_KNOWLEDGE_TOPICS) {
    if (topic.keywords.some((kw) => normalized.includes(kw))) {
      return topic;
    }
  }
  return null;
}
