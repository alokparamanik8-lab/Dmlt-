export interface TopicStudyMaterial {
  title: string;
  explanation: string;
  keyPoints: string[];
  clinicalImportance: string;
  quickRevisionLine: string;
  normalValues?: string;
}

export const TOPIC_STUDY_DATA: Record<string, TopicStudyMaterial> = {
  // --- Communication Skills in English ---
  comm_1: {
    title: 'Basics of Communication & Phonetics in Medical Field',
    explanation: 'Communication in a diagnostic laboratory is the process of conveying accurate patient instructions, specimen collection guidance, and test results clearly without ambiguity. It includes verbal communication (clear voice, phonetics, polite tone) and non-verbal cues (eye contact, posture, professional demeanor).',
    keyPoints: [
      'Verbal communication involves clear medical pronunciation, avoiding technical jargon when explaining procedures to anxious patients.',
      'Non-verbal communication (empathy, attentive listening, posture) builds patient trust during phlebotomy and sampling.',
      'Active listening ensures correct patient identification (name, age, fasting status) before specimen collection.',
      'Barriers to communication include noise in busy OPDs, language barriers, hearing impairment, and emotional distress of patients.'
    ],
    clinicalImportance: 'Miscommunication during specimen intake or patient identification is a leading cause of pre-analytical laboratory errors (e.g., mislabeled tubes, non-fasting glucose samples).',
    quickRevisionLine: 'Clear communication and active verification prevent 90% of pre-analytical laboratory specimen identification errors.'
  },
  comm_2: {
    title: 'Medical Terminology, Roots, Prefixes & Suffixes',
    explanation: 'Medical terminology is the standardized universal language of healthcare. Most medical words originate from Greek or Latin and are constructed using word roots (core meaning), prefixes (modifies location, time, or status), and suffixes (indicates condition, disease, or diagnostic test).',
    keyPoints: [
      'Prefix examples: Hemo- / Hemato- (blood), Leuko- (white), Erythro- (red), Thromb- (clot), Hyper- (increased), Hypo- (decreased).',
      'Suffix examples: -emia (blood condition), -penia (deficiency/decrease), -cytosis (increase in cells), -itis (inflammation), -pathy (disease).',
      'Root examples: Cyt- (cell), Hepat- (liver), Nephr- / Ren- (kidney), Glyc- (sugar/glucose), Path- (disease).',
      'Combining forms: Erythrocyte = red + cell; Leukopenia = decrease in white blood cells; Thrombocytopenia = low platelets.'
    ],
    clinicalImportance: 'Correct interpretation of medical terms enables technologists to correlate test requisitions with appropriate test tubes, anticoagulants, and urgency (STAT vs routine).',
    quickRevisionLine: 'Root = organ/cell; Prefix = condition/quantity; Suffix = disease or test type.'
  },
  comm_3: {
    title: 'Laboratory Record Keeping & Test Report Writing',
    explanation: 'A diagnostic report is a legal medical document that directly dictates patient diagnosis and treatment. Proper record keeping encompasses accession registers, digital Laboratory Information System (LIS) entries, internal quality control logs, and standardized report generation.',
    keyPoints: [
      'Every lab report must include patient demographics (Name, Age, Sex, OPD/IPD number, Bed number), Referring Doctor, Date & Time of collection, and Reporting time.',
      'Results must be reported alongside standardized reference intervals (normal ranges) and measurement units (e.g., g/dL, mg/dL, /cu.mm).',
      'Critical Values (panic values) such as Blood Glucose <45 mg/dL or Platelet <20,000/µL must be phoned immediately to the clinician and documented in a Critical Call Logbook.',
      'Any error in paper records must be struck out with a single horizontal line, corrected, dated, and signed. Never use correction fluid (whiteout).'
    ],
    clinicalImportance: 'Clear, accurate reports safeguard clinical decision-making and serve as crucial medico-legal documentation during audits or court proceedings.',
    quickRevisionLine: 'Document immediately, cross-check reference ranges, and report critical panic values without delay.'
  },
  comm_4: {
    title: 'Professional Workplace Etiquette & Presentation',
    explanation: 'Professional etiquette in a clinical diagnostic lab entails adherence to standard operating procedures (SOPs), personal protective equipment (PPE) compliance, ethical handling of patient information, and respectful inter-professional teamwork.',
    keyPoints: [
      'Patient confidentiality: Test results (especially HIV, Hepatitis, biopsy) must never be disclosed to unauthorized third parties or discussed publicly.',
      'Informed consent: Briefly explain the phlebotomy procedure to the patient before drawing blood; respect their dignity and comfort.',
      'Professional attire: Clean laboratory coat, closed-toe footwear, hair tied back, and appropriate gloves/PPE at all bench stations.',
      'Inter-professional teamwork: Courteous communication with nursing staff, resident doctors, and fellow technologists ensures smooth emergency care.'
    ],
    clinicalImportance: 'Maintaining confidentiality and high ethical standards builds institutional reputation and protects patient rights under healthcare regulations.',
    quickRevisionLine: 'Confidentiality, patient dignity, and PPE compliance are the core pillars of lab professionalism.'
  },

  // --- Computer Application ---
  comp_1: {
    title: 'Introduction to Computers & Operating Systems',
    explanation: 'Computers are indispensable in the modern clinical pathology laboratory for operating automated analyzers, capturing detector data, calculating calibration curves, and transmitting test results to hospital networks.',
    keyPoints: [
      'Hardware consists of CPU (Central Processing Unit), RAM (Random Access Memory), motherboard, storage drives, and input/output interfaces.',
      'Peripherals in labs include barcode laser scanners, thermal label printers, analyzer RS-232 serial/Ethernet cables, and uninterrupted power supply (UPS) units.',
      'Operating systems (Windows, Linux) manage hardware resources, file systems, device drivers, and secure access permissions.',
      'Regular backups of patient databases and calibration data to encrypted network servers prevent catastrophic data loss.'
    ],
    clinicalImportance: 'Failure of lab computing hardware halts automated analyzers and prevents emergency test reporting in intensive care and trauma units.',
    quickRevisionLine: 'Computers interface analyzers with databases; reliable hardware and regular backups ensure uninterrupted 24/7 lab reporting.'
  },
  comp_2: {
    title: 'MS Word for Laboratory Report & Documentation',
    explanation: 'Word processing software is widely used in hospital laboratories for designing Standard Operating Procedures (SOPs), safety incident manuals, histology descriptive grossing reports, and standardized diagnostic test templates.',
    keyPoints: [
      'Creation of standard header containing hospital accreditation logo (NABL/NABH), hospital name, and contact details.',
      'Tabular layouts allow side-by-side alignment of Test Name, Observed Value, Reference Range, and Flagging (High/Low).',
      'Header & Footer management ensures consistent page numbering (e.g., "Page 1 of 2") and laboratory director electronic signatures.',
      'Exporting documents to non-editable PDF format prevents unauthorized post-release tampering of diagnostic values.'
    ],
    clinicalImportance: 'Uniform, clean document layouts reduce reading errors by physicians and establish laboratory credibility.',
    quickRevisionLine: 'Standardized tables, reference ranges, and password-protected PDF exports maintain report integrity.'
  },
  comp_3: {
    title: 'MS Excel for Lab Calculations & QC Levey-Jennings Charts',
    explanation: 'Spreadsheets are fundamental tools for statistical quality control in diagnostic laboratories. Technologists use formulas to compute daily control mean, standard deviation (SD), coefficient of variation (CV%), and plot Levey-Jennings (L-J) charts to detect analytical errors.',
    keyPoints: [
      'Mean (Average) formula: =AVERAGE(range); measures central tendency of daily QC runs.',
      'Standard Deviation (SD): =STDEV.S(range); measures the analytical dispersion or precision of test runs.',
      'Coefficient of Variation: CV% = (SD / Mean) × 100; lower CV indicates higher laboratory analytical precision.',
      'Levey-Jennings (L-J) charts plot daily control values against the Mean, ±1SD, ±2SD, and ±3SD limit lines to evaluate Westgard rules.'
    ],
    clinicalImportance: 'Excel-driven QC analysis allows rapid identification of systematic errors (calibration shift) and random errors before patient samples are released.',
    quickRevisionLine: 'Mean = accuracy benchmark; SD = precision spread; L-J Chart = visual monitor of daily analyzer consistency.'
  },
  comp_4: {
    title: 'Laboratory Information Systems (LIS) & Barcoding',
    explanation: 'A Laboratory Information System (LIS) is a specialized healthcare software system that tracks patient specimens throughout the pre-analytical, analytical, and post-analytical phases of testing.',
    keyPoints: [
      'Sample Accessioning: Generates a unique barcode accession number for each patient tube upon sample arrival.',
      'Barcoding eliminates manual handwriting errors on specimen tubes and enables automated conveyor tube routing.',
      'Bi-directional Interface: The LIS sends test orders to the automated analyzer, and the analyzer automatically transmits verified numerical results back to LIS.',
      'Audit Trail: Tracks which technologist processed the sample, validation timestamp, and any revisions made.'
    ],
    clinicalImportance: 'Bi-directional LIS with barcode scanners reduces sample mix-up incidents to near zero and drastically cuts laboratory turnaround time (TAT).',
    quickRevisionLine: 'Barcodes uniquely identify samples; bi-directional LIS automates order transfer and error-free result capture.'
  },

  // --- Anatomy and Physiology ---
  anat_1: {
    title: 'The Cell & Basic Primary Tissues of the Body',
    explanation: 'The cell is the basic structural, functional, and biological unit of all living organisms. In medical laboratory technology, cellular morphology, organelle function, and tissue classification form the foundation for cytology and histopathology.',
    keyPoints: [
      'Cell Membrane: Phospholipid bilayer containing transport proteins, ion channels, and antigen markers (e.g., ABO blood antigens, CD markers).',
      'Nucleus: Houses genetic material (DNA); nucleolus synthesizes ribosomal RNA. Nuclear-to-cytoplasmic (N:C) ratio is a key marker for malignancy.',
      'Mitochondria: Generates ATP via oxidative phosphorylation; abundant in metabolically active cells (hepatocytes, renal tubular cells).',
      'Four Primary Tissues: 1) Epithelial (lining & glandular), 2) Connective (blood, bone, cartilage, adipose), 3) Muscle (skeletal, cardiac, smooth), 4) Nervous (neurons, glial cells).'
    ],
    clinicalImportance: 'Alterations in cellular morphology (dysplasia, hyperplasia, karyorrhexis) guide cytotechnologists and pathologists in cancer detection.',
    quickRevisionLine: 'High N:C ratio and hyperchromatic nuclei are classic cytological hallmarks of neoplastic transformation.'
  },
  anat_2: {
    title: 'Skeletal & Muscular Systems Overview',
    explanation: 'The skeletal system provides structural framework, protects vital internal organs, acts as calcium/phosphate reservoir, and houses red bone marrow (the site of hematopoiesis). The muscular system provides locomotion and heat generation.',
    keyPoints: [
      'The adult human skeleton comprises 206 bones divided into Axial (skull, vertebral column, thoracic cage) and Appendicular (limbs, girdles).',
      'Bone Marrow: Red marrow in sternum, iliac crest, and ribs produces blood cells; yellow marrow contains primarily adipose tissue.',
      'Laboratory Bone Marrow Aspiration: The posterior superior iliac spine (PSIS) or sternum is aspirated for hematological diagnosis (leukemia, aplastic anemia).',
      'Muscular enzymes: Creatine Kinase (CK-MM), AST, and LDH rise in serum following muscle trauma, rhabdomyolysis, or dystrophy.'
    ],
    clinicalImportance: 'Serum calcium, phosphorus, alkaline phosphatase (ALP), and bone marrow examinations are essential lab tests evaluating skeletal and hematopoietic disorders.',
    quickRevisionLine: 'Red bone marrow in axial bones is the primary site of adult blood cell formation (hematopoiesis).'
  },
  anat_3: {
    title: 'Circulatory & Cardiovascular System',
    explanation: 'The cardiovascular system consists of the muscular four-chambered heart and blood vessels (arteries, capillaries, veins) that circulate blood throughout the body, supplying oxygen and nutrients while removing metabolic wastes.',
    keyPoints: [
      'Heart Chambers: Right atrium & ventricle (deoxygenated venous blood to lungs via pulmonary artery); Left atrium & ventricle (oxygenated blood to body via aorta).',
      'Cardiac Valves: Tricuspid & Mitral (atrioventricular); Pulmonary & Aortic (semilunar); prevent retrograde blood flow.',
      'Phlebotomy Anatomy: Median cubital vein in the antecubital fossa is the first choice for venipuncture due to stability and lower nerve proximity.',
      'Cardiac Biomarkers: Troponin-I/T and CK-MB are tested urgently in serum to diagnose Acute Myocardial Infarction (heart attack).'
    ],
    clinicalImportance: 'Knowledge of antecubital vascular anatomy prevents arterial puncture or hematoma formation during routine diagnostic blood collection.',
    quickRevisionLine: 'The median cubital vein in antecubital fossa is the safest and most prominent site for routine phlebotomy.'
  },
  anat_4: {
    title: 'Respiratory & Digestive Systems',
    explanation: 'The respiratory system conducts external gas exchange across alveolar-capillary membranes. The digestive system breaks down dietary macromolecules into absorbable nutrients, with the liver serving as the body\'s central biochemical processing organ.',
    keyPoints: [
      'Alveoli: Functional gas-exchange units surrounded by pulmonary capillaries; site of Arterial Blood Gas (ABG) oxygenation.',
      'Liver: Synthesizes albumin, coagulation factors (I, II, V, VII, IX, X), bile acids, and conjugates bilirubin.',
      'Digestive enzymes: Amylase and Lipase synthesized by pancreas; elevated in acute pancreatitis.',
      'Stomach: Parietal cells secrete HCl and intrinsic factor (necessary for terminal ileum absorption of Vitamin B12).'
    ],
    clinicalImportance: 'Liver Function Tests (Total Bilirubin, AST, ALT, Alkaline Phosphatase, Total Protein, Albumin) evaluate hepatocellular integrity and biliary excretion.',
    quickRevisionLine: 'Liver synthesizes all coagulation factors except Factor VIII; parietal cell intrinsic factor is required for Vitamin B12 absorption.'
  },
  anat_5: {
    title: 'Excretory (Renal) & Endocrine Systems',
    explanation: 'The renal excretory system filters blood, regulates acid-base balance, water-electrolyte equilibrium, and excretes nitrogenous waste products (urea, creatinine, uric acid). The endocrine system secretes hormones directly into circulation.',
    keyPoints: [
      'Nephron: Functional unit of kidney (~1 million per kidney); includes Glomerulus, Bowman\'s capsule, PCT, Loop of Henle, DCT, and Collecting Duct.',
      'Glomerular Filtration Rate (GFR): Standard normal is 90-120 mL/min/1.73m²; calculated using serum creatinine levels.',
      'Endocrine Glands: Thyroid (T3, T4, TSH), Adrenal (cortisol, aldosterone), Pancreas (insulin from beta cells, glucagon from alpha cells).',
      'Renal threshold for glucose: Blood glucose level of ~160-180 mg/dL, above which glucose appears in urine (glucosuria).'
    ],
    clinicalImportance: 'Renal function tests (Blood Urea Nitrogen, Serum Creatinine, eGFR, Microalbuminuria) are frontline tests for monitoring chronic kidney disease and diabetic nephropathy.',
    quickRevisionLine: 'Nephron filters blood at glomerulus; serum creatinine and eGFR are the gold standard monitors of renal clearance.'
  },

  // --- Hematology and Blood Banking ---
  hemat_1: {
    title: 'Composition of Blood & Anticoagulants (EDTA, Citrate, Heparin)',
    explanation: 'Whole blood consists of formed cellular elements (erythrocytes, leukocytes, thrombocytes) suspended in liquid plasma. To perform in-vitro hematological testing, specific chemical anticoagulants are added to prevent clot cascade activation.',
    keyPoints: [
      'Whole blood composition: ~55% Plasma (water, proteins, electrolytes) and ~45% Formed elements (cells).',
      'K2/K3 EDTA (Lavender top): Chelates ionized calcium (Ca2+); tube of choice for Complete Blood Count (CBC) and blood smears as it preserves cell morphology.',
      'Trisodium Citrate 3.2% (Light Blue top, 1:9 ratio): Binds calcium; standard tube for Coagulation tests (PT/INR, APTT). Also used at 1:4 ratio (Black top) for Westergren ESR.',
      'Sodium/Lithium Heparin (Green top): Enhances Antithrombin III; ideal for arterial blood gases (ABG), osmotic fragility test, and clinical chemistry.',
      'Sodium Fluoride + Potassium Oxalate (Grey top): Inhibits enolase enzyme (glycolysis inhibitor); preserves glucose for blood sugar testing.'
    ],
    clinicalImportance: 'Using the incorrect anticoagulant or improper blood-to-anticoagulant fill ratio causes in-vitro hemolysis, false platelet counts, or altered clotting times.',
    quickRevisionLine: 'Lavender = EDTA (CBC); Light Blue = 3.2% Citrate 1:9 (PT/APTT); Green = Heparin; Grey = Fluoride (Glucose).'
  },
  hemat_2: {
    title: 'Hemoglobin Estimation (Sahli’s & Cyanmethemoglobin Methods)',
    explanation: 'Hemoglobin estimation measures the oxygen-carrying protein capacity of erythrocytes. Sahli\'s acid hematin is a visual colorimetric method, while Drabkin\'s cyanmethemoglobin method is the internationally recognized spectrophotometric reference method.',
    keyPoints: [
      'Sahli\'s Method: 20 µL blood added to N/10 HCl in Sahli\'s graduated tube. Hemoglobin is converted to brown acid hematin. Wait exactly 10 minutes before diluting with distilled water to match the comparator box standard.',
      'Drabkin\'s Cyanmethemoglobin (HiCN) Method: Blood is mixed with Drabkin\'s reagent (containing Potassium Ferricyanide and Potassium Cyanide).',
      'Reaction: Hemoglobin is oxidized to methemoglobin by ferricyanide, which then reacts with cyanide to form stable cyanmethemoglobin.',
      'Spectrophotometry: Read absorbance at 540 nm (green filter) against a Drabkin\'s blank; calculation: (Absorbance test / Absorbance standard) × Standard Concentration.'
    ],
    clinicalImportance: 'Accurate hemoglobin estimation diagnoses anemia types, monitors internal hemorrhage, and determines donor eligibility before blood transfusion.',
    quickRevisionLine: 'Sahli uses N/10 HCl forming acid hematin at 10 min; Drabkin converts Hb to cyanmethemoglobin measured at 540 nm.'
  },
  hemat_3: {
    title: 'Total & Differential Leukocyte Counts (TLC & DLC)',
    explanation: 'Total Leukocyte Count (TLC) quantifies the total number of circulating white blood cells per cubic millimeter. Differential Leukocyte Count (DLC) determines the relative percentage of each specific WBC type (Neutrophils, Lymphocytes, Monocytes, Eosinophils, Basophils).',
    keyPoints: [
      'TLC Hemocytometer Method: Blood diluted 1:20 with Turk\'s diluting fluid (Glacial acetic acid lyses RBCs; Gentian violet stains WBC nuclei). Count in 4 corner large squares of Improved Neubauer chamber.',
      'TLC Formula: Total WBC (/cu.mm) = (Cells counted × Dilution factor 20) / (Area 4 sq.mm × Depth 0.1 mm) = Cells counted × 50.',
      'DLC Staining: Prepared on clean peripheral blood smear stained with Leishman\'s stain or Giemsa stain; 100 consecutive leukocytes counted under 100x oil immersion in the battlement/zigzag pattern.',
      'Normal Adult DLC: Neutrophils 40-75%, Lymphocytes 20-45%, Monocytes 2-8%, Eosinophils 1-6%, Basophils 0-1%.'
    ],
    clinicalImportance: 'Neutrophilia indicates acute bacterial infection; Lymphocytosis suggests viral infections or chronic lymphocytic leukemia; Eosinophilia points to allergic reactions or parasitic infestations.',
    quickRevisionLine: 'Turk fluid lyses RBCs and stains WBCs (TLC = N × 50); Leishman stain under oil immersion differentiates 100 WBCs.'
  },
  hemat_4: {
    title: 'Erythrocyte Sedimentation Rate (ESR - Westergren & Wintrobe)',
    explanation: 'ESR is a non-specific indicator of acute phase systemic inflammation. It measures the rate in millimeters per hour at which erythrocytes settle out of unclotted anticoagulated whole blood in a vertical tube.',
    keyPoints: [
      'Westergren Method (ICSH Reference): 3.2% Sodium citrate anticoagulant (1 part citrate to 4 parts blood). Westergren tube is 300 mm long, graduated 0 to 200 mm, internal bore 2.5 mm. Placed in vertical rack; read clear plasma meniscus at exactly 1 hour.',
      'Wintrobe Method: Uses EDTA whole blood. Tube is 115 mm long with double graduation (0-100 mm for ESR, 100-0 for Hematocrit/PCV). Filled using Wintrobe Pasteur pipette.',
      'Three Phases of ESR: 1) Rouleaux formation (first 10 min), 2) Rapid settling phase (next 40 min), 3) Packing phase (final 10 min).',
      'Factors increasing ESR: Elevated fibrinogen, immunoglobulins, acute infections, multiple myeloma, pregnancy, severe anemia. Factors decreasing ESR: Polycythemia, sickle cell disease, spherocytosis.'
    ],
    clinicalImportance: 'Markedly high ESR (>100 mm/hr) strongly suggests multiple myeloma, temporal arteritis, tuberculosis, or autoimmune connective tissue disorders.',
    quickRevisionLine: 'Westergren tube length is 300 mm with 1:4 citrate; elevated fibrinogen promotes rouleaux and accelerates settling.'
  },
  hemat_5: {
    title: 'Packed Cell Volume (PCV / Hematocrit) & Red Cell Indices',
    explanation: 'Packed Cell Volume (PCV) is the fraction of whole blood volume occupied by erythrocytes after maximal centrifugal packing. Red Cell Indices (MCV, MCH, MCHC) calculated from PCV, Hb, and RBC count classify anemias morphologically.',
    keyPoints: [
      'Microhematocrit Method: Capillary tube (plain blue or heparinized red) filled 2/3 with blood, sealed with clay, centrifuged at 12,000 rpm for 5 minutes in a microhematocrit centrifuge. Read on graphic reader.',
      'Macrohematocrit (Wintrobe Method): Centrifuged at 3,000 rpm for 30 minutes in a standard centrifuge.',
      'Mean Corpuscular Volume (MCV): (PCV in % × 10) / RBC count in millions/µL; Normal = 80-100 fL. Classifies anemia as microcytic, normocytic, or macrocytic.',
      'Mean Corpuscular Hemoglobin (MCH): (Hb in g/dL × 10) / RBC in millions/µL; Normal = 27-32 pg.',
      'Mean Corpuscular Hemoglobin Concentration (MCHC): (Hb in g/dL / PCV in %) × 100; Normal = 32-36 g/dL. Differentiates normochromic from hypochromic.'
    ],
    clinicalImportance: 'Microcytic hypochromic (low MCV, low MCHC) indicates Iron Deficiency Anemia or Thalassemia; Macrocytic (high MCV) indicates Megaloblastic Anemia (Vitamin B12 / Folate deficiency).',
    quickRevisionLine: 'MCV = PCV×10/RBC (cell size); MCHC = Hb×100/PCV (chromasia); Low MCV & MCHC = Iron Deficiency Anemia.'
  },
  hemat_6: {
    title: 'ABO and Rh Blood Grouping Systems & Crossmatching',
    explanation: 'Blood grouping determines the presence of specific carbohydrate and protein antigens on erythrocyte membranes. Forward grouping detects RBC antigens using known commercial antisera, while Reverse grouping detects serum antibodies using known reagent cells.',
    keyPoints: [
      'ABO System: Type A has A antigen & anti-B antibodies; Type B has B antigen & anti-A; Type AB has both antigens & no antibodies (universal recipient); Type O has neither antigen & both anti-A/anti-B (universal donor).',
      'Rh System: D antigen is most immunogenic. D-positive possesses D antigen; D-negative lacks D antigen. Anti-D is tested with Anti-D IgM/IgG antisera at 37°C.',
      'Forward Grouping (Front): Patient RBCs + Anti-A, Anti-B, Anti-D antisera. Look for macroscopic agglutination.',
      'Reverse Grouping (Back): Patient Serum + Known A cells, B cells, O cells. Validates forward grouping.',
      'Crossmatching: Major Crossmatch = Donor RBCs + Recipient Serum (critical to prevent acute hemolytic transfusion reaction); Minor Crossmatch = Donor Serum + Recipient RBCs.'
    ],
    clinicalImportance: 'ABO incompatibility transfusion results in immediate intravascular complement-mediated hemolysis, acute renal failure, and death.',
    quickRevisionLine: 'Forward grouping detects red cell antigens; reverse grouping detects serum antibodies; major crossmatch tests donor cells with patient serum.'
  },

  // --- Clinical Pathology ---
  path_1: {
    title: 'Routine & Microscopic Examination of Urine (Physical, Chemical, Deposit)',
    explanation: 'Urinalysis is a fundamental screening test reflecting renal glomerular, tubular, and systemic metabolic function. It consists of physical inspection, chemical analysis (reagent strip & wet chemistry), and microscopic sediment examination.',
    keyPoints: [
      'Physical: Volume (normal 1000-1500 mL/day), Color (pale yellow/amber due to urochrome), Appearance (clear to slightly hazy), Specific Gravity (1.005-1.030 by refractometer or dipstick), pH (4.5-8.0, average 6.0).',
      'Chemical: Protein (Heat and Acetic Acid test or Sulfosalicylic acid SSA), Glucose (Benedict’s qualitative reagent; blue to green/yellow/brick red precipitate), Ketones (Rothera’s nitroprusside ring test), Bile pigments (Fouchet’s test), Bile salts (Hay’s sulfur powder test).',
      'Microscopic Sediment: 10 mL centrifuged urine at 2000 rpm for 5 min; sediment examined under 10x and 40x objectives.',
      'Structures: RBCs (normal 0-2/HPF), Pus cells/WBCs (normal 0-5/HPF), Epithelial cells, Casts (Hyaline, Granular, RBC casts indicate glomerulonephritis, WBC casts indicate pyelonephritis), Crystals (Calcium oxalate, Uric acid, Triple phosphate).'
    ],
    clinicalImportance: 'RBC casts are pathognomonic for glomerulonephritis; significant proteinuria indicates nephrotic syndrome; ketones indicate diabetic ketoacidosis (DKA).',
    quickRevisionLine: 'Benedict test detects reducing sugars; Rothera test detects ketones; RBC casts confirm glomerular hematuria.'
  },
  path_2: {
    title: 'Semen Analysis (Sperm Count, Motility & Morphology)',
    explanation: 'Semen analysis evaluates male reproductive capability and investigates infertility or post-vasectomy success according to World Health Organization (WHO) standardized guidelines.',
    keyPoints: [
      'Specimen Collection: Collected after strict 2 to 7 days of sexual abstinence via masturbation directly into sterile non-toxic container. Delivered to laboratory within 1 hour at room temperature.',
      'Liquefaction: Normal fresh semen coagulates and completely liquefies within 15 to 30 minutes at room temperature via prostatic enzymes.',
      'Sperm Concentration: Counted in Improved Neubauer chamber after 1:20 dilution with formal-bicarbonate diluting fluid. WHO lower reference limit: ≥15 million sperm/mL.',
      'Motility Grading: Progressive motility (PR, ≥32%), Non-progressive motility (NP), and Immotile (IM). Total motility (PR + NP) should be ≥40%.',
      'Morphology: Stained smear evaluated under 100x oil immersion; ≥4% normal forms (strict Kruger criteria).'
    ],
    clinicalImportance: 'Azoospermia (absence of sperm) or Oligospermia (<15 million/mL) directly guides clinical reproductive endocrinology and in-vitro fertilization (IVF) interventions.',
    quickRevisionLine: 'Sample requires 2-7 days abstinence; liquefaction occurs within 30 min; normal count is ≥15 million/mL with ≥32% progressive motility.'
  },
  path_3: {
    title: 'Cerebrospinal Fluid (CSF) Examination',
    explanation: 'CSF is formed by choroid plexuses in brain ventricles and cushions the central nervous system. Lumbar puncture collects CSF to diagnose meningitis, subarachnoid hemorrhage, multiple sclerosis, and central nervous system malignancies.',
    keyPoints: [
      'Tube Collection: Tube 1 (Biochemistry/Serology), Tube 2 (Microbiology Gram stain/Culture), Tube 3 (Hematology Cell Count/Differential).',
      'Appearance: Normal is crystal clear. Turbid/cloudy indicates bacterial meningitis (high neutrophils); Cobweb coagulum suggests tuberculous meningitis; Xanthochromic (pink/yellow) indicates subarachnoid hemorrhage.',
      'Biochemistry: Normal Protein = 15-45 mg/dL; Normal Glucose = 40-70 mg/dL (~60% of simultaneous blood glucose).',
      'Cell Count: Performed directly without dilution in Fuchs-Rosenthal chamber; Normal adult CSF has 0-5 lymphocytes/cu.mm. Neutrophils in CSF are always pathological.'
    ],
    clinicalImportance: 'Markedly reduced glucose (<40% of blood glucose) with high protein (>100 mg/dL) and polymorphonuclear leukocytosis confirms acute pyogenic bacterial meningitis, an urgent medical emergency.',
    quickRevisionLine: 'Clear CSF is normal; cloudy with low glucose and high neutrophils confirms bacterial meningitis.'
  },
  path_4: {
    title: 'Stool Examination: Occult Blood & Parasitology',
    explanation: 'Stool examination identifies gastrointestinal bleeding, malabsorption, and intestinal parasitic infections (protozoan cysts/trophozoites and helminthic ova/larvae).',
    keyPoints: [
      'Physical examination: Consistency (formed, semi-formed, watery), color (clay color indicates obstructive jaundice, tarry black/melena indicates upper GI bleeding), presence of visible blood or mucus.',
      'Saline & Iodine Wet Mount: Saline mount shows motile trophozoites (e.g., Entamoeba histolytica, Giardia lamblia) and helminth eggs (Ascaris, Hookworm); Lugol’s iodine stains internal nuclear structures and glycogen masses of cysts.',
      'Occult Blood Test (FOBT): Detects hidden microscopic blood (hemoglobin pseudoperoxidase activity oxidizing gum guaiac or modern fecal immunochemical test FIT).',
      'Patient prep for Guaiac FOBT: Avoid red meat, peroxidase-rich foods (turnips, horseradish), and iron/NSAID supplements for 3 days prior to prevent false positives.'
    ],
    clinicalImportance: 'Fecal occult blood is a premier screening marker for colorectal carcinoma and bleeding peptic ulcers.',
    quickRevisionLine: 'Saline wet mount reveals motility; iodine mount stains cyst nuclei; occult blood screening detects hidden gastrointestinal bleeding.'
  },

  // --- Clinical Practical Training ---
  prac_1: {
    title: 'Venipuncture Techniques, Blood Collection & Phlebotomy Safety',
    explanation: 'Venipuncture is the surgical puncture of a vein with a sterile needle for diagnostic blood sampling. Phlebotomists must follow aseptic protocols, standard order of draw, and sharps safety regulations.',
    keyPoints: [
      'Site Selection: Median cubital vein is preferred, followed by cephalic and basilic veins. Avoid edematous arms, hematomas, burns, or arms with active IV cannulas or dialysis fistulas.',
      'Tourniquet Application: Apply 3 to 4 inches above puncture site; never leave on for longer than 1 minute to avoid hemoconcentration and altered potassium/calcium results.',
      'Order of Draw (CLSI standard): 1. Blood Cultures (Yellow/SPS), 2. Sodium Citrate (Light Blue), 3. Serum Tubes (Red/Gold with clot activator), 4. Heparin (Green), 5. EDTA (Lavender), 6. Fluoride/Oxalate (Grey).',
      'Safety: Never recap needles manually. Immediately activate safety shield and discard needle directly into puncture-resistant sharps container.'
    ],
    clinicalImportance: 'Adhering to the correct order of draw prevents additive carry-over (e.g., EDTA potassium spiking chemistry electrolytes) and eliminates pre-analytical contamination.',
    quickRevisionLine: 'Release tourniquet within 60 seconds; follow order of draw (Citrate before Serum before EDTA); never recap needles.'
  },
  prac_2: {
    title: 'Capillary Blood Sampling (Skin Puncture & Fingerstick)',
    explanation: 'Capillary puncture collects blood from dermal capillaries, arterioles, and venules. It is preferred for pediatric patients, severely burned or obese patients, and point-of-care testing (glucometer, malaria rapid cards).',
    keyPoints: [
      'Sites: Fleshy lateral or medial plantar heel surface for infants (<1 year, puncture depth max 2.0 mm to avoid calcaneus osteomyelitis); Palmar tip of 3rd or 4th finger perpendicular to whorls for adults.',
      'Preparation: Warm the puncture site if cold to increase arterial blood flow up to seven-fold.',
      'Wiping First Drop: Always wipe away the first drop of blood with sterile dry gauze because it contains excess tissue fluid (interstitial fluid) which dilutes the sample.',
      'Avoid excessive milking or squeezing of the digit, which causes hemolysis and specimen dilution.'
    ],
    clinicalImportance: 'Eliminates vein scarring in neonates and provides rapid sample volume for bedside glycemic monitoring and blood grouping.',
    quickRevisionLine: 'Infant heel puncture depth max 2.0 mm; always discard first drop of capillary blood to prevent interstitial fluid contamination.'
  },
  prac_3: {
    title: 'Preparation, Staining & Fixation of Peripheral Blood Smears',
    explanation: 'A peripheral blood smear (PBS) is an essential laboratory tool providing microscopic morphological visualization of RBCs, WBCs, and platelets.',
    keyPoints: [
      'Wedge Slide Technique: Place a small drop of EDTA blood 1 cm from frosted end of clean slide; hold spreader slide at 30-45° angle, pull back into drop until blood spreads across edge, then push smoothly forward in one continuous motion.',
      'Ideal Smear Characteristics: Covers 2/3 length of slide, has smooth feathered edge without ridges or holes, margins on all sides, and uniform cell monolayer.',
      'Fixation: Air dry completely; fix in absolute methyl alcohol (methanol) for 2 to 3 minutes to preserve cellular protein architecture without water distortion.',
      'Romanowsky Stains: Leishman or Wright stain contains basic Methylene Blue (stains acidic DNA/RNA and basophilic granules blue/violet) and acidic Eosin (stains basic hemoglobin and eosinophil granules orange-pink).'
    ],
    clinicalImportance: 'PBS examination identifies malarial parasites, sickle cells, blast cells, toxic granulations, and confirms automated analyzer platelet flags.',
    quickRevisionLine: 'Spreader angle 30-45°; methanol fixes cells; feathered edge monolayer is the designated zone for morphological evaluation.'
  },

  // --- MLT Instruments Practice Lab - 1 ---
  inst_1: {
    title: 'Compound Microscope: Components, Magnification & Maintenance',
    explanation: 'The brightfield compound microscope uses a multi-lens optical system to magnify microscopic diagnostic specimens (blood cells, parasites, urinary crystals, bacteria).',
    keyPoints: [
      'Optical Pathway: Light source → Substage Condenser (focuses light cone onto specimen) → Iris Diaphragm (controls contrast and resolution) → Objective lens → Body tube → Ocular eyepiece lens.',
      'Total Magnification: Magnification of Eyepiece (usually 10x) multiplied by Magnification of Objective (Scanning 4x = 40x, Low power 10x = 100x, High dry 40x = 400x, Oil immersion 100x = 1000x).',
      'Oil Immersion Principle: Cedarwood oil or synthetic immersion oil has the same refractive index as glass slide (n = 1.515). It prevents light refraction and loss through air, maximizing numerical aperture and resolving power.',
      'Maintenance: Clean oil immersion objective immediately after use with lens tissue and optical lens cleaning solution. Never use xylene excessively or wipe optical glass with rough tissue.'
    ],
    clinicalImportance: 'A calibrated and properly aligned microscope is the technologist’s primary diagnostic instrument for hematology, parasitology, and clinical cytology.',
    quickRevisionLine: 'Total magnification = Eyepiece × Objective; immersion oil matches glass refractive index (1.515) to prevent light refraction.'
  },
  inst_2: {
    title: 'Laboratory Centrifuges: Operation, RCF/RPM & Safety',
    explanation: 'Centrifuges use centrifugal acceleration to sediment particles suspended in liquid media according to their size and density (e.g., separating serum/plasma from cellular blood elements).',
    keyPoints: [
      'RPM vs RCF: RPM is Revolutions Per Minute (rotational speed); Relative Centrifugal Force (RCF or g-force) measures actual sedimentation force applied to particles.',
      'RCF Formula: RCF (g) = 1.118 × 10^-5 × r (radius in cm) × (RPM)²',
      'Balancing: Always balance centrifuge buckets symmetrically with matched weight tubes directly opposite each other. Uneven loads cause severe vibration, motor damage, and catastrophic bucket breakage.',
      'Aerosol Prevention: Keep aerosol containment safety lids closed until rotor comes to a complete halt. Never brake the centrifuge rotor with hands.'
    ],
    clinicalImportance: 'Proper centrifugation (typically 3000 rpm for 10 min, ~1500-2000g) prevents hemolysis and yields clean, fibrinous-free serum for biochemistry and serology testing.',
    quickRevisionLine: 'Always balance tubes by weight and volume oppositely; RCF depends on rotor radius and RPM squared.'
  },
  inst_3: {
    title: 'Colorimeter & Spectrophotometer: Beer-Lambert Law & Calibration',
    explanation: 'Colorimeters and spectrophotometers quantify the concentration of colored chemical compounds in solution by measuring optical absorbance or transmittance of specific light wavelengths.',
    keyPoints: [
      'Beer\'s Law: The intensity of transmitted light decreases exponentially as concentration of absorbing substance increases (Absorbance is directly proportional to concentration).',
      'Lambert\'s Law: The intensity of transmitted light decreases exponentially as thickness/path length of absorbing medium increases (Absorbance is directly proportional to path length, standard 1 cm cuvette).',
      'Beer-Lambert Combined Equation: A = ε × c × b (where A = Absorbance, ε = molar absorptivity, c = concentration, b = path length).',
      'Concentration Calculation: Concentration of Test = (Absorbance of Test / Absorbance of Standard) × Concentration of Standard.',
      'Components: Light source (Tungsten bulb for visible light 380-750 nm, Deuterium lamp for UV 200-380 nm), Monochromator/Filter, Cuvette holder, Photodetector, Digital readout.'
    ],
    clinicalImportance: 'Forms the foundational measurement principle of automated clinical chemistry analyzers measuring blood glucose, urea, creatinine, bilirubin, and enzymes.',
    quickRevisionLine: 'Absorbance is directly proportional to solute concentration; Concentration = (A_test / A_standard) × Conc_standard.'
  },
  inst_4: {
    title: 'Autoclaves & Hot Air Ovens: Sterilization Principles & Biological Indicators',
    explanation: 'Sterilization destroys all forms of microbial life, including vegetative bacteria, viruses, fungi, and highly resistant bacterial endospores. Moist heat and dry heat are the two main thermal sterilization modalities.',
    keyPoints: [
      'Autoclave (Moist Heat under Pressure): Standard parameters are 121°C at 15 lbs/sq.inch pressure for 15 to 20 minutes. Coagulates and denatures essential microbial proteins. Used for culture media, glassware, surgical items, and biohazard waste decontamination.',
      'Hot Air Oven (Dry Heat): Standard parameters are 160°C for 2 hours or 170°C for 1 hour. Destroys organisms by oxidation. Used for dry glassware (petri dishes, pipettes, test tubes), metal forceps, and anhydrous oils/powders.',
      'Biological Indicator for Autoclave: Geobacillus stearothermophilus spores (killed at 121°C in 15 min).',
      'Biological Indicator for Hot Air Oven: Bacillus atrophaeus (subtilis) spores.'
    ],
    clinicalImportance: 'Inadequate sterilization leads to laboratory contamination, false microbial cultures, and life-threatening nosocomial infections in hospitals.',
    quickRevisionLine: 'Autoclave operates at 121°C at 15 psi for 15 min (Geobacillus spores); Hot Air Oven at 160°C for 2 hours (Bacillus spores).'
  },

  // --- Hospital Industrial Training (4 Weeks Summer Vacation) ---
  hosp_1: {
    title: 'Biomedical Waste Management (BMWM) & Color Coded Bins',
    explanation: 'Biomedical waste management protocols ensure safe segregation, collection, transport, and disposal of hazardous healthcare waste to prevent disease transmission and environmental pollution.',
    keyPoints: [
      'Yellow Bag: Infectious non-chlorinated plastic bag. Anatomical waste, animal tissue, soiled cotton, blood bags, expired medicines, microbiology culture plates. Treatment: Incineration or plasma pyrolysis.',
      'Red Bag: Contaminated recyclable plastics. Used tubing, syringes (without needle), IV sets, catheter bags, vacutainer tubes, gloves. Treatment: Autoclaving/microwaving followed by shredding and recycling.',
      'White Translucent Puncture-Proof Container: Sharp waste. Needles, scalpels, lancets, contaminated broken needles. Treatment: Autoclaving and dry-heat sterilization followed by encapsulation.',
      'Blue Box/Cardboard with Blue Marking: Glassware and metallic implants. Broken medicine vials, ampoules, glass slides, metal implants. Treatment: Disinfection with sodium hypochlorite or autoclaving.'
    ],
    clinicalImportance: 'Strict at-source segregation protects healthcare workers from needle-stick injuries and bloodborne pathogens (HIV, Hepatitis B and C).',
    quickRevisionLine: 'Yellow = anatomical & soiled; Red = recyclable plastic; White = sharps & needles; Blue = glassware & ampoules.'
  },
  hosp_2: {
    title: 'Quality Control (QC), Westgard Rules & Laboratory Accreditation',
    explanation: 'Quality control monitors laboratory analytical performance, ensuring that patient test results are reliable, accurate, and reproducible across clinical shifts.',
    keyPoints: [
      'Internal Quality Control (IQC): Daily testing of commercial control sera with known target values at normal and pathological levels.',
      'Westgard Multirules: Statistical criteria used to determine whether an analytical run is in control or out of control.',
      '1_2s Rule (Warning): One control observation exceeds ±2SD limit; warning flag.',
      '1_3s Rule (Rejection): One control observation exceeds ±3SD limit; indicates random error or major systematic shift; reject patient batch.',
      '2_2s Rule (Rejection): Two consecutive control observations exceed the same ±2SD limit; indicates systematic error.',
      'R_4s Rule (Rejection): One control exceeds +2SD and another exceeds -2SD in the same run; indicates severe random error.',
      'External Quality Assessment Scheme (EQAS): Blind proficiency testing samples sent by national/international agencies to benchmark lab accuracy against peer laboratories.'
    ],
    clinicalImportance: 'Enforcing Westgard QC rules ensures erroneous patient reports are halted before release, preventing clinical misdiagnoses.',
    quickRevisionLine: '1_2s is warning; 1_3s & 2_2s reject the analytical run; IQC monitors daily precision while EQAS verifies peer accuracy.'
  },
  hosp_3: {
    title: 'Laboratory Safety, Chemical Spills & Fire Hazards',
    explanation: 'Hospital laboratory safety protects technicians, hospital personnel, and patients from biological, chemical, radioactive, and electrical hazards.',
    keyPoints: [
      'Blood Spill Management: Cover blood spill with paper towels, pour freshly prepared 1% (10,000 ppm) Sodium Hypochlorite solution, allow 20-30 minutes contact time, wipe up wearing heavy-duty gloves, and dispose in yellow bin.',
      'Eyewash & Safety Showers: Located within 10 seconds of corrosive chemical work areas; flush contaminated eyes continuously for at least 15 minutes with eyelids held open.',
      'Fire Extinguishers: PASS technique (Pull pin, Aim at base of fire, Squeeze lever, Sweep side to side); Class B (flammable solvents) and Class C (electrical equipment fires) are most common in labs.',
      'Hepatitis B Vaccination: All laboratory technologists must receive a full 3-dose Hepatitis B vaccination series (0, 1, 6 months) with post-vaccination anti-HBs titer verification.'
    ],
    clinicalImportance: 'Preparedness for spills and fires prevents occupational contamination, burns, and ensures compliance with institutional health and safety mandates.',
    quickRevisionLine: 'Blood spills require 1% sodium hypochlorite for 20 min; for fires remember PASS; all MLT staff need Hepatitis B immunization.'
  },
};

export function getTopicStudyMaterial(topicId: string, topicTitle: string, subjectName: string): TopicStudyMaterial {
  if (TOPIC_STUDY_DATA[topicId]) {
    return TOPIC_STUDY_DATA[topicId];
  }

  // Fallback high-yield material generator for any custom or dynamic topic
  return {
    title: topicTitle,
    explanation: `${topicTitle} is an essential core module within ${subjectName} in DMLT 1st Year. It provides the diagnostic methodology, standard laboratory procedures, and quality control protocols required for clinical testing.`,
    keyPoints: [
      `Standard operational guidelines and principles governing ${topicTitle}.`,
      `Proper specimen handling, anticoagulant selection, and pre-analytical checks.`,
      `Step-by-step laboratory testing methodology, reagent calibration, and quality control.`,
      `Identification and prevention of common analytical and post-analytical errors.`
    ],
    clinicalImportance: `Accurate execution of ${topicTitle} provides clinicians with vital diagnostic data to detect disease processes, monitor therapeutics, and ensure patient safety.`,
    quickRevisionLine: `Master the standard operating procedure, normal reference values, and quality control rules for ${topicTitle}.`,
  };
}
