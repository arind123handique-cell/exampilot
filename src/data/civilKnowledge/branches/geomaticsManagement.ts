import type { CivilKnowledgeConcept, CivilKnowledgeSubject } from '../../../types/civilKnowledge';
import { CIVIL_FORMULA_BANK } from '../banks/formulaBank';

const getFormulasByIds = (...ids: string[]) =>
  CIVIL_FORMULA_BANK.filter((f) => ids.includes(f.id));

export const GEOMATICS_MANAGEMENT_CONCEPTS: CivilKnowledgeConcept[] = [
  /* ==========================================================================
     BHAVIKATTI UNIT I: CIVIL ENGINEERING MATERIALS
     ========================================================================== */
  {
    id: 'ck-mat-001',
    slug: 'building-materials-traditional-stones-bricks-cement-timber',
    title: 'Traditional Civil Materials: Stones, Clay Bricks, Lime, Cement & Timber',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    subject: 'Building Materials & Concrete Technology',
    unit: 'Unit 1: Civil Engineering Materials',
    chapter: 'Chapter 1: Traditional Materials',
    topic: 'Stones, Bricks, Lime, Cement & Timber',
    subtopic: 'Geological/Physical Classifications, Chemical Compounds, Strength Tests & IS Specifications',
    difficulty: 'FUNDAMENTAL',
    keywords: [
      'stones', 'granite', 'basalt', 'crushing strength', 'bricks', 'frog', 'efflorescence',
      'lime', 'fat lime', 'hydraulic lime', 'cement', 'Bogue compounds', 'C3S', 'C2S', 'C3A',
      'timber', 'heartwood', 'sapwood', 'cambium', 'IS 1077', 'IS 269'
    ],
    theory: {
      summary: 'Comprehensive textbook coverage of traditional engineering materials per Dr. S.S. Bhavikatti: geological/physical/chemical classification of building stones, crushing strength hierarchy, brick earth chemistry and kiln burning, lime slaking categories, Portland cement manufacturing and Bogue mineral hydration kinetics, and macro-structure of timber trees.',
      definitions: [
        'Building Stone: Natural consolidated rock mass quarried and dressed for load-bearing masonry, aggregate production, or architectural facing.',
        'Frog in Brick: An indentation 10 to 20 mm deep formed on the top face of a brick to provide a mechanical key for mortar and display the manufacturer trademark.',
        'Fat Lime (Rich Lime): High-purity calcium lime containing >= 95% CaO that slakes vigorously, expands to 2-2.5 times its initial volume, and hardens solely by absorbing atmospheric CO2.',
        'Hydraulic Lime: Lime obtained by burning kankar or argillaceous limestone containing 5-30% clay (silica and alumina) which can set and harden under water without air.',
        'Bogue Compounds: The 4 synthesized mineral clinker phases (C3S, C2S, C3A, C4AF) formed during the clinkering kiln process at 1400-1500°C governing cement strength and hydration rate.',
        'Heartwood: The dead, inner, dark-colored core of an exogenous tree stem providing structural rigidity and high resistance to insect attack.'
      ],
      principlesAndLaws: [
        'Stone Classification Triad: Geological (Igneous formed by magma cooling, Sedimentary formed by deposition/cementation, Metamorphic formed by heat/pressure alteration); Physical (Stratified, Unstratified, Foliated); Chemical (Siliceous rich in SiO2, Argillaceous rich in Al2O3/clay, Calcareous rich in CaCO3).',
        'Bhavikatti Stone Crushing Strength Hierarchy: Trap (300-350 MPa) > Basalt (153-189 MPa) > Granite (104-140 MPa) > Slate (70-210 MPa) > Marble (72 MPa) > Sandstone (65 MPa) > Limestone (55 MPa) > Laterite (1.8-3.2 MPa). Good building stone requires minimum crushing strength >= 100 MPa.',
        'Brick Earth Composition Rule: Silica (50-60% prevents warping/cracking) + Alumina (20-30% imparts plasticity for moulding) + Lime (< 5% acts as flux) + Iron Oxide (5-6% imparts red color and acts as flux) + Magnesia (< 1%). Excess lime causes splitting and slaking; excess alkalis cause efflorescence.',
        'Bogue Hydration Kinetics: C3S hydrates rapidly providing high early strength (1 to 28 days); C2S hydrates slowly providing progressive long-term strength (> 28 days to years); C3A causes flash set and generates highest heat of hydration (865 J/g); C4AF has negligible cementing value.',
        'Role of Gypsum: 2% to 3% gypsum (CaSO4·2H2O) is interground with clinker to react with C3A forming calcium sulfoaluminate (ettringite), preventing flash set and ensuring manageable setting time.'
      ],
      governingAssumptions: [
        'Standard modular brick size in India per IS 1077 is exactly 190 x 90 x 90 mm; with 10 mm mortar joint nominal size is 200 x 100 x 100 mm.',
        'Non-modular traditional Indian brick size is 230 x 115 x 75 mm (9" x 4.5" x 3").',
        'Cement fineness testing requires < 10% residue on 90-micron IS sieve for OPC, with Blaine specific surface >= 225 m²/kg.'
      ],
      detailedExplanation: '1. Building Stones:\n- Quarrying methods: digging, wedging, channelling, and blasting (gunpowder/dynamite).\n- Dressing: pitch-faced, hammer-dressed, chisel-drafted, fine-tooled, and polished.\n- Laboratory tests: Compressive crushing test on 40 mm cubes; Water absorption (should not exceed 5% after 24 hr immersion); Smith test for earthy silt; Brard test for frost action; Los Angeles abrasion test for aggregate hardness.\n\n2. Clay Bricks:\n- Manufacturing cycle: Unsoiling -> Digging -> Weathering -> Blending -> Tempering (in pug mill) -> Moulding (hand/machine) -> Drying -> Burning (Clamp vs Continuous Bull\'s trench / Hoffman kilns at 900-1200°C).\n- IS 1077 Classification:\n  * First Class: Compressive strength >= 10.5 N/mm², water absorption <= 20%, metallic ringing sound, no efflorescence.\n  * Second Class: Compressive strength >= 7.0 N/mm², water absorption <= 22%.\n  * Third Class: Compressive strength >= 3.5 N/mm², water absorption <= 25%.\n\n3. Lime Types:\n- Fat lime: Plastering and whitewashing (CaO >= 95%).\n- Feebly hydraulic (5-10% clay), Moderately hydraulic (11-20% clay), Eminently hydraulic (21-30% clay for underwater masonry).\n- Poor/Lean lime: > 30% clay/sand, yields weak dark mortar.\n\n4. Portland Cement:\n- Manufactured from calcareous materials (limestone, chalk) and argillaceous materials (clay, shale).\n- Wet process (slurry 35-40% water) and Modern Dry process (raw meal preheated, energy efficient).\n- Standard physical tests per IS 4031:\n  * Standard Consistency: Vicat apparatus with 10 mm diameter plunger penetrating 33-35 mm from top.\n  * Initial Setting Time: Vicat 1 mm square needle penetrating to 5 mm from bottom, minimum 30 minutes.\n  * Final Setting Time: Vicat 5 mm annular attachment makes impression but needle does not, maximum 600 minutes (10 hours).\n  * Soundness: Le Chatelier mould (unburnt free lime expansion <= 10 mm) and Autoclave test (magnesia expansion <= 0.8%).\n  * Compressive Strength: 1:3 standard Ennore sand mortar cubes (70.6 mm face area 50 cm²), tested at 3, 7, and 28 days.\n\n5. Timber:\n- Cross-section concentric anatomy: Pith (center) -> Heartwood -> Sapwood -> Cambium layer -> Inner bark (phloem) -> Outer bark (cortex), traversed radially by Medullary rays.\n- Seasoning: Natural air drying vs Artificial kiln seasoning, chemical seasoning, or boiling; moisture content reduced to 10-12% equilibrium.\n- Common defects: Knots (live/dead), Shakes (star shake from exterior bark, heart shake from interior pith, cup shake along annual rings), Checks, Warping (bow, cup, twist).',
      applications: [
        'Granite and basalt for bridge piers, heavy dam abutments, railway ballast, and road macadam.',
        'First-class modular bricks for multi-storey load-bearing masonry walls and reinforced brick lintels.',
        'OPC 43/53 grades for high-performance concrete infrastructures, bridges, and flyovers.',
        'Teak and sal structural timber for trusses, purlins, door/window joinery, and formwork props.'
      ],
      limitations: [
        'Sandstones and limestones deteriorate rapidly in acidic industrial atmospheres.',
        'Unseasoned timber undergoes dry rot fungal attack and heavy dimensional shrinkage warping.'
      ],
      comparisons: [
        {
          aspect: 'Setting & Hardening Chemistry',
          itemA: { label: 'Fat Lime', value: 'Sets solely by absorbing CO2 from air: Ca(OH)2 + CO2 -> CaCO3 + H2O. Cannot set under water.' },
          itemB: { label: 'Hydraulic Lime & Cement', value: 'Sets by hydration reaction of silicates and aluminates forming C-S-H gel: can set and harden submerged under water.' }
        },
        {
          aspect: 'Anatomical Wood Quality',
          itemA: { label: 'Heartwood', value: 'Dark, dead, dense wood. Resistant to fungi/termites. High structural strength and durability.' },
          itemB: { label: 'Sapwood', value: 'Light, active living wood carrying sap. High moisture, highly susceptible to rot, lower strength.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-tree-anatomy',
        title: 'Exogenous Tree Stem Concentric Cross-Section',
        format: 'ASCII',
        content: `
                 OUTER BARK (Cortex - Protective)
               /
              |   INNER BARK (Phloem - Sap food flow)
              |  /
              | |   CAMBIUM LAYER (Cellular growth ring)
              | |  /
              | | |   SAPWOOD (Light, active sap conduction)
              | | |  /
              | | | |   HEARTWOOD (Dark, dead structural core)
              | | | |  /
              | | | | |   PITH / MEDULLA (Center core)
              | | | | |  /
        +-----+-----+-----+-----+-----+-----+-----+
        | O.B | I.B | CAM | SAP | HRT | PITH| HRT | ...
        +-----+-----+-----+-----+-----+-----+-----+
              | | | | |         |
              \\_|_|_|_|_________|
                    |
               MEDULLARY RAYS (Radial fibrous bands binding rings)
        `,
        caption: 'Concentric growth rings and medullary rays of an exogenous tree stem (Bhavikatti Fig. 1.8).'
      },
      {
        id: 'diag-brick-closer',
        title: 'Standard Modular Brick & Closer Cuts',
        format: 'ASCII',
        content: `
      STANDARD MODULAR BRICK                 QUEEN CLOSER (Half)
        (190 x 90 x 90 mm)                   (190 x 45 x 90 mm)
          +---------------+                    +-------+
         /    FROG       /|                   /       /|
        +---------------+ |                  +-------+ |
        |   (10-20 mm)  | | 90 mm            |       | | 90 mm
        |               |/                   |       |/
        +---------------+                    +-------+
             190 mm                               45 mm
                                             (Cut lengthwise)
        KING CLOSER                          HALF BAT
        (Corner triangle cut)                (Cut across width)
             90 mm                                90 mm
          +-------+                            +-------+
         /  /    /|                           /       /|
        +--/----+ |                          +-------+ |
        | /     | |                          |       | |
        |/______|/                           +-------+
          190 mm                               95 mm
        `,
        caption: 'Standard modular brick with frog, and specialized closer bricks for bonding (Bhavikatti Fig. 1.2).'
      }
    ],
    formulas: [],
    codeProvisions: [
      {
        standard: 'IS 1077:1992',
        clauseOrTable: 'Table 1 & Cl. 4.2',
        title: 'Common Burnt Clay Building Bricks — Compressive Strength Classes',
        provisionText: 'Bricks are classified into 11 strength classes from 35 (>= 35 N/mm²) down to 3.5 (>= 3.5 N/mm²). First class bricks must not absorb water exceeding 20% by dry weight after 24-hour immersion.',
        isMandatory: true,
        notes: 'Bricks having compressive strength < 3.5 N/mm² shall not be used in permanent construction.'
      },
      {
        standard: 'IS 269:2015',
        clauseOrTable: 'Table 2 & Cl. 6.2',
        title: 'Ordinary Portland Cement — Physical and Chemical Requirements',
        provisionText: 'OPC grades 33, 43, and 53 consolidated. Minimum initial setting time 30 min, maximum final setting time 600 min. Le Chatelier expansion <= 10 mm, Autoclave expansion <= 0.8%. Blaine fineness >= 225 m²/kg.',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-brick-test-001',
        title: 'Water Absorption & Quality Compliance of Clay Bricks per IS 1077',
        problemStatement: 'A sample of 5 burnt clay bricks has an initial dry weight W1 = 3.20 kg. After immersion in clean cold water for 24 hours at 27°C, its saturated surface-dry weight W2 = 3.76 kg. In a subsequent compressive strength test, a modular brick specimen (190 x 90 mm bed) crushed under an ultimate load of 210 kN. Determine the percentage water absorption, the compressive crushing strength, and state whether the brick qualifies as First Class.',
        givenData: {
          'Dry weight (W1)': '3.20 kg',
          'Saturated weight (W2)': '3.76 kg',
          'Crushing load (P)': '210 kN = 210,000 N',
          'Bed face area (A)': '190 mm x 90 mm = 17,100 mm²'
        },
        governingFormulas: [
          'Water Absorption (%) = [(W2 - W1) / W1] * 100',
          'Compressive Strength (f_c) = P / A'
        ],
        stepByStepSolution: [
          'Step 1: Compute Percentage Water Absorption:\nAbsorption = [(3.76 - 3.20) / 3.20] * 100 = (0.56 / 3.20) * 100 = 17.50%.',
          'Step 2: Check Water Absorption Limit for First Class:\nIS 1077 stipulates water absorption <= 20% for first-class bricks. Since 17.50% <= 20%, it satisfies the absorption criterion.',
          'Step 3: Compute Compressive Strength:\nf_c = P / A = 210,000 N / 17,100 mm² = 12.28 N/mm² (MPa).',
          'Step 4: Check Compressive Strength Limit:\nFirst class bricks require f_c >= 10.5 N/mm². Since 12.28 N/mm² >= 10.5 N/mm², it satisfies the strength criterion (Class 12.5).'
        ],
        finalAnswer: 'Water Absorption = 17.50%, Compressive Strength = 12.28 N/mm²; Brick qualifies as First Class (Class 12.5 per IS 1077).',
        answerUnit: 'N/mm²',
        takeaway: 'Both physical limits (absorption <= 20% and crushing strength >= 10.5 MPa) must be satisfied simultaneously for first-class classification.',
        examProvenance: 'APSC AE Civil / State PSC Examination'
      }
    ],
    conceptTraps: [
      {
        id: 'trap-mat-soundness',
        subject: 'Building Materials & Concrete Technology',
        topic: 'Cement Soundness Testing',
        branch: 'Geomatics, Materials & Management',
        trapTitle: 'Le Chatelier Test Inability to Detect Magnesia Unsoundness',
        commonMistake: 'Believing that a passing Le Chatelier test guarantees complete cement soundness against all expansive ingredients.',
        correctConcept: 'The Le Chatelier test detects expansion caused ONLY by free uncombined lime (CaO). It CANNOT detect expansion caused by excess magnesia (MgO). Unsoundness due to magnesia is detected exclusively by the Autoclave Test.',
        whyCandidatesFail: 'Frequent multiple-choice question testing the difference between Le Chatelier (free lime only) and Autoclave (both free lime and magnesia).',
        preventionRule: 'Free lime -> Le Chatelier (<= 10 mm). Free lime + Magnesia -> Autoclave (<= 0.8%).'
      }
    ],
    quickRevisionFacts: [
      'Standard modular brick size: 190 x 90 x 90 mm; nominal size with mortar: 200 x 100 x 100 mm.',
      'Stone crushing strength: Trap (300-350 MPa) > Basalt (153-189) > Granite (104-140) > Laterite (1.8-3.2 MPa).',
      'Vicat plunger: 10 mm diameter for consistency; 1 mm square needle for initial setting time (>= 30 min).',
      'Gypsum (2-3%) retards flash set by controlling tricalcium aluminate (C3A).'
    ],
    prerequisites: ['Basic Applied Chemistry', 'Geology of Rocks'],
    relatedConceptSlugs: ['building-materials-mortars-concrete-special-concretes', 'building-construction-superstructure-masonry-finishes-stairs-roofs'],
    downstreamApplications: ['Masonry Wall Design', 'Concrete Mix Proportioning']
  },

  /* ==========================================================================
     BHAVIKATTI CH. 2, 3, 4: MORTARS, CONCRETE & SPECIAL CONCRETES
     ========================================================================== */
  {
    id: 'ck-mat-002',
    slug: 'building-materials-mortars-concrete-special-concretes',
    title: 'Mortars, Concrete Technology & Special Concretes (RCC, PSC, FRC, Cellular & Ferrocement)',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    subject: 'Building Materials & Concrete Technology',
    unit: 'Unit 1: Civil Engineering Materials',
    chapter: 'Chapter 2-4: Mortars, Concrete & Special Concretes',
    topic: 'Mortars, Plain Concrete, Workability & Special Concretes',
    subtopic: 'Abrams Law, Slump/Compaction Factor, Creep, Prestressing Systems, FRC & Ferrocement',
    difficulty: 'GATE_IES',
    keywords: [
      'mortar', 'Abrams law', 'water-cement ratio', 'slump test', 'compaction factor',
      'curing', 'creep', 'shrinkage', 'RCC', 'PSC', 'Freyssinet', 'FRC', 'cellular concrete',
      'AAC', 'ferrocement', 'IS 456', 'IS 1343'
    ],
    theory: {
      summary: 'Detailed theoretical treatment of mortars and plain/reinforced/prestressed/composite concretes per Dr. S.S. Bhavikatti. Covers sand grading functions, cement mortar mixes, Abram\'s law of water-cement ratio, standard workability test mechanisms, concrete time-dependent creep and shrinkage, and specialized structural concretes including Prestressed Concrete (PSC), Fibre Reinforced Concrete (FRC), Aerated Cellular Concrete (AAC), and Ferrocement.',
      definitions: [
        'Mortar: A workable paste formed by intimately mixing a binding material (cement/lime) with fine aggregate (sand/surkhi) and water, used to bind masonry units and plaster surfaces.',
        'Gauged Mortar: A composite mortar prepared by adding Portland cement to lime-sand mortar (typically 1:1:6 or 1:2:9) combining the workability and water retention of lime with the early strength of cement.',
        'Abrams Water-Cement Law: For fully compacted concrete, compressive strength is an inverse exponential function of the water-cement ratio by weight, independent of the aggregate mix proportions: S = A / B^(W/C).',
        'Workability: That property of freshly mixed concrete or mortar which determines the ease and homogeneity with which it can be mixed, placed, compacted, and finished without segregation or bleeding.',
        'Creep of Concrete: The time-dependent progressive inelastic deformation of hardened concrete under sustained sustained mechanical stress.',
        'Ferrocement: A composite material consisting of rich cement mortar (1:2 to 1:3) reinforced with closely spaced layers of continuous, fine galvanized woven or welded wire mesh, exhibiting high tensile ductility and crack-arresting capability.'
      ],
      principlesAndLaws: [
        'Functions of Sand in Mortar: Sand reduces shrinkage and cracking of the binder, provides bulk and economy, forms voids for CO2 ingress in lime mortar, and prevents excessive binder contraction. Sand does NOT impart chemical strength.',
        'Mortar Mix Proportions (Bhavikatti Table 2.1): 1:1 to 1:2 for pointing and DPC; 1:3 for high-strength repairs and water-retaining structures; 1:4 to 1:6 for external plastering and standard brick masonry; 1:8 for lean foundation masonry.',
        'Workability vs Water Content: Adding extra water increases workability but drastically increases capillary porosity upon evaporation, reducing compressive strength, elastic modulus, and durability.',
        'Creep Coefficients per IS 456: Creep coefficient theta = (Creep strain / Elastic strain): 2.2 at 7 days; 1.6 at 28 days; 1.1 at 1 year.',
        'Prestressing Principle: Deliberate induction of internal initial compressive stresses into concrete using high-tensile steel tendons (1500-2000 MPa) to neutralize all tensile flexural stresses produced by dead and live loads.'
      ],
      governingAssumptions: [
        'Full compaction is achieved (concrete without entrapped air voids). 1% air voids reduce compressive strength by approximately 5% to 6%.',
        'In Prestressed Concrete, minimum concrete grade is M40 for pre-tensioning and M30 for post-tensioning per IS 1343.',
        'Ferrocement shell thickness ranges from 10 to 30 mm with rebar matrix reinforcement wire diameter 0.5 to 1.5 mm.'
      ],
      detailedExplanation: '1. Concrete Workability Testing (Bhavikatti Table 3.2):\n- Slump Test: Truncated metallic cone (300 mm high, 100 mm top dia, 200 mm base dia) filled in 4 equal layers tamped 25 strokes each with 16 mm rod. Types: True slump (uniform subsidence), Shear slump (half slips off indicating lack of cohesion), Collapse slump (excess water).\n  * Low (25-50 mm): Roads, mass concrete.\n  * Medium (50-100 mm): Normal reinforced beams, slabs, columns.\n  * High (100-175 mm): Heavily congested reinforcement, tremie underwater concreting.\n- Compaction Factor Test: Compares density of partially compacted concrete dropped through two hoppers with fully vibrated density. CF = (Partial Weight) / (Fully Compacted Weight). Sensitive for dry/stiff mixes (0.75 to 0.95).\n- Vee-Bee Consistometer: Vibrating table timing (Vee-Bee seconds) for cone to slump and surface to become completely horizontal. For very dry, zero-slump roller-compacted mixes.\n\n2. Special Concretes:\n- Reinforced Brick Concrete (RBC): Slabs where bricks replace lower-zone tension concrete between steel bars, economizing cement in low-cost roofs.\n- Prestressed Concrete (PSC):\n  * Pre-tensioning (Hoyer system): Tendons tensioned against external bulkheads, concrete cast around them, transferred by bond upon hardening.\n  * Post-tensioning: Concrete cast with ducts; tendons threaded, tensioned against hardened concrete, anchored with mechanical wedges/cones (Freyssinet, Magnel-Blaton, Gifford-Udall, Lee-McCall), and grouted.\n- Fibre Reinforced Concrete (FRC): Addition of steel, alkali-resistant glass, polypropylene, or carbon fibres (aspect ratio L/d = 30 to 150) bridging micro-cracks, increasing fracture energy, impact resistance, and fatigue life.\n- Cellular / Aerated Concrete (AAC): Density 300 to 800 kg/m³. Prepared by adding 0.2% aluminium powder to a rich slurry of cement, lime, and fly ash (2Al + 3Ca(OH)2 + 6H2O -> C3AH6 + 3H2 gas). Hydrogen gas forms millions of microscopic uniform cells, providing extraordinary thermal insulation and lightweight fireproofing.',
      applications: [
        'Ferrocement for thin-shell parabolic domes, precast water tanks, septic tanks, and marine boat hulls.',
        'AAC blocks for earthquake-resistant lightweight partition infill walls reducing structural dead loads.',
        'PSC girders for long-span highway flyovers, metro rail viaducts, and nuclear containment vessels.'
      ],
      limitations: [
        'Prestressed concrete requires specialized high-tensile steel, heavy anchorages, and skilled supervision.',
        'Ferrocement is labor-intensive and prone to corrosion if the thin cover (3-5 mm) is compromised.'
      ],
      comparisons: [
        {
          aspect: 'Pre-tensioning vs Post-tensioning',
          itemA: { label: 'Pre-tensioning (Hoyer)', value: 'Tendons stressed BEFORE concrete is placed. Stress transferred solely via bond along transmission length. Factory precast.' },
          itemB: { label: 'Post-tensioning (Freyssinet)', value: 'Tendons stressed AFTER concrete hardens. Stress transferred via end bearing anchorages. Cast-in-situ or field precast.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-slump-types',
        title: 'Concrete Slump Test Failure Profiles',
        format: 'ASCII',
        content: `
      MOULD CONE (300 mm)       TRUE SLUMP           SHEAR SLUMP          COLLAPSE
         +-------+             +-------+
        /         \\           /         \\
       /           \\         /           \\            /\\
      /             \\       /             \\          /  \\
     +---------------+     +---------------+        /____\\               ~~~~~~~~~~
     300 x 200 x 100 mm     Uniform drop (h)       One side slips      Slurry puddles
                            Desirable cohesion     Harsh, segregates   Excess water (W/C)
        `,
        caption: 'Three characteristic slump profiles during fresh concrete testing (Bhavikatti Fig. 3.1).'
      }
    ],
    formulas: [],
    codeProvisions: [
      {
        standard: 'IS 456:2000',
        clauseOrTable: 'Table 5 & Cl. 6.2.5.1',
        title: 'Minimum Cement Content and Maximum Free W/C Ratio',
        provisionText: 'For RCC in Moderate exposure: Minimum grade M25, minimum cement 300 kg/m³, maximum free W/C ratio 0.50. For Severe exposure: Minimum M30, cement 320 kg/m³, max W/C 0.45.',
        isMandatory: true
      },
      {
        standard: 'IS 1343:2012',
        clauseOrTable: 'Cl. 6.1',
        title: 'Prestressed Concrete — Minimum Characteristic Strength',
        provisionText: 'The minimum characteristic 28-day cube strength fck shall not be less than 40 N/mm² for pre-tensioned systems, and 30 N/mm² for post-tensioned systems.',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-target-mean-strength',
        title: 'Target Mean Compressive Strength Computation for M30 Grade per IS 10262',
        problemStatement: 'Design a concrete mix for an RCC bridge pier subjected to severe exposure conditions using M30 grade concrete. As per IS 10262:2019, the assumed standard deviation for M30 is s = 5.0 N/mm². Calculate the target mean compressive strength at 28 days.',
        givenData: {
          'Characteristic compressive strength (fck)': '30 N/mm²',
          'Standard deviation (s)': '5.0 N/mm²',
          'Risk factor (t)': '1.65 (corresponding to 5% failure probability)'
        },
        governingFormulas: [
          'Target Mean Strength f\'ck = fck + 1.65 * s'
        ],
        stepByStepSolution: [
          'Step 1: Identify Governing Equation:\nIS 10262 and IS 456 define target mean strength to ensure not more than 5% test results fall below fck:\nf\'ck = fck + 1.65 * s',
          'Step 2: Substitute Values:\nf\'ck = 30 + 1.65 * (5.0) = 30 + 8.25 = 38.25 N/mm².',
          'Step 3: Verification with IS 10262 Alternative Check:\nIS 10262:2019 also specifies f\'ck = fck + X (where X = 6.5 for M30) = 30 + 6.5 = 36.5 N/mm². The higher value (38.25 N/mm²) governs the laboratory mix proportioning.'
        ],
        finalAnswer: 'Target Mean Compressive Strength f\'ck = 38.25 N/mm² (MPa)',
        answerUnit: 'N/mm²',
        takeaway: 'Concrete is proportioned in the laboratory for 38.25 MPa so that in the field, 95% of all samples exceed 30 MPa.',
        examProvenance: 'GATE Civil / UPSC ESE'
      }
    ],
    conceptTraps: [
      {
        id: 'trap-mortar-sand',
        subject: 'Building Materials & Concrete Technology',
        topic: 'Function of Sand in Mortar',
        branch: 'Geomatics, Materials & Management',
        trapTitle: 'Misconception That Sand Adds Strength to Mortar',
        commonMistake: 'Selecting "sand increases compressive strength of mortar" in MCQ examinations.',
        correctConcept: 'Pure cement paste has higher compressive strength than cement-sand mortar. Sand is added to reduce shrinkage, prevent surface cracking, provide bulk/economy, and allow gas permeability. Sand does NOT impart chemical strength to mortar.',
        whyCandidatesFail: 'Intuition suggests sand makes mortar "stiffer", confusing stiffness with binding strength.',
        preventionRule: 'Sand provides bulk, prevents shrinkage, and cuts cost. Binder (cement/lime) provides strength.'
      }
    ],
    quickRevisionFacts: [
      'Abrams Law: Compressive strength S = A / B^(W/C); depends solely on water-cement ratio for fully compacted mix.',
      'Slump cone dimensions: 300 mm high, 100 mm top diameter, 200 mm base diameter.',
      'Minimum concrete grade for Prestressed Concrete: Pre-tensioned = M40; Post-tensioned = M30.',
      'Creep coefficient: 2.2 at 7 days, 1.6 at 28 days, 1.1 at 1 year.'
    ],
    prerequisites: ['ck-mat-001'],
    relatedConceptSlugs: ['building-materials-traditional-stones-bricks-cement-timber', 'cpm-pert-project-scheduling-floats'],
    downstreamApplications: ['RCC Design IS 456', 'Prestressed Concrete Bridge Design']
  },

  /* ==========================================================================
     BHAVIKATTI CH. 5, 6: METALS & MISCELLANEOUS BUILDING MATERIALS
     ========================================================================== */
  {
    id: 'ck-mat-003',
    slug: 'building-materials-metals-plastics-paints-blocks',
    title: 'Metals, Polymers, Bitumen, Paints & Precast Concrete Masonry Blocks',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    subject: 'Building Materials & Concrete Technology',
    unit: 'Unit 1: Civil Engineering Materials',
    chapter: 'Chapter 5-6: Metals & Miscellaneous Materials',
    topic: 'Ferrous & Non-Ferrous Metals, Polymers, Bitumen, Paints & Concrete Blocks',
    subtopic: 'Cast Iron vs Wrought Iron, TMT Rebar Quenching, Thermoplastics, Bitumen vs Tar, Paint Vehicles',
    difficulty: 'INTERMEDIATE',
    keywords: [
      'cast iron', 'wrought iron', 'TMT steel', 'martensite', 'aluminium', 'copper',
      'plastics', 'thermoplastic', 'thermosetting', 'bitumen', 'tar', 'asphalt',
      'paint', 'vehicle', 'drier', 'varnish', 'concrete blocks', 'IS 1786', 'IS 2185'
    ],
    theory: {
      summary: 'Complete engineering review of ferrous metals (Cast Iron, Wrought Iron, Structural Steels, Thermo-Mechanically Treated TMT bars), non-ferrous architectural metals (Aluminium, Copper), synthetic polymers (Thermoplastics vs Thermosets), bituminous binders (Bitumen, Tar, Asphalt), paints/distempers/varnishes, and precast concrete blocks per Dr. S.S. Bhavikatti.',
      definitions: [
        'Cast Iron: Ferrous product obtained by remelting pig iron with coke and limestone in a cupola furnace containing 2.0% to 4.5% carbon; exhibits very high compressive strength (600 MPa) but is brittle and weak in tension (150 MPa).',
        'Wrought Iron: The purest commercial iron manufactured in a puddling furnace containing < 0.15% carbon; highly ductile, malleable, fibrous, and easily welded and forged.',
        'TMT Steel (Thermo-Mechanically Treated): High-yield rebar manufactured by intensive controlled in-line water quenching of hot-rolled bars producing a tough, hard martensitic outer rim surrounding a ductile, soft ferrite-pearlite core.',
        'Thermoplastics: Linear long-chain polymers that soften when heated and harden upon cooling reversibly without cross-linking (e.g. PVC, Polyethylene), allowing repeated moulding and recycling.',
        'Thermosetting Plastics: Polymer resins that undergo permanent irreversible chemical cross-linking upon heat curing (e.g. Bakelite, Epoxy, Melamine), decomposing rather than softening upon reheating.',
        'Bitumen: A black or dark-brown viscous petroleum residue consisting of high molecular weight hydrocarbons completely soluble in carbon disulfide (CS2).',
        'Coal Tar: A dark viscous liquid byproduct obtained by the destructive distillation of coal at high temperatures, rich in volatile aromatic compounds and pitch.'
      ],
      principlesAndLaws: [
        'Carbon Content vs Ductility Law: In ferrous metals, increasing carbon content increases ultimate tensile strength and hardness but dramatically decreases ductility, weldability, and impact toughness.',
        'TMT Quenching Microstructure: Outer rim = Tempered Martensite (provides high yield strength >= 500 MPa and wear resistance); Inner core = Ferrite + Pearlite (provides high elongation >= 14.5% and seismic energy dissipation).',
        'Bitumen vs Coal Tar Temperature Susceptibility: Coal tar has much higher temperature susceptibility (softens rapidly in summer, becomes brittle in winter) than bitumen. Bitumen is non-carcinogenic; coal tar contains carcinogenic phenols and pitch.',
        'Paint Formulation Mechanics: Base (provides opacity, body, and resistance, e.g. white lead, zinc oxide, titanium dioxide) + Vehicle/Binder (holds pigment particles in suspension, e.g. raw/double-boiled linseed oil, tung oil) + Pigment (imparts color) + Thinner/Solvent (adjusts viscosity, e.g. turpentine) + Drier (catalytic oxidation accelerator, e.g. litharge, manganese dioxide).'
      ],
      governingAssumptions: [
        'Aluminium density is 2.7 g/cm³ (approx. 1/3rd that of steel 7.85 g/cm³); corrosion resistance is provided by a self-healing micro-thin aluminium oxide (Al2O3) film.',
        'Concrete masonry blocks per IS 2185 are categorized as Grade A/B (load-bearing hollow blocks, min density 1500 kg/m³, crushing strength >= 3.5 to 15.0 MPa) and Grade C (non-load-bearing, min 1000 kg/m³, >= 1.5 MPa).'
      ],
      detailedExplanation: '1. Ferrous Metals (Bhavikatti Ch. 5):\n- Pig Iron: Raw blast-furnace smelting product (3.5-4.5% C).\n- Cast Iron: Grey, white, and malleable cast irons. Unmachinable when chilled. Ideal for manhole covers, drainage pipes, and heavy machinery bases.\n- Wrought Iron: Slag inclusion fibers give resistance to progressive shock and corrosion; historical railway couplings and crane chains.\n- Structural Steel Grades: Fe 250 (Mild steel, yield 250 MPa, elongation 23%), Fe 415, Fe 500, Fe 550, and Fe 600. TMT rebars have completely replaced cold-twisted deformed (CTD) Tor-steel because CTD twists cause surface micro-cracks and residual stresses that accelerate corrosion.\n\n2. Plastics in Construction (Bhavikatti Ch. 6):\n- PVC (Polyvinyl Chloride): Rigid PVC for water supply pipes, rainwater gutters, window profiles; Flexible PVC for floor tiles and cable insulation.\n- HDPE (High-Density Polyethylene): High impact resistance, underground water and gas pipelines.\n- Epoxies: Structural bonding, crack injection in damaged concrete, industrial chemical-resistant floor screeds.\n\n3. Bituminous Materials:\n- Asphalt: Natural rock asphalt or manufactured mix of bitumen (10-15%) with graded mineral aggregate (sand, stone dust, chips).\n- Cutback Bitumen: Bitumen liquefied by blending with volatile petroleum solvent (kerosene, naphtha, or diesel) for cold-weather spray application.\n- Bitumen Emulsion: Microscopic bitumen droplets suspended in water with emulsifying soap; applied cold on wet road surfaces.\n\n4. Wall Finishes:\n- Distemper: Powdered chalk (whiting), water, and animal glue or casein binder. Economical internal wall coating; washable or non-washable.\n- Varnish: Solution of natural/synthetic resin (copal, lac, dammar) in drying oil or turpentine/alcohol. Dries to a transparent lustrous protective film revealing the natural grain of wood.',
      applications: [
        'TMT Fe 500D rebars for earthquake-resistant RCC buildings (the "D" denotes guaranteed high uniform elongation >= 16%).',
        'Aluminium extrusion frames for curtain-wall glazing, sliding doors, and architectural facades.',
        'Bituminous mastic asphalt for bridge deck waterproofing and terrace waterproofing membranes.'
      ],
      limitations: [
        'Cast iron fails abruptly in tension without warning necking; prohibited for flexural structural members.',
        'Plastics undergo accelerated UV photo-degradation and lose tensile strength under prolonged tropical sun exposure.'
      ],
      comparisons: [
        {
          aspect: 'Solubility & Origin',
          itemA: { label: 'Bitumen', value: 'Petroleum distillation residue. 100% soluble in carbon disulfide (CS2). Low temperature susceptibility.' },
          itemB: { label: 'Coal Tar', value: 'Destructive distillation of coal. Insoluble pitch residue in CS2. High temperature susceptibility; carcinogenic.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-tmt-section',
        title: 'TMT Rebar Quenched Microstructure Cross-Section',
        format: 'ASCII',
        content: `
                 HOT-ROLLED REBAR RAPID WATER QUENCHING
                               |
                               v
               +-------------------------------+
              /     TEMPERED MARTENSITE RIM     \\
             /   (Hard, Wear-Resistant, fy >= 500) \\
            |   +-----------------------------+   |
            |  /     FERRITE - PEARLITE        \\  |
            | |             CORE                | |
            | |   (Soft, Ductile, High Energy   | |
            | |    Absorption, Elongation >=16%)| |
            |  \\                               /  |
            |   +-----------------------------+   |
             \\                                   /
              \\                                 /
               +-------------------------------+
        `,
        caption: 'Dual-phase metallurgical microstructure of modern Thermo-Mechanically Treated (TMT) rebar.'
      }
    ],
    formulas: [],
    codeProvisions: [
      {
        standard: 'IS 1786:2008',
        clauseOrTable: 'Table 3',
        title: 'High Strength Deformed Steel Bars for Concrete Reinforcement',
        provisionText: 'Specifies chemical and mechanical requirements for Fe 415, Fe 500, Fe 550, and Fe 600 and their "D" (ductile) counterparts. Fe 500D requires min yield 500 MPa, tensile-to-yield ratio >= 1.10, and min elongation 16.0%.',
        isMandatory: true
      },
      {
        standard: 'IS 2185 (Part 1):2005',
        clauseOrTable: 'Cl. 7.1 & Table 1',
        title: 'Concrete Masonry Units — Hollow and Solid Concrete Blocks',
        provisionText: 'Grade A (load-bearing hollow units with min face shell thickness 30 mm) shall possess minimum 28-day compressive strength of 3.5 to 15.0 N/mm² based on block class.',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-rebar-yield',
        title: 'Tensile-to-Yield Ratio and Elongation Check for Fe 500D Rebar',
        problemStatement: 'A 16 mm diameter TMT steel rebar sample is tested in universal tension testing machine. The gauge length is 80 mm. The bar yields at a load of 106.5 kN and fractures at an ultimate load of 122.5 kN. The final distance between gauge marks after fracture is 93.8 mm. Check if the rebar satisfies the seismic ductility requirements of IS 1786:2008 for Fe 500D.',
        givenData: {
          'Bar nominal diameter (d)': '16 mm',
          'Cross-sectional area (A0)': 'pi * (16)^2 / 4 = 201.06 mm²',
          'Initial gauge length (L0)': '80 mm',
          'Yield load (Py)': '106.5 kN = 106,500 N',
          'Ultimate load (Pu)': '122.5 kN = 122,500 N',
          'Final gauge length (Lf)': '93.8 mm'
        },
        governingFormulas: [
          'Yield Strength (fy) = Py / A0',
          'Ultimate Tensile Strength (fu) = Pu / A0',
          'Ratio = fu / fy',
          'Elongation (%) = [(Lf - L0) / L0] * 100'
        ],
        stepByStepSolution: [
          'Step 1: Compute Yield Strength (fy):\nfy = 106,500 N / 201.06 mm² = 529.7 N/mm² (>= 500 N/mm² -> Satisfies Fe 500 minimum).',
          'Step 2: Compute Ultimate Tensile Strength (fu):\nfu = 122,500 N / 201.06 mm² = 609.3 N/mm².',
          'Step 3: Compute fu / fy Ratio:\nRatio = 609.3 / 529.7 = 1.150.\nIS 1786 requires fu / fy >= 1.10 for Fe 500D. Since 1.15 >= 1.10, this passes.',
          'Step 4: Compute Percentage Elongation:\nElongation = [(93.8 - 80) / 80] * 100 = (13.8 / 80) * 100 = 17.25%.\nIS 1786 requires elongation >= 16.0% for Fe 500D. Since 17.25% >= 16.0%, this passes.'
        ],
        finalAnswer: 'fy = 529.7 MPa, fu/fy = 1.15, Elongation = 17.25%; Rebar fully complies with IS 1786 Fe 500D seismic grade.',
        answerUnit: '%',
        takeaway: 'High fu/fy ratio and high elongation guarantee that plastic hinges form safely during an earthquake without sudden brittle rebar snap.',
        examProvenance: 'GATE Civil / UPSC ESE'
      }
    ],
    conceptTraps: [
      {
        id: 'trap-paint-linseed',
        subject: 'Building Materials & Concrete Technology',
        topic: 'Constituents of Oil Paints',
        branch: 'Geomatics, Materials & Management',
        trapTitle: 'Confusing Paint Vehicle with Thinner',
        commonMistake: 'Identifying Turpentine as the Vehicle (binder) and Linseed Oil as the solvent/thinner.',
        correctConcept: 'Linseed oil is the VEHICLE (or binder) that forms the protective elastic film holding pigment particles together. Turpentine is the THINNER (or solvent) added only to adjust workability and evaporate away during drying.',
        whyCandidatesFail: 'Both are liquids mixed into the paint pot, but they perform opposite metallurgical functions.',
        preventionRule: 'Linseed Oil = Film-forming Vehicle. Turpentine = Evaporating Thinner. Litharge = Drier.'
      }
    ],
    quickRevisionFacts: [
      'Cast iron has high carbon (2.0-4.5%), high compressive strength (600 MPa), but brittle and weak in tension (150 MPa).',
      'Wrought iron has lowest carbon (< 0.15%), highly ductile and fibrous.',
      'TMT bars: Quenched outer martensitic rim with soft ferrite-pearlite core.',
      'Bitumen is 100% soluble in CS2; coal tar contains insoluble pitch residue.'
    ],
    prerequisites: ['ck-mat-001', 'ck-mat-002'],
    relatedConceptSlugs: ['building-materials-traditional-stones-bricks-cement-timber', 'building-construction-superstructure-masonry-finishes-stairs-roofs'],
    downstreamApplications: ['Steel Structure Fabrication', 'Earthquake Ductile Detailing']
  },

  /* ==========================================================================
     BHAVIKATTI UNIT II: BUILDING PLANNING & FOUNDATIONS
     ========================================================================== */
  {
    id: 'ck-bcon-001',
    slug: 'building-construction-planning-foundations-soils',
    title: 'Building Planning Principles, Safe Bearing Capacity & Foundation Engineering',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    subject: 'Building Construction & Planning',
    unit: 'Unit 2: Building Construction',
    chapter: 'Chapter 7-8: Building Planning & Foundations',
    topic: 'Principles of Planning, Safe Bearing Capacity & Foundation Engineering',
    subtopic: 'Rankine Minimum Depth, Spread/Combined Footings, Raft, Grillage, Under-Reamed Piles in Black Cotton Soil',
    difficulty: 'INTERMEDIATE',
    keywords: [
      'planning principles', 'aspect', 'prospect', 'FAR', 'FSI', 'foundation', 'SBC',
      'Rankine depth', 'spread footing', 'strap footing', 'raft foundation', 'grillage',
      'under-reamed piles', 'black cotton soil', 'caissons', 'NBC 2016'
    ],
    theory: {
      summary: 'Comprehensive textbook analysis of architectural building planning principles, building bye-laws (FAR, setbacks), soil Safe Bearing Capacity (SBC) classifications, Rankine minimum foundation depth, shallow foundation types (spread, stepped, combined, strap cantilever, mat/raft, steel grillage), and deep foundation solutions for problematic soils (under-reamed piles for expansive black cotton soil and well foundations/caissons) per Dr. S.S. Bhavikatti.',
      definitions: [
        'Floor Area Ratio (FAR) / Floor Space Index (FSI): The quotient obtained by dividing the total covered gross built-up area of all floors by the total area of the plot: FAR = (Total Floor Area of all Storeys) / (Plot Area).',
        'Aspect: The strategic orientation and placement of doors and windows in external walls to admit natural sunlight, fresh air, and prevailing seasonal breezes into specific rooms.',
        'Prospect: The architectural arrangement of doors, windows, and balconies to command pleasant, uplifting views of surrounding landscapes while screening unsightly features.',
        'Safe Bearing Capacity (SBC): The maximum gross contact pressure that supporting soil can sustain safely without risk of shear failure or exceeding permissible differential settlement.',
        'Under-Reamed Pile: A bored cast-in-situ concrete pile having one or more enlarged bulbous pedestals (under-reams) along its stem, engineered to anchor structures in swelling/shrinking soils.',
        'Grillage Foundation: A shallow foundation consisting of one or two orthogonal tiers of rolled steel joists (RSJ) encased in concrete, used to transmit heavy column loads to soils of low bearing capacity without deep excavation.'
      ],
      principlesAndLaws: [
        'Principles of Architectural Planning (Bhavikatti Ch. 7): 1. Aspect; 2. Prospect; 3. Privacy (internal between rooms and external from streets); 4. Grouping (functional correlation of rooms, e.g. kitchen adjacent to dining); 5. Roominess (optimal length-to-breadth ratio 1.2 to 1.5); 6. Sanitation (natural light and cross-ventilation); 7. Circulation (unobstructed horizontal corridors and vertical stairways); 8. Flexibility; 9. Elegance; 10. Economy.',
        'Standard Room Orientations for India: Kitchen towards East (morning sunlight kills bacteria); Bedrooms towards South-West or West (receives pleasant prevailing south-west breeze and winter sun); Living room towards North or East; Reading room towards North (glare-free uniform light).',
        'Bhavikatti Safe Bearing Capacity Table 7.1: Igneous rocks (granite, basalt) = 3300 kN/m²; Sedimentary rocks (limestone, sandstone) = 1650 kN/m²; Compact gravel and sand-gravel = 450 kN/m²; Medium coarse sand = 250 kN/m²; Fine compact sand = 150 kN/m²; Soft clay = 100 kN/m²; Black cotton soil / very soft clay = 50 kN/m².',
        'Rankine Minimum Foundation Depth: H_min = (p / w) * [(1 - sin phi) / (1 + sin phi)]^2. Where p is safe bearing capacity, w is unit weight of soil, and phi is angle of internal friction. In practice, minimum foundation depth is 0.9 m to prevent frost and seasonal shrinkage heave.',
        'Black Cotton Soil Mechanism: Highly expansive clay rich in Montmorillonite mineral that swells heavily in the rainy season and undergoes extreme volumetric shrinkage with deep vertical fissures (up to 150 mm wide and 3 m deep) during summer. Piles must be anchored below the active zone (minimum 3.5 m depth).'
      ],
      governingAssumptions: [
        'Footing base is assumed rigid with planar contact pressure distribution against soil.',
        'Under-ream bulb diameter is typically 2.0 to 2.5 times the stem diameter; vertical spacing between multiple bulbs is 1.25 to 1.5 times the bulb diameter.',
        'Raft foundation is mandatory when individual isolated column footings would occupy more than 50% of the total building footprint area.'
      ],
      detailedExplanation: '1. Building Planning & Bye-Laws:\n- Plinth Height: Minimum 450 mm above the crown of the front abutting road to prevent monsoon storm runoff inundation.\n- Habitable Room Sizes: Minimum carpet area 9.5 m² with minimum width 2.4 m and clear ceiling height 2.75 m.\n- Window Openings: Aggregate glazed area of windows and ventilators must be at least 1/10th (10%) of the floor area in dry climates, and 1/6th (16.7%) in humid tropical climates.\n\n2. Shallow Foundations (Bhavikatti Ch. 8):\n- Spread / Stepped Footing: Masonry wall footings where concrete bed projection equals footing thickness, widening at 45° load dispersion angles.\n- Combined Footing: Supports two columns. Rectangular if column loads are equal; Trapezoidal if column loads are unequal or boundary plot restrictions exist (centroid of footing area must coincide with line of action of resultant column load).\n- Strap (Cantilever) Footing: Independent footing of an exterior column on a property boundary connected by a stiff, cantilevered strap beam to an interior footing to balance overturning moment without contact soil pressure under the strap.\n- Raft / Mat Foundation: Continuous reinforced concrete slab covering the entire substructure, bridging soft local pockets and virtually eliminating differential settlement.\n- Steel Grillage Foundation: Two tiers of RSJ beams separated by spacers and completely encased in 100 mm minimum concrete cover to prevent steel corrosion.\n\n3. Deep Foundations:\n- End-bearing piles transfer load to hard bedrock; Friction piles transfer load through skin friction in deep soft clays.\n- Under-Reamed Piles in Expansive Soils (IS 2911 Part 3): Stem diameter 200 to 300 mm, bulb diameter 500 to 750 mm bored using augers and under-reamer tools, reinforced with steel cage and poured with M20 concrete. Anchored securely into the stable inactive stratum below the 3.0 m moisture variation zone.',
      applications: [
        'Under-reamed pile foundations for multi-storey residential quarters across Central India and Deccan basalt regions.',
        'Mat/raft foundations for commercial shopping complexes and hospitals on alluvial soils of the Gangetic and Brahmaputra plains.',
        'Pneumatic and open well caissons for major river bridges and offshore jetty terminals.'
      ],
      limitations: [
        'Spread footings fail catastrophically in black cotton soils due to unequal seasonal swell-shrink heave.',
        'Under-reamed piles cannot be bored through running sands without bentonite slurry or casing pipes.'
      ],
      comparisons: [
        {
          aspect: 'Load Transfer Mechanism',
          itemA: { label: 'Shallow Spread Footing', value: 'Transfers load by direct contact bearing pressure to soil immediately beneath the footing base (depth D <= width B).' },
          itemB: { label: 'Under-Reamed Deep Pile', value: 'Transfers load to deep stable strata via bulb bearing plus shaft skin friction well below active swelling layers.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-underreamed-pile',
        title: 'Under-Reamed Pile in Expansive Black Cotton Soil',
        format: 'ASCII',
        content: `
            GROUND LEVEL
            =============+===========+=============
            |            |  GRADE    |            |   ACTIVE SWELL / SHRINK
            |            |   BEAM    |            |   ZONE (0 to 3.0 m depth)
            |            |===========|            |   Deep shrinkage cracks
            |                 | |                 |   in dry summer
            |                 | |                 |
            |                 | | Stem dia (d)    |
            |              .--' '--.              |
            |             /         \\             |
            |            |  BULB 1   | Bulb dia   |
            |             \\ (2.5 d) /             |
            |              '--. .--'              |
            |                 | |                 |
            - - - - - - - - - | | - - - - - - - - -   INACTIVE STABLE ZONE
            |              .--' '--.              |   (Constant moisture)
            |             /         \\             |
            |            |  BULB 2   | Spacing    |
            |             \\         /  (1.5 D_b)  |
            |              '--. .--'              |
            |                 | |                 |
            ==================+ = +================
        `,
        caption: 'Multi-under-reamed pile anchored deep in the stable stratum below the active swelling layer (Bhavikatti Fig. 8.11).'
      },
      {
        id: 'diag-stepped-footing',
        title: 'Masonry Wall Stepped Spread Footing',
        format: 'ASCII',
        content: `
                 WALL (Width t)
                     |   |
                  +--+   +--+
                  |  OFFSET | (50 mm projection per course)
                +-+         +-+
                |             |
              +-+             +-+
              |                 |
            +-+                 +-+
            |  LEAN CONCRETE BED  | (1:4:8 or 1:3:6)
            +---------------------+
            <====== Width B ======>
                     v
             Soil Bearing Pressure (p <= SBC)
        `,
        caption: 'Stepped spread footing load dispersion in continuous masonry walls (Bhavikatti Fig. 8.1).'
      }
    ],
    formulas: [CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-001')!],
    codeProvisions: [
      {
        standard: 'IS 1904:1986',
        clauseOrTable: 'Cl. 6.1',
        title: 'Structural Safety of Buildings: Shallow Foundations — Depth',
        provisionText: 'All foundations shall extend to a minimum depth of 0.90 m below natural ground level to protect against surface weathering, seasonal moisture variation, and topsoil scour.',
        isMandatory: true
      },
      {
        standard: 'IS 2911 (Part 3):1980',
        clauseOrTable: 'Cl. 5.2',
        title: 'Design and Construction of Under-Reamed Pile Foundations',
        provisionText: 'Bulb diameter shall be between 2.0 and 2.5 times the stem diameter. For multi-under-reamed piles, vertical bulb center-to-center distance shall be 1.25 to 1.50 times the bulb diameter.',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-rankine-depth-001',
        title: 'Computation of Minimum Foundation Depth Using Rankine Formula',
        problemStatement: 'A residential building is to be constructed on a sandy soil site. The safe bearing capacity of the soil is p = 180 kN/m², unit weight of soil is w = 18 kN/m³, and angle of internal friction is phi = 30°. Determine the minimum depth of foundation required as per Rankine\'s formula.',
        givenData: {
          'Safe bearing capacity (p)': '180 kN/m²',
          'Unit weight of soil (w)': '18 kN/m³',
          'Angle of internal friction (phi)': '30°'
        },
        governingFormulas: [
          'Rankine Minimum Depth H_min = (p / w) * [(1 - sin phi) / (1 + sin phi)]^2'
        ],
        stepByStepSolution: [
          'Step 1: Compute the Active Earth Pressure Coefficient (Ka):\nsin(30°) = 0.50.\nKa = (1 - 0.50) / (1 + 0.50) = 0.50 / 1.50 = 1/3.',
          'Step 2: Square the Pressure Ratio:\n(Ka)^2 = (1/3)^2 = 1/9 = 0.1111.',
          'Step 3: Evaluate Minimum Depth:\nH_min = (p / w) * (Ka)^2\nH_min = (180 / 18) * (1/9) = 10 * 0.1111 = 1.111 meters.',
          'Step 4: Check Practical Field Requirement:\nIS 1904 recommends minimum 0.90 m depth. Since 1.11 m >= 0.90 m, adopt minimum depth of 1.15 to 1.20 meters.'
        ],
        finalAnswer: 'Rankine Minimum Depth H_min = 1.11 m (Adopt 1.20 m in practice)',
        answerUnit: 'm',
        takeaway: 'Notice that squaring the coefficient Ka = 1/3 reduces the depth multiplier to 1/9th of (p/w). Candidates often forget the square and erroneously obtain 3.33 m.',
        examProvenance: 'GATE Civil / APSC CCE'
      }
    ],
    conceptTraps: [
      {
        id: 'trap-bldg-rankine-sq',
        subject: 'Building Construction & Planning',
        topic: 'Rankine Foundation Depth Formula',
        branch: 'Geomatics, Materials & Management',
        trapTitle: 'Forgetting the Square on the Rankine Pressure Coefficient',
        commonMistake: 'Using H_min = (p/w) * [(1-sin phi)/(1+sin phi)] without squaring the term.',
        correctConcept: 'The Rankine minimum foundation depth equation requires the square: H_min = (p/w) * [(1-sin phi)/(1+sin phi)]^2 = (p/w) * Ka^2.',
        whyCandidatesFail: 'Confusing the lateral active earth pressure equation (pa = Ka * sigma) with the foundation depth equation which balances vertical surcharge with passive resistance.',
        preventionRule: 'Depth formula has (Ka)^2. Lateral earth pressure has Ka.'
      }
    ],
    quickRevisionFacts: [
      'Rankine minimum depth: H_min = (p/w) * [(1 - sin phi) / (1 + sin phi)]^2; absolute minimum depth is 0.9 m per IS 1904.',
      'SBC hierarchy: Igneous rocks (3300 kPa) > Sedimentary (1650) > Medium sand (250) > Soft clay (100) > Black cotton soil (50 kPa).',
      'Under-reamed pile bulb diameter = 2.0 to 2.5 times stem diameter.',
      'FAR = Total built-up area of all floors / Total plot area.'
    ],
    prerequisites: ['ck-mat-001'],
    relatedConceptSlugs: ['building-construction-superstructure-masonry-finishes-stairs-roofs', 'surveying-linear-compass-plane-table-theodolite'],
    downstreamApplications: ['Foundation Structural Design', 'Subsoil Geotechnical Investigation']
  },

  /* ==========================================================================
     BHAVIKATTI CH. 9, 10: SUPERSTRUCTURES, FINISHES, STAIRS & ROOFS
     ========================================================================== */
  {
    id: 'ck-bcon-002',
    slug: 'building-construction-superstructure-masonry-finishes-stairs-roofs',
    title: 'Superstructures: Brick/Stone Masonry Bonds, Finishes, Stairs & Roof Trusses',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    subject: 'Building Construction & Planning',
    unit: 'Unit 2: Building Construction',
    chapter: 'Chapter 9-10: Superstructures, Masonry, Components & Stairs',
    topic: 'Masonry Bonds, Plastering, Pointing, Flooring, Roof Trusses & Stairs',
    subtopic: 'English vs Flemish Bonds, King/Queen Closers, Struck/Weathered Pointing, Truss Spans, Stair Comfort Formula',
    difficulty: 'FUNDAMENTAL',
    keywords: [
      'English bond', 'Flemish bond', 'queen closer', 'rubble masonry', 'ashlar',
      'plastering', 'pointing', 'terrazzo', 'king post truss', 'queen post truss',
      'north light truss', 'staircase', 'rise and tread', 'DPC', 'IS 2212'
    ],
    theory: {
      summary: 'Thorough textbook instruction in building superstructures, stone masonry (rubble vs ashlar), brick bonds (English, Flemish, Stretcher, Header), closer cuts, cavity walls, damp proofing (DPC), internal/external plastering and pointing styles, floor finishes (terrazzo, mosaic, vitrified), pitched roofs and truss geometries (King post, Queen post, Howe, Pratt, North light), lintels/arches, and staircase design rules per Dr. S.S. Bhavikatti.',
      definitions: [
        'English Bond: A brick masonry bond consisting of alternate courses of pure stretchers and pure headers, with a queen closer placed next to the quoin header in each heading course to break vertical joints.',
        'Flemish Bond: A brick masonry bond in which each individual course comprises alternate headers and stretchers along the entire face of the wall.',
        'Queen Closer: A portion of a brick obtained by cutting a standard brick lengthwise into two equal halves (190 x 45 x 90 mm), placed immediately next to the corner quoin header to create a 1/4th brick lap.',
        'Ashlar Masonry: High-grade stone masonry constructed from square or rectangular stone blocks finely dressed with chisel on all beds and joints, laid with thin mortar joints not exceeding 3 to 5 mm.',
        'Pointing: The process of raking out green mortar joints to a depth of 12 to 20 mm and filling them with high-grade rich mortar (1:2 or 1:3) finished in specific decorative profiles to resist rain penetration.',
        'King Post Truss: A timber or steel triangular pitched roof truss having a single central vertical member (king post) acting in tension to suspend the tie beam and support two diagonal struts for spans up to 8 meters.',
        'Queen Post Truss: A pitched roof truss having two vertical tension posts (queen posts) interconnected at the top by a horizontal straining beam, suitable for spans between 8 and 12 meters.'
      ],
      principlesAndLaws: [
        'Brick Masonry Bonding Rules: 1. Continuous vertical joints must never exist between adjacent courses; 2. Lap must be at least 1/4th brick length along the wall length; 3. Queen closer is placed immediately adjacent to the quoin header, NEVER at the corner end; 4. English bond is stronger than Flemish bond for walls thicker than 1 brick; Flemish bond gives a more attractive artistic face.',
        'Staircase Comfort Empirical Rules (Bhavikatti Ch. 8 & 10): 1. (2 * Rise) + Tread = 550 to 600 mm; 2. Rise + Tread = 400 to 450 mm; 3. Rise * Tread = 40,000 to 45,000 mm². Standard dimensions: Residential Rise = 150 to 175 mm, Tread = 250 mm; Public buildings Rise = 120 to 150 mm, Tread = 300 mm. Stair pitch must remain between 25° and 40° with minimum headroom clearance of 2.1 meters.',
        'Roof Truss Span Classifications (Bhavikatti Table 10.1): King Post (up to 8 m); Queen Post (8 to 12 m); Fink / French truss (up to 10 m); Fan truss (10 to 15 m); Howe truss (6 to 30 m); Pratt truss (6 to 100 m); North Light saw-tooth roof (8 to 10 m span, steeper glazed north-facing pitch at 60° admitting uniform daylight without direct solar glare for factories).',
        'Damp Proof Course (DPC) Mechanics: Continuous horizontal layer of 25 to 50 mm thick rich cement concrete (1:1.5:3 or 1:2:4) with integral waterproofing compound (2% by cement weight) coated with hot bitumen (1.7 kg/m²), laid at plinth level to block upward capillary suction of groundwater.'
      ],
      governingAssumptions: [
        'Mortar joints in standard brickwork are assumed 10 mm thick.',
        'King post and queen post vertical members are subjected to TENSION (not compression), counteracting gravity sag of the bottom tie beam.',
        'Maximum number of steps in a single stair flight is limited to 12 to 14; minimum steps per flight is 3.'
      ],
      detailedExplanation: '1. Brick Masonry Bonds (Bhavikatti Ch. 9):\n- English Bond: Alternate header and stretcher courses. Strongest bond for all wall thicknesses.\n- Flemish Bond: Double Flemish (both faces show alternate header/stretcher) and Single Flemish (facing is Flemish, backing is English bond; requires minimum 1.5 brick wall thickness).\n- Stretcher Bond (Running bond): All stretchers; used only for half-brick thick (100 mm) partition walls.\n- Header Bond: All headers; used for curved brick walls and footing steps.\n\n2. Plastering & Pointing:\n- Plastering applied in 1, 2, or 3 coats (12 to 20 mm total): Rendering / scratch coat (1:3 or 1:4), Floating coat (1:4), and Finishing coat (1:6 or neat lime putty). Common defects: Blistering (local swelling from unslaked lime), Efflorescence, Cracking, and Crazing.\n- Pointing Types:\n  * Flush pointing: Mortar pressed flush with brick edge; does not collect dust.\n  * Struck pointing: Upper edge pressed in 12 mm while lower edge remains flush; sheds rainwater.\n  * Weathered / V-pointing: Triangular groove with apex in center.\n  * Recessed pointing: Mortar pressed back 5 to 6 mm forming clean shadow lines.\n  * Keyed / Grooved pointing: Curved concavity formed with round steel tool.\n\n3. Floorings:\n- Cement Concrete (IPS - Indian Patent Stone): 1:2:4 concrete wearing surface laid in alternate panels to avoid shrinkage cracking.\n- Terrazzo / Mosaic Flooring: Base concrete coat + 6 to 10 mm wearing coat consisting of marble chips (size 3 to 6 mm) embedded in white or colored cement (1:1.5 to 1:2 ratio), ground with carborundum stones and oxalic acid polished.\n\n4. Lintels vs Arches:\n- Lintels: Flexural horizontal beams bridging openings (RCC, stone, timber, steel).\n- Arches: Curved structures transferring loads purely through masonry voussoir compression to skewbacks and abutments.',
      applications: [
        'Dog-legged stairs in residential buildings with compact central staircases.',
        'North light steel roof trusses in textile mills, machine shops, and printing presses.',
        'Cavity walls (50 mm cavity with metal ties) in high-rainfall coastal regions for 100% damp prevention and thermal insulation.'
      ],
      limitations: [
        'Flemish bond requires skilled masons and involves more broken bats than English bond.',
        'King post wooden trusses cannot be used economically for spans exceeding 8 meters due to timber deflection.'
      ],
      comparisons: [
        {
          aspect: 'Bonding Mechanics',
          itemA: { label: 'English Bond', value: 'Alternate courses of headers and stretchers. Zero continuous vertical joints. Superior structural strength.' },
          itemB: { label: 'Double Flemish Bond', value: 'Alternate headers and stretchers in EVERY course. Highly aesthetic face, but creates partial internal vertical joint lines.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-english-flemish',
        title: 'English Bond vs Double Flemish Bond Elevation',
        format: 'ASCII',
        content: `
      ENGLISH BOND ELEVATION                 DOUBLE FLEMISH BOND ELEVATION
      +---+---+---+---+---+---+---+          +---+-------+---+-------+---+
      | H | H | H | H | H | H | H | Header   | H |   S   | H |   S   | H |
      +---+---+---+---+---+---+---+ Course   +---+-------+---+-------+---+
      |     S     |     S     |   | Stretcher|   S   | H |   S   | H |   S
      +---+---+---+---+---+---+---+ Course   +-------+---+-------+---+---+
      | H |QC | H | H | H | H | H | Header   | H |   S   | H |   S   | H |
      +---+---+---+---+---+---+---+ (QC next +---+-------+---+-------+---+
      |     S     |     S     |   | to Quoin)|   S   | H |   S   | H |   S
      +-----------+-----------+---+          +-------+---+-------+---+---+
      `,
        caption: 'Comparison of course patterns and Queen Closer (QC) placement in English and Flemish bonds.'
      },
      {
        id: 'diag-king-post',
        title: 'King Post Roof Truss (Span up to 8 m)',
        format: 'ASCII',
        content: `
                                   RIDGE
                                     /\\
                                    /  \\
                                   / |  \\
                  PRINCIPAL       /  |   \\      PRINCIPAL
                  RAFTER         /   |    \\     RAFTER
                                /    |     \\
                               /   .-'--.   \\
                              /   /  |   \\   \\
                             /   /   |STRUT   \\
                            /  |/_   |   _\\|   \\
                           /         |         \\
                          /          |          \\
                         +-----------+-----------+
                         <==== TIE BEAM (Tension) =>
                                     ^
                             KING POST (Tension rod)
        `,
        caption: 'King Post Roof Truss showing member forces: King post and Tie beam are in TENSION, Rafters and Struts are in COMPRESSION.'
      }
    ],
    formulas: [CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-012')!],
    codeProvisions: [
      {
        standard: 'IS 2212:1991',
        clauseOrTable: 'Cl. 7.2 & 7.3',
        title: 'Code of Practice for Brickwork — Bonding and Closers',
        provisionText: 'Queen closers shall be placed next to the corner quoin header in heading courses. In no case shall a closer be placed at the wall edge.',
        isMandatory: true
      },
      {
        standard: 'NBC 2016',
        clauseOrTable: 'Part 3, Cl. 4.12',
        title: 'National Building Code — Staircase Geometric Specifications',
        provisionText: 'Minimum width of staircase for residential buildings shall be 0.90 m, and for public buildings 1.50 m. Maximum rise 190 mm (residential) and 150 mm (public); minimum tread 250 mm (residential) and 300 mm (public). Minimum headroom clearance 2.1 m.',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-stair-design-001',
        title: 'Design of a Residential Dog-Legged Staircase per NBC Rules',
        problemStatement: 'Design a dog-legged staircase for a residential building where the vertical height between floor slabs is 3.30 meters. The staircase hall is 2.50 m wide and 4.80 m long. Use standard comfortable residential rise and tread proportions.',
        givenData: {
          'Floor-to-floor vertical height (H)': '3.30 m = 3300 mm',
          'Staircase hall dimensions': '2.50 m wide x 4.80 m long',
          'Two equal flights': 'Height per flight h = 3300 / 2 = 1650 mm'
        },
        governingFormulas: [
          'Number of Risers per flight (N_R) = h / R',
          'Number of Treads per flight (N_T) = N_R - 1',
          'Comfort Rule: 2 * R + T = 550 to 600 mm'
        ],
        stepByStepSolution: [
          'Step 1: Select Rise (R):\nAdopt a standard comfortable residential rise R = 150 mm.\nNumber of risers per flight N_R = 1650 / 150 = 11 risers.',
          'Step 2: Determine Tread (T) from Comfort Rule:\nUsing 2 * R + T = 600 mm:\nT = 600 - 2 * (150) = 600 - 300 = 300 mm.\n(Alternatively, 2 * 150 + 250 = 550 mm; choose T = 250 mm for optimal spatial economy).',
          'Step 3: Number of Treads per Flight:\nN_T = N_R - 1 = 11 - 1 = 10 treads.',
          'Step 4: Hall Length Verification:\nLength of going of flight = N_T * T = 10 * 250 mm = 2500 mm = 2.50 m.\nLanding width = flight width = 1.20 m at each end.\nTotal length required = 1.20 m (bottom landing) + 2.50 m (going) + 1.20 m (mid landing) = 4.90 m.\nAdjust: Use landing width 1.15 m at each end: 1.15 + 2.50 + 1.15 = 4.80 m. Exactly fits the 4.80 m hall!'
        ],
        finalAnswer: 'Adopt Rise R = 150 mm, Tread T = 250 mm, 11 Risers and 10 Treads per flight with 1.15 m landing width.',
        answerUnit: 'mm',
        takeaway: 'Remember that the number of treads is ALWAYS 1 less than the number of risers (N_T = N_R - 1) because the top landing serves as the final step.',
        examProvenance: 'State PSC AE / UPSC ESE'
      }
    ],
    conceptTraps: [
      {
        id: 'trap-truss-king-force',
        subject: 'Building Construction & Planning',
        topic: 'King Post Truss Member Forces',
        branch: 'Geomatics, Materials & Management',
        trapTitle: 'Believing the King Post Member is in Compression',
        commonMistake: 'Classifying the central vertical "king post" as a compression column because it looks like a post.',
        correctConcept: 'In a King Post roof truss under gravity loads, the central vertical King Post is in TENSION! It suspends the bottom horizontal tie beam to prevent it from sagging downward. The inclined rafters and struts are in compression.',
        whyCandidatesFail: 'The word "post" customarily implies a compression column, misleading candidates in structural MCQ exams.',
        preventionRule: 'King post is a tension hanger. Tie beam is in tension. Principal rafters and struts are in compression.'
      }
    ],
    quickRevisionFacts: [
      'Queen closer is placed immediately next to the quoin header in heading courses.',
      'King post truss is suitable for spans up to 8 m; Queen post truss for 8 to 12 m spans.',
      'Staircase comfort rule: 2R + T = 550 to 600 mm; number of treads = number of risers - 1.',
      'North light roof trusses provide glare-free, uniform daylight by facing their 60° glazed slope towards the North.'
    ],
    prerequisites: ['ck-mat-001', 'ck-bcon-001'],
    relatedConceptSlugs: ['building-materials-traditional-stones-bricks-cement-timber', 'building-construction-planning-foundations-soils'],
    downstreamApplications: ['Architectural Working Drawings', 'Roof Truss Structural Analysis']
  },

  /* ==========================================================================
     BHAVIKATTI UNIT III: SURVEYING & FIELD MEASUREMENTS
     ========================================================================== */
  {
    id: 'ck-surv-001',
    slug: 'surveying-linear-compass-plane-table-theodolite',
    title: 'Surveying: Linear Chaining, Compass, Plane Table Lehman Rules, Leveling & Modern Tools',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    subject: 'Surveying & Geomatics',
    unit: 'Unit 3: Surveying & Field Measurements',
    chapter: 'Chapter 11-16: Linear, Compass, Plane Table, Leveling & Modern Tools',
    topic: 'Survey Principles, Chaining Corrections, Bearings, Lehman\'s Rules, Leveling & Total Station/GPS',
    subtopic: 'Tape Corrections, Prismatic vs Surveyor Compass, Local Attraction, HI vs Rise/Fall, Reciprocal Leveling, Tacheometry & GPS',
    difficulty: 'GATE_IES',
    keywords: [
      'surveying principles', 'whole to part', 'metric chain', 'tape corrections', 'normal tension',
      'prismatic compass', 'surveyor compass', 'magnetic declination', 'local attraction',
      'plane table', 'Lehmans rules', 'three-point problem', 'leveling', 'reciprocal leveling',
      'curvature correction', 'total station', 'GPS', 'tacheometry'
    ],
    theory: {
      summary: 'Comprehensive textbook analysis of classical and modern geomatics per Dr. S.S. Bhavikatti. Covers the fundamental principles of surveying, tape/chain error corrections (temperature, pull, slope, sag, normal tension), compass surveying (Prismatic vs Surveyor, WCB vs QB, magnetic declination, local attraction correction), Plane Table survey methods and Lehman\'s trial-and-error rules for the Three-Point Problem, Spirit Leveling (HI vs Rise & Fall arithmetic checks, curvature/refraction corrections, reciprocal leveling), Theodolite/Tacheometry optical distance equations, Electronic Total Station, and GPS satellite trilateration.',
      definitions: [
        'Working from Whole to Part: The primary governing principle of surveying where a high-precision framework of control stations is established first across the entire boundary, and minor detailing is fitted inside to prevent error accumulation.',
        'Prismatic Compass: A circular magnetic compass where the graduated ring is attached to the magnetic needle and rotates with it, reading Whole Circle Bearings (WCB from 0° to 360° clockwise with 0° at South) through a reflecting prism.',
        'Surveyor Compass: A compass where the graduated ring is fixed to the box and the needle swings independently, reading Quadrantal/Reduced Bearings (QB from 0° to 90° in quadrants) directly from the glass cover.',
        'Magnetic Declination: The horizontal angle between the True (Geographic) Meridian and the Magnetic Meridian at any station.',
        'Reciprocal Leveling: A leveling field technique conducted across wide obstacles (rivers, ravines) where two sets of readings are taken from opposite banks, mathematically eliminating collimation error, earth\'s curvature, and atmospheric refraction.',
        'Total Station: An integrated electronic geodetic instrument combining an electronic transit theodolite, an electronic distance meter (EDM), an onboard microprocessor, and a digital data collector.',
        'GPS Trilateration: The geometric positioning method of calculating a receiver\'s 3D coordinates (X, Y, Z) and receiver clock offset by measuring radio signal transit times from at least 4 known orbiting satellites.'
      ],
      principlesAndLaws: [
        'Surveying Principles: 1. Always work from whole to part (never part to whole); 2. Fix the position of any new survey point by at least two independent measurements (linear, angular, or combination).',
        'Tape Corrections: Pull correction Cp = (P - P0)L / (AE); Temperature correction Ct = alpha * (Tm - T0) * L; Slope correction Cs = -h² / (2L) = -L(1 - cos theta); Sag correction Csag = -W²L / (24 P²). Sag correction is ALWAYS negative.',
        'Normal Tension Equation: The applied pull Pn at which the positive pull correction exactly cancels the negative sag correction: Pn = 0.204 W * sqrt(AE) / sqrt(Pn - P0).',
        'Compass Bearings: Back Bearing = Fore Bearing ± 180° (+ if FB < 180°, - if FB > 180°). True Bearing = Magnetic Bearing ± Declination (+ for East, - for West).',
        'Lehman\'s Rules for Three-Point Problem (Bhavikatti Ch. 14): 1. The true station p is always located such that all three rays are either all to the right or all to the left of the rays when facing the ground stations; 2. Distance of p from each ray is strictly proportional to the actual distance of the instrument from the ground station; 3. If the instrument is inside the great triangle ABC, p lies inside the triangle of error; if outside, p lies outside.',
        'Danger Circle in Plane Tabling: If the instrument station lies on the circumscribed circle passing through the three known ground stations (A, B, C), resection is mathematically indeterminate (infinite solutions).',
        'Curvature & Refraction: Curvature correction Cc = -0.0785 d² (meters for d in km); Refraction correction Cr = +0.0112 d²; Combined correction C_comb = -0.0673 d² (always subtractive from staff reading).'
      ],
      governingAssumptions: [
        'Standard metric chains are 20 m (100 links, 200 mm per link) or 30 m (150 links, 200 mm per link).',
        'In reciprocal leveling, atmospheric refraction is assumed identical during both reciprocal observations.',
        'Minimum 4 satellites are required simultaneously for a 3D GPS navigation fix (X, Y, Z, and receiver clock bias delta t).'
      ],
      detailedExplanation: '1. Linear Measurements & Chaining (Bhavikatti Ch. 12):\n- Types of Chains: Metric chain, Gunter\'s chain (66 ft, 100 links; 10 sq chains = 1 acre), Engineer\'s chain (100 ft, 100 links), Revenue chain (33 ft, 16 links).\n- Tapes: Cloth/linen, Metallic (brass wire reinforced), Steel tape, Invar tape (alloy of 64% steel and 36% nickel, alpha = 0.12 x 10^-6 /°C, used for highest precision geodetic base lines).\n- Ranging: Direct ranging (stations intervisible) vs Indirect/Reciprocal ranging (intervening hill/ridge prevents direct sight).\n\n2. Compass Surveying (Bhavikatti Ch. 13):\n- Local Attraction: Deflection of the magnetic needle from magnetic north caused by nearby magnetic bodies (iron pipes, power cables, railway rails). Detected when difference between FB and BB of a line is not equal to 180°.\n- Correction: Method of included angles (interior angles remain unaffected by local attraction) or Method of error adjustment.\n\n3. Leveling Reduction Methods (Bhavikatti Ch. 15):\n- Height of Instrument (Collimation) Method:\n  * HI = RL + Backsight; RL = HI - Intermediate sight / Foresight.\n  * Arithmetic Check: Sigma BS - Sigma FS = Last RL - First RL.\n  * Limitation: No arithmetic check on intermediate sights!\n- Rise and Fall Method:\n  * Difference between consecutive readings: positive = Rise, negative = Fall.\n  * Arithmetic Check: Sigma BS - Sigma FS = Sigma Rise - Sigma Fall = Last RL - First RL.\n  * Advantage: Provides complete mathematical check on all intermediate sights.\n\n4. Modern Geomatics (Bhavikatti Ch. 16):\n- Tacheometry: D = k * s * cos²(theta) + c * cos(theta); for anallactic lens k = 100, c = 0.\n- GPS Segments: Space segment (24+ satellites in 6 orbital planes at 20,200 km altitude), Control segment (master and monitor tracking stations), User segment (receivers).',
      applications: [
        'Total Station electronic traversing for highway and railway corridor alignment.',
        'Reciprocal leveling across major rivers for transmission line towers and bridge piers.',
        'Differential GPS (DGPS) for cadastral boundary mapping with sub-centimeter accuracy.'
      ],
      limitations: [
        'Prismatic compass is completely unreliable near high-voltage electrical lines and steel structures.',
        'Plane table surveying is restricted to open terrain and cannot be performed in rainy or high-wind weather.'
      ],
      comparisons: [
        {
          aspect: 'Compass Comparison',
          itemA: { label: 'Prismatic Compass', value: 'Reads WCB (0°-360°). 0° at South. Needle and ring rotate together. Sighting and reading simultaneous. Hand-held.' },
          itemB: { label: 'Surveyor Compass', value: 'Reads QB (0°-90°). 0° at North & South. Needle swings over fixed dial. Sighting and reading separate. Requires tripod.' }
        },
        {
          aspect: 'Leveling Reduction',
          itemA: { label: 'Collimation (HI) Method', value: 'Faster, fewer computations. Only checks BS and FS; does NOT verify Intermediate Sights (IS).' },
          itemB: { label: 'Rise & Fall Method', value: 'Laborious. Fully verifies all readings: Sigma BS - Sigma FS = Sigma Rise - Sigma Fall = Last RL - First RL.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-compass-dials',
        title: 'Prismatic Compass vs Surveyor Compass Graduations',
        format: 'ASCII',
        content: `
       PRISMATIC COMPASS (WCB)                 SURVEYOR COMPASS (QB)
               180° (North)                            0° (North)
                  |                                       |
                  |                                       |
        270° (E) -+- 90° (W)                    90° (W) -+- 90° (E)
                  |                                       |
                  |                                       |
                0° (South)                             0° (South)
        * Needle attached to ring               * Needle rotates freely
        * Reads WCB (0° to 360°)                * Reads QB (0° to 90°)
        * Prism at South (Eye vane)             * Sights through sight vanes
        `,
        caption: 'Prismatic compass graduated circle (zero at South) vs Surveyor compass dial (zero at North and South).'
      },
      {
        id: 'diag-reciprocal-level',
        title: 'Reciprocal Leveling Across a River',
        format: 'ASCII',
        content: `
            INSTRUMENT AT A                          INSTRUMENT AT B
               +==+                                       +==+
               |  |                                       |  |
             +--+--+                                    +--+--+
            /   |   \\                                  /   |   \\
       Staff A  |    Staff B                     Staff A   |   Staff B
        [ha]    |     [hb]                        [ha']    |    [hb']
         |      |      |                           |       |      |
        ===    ===    ===                         ===     ===    ===
        BANK A   ~~~~~~~~~~~~ RIVER CHANNEL ~~~~~~~~~~~~    BANK B
        
        True Difference in Elevation H = 0.5 * [(ha - hb) + (ha' - hb')]
        Collimation Error e = 0.5 * [(ha - hb) - (ha' - hb')]
        `,
        caption: 'Reciprocal leveling setup across an obstacle eliminating curvature, refraction, and collimation errors.'
      }
    ],
    formulas: [
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-surv-001')!,
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-002')!,
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-003')!,
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-004')!,
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-005')!,
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-006')!,
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-007')!,
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-013')!
    ],
    codeProvisions: [
      {
        standard: 'Survey of India Standards',
        clauseOrTable: 'Leveling Manual Cl. 8.4',
        title: 'Combined Curvature and Atmospheric Refraction Correction',
        provisionText: 'For sight distances exceeding 100 m, the combined correction C_comb = -0.0673 * d² (meters for d in km) must be applied to all staff readings.',
        isMandatory: true
      },
      {
        standard: 'SP:43 (IRC)',
        clauseOrTable: 'Sec. 3.2',
        title: 'Specifications for Total Station Highway Alignment Surveys',
        provisionText: 'Primary control traverses shall close with an angular error not exceeding 10" sqrt(N) and linear fractional closure better than 1:10,000.',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-reciprocal-level-001',
        title: 'Reciprocal Leveling Across a River to Determine True RL Difference',
        problemStatement: 'In reciprocal leveling across a river 800 m wide, the following observations were recorded:\n- Instrument near station A: Staff reading at A (ha) = 1.350 m; Staff reading at B (hb) = 2.750 m.\n- Instrument near station B: Staff reading at A (ha\') = 0.950 m; Staff reading at B (hb\') = 2.150 m.\nIf the RL of station A is 100.000 m, compute the true RL of station B and the instrumental collimation error.',
        givenData: {
          'Staff readings from A': 'ha = 1.350 m, hb = 2.750 m',
          'Staff readings from B': 'ha\' = 0.950 m, hb\' = 2.150 m',
          'RL of Station A': '100.000 m'
        },
        governingFormulas: [
          'Apparent difference from A: delta_h1 = ha - hb',
          'Apparent difference from B: delta_h2 = ha\' - hb\'',
          'True elevation difference H = 0.5 * (delta_h1 + delta_h2)',
          'Collimation error e = 0.5 * (delta_h1 - delta_h2)'
        ],
        stepByStepSolution: [
          'Step 1: Compute Apparent Elevation Differences:\ndelta_h1 = 1.350 - 2.750 = -1.400 m (station B is lower than A).\ndelta_h2 = 0.950 - 2.150 = -1.200 m (station B is lower than A).',
          'Step 2: Compute True Difference in Elevation (H):\nH = 0.5 * [(-1.400) + (-1.200)] = 0.5 * (-2.600) = -1.300 m.\nStation B is exactly 1.300 m below station A.',
          'Step 3: Compute True RL of Station B:\nRL of B = RL of A + H = 100.000 - 1.300 = 98.700 meters.',
          'Step 4: Compute Instrumental Error (e):\ne = 0.5 * [(-1.400) - (-1.200)] = 0.5 * (-0.200) = -0.100 m over 800 m sight distance.'
        ],
        finalAnswer: 'True RL of Station B = 98.700 m; Collimation error = -0.100 m',
        answerUnit: 'm',
        takeaway: 'Reciprocal leveling automatically eliminates both instrumental collimation error and earth curvature/refraction without knowing the numerical values of refraction.',
        examProvenance: 'GATE Civil / UPSC ESE'
      }
    ],
    conceptTraps: [
      {
        id: 'trap-prismatic-zero',
        subject: 'Surveying & Geomatics',
        topic: 'Prismatic Compass Dial Orientation',
        branch: 'Geomatics, Materials & Management',
        trapTitle: 'Prismatic Compass Zero Graduation Location',
        commonMistake: 'Assuming 0° graduation is at the North end of the ring in a Prismatic Compass.',
        correctConcept: 'In a Prismatic Compass, 0° is located at the SOUTH end of the ring, 90° at West, 180° at North, and 270° at East. Because the reading is viewed through a prism at the South eye vane, when looking North the South reading of 0° is reflected directly into the eye.',
        whyCandidatesFail: 'Intuition assumes 0° represents North on all compass dials.',
        preventionRule: 'Prismatic Compass: 0° is at South, reads clockwise. Surveyor Compass: 0° is at North and South.'
      }
    ],
    quickRevisionFacts: [
      'Fundamental surveying rule: Always work from whole to part to prevent error accumulation.',
      'Invar tape has lowest thermal expansion: 64% steel + 36% nickel (alpha = 0.12 x 10^-6 /°C).',
      'Combined curvature and refraction correction: C_comb = -0.0673 d² meters (where d is in km; always subtractive).',
      'Reciprocal leveling formula: True H = 0.5 * [(ha - hb) + (ha\' - hb\')].'
    ],
    prerequisites: ['Basic Trigonometry', 'Cartography Basics'],
    relatedConceptSlugs: ['geomatics-mapping-contouring-areas-volumes-gis', 'building-construction-planning-foundations-soils'],
    downstreamApplications: ['Highway Alignment & Earthwork Quantities', 'Structural Monitoring']
  },

  /* ==========================================================================
     BHAVIKATTI UNIT IV: MAPPING, EARTHWORK & GEOINFORMATICS
     ========================================================================== */
  {
    id: 'ck-surv-002',
    slug: 'geomatics-mapping-contouring-areas-volumes-gis',
    title: 'Contour Mapping, Simpson & Prismoidal Earthwork Volumes, Planimeter & GIS',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    subject: 'Surveying & Geomatics',
    unit: 'Unit 4: Mapping, Earthwork & Geoinformatics',
    chapter: 'Chapter 17-19: Contouring, Areas, Volumes, Remote Sensing & GIS',
    topic: 'Contour Topography, Simpson\'s Rule, Planimeter, Prismoidal Volume & Remote Sensing/GIS',
    subtopic: 'Contour Interval vs Horizontal Equivalent, Amsler Polar Planimeter Zero Circle, Prismoidal Correction, 4 RS Resolutions',
    difficulty: 'INTERMEDIATE',
    keywords: [
      'contours', 'contour interval', 'horizontal equivalent', 'ridge line', 'valley line',
      'Simpsons rule', 'planimeter', 'zero circle', 'prismoidal formula', 'borrow pit',
      'remote sensing', 'spectral resolution', 'spatial resolution', 'GIS', 'vector', 'raster'
    ],
    theory: {
      summary: 'Comprehensive textbook analysis of topographic contour characteristics, calculation of irregular areas using Simpson\'s 1/3rd rule and the Amsler Polar Planimeter, earthwork volume computation via Prismoidal and Borrow Pit spot-level formulas, physics of satellite Remote Sensing (electromagnetic spectrum, passive vs active sensors, 4 resolutions), and Geographic Information Systems (GIS data models and spatial analyses) per Dr. S.S. Bhavikatti.',
      definitions: [
        'Contour Line: An imaginary line on the ground surface joining points of equal elevation above a specified reference datum.',
        'Contour Interval (CI): The constant vertical distance between two consecutive contour lines on a topographic map.',
        'Horizontal Equivalent (HE): The horizontal distance between two consecutive contour lines on a map, which varies inversely with the steepness of the ground terrain.',
        'Simpson\'s 1/3rd Rule: A numerical quadrature method for computing irregular boundary areas by assuming a second-degree parabolic profile between consecutive ordinates: A = (d/3) * [(y0 + yn) + 4 Sigma y_odd + 2 Sigma y_even].',
        'Zero Circle (Circle of Correction): The specific circle traced by an Amsler Polar Planimeter tracing point when the integrating measuring wheel rolls purely without any rotation (wheel slippage zero), corresponding to area M * C.',
        'Prismoidal Correction (Cp): The volumetric difference between the Trapezoidal (Average End Area) volume and the Prismoidal volume: Cp = V_trap - V_prism; Cp is always positive for convex ground, proving that trapezoidal formula overestimates volume.',
        'Remote Sensing: The science and art of acquiring data about earth surface features from a distance without physical contact, using sensors mounted on aerospace platforms.',
        'GIS (Geographic Information System): A computer-based tool for capturing, storing, checking, manipulating, analyzing, and displaying geographically referenced spatial and attribute data.'
      ],
      principlesAndLaws: [
        'Characteristics of Contours (Bhavikatti Ch. 17): 1. Closely spaced contours = steep slope; widely spaced = gentle slope; equally spaced = uniform slope; 2. Concentric closed contours with higher values inside = Hill; lower values inside = Depression/Pond; 3. V-shaped contours with apex pointing upstream = Valley line; U-shaped contours with convexity pointing downhill = Ridge line; 4. Contours cross ridge and valley lines at exact right angles (90°); 5. Contours NEVER cross or intersect each other, EXCEPT in the rare case of an Overhanging Cliff or a Cave; 6. Contours coalescing into a single line = Vertical Cliff.',
        'Simpson\'s Odd Ordinates Law: Simpson\'s 1/3rd rule can ONLY be applied when the total number of divisions n is EVEN, which means the total number of ordinates must be ODD. If ordinates are even, apply Simpson to (n-1) ordinates and calculate the last strip with the Trapezoidal rule.',
        'Amsler Polar Planimeter Equation: Area A = M * (F - I ± 10 N + C). Where M is multiplying constant, F is final reading, I is initial reading, N is net revolutions of zero dial, and C is instrument constant added ONLY if anchor point is INSIDE the area (C = 0 if anchor point is outside).',
        'Borrow Pit Spot Level Volume: V = (A / 4) * (Sigma h1 + 2 Sigma h2 + 3 Sigma h3 + 4 Sigma h4), where hn is depth of cut common to n adjacent grid squares.',
        'The 4 Remote Sensing Resolutions: Spatial (smallest ground footprint resolved as a single pixel, e.g. 10 m); Spectral (number and width of wavelength bands); Radiometric (bit-depth sensitivity to radiation intensity, e.g. 8-bit = 256 levels, 12-bit = 4096 levels); Temporal (revisit cycle time of satellite over same site).'
      ],
      governingAssumptions: [
        'Ground surface between cross sections is assumed a prismoid for the prismoidal volume formula.',
        'Passive remote sensors rely on reflected solar illumination or thermal emission; active sensors (RADAR, LiDAR) emit their own artificial pulses.',
        'In GIS, Vector data represents features as discrete Points, Lines, and Polygons; Raster data represents continuous fields as a regular grid of square pixels.'
      ],
      detailedExplanation: '1. Contouring Topography (Bhavikatti Ch. 17):\n- Methods of Contouring: Direct method (points on contour located on ground with level and staff and surveyed; highly accurate, slow) vs Indirect method (cross-sections, square grid spot levels, or tacheometric radial lines; elevations interpolated mathematically).\n- Uses: Reservoir capacity computation from contour areas, dam alignment, route grading, and intervisibility determination.\n\n2. Computation of Areas & Volumes (Bhavikatti Ch. 18):\n- Mid-ordinate rule, Average ordinate rule, Trapezoidal rule, and Simpson\'s 1/3rd rule.\n- Planimeter Operation: Tracing point guided clockwise around perimeter. Integrating wheel records revolutions and fractional parts via vernier.\n- Earthwork Volumes: Trapezoidal formula V = d * [(A0 + An)/2 + A1 + ... + An-1]; Prismoidal formula V = (d/3) * [(A0 + An) + 4 Sigma A_odd + 2 Sigma A_even].\n\n3. Remote Sensing & GIS (Bhavikatti Ch. 19):\n- Electromagnetic Spectrum: Visible (0.4-0.7 um), Near Infrared NIR (0.7-1.3 um - vegetation reflectance), Shortwave Infrared SWIR (1.3-3.0 um - soil moisture), Thermal IR (3-14 um - surface temperature), Microwave (1 mm - 1 m - day/night cloud penetration).\n- GIS Spatial Operations: Buffer analysis (distance zones around roads/rivers), Overlay analysis (Union, Intersect, Identity), Network analysis (shortest path route optimization), and Digital Elevation Model (DEM) watershed delineation.',
      applications: [
        'Reservoir storage-elevation curve and spillway design from contour maps.',
        'Highway earthwork cut-and-fill volume balancing using mass-haul diagrams.',
        'GIS flood inundation mapping and urban storm drainage network management.'
      ],
      limitations: [
        'Optical remote sensing cannot penetrate cloud cover or acquire imagery at night.',
        'Trapezoidal volume formula consistently overestimates earthwork quantities compared to prismoidal calculation.'
      ],
      comparisons: [
        {
          aspect: 'Area Calculation Rules',
          itemA: { label: 'Trapezoidal Rule', value: 'Assumes linear chord boundary between ordinates. Valid for any number of ordinates. Slightly underestimates curved area.' },
          itemB: { label: 'Simpson\'s 1/3rd Rule', value: 'Assumes second-degree parabolic boundary. Requires strictly ODD number of ordinates. Higher mathematical accuracy.' }
        },
        {
          aspect: 'GIS Data Models',
          itemA: { label: 'Vector Data', value: 'Points, lines, polygons with topological coordinates. Ideal for discrete boundaries, roads, cadastral parcels.' },
          itemB: { label: 'Raster Data', value: 'Grid cells/pixels. Ideal for continuous spatial phenomena: satellite imagery, digital elevation models (DEM), slope.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-contour-features',
        title: 'Topographic Contour Signatures',
        format: 'ASCII',
        content: `
         HILL (Higher inside)                 POND (Lower inside)
               (100)                                (70)
             /       \\                            /      \\
            |   (110) |                          |   (60) |
            |  /     \\|                          |  /    \\|
            | | (120) | |                        | | (50) | |
            
         RIDGE LINE (Watershed)               VALLEY LINE (Stream flow)
           80   90  100  110                    110  100   90   80
          (   (   (   (                      )   )   )   )
          (   (   (   (                      )   )   )   )  <==== Stream flow
          (   (   (   (                      )   )   )   )
          (U-shaped, convexity downhill)     (V-shaped, apex points uphill)
        `,
        caption: 'Characteristic contour line patterns for hills, depressions, ridges, and valleys (Bhavikatti Ch. 17).'
      }
    ],
    formulas: [
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-008')!,
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-009')!,
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-010')!,
      CIVIL_FORMULA_BANK.find((f) => f.id === 'f-bhav-011')!
    ],
    codeProvisions: [
      {
        standard: 'IS 1200 (Part 1):1992',
        clauseOrTable: 'Cl. 4.1',
        title: 'Method of Measurement of Building and Civil Works — Earthwork',
        provisionText: 'Earthwork excavation shall be measured in cubic meters (m³) calculated from initial and final spot levels or cross-sections using the prismoidal formula.',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-simpson-area-001',
        title: 'Simpson 1/3rd Rule vs Trapezoidal Rule Area Calculation',
        problemStatement: 'The following offsets were measured at equal intervals of d = 10 meters from a survey line to an irregular curved boundary:\ny0 = 3.50 m, y1 = 5.20 m, y2 = 6.40 m, y3 = 7.80 m, y4 = 6.90 m, y5 = 5.60 m, y6 = 4.10 m.\nCompute the total area enclosed between the survey line and the boundary using: (a) Trapezoidal Rule, and (b) Simpson\'s 1/3rd Rule.',
        givenData: {
          'Common offset interval (d)': '10 meters',
          'Number of ordinates (N)': '7 (ODD -> Simpson is directly valid)',
          'Number of divisions (n)': '6 (EVEN)',
          'Ordinates': 'y0=3.5, y1=5.2, y2=6.4, y3=7.8, y4=6.9, y5=5.6, y6=4.1 m'
        },
        governingFormulas: [
          'Trapezoidal Area: A_trap = d * [(y0 + yn)/2 + y1 + y2 + ... + y_{n-1}]',
          'Simpson Area: A_simp = (d / 3) * [(y0 + yn) + 4*(Sigma y_odd) + 2*(Sigma y_even)]'
        ],
        stepByStepSolution: [
          'Step 1: Compute using Trapezoidal Rule:\nEnd ordinates: (y0 + y6) / 2 = (3.50 + 4.10) / 2 = 7.60 / 2 = 3.80 m.\nIntermediate sum: y1 + y2 + y3 + y4 + y5 = 5.20 + 6.40 + 7.80 + 6.90 + 5.60 = 31.90 m.\nA_trap = 10 * [3.80 + 31.90] = 10 * 35.70 = 357.00 m².',
          'Step 2: Compute using Simpson\'s 1/3rd Rule:\nEnd sum: y0 + y6 = 3.50 + 4.10 = 7.60 m.\nOdd ordinates sum: y1 + y3 + y5 = 5.20 + 7.80 + 5.60 = 18.60 m.\nEven ordinates sum: y2 + y4 = 6.40 + 6.90 = 13.30 m.\nA_simp = (10 / 3) * [7.60 + 4 * (18.60) + 2 * (13.30)]\n= (10 / 3) * [7.60 + 74.40 + 26.60] = (10 / 3) * [108.60] = 10 * 36.20 = 362.00 m².'
        ],
        finalAnswer: 'Trapezoidal Area = 357.00 m² ; Simpson\'s 1/3rd Area = 362.00 m²',
        answerUnit: 'm²',
        takeaway: 'Simpson\'s rule produces 362.00 m² because the parabolic boundary curves outward between the linear chords, capturing the true curved profile.',
        examProvenance: 'APSC CCE / GATE Civil'
      }
    ],
    conceptTraps: [
      {
        id: 'trap-planimeter-c',
        subject: 'Surveying & Geomatics',
        topic: 'Amsler Polar Planimeter Zero Circle Constant C',
        branch: 'Geomatics, Materials & Management',
        trapTitle: 'Adding Planimeter Constant C When Anchor Point Is Outside',
        commonMistake: 'Adding the constant C to the planimeter equation when the anchor needle is placed outside the boundary.',
        correctConcept: 'In Amsler polar planimeter area A = M * (F - I + 10 N + C), the constant C is added IF AND ONLY IF the anchor point is fixed INSIDE the figure being measured. If the anchor point is outside, C is strictly ZERO: A = M * (F - I + 10 N).',
        whyCandidatesFail: 'Memorizing the full formula without understanding that C represents the area of the zero circle traced only when the anchor point is encircled.',
        preventionRule: 'Anchor outside -> C = 0. Anchor inside -> Add C.'
      }
    ],
    quickRevisionFacts: [
      'Contours cross ridge and valley lines at right angles (90°).',
      'Simpson\'s 1/3rd rule requires an ODD number of ordinates (EVEN number of segments).',
      'Prismoidal formula always yields less volume than trapezoidal for convex ground (Cp > 0).',
      'In Amsler planimeter, constant C is added only when anchor point is inside the figure.'
    ],
    prerequisites: ['ck-surv-001'],
    relatedConceptSlugs: ['surveying-linear-compass-plane-table-theodolite', 'cpm-pert-project-scheduling-floats'],
    downstreamApplications: ['Reservoir Sizing & Dam Engineering', 'GIS Infrastructure Asset Management']
  },

  /* ==========================================================================
     BHAVIKATTI UNIT V: DISASTER RESISTANT BUILDINGS & IS CODES
     ========================================================================== */
  {
    id: 'ck-bcon-003',
    slug: 'disaster-resistant-buildings-earthquake-cyclone-fire-is-codes',
    title: 'Disaster-Resistant Buildings (Earthquake, Cyclone, Fire) & Master IS Code Catalog',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    subject: 'Building Construction & Planning',
    unit: 'Unit 5: Disaster Resistant Buildings & IS Codes',
    chapter: 'Chapter 20-22: Earthquake, Cyclone, Fire Protection & Indian Standards',
    topic: 'Seismic Engineering, RC Bands, Base Isolation, Wind Anchors, Fire Rating & Master IS Code Catalog',
    subtopic: 'IS 1893:2016 Seismic Zones, RC Lintel/Roof Bands, Base Isolators, Wind Suction Uplift, NBC 2016 Fire Escape Rules',
    difficulty: 'GATE_IES',
    keywords: [
      'earthquake engineering', 'seismic zones', 'Richter scale', 'MSK intensity', 'base shear',
      'IS 1893', 'IS 13920', 'IS 4326', 'seismic band', 'lintel band', 'roof band',
      'base isolation', 'cyclone resistance', 'hip roof', 'fire resistance', 'NBC 2016', 'IS codes'
    ],
    theory: {
      summary: 'Comprehensive textbook instruction on disaster-resilient building engineering per Dr. S.S. Bhavikatti. Details earthquake mechanics (focus, epicenter, P/S/Rayleigh waves, Richter magnitude vs Mercalli intensity), seismic zonation of India per IS 1893:2016, design base shear formulation, earthquake-resistant load-bearing masonry features (continuous RC plinth, lintel, and roof bands, vertical corner rebar), ductile RCC detailing per IS 13920, base isolation and tuned mass dampers, aerodynamic cyclone-resistant roofing and anchorage, building fire safety per NBC 2016 Part 4, and the definitive master catalog of Indian Standard (IS) codes for civil engineering.',
      definitions: [
        'Focus (Hypocenter): The point inside the earth\'s crust where rock fracture initiates and seismic strain energy is first released.',
        'Epicenter: The point on the earth\'s surface vertically directly above the seismic focus.',
        'Richter Magnitude (M): A logarithmic measure of the total strain energy released at the earthquake focus; each whole-number increase on the scale represents approximately 31.6 times more energy.',
        'MSK / Modified Mercalli Intensity: A qualitative scale (expressed in Roman numerals I to XII) measuring the local severity of ground shaking and observed damage to structures at a specific site.',
        'Reinforced Concrete Seismic Band: A continuous horizontal reinforced concrete runner beam tying all internal and external load-bearing masonry walls together like a stiff belt at specific floor/lintel/roof levels.',
        'Base Isolation: A passive earthquake mitigation technology that decouples the building superstructure from the substructure using flexible elastomeric rubber or friction pendulum bearings, shifting the fundamental period into the low-energy spectrum.',
        'Fire Resistance Rating: The duration of time in hours (0.5 to 4.0 hours) an element of structure can fulfill its required loadbearing, integrity, and thermal insulation functions under the standard ISO 834 fire test curve.'
      ],
      principlesAndLaws: [
        'Seismic Zonation of India per IS 1893:2016: Zone II (Low, Z = 0.10); Zone III (Moderate, Z = 0.16); Zone IV (Severe, Z = 0.24); Zone V (Very Severe, Z = 0.36). Zone I was abolished and merged into Zone II.',
        'Design Horizontal Base Shear Law: V_B = A_h * W, where A_h = (Z / 2) * (I / R) * (Sa / g). Z is zone factor, I is importance factor (1.5 for hospitals/emergency, 1.2 for schools/community, 1.0 for residential), R is response reduction factor (5.0 for SMRF, 3.0 for OMRF), and Sa/g is spectral acceleration based on natural period Ta and soil type.',
        'Earthquake-Resistant Masonry Principles (IS 4326): 1. Perfect geometric symmetry in plan and elevation (avoid asymmetric L, U, T, and H shapes without seismic separation joints); 2. Continuous RC bands provided at Plinth level, Lintel level, Roof level, and Gable level; 3. Vertical high-strength rebar provided at all wall corners, T-junctions, and alongside door/window jambs.',
        'Cyclone-Resistant Roofing Principles (Bhavikatti Ch. 21): 1. Pitched roofs must have slope between 30° and 40° (flatter slopes < 30° generate extreme aerodynamic uplift suction; steeper slopes generate excessive lateral wind thrust); 2. Hip roofs perform significantly better than Gable roofs under cyclonic winds; 3. Overhangs should be restricted to maximum 450 mm; 4. Continuous steel hold-down straps must anchor roof rafters directly to wall tie beams.',
        'Behavior of Structural Materials under Fire: Concrete has low thermal conductivity and excellent fire resistance (spalling occurs at high internal steam pressure); Structural steel rapidly loses 50% of its yield strength at 550°C and buckles; Heavy timber chars at a slow predictable rate (~0.6 mm/min), insulating the internal load-bearing wood core.'
      ],
      governingAssumptions: [
        'In base shear calculation, total seismic weight W includes 100% of dead loads and 25% (if imposed load <= 3 kN/m²) or 50% (if imposed load > 3 kN/m²) of live loads per IS 1893.',
        'In IS 13920 ductile RCC frames, transverse hoop spacing at beam-column joint faces shall not exceed d/4, 8 times bar diameter, or 100 mm.',
        'Fire escape staircases must be continuous to the building exterior at ground level and completely enclosed with 2-hour fire-rated walls.'
      ],
      detailedExplanation: '1. Earthquake Engineering & Seismic Bands (Bhavikatti Ch. 20):\n- Seismic Waves: P-waves (compressional, fastest, travel through solid and liquid), S-waves (shear, transverse, travel through solid only, cause destructive lateral shearing), Surface waves (Rayleigh elliptical and Love horizontal waves; slowest, cause peak building damage).\n- RC Seismic Bands Details (IS 4326 Table 2):\n  * Plinth Band: At top of foundation plinth wall.\n  * Lintel Band: Continuous over all doors and windows on all external and internal walls (minimum 75 mm thick with 2 to 4 bars of 8-10 mm dia).\n  * Roof Band: Under pitched roofs at eaves level or around perimeter of flat RCC slabs.\n  * Gable Band: Along sloped triangular gable masonry.\n- Base Isolation & Dampers: Lead-rubber bearings (LRB) decouple building from high ground accelerations. Tuned mass dampers (TMD) resonate out-of-phase to absorb wind and seismic kinetic energy.\n\n2. Cyclone & Wind Resistant Design (Bhavikatti Ch. 21):\n- Wind forces per IS 875 (Part 3): Design wind speed Vz = Vb * k1 * k2 * k3 * k4; Design wind pressure pz = 0.6 * Vz².\n- Aerodynamic forms: Circular and octagonal building footprints experience least wind drag. Strong cross-bracing in roof trusses and purlins.\n\n3. Master Catalog of Indian Standard (IS) Codes for Civil Engineering (Bhavikatti Ch. 22):\n- IS 456:2000 — Plain and Reinforced Concrete.\n- IS 800:2007 — General Construction in Steel (Limit State Method).\n- IS 875 (Parts 1-5):1987/2015 — Design Loads (Dead, Imposed, Wind, Snow, Combinations).\n- IS 1893 (Part 1):2016 — Criteria for Earthquake Resistant Design of Structures.\n- IS 13920:2016 — Ductile Detailing of Reinforced Concrete Structures.\n- IS 4326:2013 — Earthquake Resistant Design of Buildings — Code of Practice.\n- IS 1905:1987 — Structural Use of Unreinforced Masonry.\n- IS 1343:2012 — Prestressed Concrete.\n- IS 10500:2012 — Drinking Water Specifications.\n- IS 1200 (Parts 1-28) — Measurement of Building & Civil Works.\n- IS 383:2016 — Coarse and Fine Aggregates for Concrete.\n- IS 269:2015 — Ordinary Portland Cement.\n- IS 10262:2019 — Concrete Mix Proportioning.\n- IS 1077:1992 — Common Burnt Clay Building Bricks.\n- National Building Code of India (NBC:2016) — Comprehensive national model code.',
      applications: [
        'Seismic retrofitting of unreinforced school buildings using continuous RC lintel bands and corner ferrocement jackets.',
        'High-rise base isolation design in Seismic Zone V (Assam, Himalayas).',
        'Coastal cyclone shelter design along the Bay of Bengal with hip roofs and aerodynamic circular geometries.'
      ],
      limitations: [
        'Base isolation is ineffective for tall, slender skyscrapers or buildings founded on deep, soft soil strata where low-frequency resonant amplification occurs.',
        'Unreinforced masonry without seismic bands undergoes brittle out-of-plane wall collapse during moderate ground shaking.'
      ],
      comparisons: [
        {
          aspect: 'Earthquake Measurement',
          itemA: { label: 'Richter Magnitude (M)', value: 'Quantitative, logarithmic measure of total strain energy released at the focus. Single unique number for an event.' },
          itemB: { label: 'Mercalli/MSK Intensity (I)', value: 'Qualitative measure of ground shaking severity and building damage at a specific location. Varies with distance (I to XII).' }
        },
        {
          aspect: 'Roof Geometry Under Cyclone Winds',
          itemA: { label: 'Hip Roof (4 Slopes)', value: 'Slopes down on all four sides. Aerodynamic, highly stable, eliminates high wind pressure concentrations.' },
          itemB: { label: 'Gable Roof (2 Slopes)', value: 'Vertical triangular gable walls experience heavy lateral wind stagnation pressure and severe eaves suction uplift.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-seismic-bands',
        title: 'Earthquake-Resistant Masonry Building with Continuous RC Bands',
        format: 'ASCII',
        content: `
                 ROOF SLAB OR TRUSS
             +===========================+
             |=== CONTINUOUS ROOF BAND ==| (At Eaves Level)
             +---+---+-----------+---+---+
             |   |   |           |   |   |
             |   |===|LINTEL BAND|===|   | (Continuous over all walls)
             | V |[W]|           |[D]| V |
             | E |   |           |   | E |   [W] = Window opening
             | R |   |           |   | R |   [D] = Door opening
             | T |   |           |   | T |   VERT = Vertical corner rebar
             |===+===+===========+===+===|
             |=== CONTINUOUS PLINTH BAND=| (At Plinth Level)
             +===========================+
                     FOUNDATION
        `,
        caption: 'Location of continuous reinforced concrete seismic bands and corner vertical rebar per IS 4326 (Bhavikatti Fig. 20.3).'
      },
      {
        id: 'diag-base-isolator',
        title: 'Elastomeric Rubber Base Isolator with Lead Core',
        format: 'ASCII',
        content: `
                   SUPERSTRUCTURE COLUMN BASE
                 ==============================
                 |      STEEL TOP PLATE       |
                 +----------------------------+
                 |  RUBBER LAYER              |
                 |  STEEL SHIM PLATE   +-+    |
                 |  RUBBER LAYER       |L|    |  L = SOLID LEAD CORE
                 |  STEEL SHIM PLATE   |E|    |      (Dissipates kinetic
                 |  RUBBER LAYER       |A|    |       energy via plastic
                 |  STEEL SHIM PLATE   |D|    |       shear deformation)
                 |  RUBBER LAYER       +-+    |
                 +----------------------------+
                 |     STEEL BOTTOM PLATE     |
                 ==============================
                   FOUNDATION PLINTH CAP
        `,
        caption: 'Cross section of an elastomeric lead-rubber base isolator (LRB) decoupling structure from ground motion.'
      }
    ],
    formulas: [],
    codeProvisions: [
      {
        standard: 'IS 1893 (Part 1):2016',
        clauseOrTable: 'Cl. 6.4.2 & Table 2',
        title: 'Design Horizontal Base Shear and Seismic Zone Factors',
        provisionText: 'Zone factors: Zone II (0.10), Zone III (0.16), Zone IV (0.24), Zone V (0.36). Design base shear V_B = A_h * W. Importance factor I = 1.5 for critical structures.',
        isMandatory: true
      },
      {
        standard: 'IS 13920:2016',
        clauseOrTable: 'Cl. 6.3.5',
        title: 'Ductile Detailing of Beams — Special Transverse Reinforcement',
        provisionText: 'Hoops shall be provided over a length 2d from the joint face with spacing <= d/4, 8*dia of smallest longitudinal bar, or 100 mm. All hooks must have 135° bends with 10*dia extension.',
        isMandatory: true
      },
      {
        standard: 'IS 4326:2013',
        clauseOrTable: 'Cl. 8.4',
        title: 'Seismic Bands in Masonry Buildings',
        provisionText: 'Lintel band shall be continuous across all external and internal load-bearing walls in Seismic Zones III, IV, and V.',
        isMandatory: true
      }
    ],
    workedExamples: [
      {
        id: 'we-base-shear-001',
        title: 'Computation of Design Seismic Base Shear per IS 1893:2016',
        problemStatement: 'A four-storey reinforced concrete office building with Special Moment Resisting Frames (SMRF, R = 5) is located in Guwahati (Seismic Zone V, Z = 0.36) on medium soil. The total calculated seismic weight of the building is W = 12,000 kN. The fundamental natural period of vibration is Ta = 0.40 seconds. For medium soil at Ta = 0.40 s, Sa/g = 2.50. The importance factor for the commercial office is I = 1.2. Compute the design horizontal seismic coefficient Ah and the total design seismic base shear VB.',
        givenData: {
          'Seismic Zone': 'Zone V (Z = 0.36)',
          'Importance factor (I)': '1.2',
          'Response reduction factor (R)': '5.0 (SMRF)',
          'Spectral acceleration coefficient (Sa/g)': '2.50',
          'Seismic weight of structure (W)': '12,000 kN'
        },
        governingFormulas: [
          'Design Horizontal Seismic Coefficient Ah = (Z / 2) * (I / R) * (Sa / g)',
          'Design Base Shear VB = Ah * W'
        ],
        stepByStepSolution: [
          'Step 1: Compute Design Horizontal Acceleration Coefficient Ah:\nAh = (Z / 2) * (I / R) * (Sa / g)\nAh = (0.36 / 2) * (1.2 / 5.0) * (2.50)\nAh = 0.18 * 0.24 * 2.50 = 0.18 * 0.60 = 0.108.',
          'Step 2: Check Minimum Ah Limit (IS 1893 Cl. 7.2.2):\nMinimum Ah = (Z / 2) * (I / R) * 0.108 >= Z/20 = 0.36/20 = 0.018. Since 0.108 >= 0.018, Ah = 0.108 governs.',
          'Step 3: Calculate Design Seismic Base Shear VB:\nVB = Ah * W = 0.108 * 12,000 kN = 1,296 kN.'
        ],
        finalAnswer: 'Design Horizontal Coefficient Ah = 0.108 ; Design Base Shear VB = 1,296 kN',
        answerUnit: 'kN',
        takeaway: 'Notice that using SMRF (R = 5) in the denominator reduces the elastic earthquake forces by a factor of 5, relying on the ductile detailing of IS 13920 to absorb energy through plastic hinging.',
        examProvenance: 'GATE Civil / UPSC ESE'
      }
    ],
    conceptTraps: [
      {
        id: 'trap-seismic-zone-one',
        subject: 'Building Construction & Planning',
        topic: 'Indian Seismic Zonation Map',
        branch: 'Geomatics, Materials & Management',
        trapTitle: 'Believing Seismic Zone I Still Exists in IS 1893',
        commonMistake: 'Selecting Zone I as the lowest risk seismic zone in India.',
        correctConcept: 'Seismic Zone I DOES NOT EXIST in Indian Standards. In the revision of IS 1893, Zone I was merged with Zone II. India is divided into only 4 seismic zones: Zone II (Z = 0.10), Zone III (Z = 0.16), Zone IV (Z = 0.24), and Zone V (Z = 0.36).',
        whyCandidatesFail: 'Outdated textbooks or assumptions that Roman numeral numbering must start from I.',
        preventionRule: 'Seismic Zones: II (0.10), III (0.16), IV (0.24), V (0.36). Zone I has been deleted.'
      }
    ],
    quickRevisionFacts: [
      'Seismic zones of India: II (Z=0.10), III (0.16), IV (0.24), V (Z=0.36); Zone I has been eliminated.',
      'Design Base Shear: V_B = A_h * W = [(Z/2) * (I/R) * (Sa/g)] * W.',
      'SMRF response reduction factor R = 5; OMRF R = 3.',
      'In cyclone design, hip roofs (4-pitch) perform significantly better than gable roofs.'
    ],
    prerequisites: ['ck-bcon-001', 'ck-bcon-002'],
    relatedConceptSlugs: ['building-construction-planning-foundations-soils', 'building-construction-superstructure-masonry-finishes-stairs-roofs'],
    downstreamApplications: ['Earthquake Structural Detailing', 'Disaster Mitigation Management']
  },

  /* ==========================================================================
     CONSTRUCTION MANAGEMENT & ESTIMATING (CPM/PERT)
     ========================================================================== */
  {
    id: 'ck-cpm-001',
    slug: 'cpm-pert-project-scheduling-floats',
    title: 'CPM / PERT Network Scheduling, Critical Path & Activity Floats',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    subject: 'Construction Management & Estimating',
    unit: 'Unit 1: Construction Project Planning & Scheduling',
    chapter: 'Chapter 1.1: Network Scheduling Techniques',
    topic: 'CPM & PERT Network Analysis',
    subtopic: 'Critical Path Determination, Total/Free/Independent Floats & PERT Probability',
    difficulty: 'GATE_IES',
    keywords: ['CPM', 'PERT', 'critical path', 'total float', 'free float', 'independent float', 'crashing', 'variance'],
    theory: {
      summary: 'Mathematical formulation of Critical Path Method (CPM) and Program Evaluation and Review Technique (PERT) for construction project scheduling, activity network logic, float mechanics, and probabilistic completion times.',
      definitions: [
        'Critical Path: The longest continuous path of dependent activities connecting project start to project finish. Any delay along the critical path delays the entire project completion.',
        'Total Float (TF): The maximum duration by which an activity completion can be delayed without delaying the overall project completion: TF = L_j - E_i - t_ij.',
        'Free Float (FF): The amount of time an activity can be delayed without delaying the earliest start of any immediate successor activity: FF = E_j - E_i - t_ij.',
        'Independent Float (IF): The time an activity can be delayed without affecting any preceding or succeeding activities even under worst-case scheduling: IF = E_j - L_i - t_ij.'
      ],
      principlesAndLaws: [
        'CPM vs PERT Paradigm: CPM is deterministic, activity-oriented, and applies to repetitive construction works where durations and costs are known with certainty. PERT is probabilistic, event-oriented, and applies to research and one-off projects where durations follow a Beta probability distribution.',
        'Float Inequality Law: For any activity in a valid network: Total Float >= Free Float >= Independent Float. Critical activities possess zero Total Float (TF = 0).'
      ],
      governingAssumptions: [
        'Network logic is acyclic (no circular loops or dangling events allowed).',
        'In PERT, individual activity durations follow a Beta distribution with mean t_e = (t_o + 4t_m + t_p)/6 and variance sigma² = [(t_p - t_o)/6]².',
        'By the Central Limit Theorem, the total project duration (sum of independent critical path activities) approximates a Normal Gaussian distribution.'
      ],
      detailedExplanation: 'Forward Pass Computations (Earliest Times):\n- Earliest Event Time (E_j): Max (E_i + t_ij) for all incoming activities.\n- Earliest Start Time (ES) = E_i; Earliest Finish Time (EF) = E_i + t_ij.\n\nBackward Pass Computations (Latest Times):\n- Latest Event Time (L_i): Min (L_j - t_ij) for all outgoing activities.\n- Latest Finish Time (LF) = L_j; Latest Start Time (LS) = L_j - t_ij.\n\nFloat Calculations & Hierarchy:\n- Total Float: TF = LS - ES = LF - EF = L_j - E_i - t_ij\n- Free Float: FF = TF - S_j (where head event slack S_j = L_j - E_j)\n- Independent Float: IF = FF - S_i (where tail event slack S_i = L_i - E_i)\nNote: If calculated IF < 0, it is practically treated as 0.\n\nProject Completion Probability (PERT):\n   Z = (T_s - T_e) / sigma_project\nwhere T_s is target scheduled time, T_e is expected critical path duration, and sigma_project = sqrt[Sum of variances along critical path].',
      applications: [
        'Mega infrastructure construction tracking (bridges, dams, metro rail networks, and highways).',
        'Resource leveling, smoothing, and project cost-time crashing optimization.'
      ],
      limitations: [
        'Classic CPM/PERT ignores resource constraints (assumes unlimited labor, machinery, and capital unless constrained by resource leveling algorithms).'
      ],
      comparisons: [
        {
          aspect: 'Activity-Oriented vs Event-Oriented',
          itemA: { label: 'CPM (Critical Path Method)', value: 'Activity-oriented (AOA/AON). Deterministic single-time estimate. Emphasizes cost-time tradeoff (crashing).' },
          itemB: { label: 'PERT (Program Evaluation & Review)', value: 'Event-oriented. Probabilistic 3-time estimates (to, tm, tp). Emphasizes schedule probability.' }
        }
      ]
    },
    diagrams: [
      {
        id: 'diag-cpm-001',
        title: 'Activity Float Mechanics & Event Times',
        format: 'ASCII',
        content: `
   TAIL EVENT (i)                                HEAD EVENT (j)
   +-----------+                                 +-----------+
   |    (i)    |                                 |    (j)    |
   +-----+-----+           Activity t_ij         +-----+-----+
   | E_i | L_i | ------------------------------> | E_j | L_j |
   +-----+-----+                                 +-----+-----+
        |                                             |
        |<============= Total Float TF ==============>|
        |              L_j - E_i - t_ij               |
        |                                             |
        |<========= Free Float FF =========>|         |
        |          E_j - E_i - t_ij         |         |
        |                                   |         |
        |        |<== Indep Float IF ==>|   |         |
        |        |    E_j - L_i - t_ij  |   |         |
        v        v                      v   v         v
       E_i      L_i                    E_j L_j
        `,
        caption: 'Geometric visualization of Total Float, Free Float, Independent Float, and Event Slacks.'
      }
    ],
    formulas: getFormulasByIds('f-cpm-001'),
    codeProvisions: [
      {
        standard: 'IS 15883:2009',
        clauseOrTable: 'Part 2 & Cl. 4.3',
        title: 'Guidelines for Construction Project Management — Time Management',
        provisionText: 'Project work breakdown structure (WBS) must precede network scheduling. Baseline critical path shall be monitored at minimum monthly intervals with variance tracking.',
        isMandatory: false,
        notes: 'National standard guidelines for construction quality and time management.'
      }
    ],
    workedExamples: [
      {
        id: 'we-cpm-001',
        title: 'Computation of Total, Free, and Independent Floats',
        problemStatement: 'An activity (i-j) has an estimated duration t_ij = 8 days. For the tail event (i), earliest event time E_i = 10 days and latest event time L_i = 14 days. For the head event (j), earliest event time E_j = 24 days and latest event time L_j = 28 days. Calculate the Total Float, Free Float, and Independent Float of the activity.',
        givenData: {
          'Activity duration (t_ij)': '8 days',
          'Tail event times': 'E_i = 10 days, L_i = 14 days (Tail slack S_i = 4 days)',
          'Head event times': 'E_j = 24 days, L_j = 28 days (Head slack S_j = 4 days)'
        },
        governingFormulas: [
          'Total Float (TF) = L_j - E_i - t_ij',
          'Free Float (FF) = E_j - E_i - t_ij = TF - S_j',
          'Independent Float (IF) = E_j - L_i - t_ij = FF - S_i'
        ],
        stepByStepSolution: [
          'Step 1: Compute Total Float (TF):\nTF = L_j - E_i - t_ij = 28 - 10 - 8 = 10 days.',
          'Step 2: Compute Free Float (FF):\nFF = E_j - E_i - t_ij = 24 - 10 - 8 = 6 days.\n(Alternatively: FF = TF - S_j = 10 - (28 - 24) = 10 - 4 = 6 days).',
          'Step 3: Compute Independent Float (IF):\nIF = E_j - L_i - t_ij = 24 - 14 - 8 = 2 days.\n(Alternatively: IF = FF - S_i = 6 - (14 - 10) = 6 - 4 = 2 days).',
          'Step 4: Verify Float Inequality:\nTF (10 days) >= FF (6 days) >= IF (2 days) >= 0. The inequality is strictly satisfied.'
        ],
        finalAnswer: 'Total Float = 10 days, Free Float = 6 days, Independent Float = 2 days',
        answerUnit: 'days',
        takeaway: 'Notice that Total Float is shared across the path, Free Float belongs exclusively to the activity without disturbing successors, and Independent Float is completely autonomous.',
        examProvenance: 'GATE Civil 2021 / APSC CCE'
      }
    ],
    conceptTraps: [
      {
        id: 'trap-cpm-float',
        subject: 'Construction Management & Estimating',
        topic: 'Negative Independent Float',
        branch: 'Geomatics, Materials & Management',
        trapTitle: 'Negative Independent Float Treatment',
        commonMistake: 'Reporting a negative independent float as a mathematical value without understanding practical physics.',
        correctConcept: 'If formula (E_j - L_i - t_ij) gives a negative number, the Independent Float is taken as ZERO in practical project management, because an activity cannot compress time.',
        whyCandidatesFail: 'Missing the engineering definition: float represents available surplus time, which cannot be negative.',
        preventionRule: 'IF = max(0, E_j - L_i - t_ij).'
      }
    ],
    quickRevisionFacts: [
      'Critical path is the longest duration path in the network; Total Float = 0 along critical path.',
      'Float hierarchy: Total Float >= Free Float >= Independent Float.',
      'PERT expected duration: te = (to + 4 tm + tp) / 6. Variance: sigma² = [(tp - to) / 6]².'
    ],
    prerequisites: ['Graph Theory & Network Logic', 'Basic Probability & Statistics'],
    relatedConceptSlugs: ['cpm-project-crashing', 'quantity-surveying-estimation', 'building-materials-concrete'],
    downstreamApplications: ['Highway & Bridge Project Management', 'Construction Contract Administration']
  }
];

export const GEOMATICS_MANAGEMENT_SUBJECTS: CivilKnowledgeSubject[] = [
  {
    id: 'subj-bldg-materials',
    name: 'Building Materials & Concrete Technology',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    description: 'Traditional materials (stones, bricks, lime, cement, timber), mortars, plain concrete, workability, and special concretes (RCC, PSC, FRC, cellular concrete, ferrocement), metals, polymers, paints, and concrete blocks per Dr. S.S. Bhavikatti.',
    weightageRank: 8,
    totalConcepts: 28,
    standardCodes: ['IS 1077:1992', 'IS 269:2015', 'IS 383:2016', 'IS 456:2000', 'IS 1343:2012', 'IS 1786:2008', 'IS 2185:2005'],
    units: [
      {
        id: 'u-mat-1',
        unitNumber: 1,
        title: 'Traditional Civil Engineering Materials',
        subject: 'Building Materials & Concrete Technology',
        chapters: [
          {
            id: 'ch-mat-1',
            chapterNumber: 1,
            title: 'Stones, Clay Bricks, Lime, Cement & Timber',
            subject: 'Building Materials & Concrete Technology',
            unit: 'Traditional Civil Engineering Materials',
            overview: 'Geological, physical, and chemical stone classifications, brick manufacturing and crushing strength classes, lime hydration, Bogue compounds and physical testing of Portland cement, and macro-structural anatomy of timber.',
            conceptSlugs: ['building-materials-traditional-stones-bricks-cement-timber']
          }
        ]
      },
      {
        id: 'u-mat-2',
        unitNumber: 2,
        title: 'Mortars, Concrete & Special Concretes',
        subject: 'Building Materials & Concrete Technology',
        chapters: [
          {
            id: 'ch-mat-2',
            chapterNumber: 2,
            title: 'Mortars, Plain Concrete, Workability & Special Concretes',
            subject: 'Building Materials & Concrete Technology',
            unit: 'Mortars, Concrete & Special Concretes',
            overview: 'Mortar proportions, Abrams water-cement ratio law, slump and compaction factor tests, creep and shrinkage, prestressing systems (Hoyer, Freyssinet), FRC, AAC blocks, and ferrocement.',
            conceptSlugs: ['building-materials-mortars-concrete-special-concretes']
          }
        ]
      },
      {
        id: 'u-mat-3',
        unitNumber: 3,
        title: 'Metals, Polymers & Miscellaneous Materials',
        subject: 'Building Materials & Concrete Technology',
        chapters: [
          {
            id: 'ch-mat-3',
            chapterNumber: 3,
            title: 'Ferrous/Non-Ferrous Metals, Polymers, Bitumen & Paints',
            subject: 'Building Materials & Concrete Technology',
            unit: 'Metals, Polymers & Miscellaneous Materials',
            overview: 'Cast iron, wrought iron, TMT bar quenching metallurgy, aluminium and copper, thermoplastics vs thermosetting resins, bitumen vs tar, paint vehicles/driers, and precast concrete masonry units.',
            conceptSlugs: ['building-materials-metals-plastics-paints-blocks']
          }
        ]
      }
    ]
  },
  {
    id: 'subj-bldg-construction',
    name: 'Building Construction & Planning',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    description: 'Principles of architectural planning, building bye-laws, foundations in regular and problematic soils, masonry bonds, finishes, stairs, roof trusses, disaster-resistant construction (earthquakes, cyclones, fires), and catalog of Indian Standards per Dr. S.S. Bhavikatti.',
    weightageRank: 9,
    totalConcepts: 25,
    standardCodes: ['NBC 2016', 'IS 1904:1986', 'IS 2911 (Part 3)', 'IS 2212:1991', 'IS 1893:2016', 'IS 13920:2016', 'IS 4326:2013'],
    units: [
      {
        id: 'u-bcon-1',
        unitNumber: 1,
        title: 'Building Planning & Foundation Engineering',
        subject: 'Building Construction & Planning',
        chapters: [
          {
            id: 'ch-bcon-1',
            chapterNumber: 1,
            title: 'Principles of Planning & Foundations in Expansive Soils',
            subject: 'Building Construction & Planning',
            unit: 'Building Planning & Foundation Engineering',
            overview: 'Aspect, prospect, privacy, FAR, Safe Bearing Capacity (SBC), Rankine minimum foundation depth, spread/stepped/combined/strap footings, raft, grillage, and under-reamed piles for black cotton soil.',
            conceptSlugs: ['building-construction-planning-foundations-soils']
          }
        ]
      },
      {
        id: 'u-bcon-2',
        unitNumber: 2,
        title: 'Superstructures, Masonry Bonds, Components & Stairs',
        subject: 'Building Construction & Planning',
        chapters: [
          {
            id: 'ch-bcon-2',
            chapterNumber: 2,
            title: 'Masonry Bonds, Finishes, Stairs & Roof Trusses',
            subject: 'Building Construction & Planning',
            unit: 'Superstructures, Masonry Bonds, Components & Stairs',
            overview: 'English and Flemish brick bonds, queen closers, plastering, pointing profiles, terrazzo flooring, King post and Queen post roof trusses, North light saw-tooth roofs, and staircase comfort design rules.',
            conceptSlugs: ['building-construction-superstructure-masonry-finishes-stairs-roofs']
          }
        ]
      },
      {
        id: 'u-bcon-3',
        unitNumber: 3,
        title: 'Disaster Resistant Buildings & Indian Standards',
        subject: 'Building Construction & Planning',
        chapters: [
          {
            id: 'ch-bcon-3',
            chapterNumber: 3,
            title: 'Earthquake, Cyclone, Fire Protection & Master IS Codes',
            subject: 'Building Construction & Planning',
            unit: 'Disaster Resistant Buildings & Indian Standards',
            overview: 'Seismic zonation of India (Zones II-V), design base shear formulation, continuous RC plinth/lintel/roof bands, base isolation, cyclone-resistant hip roofs, fire resistance ratings, and master catalog of Indian Standards.',
            conceptSlugs: ['disaster-resistant-buildings-earthquake-cyclone-fire-is-codes']
          }
        ]
      }
    ]
  },
  {
    id: 'subj-survey-geomatics',
    name: 'Surveying & Geomatics',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    description: 'Principles of surveying, chaining, tape corrections, compass surveying, plane table Lehman rules, spirit leveling, reciprocal leveling, theodolite, tacheometry, total station, GPS, contouring, Simpson area, prismoidal earthwork volumes, and Remote Sensing/GIS per Dr. S.S. Bhavikatti.',
    weightageRank: 10,
    totalConcepts: 24,
    standardCodes: ['Survey of India Standards', 'SP:43 (IRC)', 'IS 1200 (Part 1)'],
    units: [
      {
        id: 'u-surv-1',
        unitNumber: 1,
        title: 'Linear Measurements, Compass, Plane Table & Leveling',
        subject: 'Surveying & Geomatics',
        chapters: [
          {
            id: 'ch-surv-1',
            chapterNumber: 1,
            title: 'Chaining Corrections, Compass, Lehman Rules & Leveling',
            subject: 'Surveying & Geomatics',
            unit: 'Linear Measurements, Compass, Plane Table & Leveling',
            overview: 'Working from whole to part, tape pull/temperature/sag corrections, normal tension, Prismatic vs Surveyor compass, local attraction, Lehman Three-Point Problem rules, HI vs Rise/Fall leveling, reciprocal leveling, tacheometry, and GPS.',
            conceptSlugs: ['surveying-linear-compass-plane-table-theodolite']
          }
        ]
      },
      {
        id: 'u-surv-2',
        unitNumber: 2,
        title: 'Mapping, Contouring, Earthwork & Geoinformatics',
        subject: 'Surveying & Geomatics',
        chapters: [
          {
            id: 'ch-surv-2',
            chapterNumber: 2,
            title: 'Topographic Contours, Simpson Rule, Planimeter & GIS',
            subject: 'Surveying & Geomatics',
            unit: 'Mapping, Contouring, Earthwork & Geoinformatics',
            overview: 'Contour topographic signatures, Simpson 1/3rd rule, Amsler Polar Planimeter zero circle, Prismoidal formula, borrow pit excavation volume, satellite remote sensing resolutions, and GIS spatial data models.',
            conceptSlugs: ['geomatics-mapping-contouring-areas-volumes-gis']
          }
        ]
      }
    ]
  },
  {
    id: 'subj-const-mgmt',
    name: 'Construction Management & Estimating',
    branchId: 'geomatics-management',
    branchName: 'Geomatics, Materials & Management',
    description: 'Project planning, CPM, PERT, floats, crashing, building estimation, analysis of rates, and valuation.',
    weightageRank: 11,
    totalConcepts: 16,
    standardCodes: ['IS 1200 (Part 1-28)', 'IS 15883:2009'],
    units: [
      {
        id: 'u-cpm-1',
        unitNumber: 1,
        title: 'Project Planning, CPM & PERT Scheduling',
        subject: 'Construction Management & Estimating',
        chapters: [
          {
            id: 'ch-cpm-1',
            chapterNumber: 1,
            title: 'Network Analysis & Float Calculations',
            subject: 'Construction Management & Estimating',
            unit: 'Project Planning, CPM & PERT Scheduling',
            overview: 'Critical path determination, Total/Free/Independent floats, and PERT probabilistic completion.',
            conceptSlugs: ['cpm-pert-project-scheduling-floats']
          }
        ]
      }
    ]
  }
];
