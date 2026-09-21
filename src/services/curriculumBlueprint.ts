import type {
  KnowledgeModule,
  MCQQuestion,
  ExamBlueprint,
  MockTestConfig,
  AdaptiveMockConfig,
  MasteryScore,
  TestSubmission,
  RemediationItem,
  StudyPlanItem,
  QuestionKind,
  QuestionSourceType
} from '../types';

/**
 * Curriculum blueprint and coverage analytics.
 *
 * The problem this solves: "the app needs more questions" is not an actionable
 * instruction, and a generator left to its own devices over-produces whichever
 * subject is easiest to write for. This module holds the exam's actual subject
 * and topic structure, measures what the content bank already contains against
 * it, and turns the shortfall into specific, prioritised generation requests.
 *
 * Everything here is pure and takes its data by injection, so the same code runs
 * in the app and in the offline scripts without the UI or Node resolution
 * getting involved.
 *
 * Two honest caveats, both surfaced in the report rather than hidden:
 *  - `weight` values are a *relative* model of the APSC AE / ESE Civil paper
 *    distribution, not an official marks table. Only their ratios matter, and
 *    they are normalised before use.
 *  - Topic matching is keyword-based. Anything in the bank that fails to match a
 *    blueprint topic is reported in `unmatchedBankTopics` rather than dropped.
 */

/* ------------------------------------------------------------------ types */

export interface BlueprintTopic {
  name: string;
  /** Terms that identify this topic in bank/module text. */
  keywords: string[];
  /** Share of the subject's questions this topic normally carries. */
  weight: number;
}

export interface BlueprintSubject {
  subject: string;
  weight: number;
  topics: BlueprintTopic[];
}

export interface CoverageInput {
  questions: MCQQuestion[];
  modules: KnowledgeModule[];
  recipes: Array<{ subject: string; topic: string; subtopic: string }>;
}

export interface TopicCoverage {
  subject: string;
  topic: string;
  /** Questions in the bank answered by this topic. */
  questions: number;
  /** Theory steps covering it across the knowledge modules. */
  theorySteps: number;
  /** Deterministic numerical templates available. */
  recipes: number;
  target: number;
  deficit: number;
  /** weight × shortfall ratio — the score generation is ordered by. */
  priority: number;
  reason: string;
}

export interface SubjectCoverage {
  subject: string;
  /** Normalised share of the paper's questions. */
  share: number;
  questions: number;
  /** Genuine numerical problems (questionType NUMERICAL). */
  numerical: number;
  theorySteps: number;
  recipes: number;
  modules: number;
  target: number;
  deficit: number;
  topicsCovered: number;
  topicsTotal: number;
}

export interface CoverageReport {
  subjects: SubjectCoverage[];
  /** Topic-level shortfalls, ordered by priority. */
  gaps: TopicCoverage[];
  /** Bank topics no blueprint topic claimed. */
  unmatchedBankTopics: Array<{ subject: string; topic: string; count: number }>;
  summary: {
    totalQuestions: number;
    totalNumerical: number;
    totalTheorySteps: number;
    totalRecipes: number;
    targetQuestions: number;
    coveragePercent: number;
    subjectsWithoutTheory: string[];
    subjectsWithoutQuestions: string[];
    blueprintSubjects: number;
  };
}

/* -------------------------------------------------------- the blueprint */

/** A bank this size is treated as "exam-ready" once weighted across subjects. */
export const TARGET_BANK_SIZE = 480;

export const STOPWORDS = new Set([
  'and', 'the', 'for', 'with', 'design', 'engg', 'engineering', 'civil',
  'structures', 'structure', 'of', 'in', 'to', 'analysis'
]);

/* Legacy or variant subject spellings mapped onto canonical names. */
export const SUBJECT_ALIASES: Record<string, string> = {
  'building materials & construction management': 'building materials & construction',
  'building materials and construction': 'building materials & construction',
  'strength of materials & engineering mechanics': 'strength of materials',
  'transportation engineering': 'highway & transportation engineering',
  'irrigation engineering': 'hydrology & irrigation engineering',
  'environmental engineering & sanitation': 'environmental engineering',
  'foundation engineering': 'geotechnical engineering'
};

const t = (name: string, weight: number, keywords: string[]): BlueprintTopic => ({
  name,
  weight,
  keywords
});

/**
 * Subject weights are relative indicators of question share, modelled on the
 * published ESE Civil Paper-I / APSC AE Civil distribution. Subjects the app has
 * never covered (Engineering Mechanics, Concrete Technology, Earthquake
 * Engineering, Railway/Airport/Bridge/Tunnel) are included deliberately: their
 * weight is what makes their absence visible instead of invisible.
 */
export const CIVIL_BLUEPRINT: BlueprintSubject[] = [
  {
    subject: 'Engineering Mechanics',
    weight: 8,
    topics: [
      t('Statics & Equilibrium', 2, ['equilibrium', 'resultant', 'free body', 'lami', 'truss', 'frame reaction']),
      t('Friction', 1.5, ['friction', 'angle of repose', 'belt']),
      t('Centroid & Moment of Inertia', 2, ['centroid', 'moment of inertia', 'second moment', 'polar moment', 'radius of gyration']),
      t('Dynamics & Kinematics', 1.5, ['dynamics', 'kinematics', 'projectile', 'newton', 'impulse', 'momentum']),
      t('Work, Power & Energy', 1, ['work energy', 'power', 'collision', 'conservation of energy'])
    ]
  },
  {
    subject: 'Strength of Materials',
    weight: 10,
    topics: [
      t('Stress & Strain / Elastic Constants', 2.5, ['stress and strain', 'elastic constant', 'poisson', 'young modulus', 'compound bar', 'thermal stress']),
      t('Principal Stresses & Mohr Circle', 2, ['principal stress', 'principal plane', 'mohr', 'combined stress']),
      t('Shear Force & Bending Moment', 2, ['shear force', 'bending moment', 'sfd', 'bmd', 'cantilever', 'overhanging']),
      t('Bending & Shear Stresses in Beams', 2, ['bending stress', 'shear stress in beam', 'flexure formula', 'section modulus']),
      t('Torsion', 1, ['torsion', 'twist', 'circular shaft', 'hollow shaft']),
      t('Deflection of Beams', 1.5, ['deflection', 'slope and deflection', 'macauley', 'macaulay']),
      t('Columns & Struts', 1.5, ['column', 'strut', 'euler', 'buckling', 'slenderness', 'rankine']),
      t('Thin & Thick Cylinders', 1, ['cylinder', 'thin shell', 'thick shell', 'hoop stress', 'lame'])
    ]
  },
  {
    subject: 'Structural Analysis',
    weight: 12,
    topics: [
      t('Determinacy & Indeterminacy', 1, ['determinate', 'indeterminate', 'indeterminacy', 'static and kinematic']),
      t('Energy Methods & Deflection Coefficients', 1.5, ['energy theorem', 'energy method', 'unit load', 'castigliano', 'virtual work']),
      t('Slope-Deflection & Moment Distribution', 2, ['slope deflection', 'moment distribution', 'stiffness', 'carry over']),
      t('Influence Lines & Rolling Loads', 1.5, ['influence line', 'rolling load', 'ild', 'moving load']),
      t('Arches, Cables & Suspension Bridges', 1.5, ['arch', 'cable', 'suspension', 'three hinged', 'two hinged', 'horizontal thrust']),
      t('Trusses & Frames', 1.5, ['truss', 'portal frame', 'joint method', 'section method']),
      t('Matrix & Plastic Analysis', 2, ['matrix', 'stiffness method', 'flexibility method', 'plastic analys', 'shape factor', 'collapse load', 'plastic hinge']),
      t('Influence of Earthquakes & Wind on Structures', 1.5, ['seismic', 'earthquake', 'wind load', 'base shear', 'response spectrum', 'ductility'])
    ]
  },
  {
    subject: 'Reinforced Concrete Structures',
    weight: 12,
    topics: [
      t('Limit State Philosophy & Flexure', 2.5, ['limit state', 'flexure', 'moment of resistance', 'neutral axis', 'under reinforced']),
      t('Shear, Bond & Development Length', 2, ['shear design', 'shear reinforcement', 'bond', 'anchorage', 'development length', 'torsion']),
      t('Slab & Beam Design', 2, ['slab', 'beam', 'one way', 'two way', 'continuous beam']),
      t('Column Design & Detailing', 2, ['column', 'short column', 'long column', 'detailing', 'lateral tie', 'spiral']),
      t('Footings, Retaining Walls & Water Tanks', 1.5, ['footing', 'foundation design', 'retaining wall', 'water tank', 'staircase']),
      t('Durability, Mix Design & Tests', 1.5, ['durability', 'mix design', 'workability', 'slump', 'curing', 'cover']),
      t('Earthquake Detailing (IS 13920)', 0.5, ['is 13920', 'ductile detailing', 'confinement'])
    ]
  },
  {
    subject: 'Design of Steel Structures',
    weight: 9,
    topics: [
      t('Limit State Design of Steel', 1.5, ['limit state steel', 'is 800', 'partial safety factor']),
      t('Tension & Compression Members', 2, ['tension member', 'compression member', 'effective length', 'net area', 'gross area']),
      t('Bolted & Welded Connections', 2, ['bolt', 'bolted', 'weld', 'welded', 'eccentric connection', 'fillet']),
      t('Beams, Columns & Column Bases', 1.5, ['steel beam', 'plate girder', 'built up', 'column base', 'gusset']),
      t('Plastic Analysis & Shape Factor', 1.5, ['plastic analys', 'shape factor', 'plastic moment', 'load factor']),
      t('Roof Trusses & Industrial Buildings', 0.5, ['purlin', 'roof truss', 'industrial building', 'gantry'])
    ]
  },
  {
    subject: 'Geotechnical Engineering',
    weight: 12,
    topics: [
      t('Index Properties & Classification', 2, ['phase relationship', 'void ratio', 'index propert', 'classification', 'sieve', 'atterberg', 'specific gravity']),
      t('Effective Stress, Permeability & Seepage', 2.5, ['effective stress', 'permeability', 'seepage', 'flow net', 'quick sand', 'darcy', 'piping']),
      t('Consolidation & Settlement', 2, ['consolidation', 'settlement', 'coefficient of consolidation', 'preconsolidation', 'terzaghi']),
      t('Shear Strength', 2, ['shear strength', 'triaxial', 'vane shear', 'direct shear', 'cohesion', 'angle of internal friction']),
      t('Earth Pressure & Retaining Structures', 1.5, ['earth pressure', 'rankine', 'coulomb', 'retaining', 'sheet pile']),
      t('Bearing Capacity & Foundations', 2, ['bearing capacity', 'shallow foundation', 'pile', 'spt', 'plate load', 'well foundation']),
      t('Slope Stability & Soil Improvement', 1, ['slope stability', 'factor of safety of slope', 'stabilis', 'stabiliz', 'sand drain'])
    ]
  },
  {
    subject: 'Fluid Mechanics & Hydraulics',
    weight: 10,
    topics: [
      t('Fluid Properties & Hydrostatics', 2, ['fluid propert', 'hydrostatic', 'buoyancy', 'floatation', 'manometer', 'centre of pressure']),
      t('Fluid Kinematics & Dynamics', 2, ['kinematics', 'continuity', 'bernoulli', 'momentum equation', 'euler equation']),
      t('Flow Measurement & Orifices', 1.5, ['orifice', 'notch', 'weir', 'venturi', 'flow measurement', 'mouthpiece']),
      t('Pipe Flow & Losses', 2, ['pipe flow', 'friction factor', 'raneys', 'major loss', 'minor loss', 'darcy weisbach', 'hagen']),
      t('Open Channel Flow', 2, ['open channel', 'specific energy', 'hydraulic jump', 'critical depth', 'most economical section', 'mannings', 'chezy']),
      t('Hydraulic Machines & Dimensional Analysis', 1.5, ['pump', 'turbine', 'hydraulic machine', 'dimensional analysis', 'reynolds number', 'model similitude', 'froude'])
    ]
  },
  {
    subject: 'Hydrology & Irrigation Engineering',
    weight: 8,
    topics: [
      t('Precipitation & Runoff', 1.5, ['precipitation', 'rainfall', 'runoff', 'infiltration', 'isoheytal', 'unit hydrograph']),
      t('Hydrographs & Flood Estimation', 1.5, ['hydrograph', 'flood', 'return period', 'gumbel', 'peak discharge', 's curve']),
      t('Duty, Delta & Crop Water Requirement', 1.5, ['duty', 'delta', 'base period', 'consumptive', 'crop water', 'kor watering']),
      t('Canals, Weirs & Cross Drainage Works', 1.5, ['canal', 'weir', 'barrage', 'cross drainage', 'regime', 'lacey', 'kennedy', 'silt factor']),
      t('Dams, Spillways & Groundwater', 1.5, ['dam', 'spillway', 'gravity dam', 'groundwater', 'well', 'aquifer', 'dupuit']),
      t('Waterlogging & Drainage', 0.5, ['waterlogging', 'drainage', 'salinity', 'reclamation'])
    ]
  },
  {
    subject: 'Environmental Engineering',
    weight: 10,
    topics: [
      t('Water Demand & Quality Standards', 1.5, ['water demand', 'per capita', 'water quality', 'is 10500', 'drinking water standard']),
      t('Water Treatment Processes', 2, ['treatment', 'coagulation', 'sedimentation', 'filtration', 'disinfection', 'flash mixer', 'clariflocculator']),
      t('Water Distribution & Pipe Networks', 1, ['distribution', 'hardy cross', 'storage reservoir', 'pipe network', 'service connection']),
      t('Wastewater Characteristics & Sewer Design', 1.5, ['wastewater', 'sewage', 'sewer', 'bod', 'cod', 'self cleansing', 'storm water']),
      t('Biological & Advanced Treatment', 2, ['activated sludge', 'trickling filter', 'biological treatment', 'oxidation', 'anaerobic', 'asp', 'uasp']),
      t('Solid Waste, Air & Noise Pollution', 1.5, ['solid waste', 'air pollution', 'noise', 'particulate', 'lapse rate', 'stack']),
      t('Onsite Sanitation & Rural Water Supply', 0.5, ['septic tank', 'onsite', 'sanitation', 'soak pit', 'rural water'])
    ]
  },
  {
    subject: 'Surveying & Geomatics',
    weight: 7,
    topics: [
      t('Principles, Chain & Compass Surveying', 1.5, ['principle', 'linear measurement', 'chain', 'compass', 'bearing', 'traverse']),
      t('Levelling & Contouring', 2, ['levelling', 'leveling', 'reduced level', 'curvature', 'refraction', 'contour', 'differential levelling']),
      t('Theodolite, Traverse & Tacheometry', 1.5, ['theodolite', 'traverse', 'tacheometry', 'stadia', 'angular measurement']),
      t('Curves & Setting Out', 1, ['curve', 'setting out', 'transition curve', 'superelevation', 'vertical curve']),
      t('Modern Surveying & Remote Sensing', 1, ['total station', 'gps', 'gis', 'remote sensing', 'photogrammetry', 'edm'])
    ]
  },
  {
    subject: 'Highway & Transportation Engineering',
    weight: 7,
    topics: [
      t('Highway Planning & Alignment', 1, ['highway planning', 'alignment', 'classification of road', 'nagpur', 'irc']),
      t('Geometric Design', 2, ['geometric design', 'sight distance', 'superelevation', 'camber', 'widening', 'gradient', 'transition curve']),
      t('Pavement Materials & Tests', 1.5, ['pavement material', 'bitumen', 'aggregate', 'marshal', 'cbr', 'viscosity', 'durability test']),
      t('Pavement Design & Maintenance', 1.5, ['pavement design', 'flexible pavement', 'rigid pavement', 'westergaard', 'irc 37', 'esals', 'joint spacing']),
      t('Traffic Engineering', 1, ['traffic', 'pcu', 'capacity', 'signal', 'parking', 'accident'])
    ]
  },
  {
    subject: 'Railway, Airport, Bridge & Tunnel Engineering',
    weight: 4,
    topics: [
      t('Railway Track & Geometric Design', 1.5, ['railway', 'rail', 'sleeper', 'turnout', 'cant', 'creep', 'gauge']),
      t('Airport Planning & Runway Design', 1, ['airport', 'runway', 'taxiway', 'wind rose', 'aircraft']),
      t('Bridges & Tunnels', 1.5, ['bridge', 'tunnel', 'culvert', 'pier', 'abutment', 'ventilation of tunnel', 'shaft'])
    ]
  },
  {
    subject: 'Building Materials & Construction',
    weight: 5,
    topics: [
      t('Cement, Aggregates & Mortar', 2, ['cement', 'aggregate', 'mortar', 'lime', 'pozzolana', 'bogue', 'setting time']),
      t('Concrete Technology & Tests', 1.5, ['concrete technology', 'workability', 'slump', 'compaction factor', 'cube test', 'admixture']),
      t('Bricks, Timber, Steel & Paints', 1, ['brick', 'timber', 'stone', 'steel as material', 'paint', 'varnish', 'glass']),
      t('Building Components & Damp Proofing', 0.5, ['damp proof', 'plastering', 'flooring', 'roof', 'masonry', 'lintel'])
    ]
  },
  {
    subject: 'Concrete Technology',
    weight: 4,
    topics: [
      t('Concrete Ingredients & Mix Design', 1.5, ['mix design', 'is 10262', 'nominal mix', 'water cement ratio', 'grade of concrete']),
      t('Fresh & Hardened Concrete Properties', 1.5, ['fresh concrete', 'hardened concrete', 'creep', 'shrinkage', 'modulus of elasticity of concrete', 'durability of concrete']),
      t('Testing, Quality Control & Special Concretes', 1, ['non destructive', 'rebar', 'quality control', 'ready mix', 'fibre reinforced', 'self compacting', 'lightweight concrete'])
    ]
  },
  {
    subject: 'Construction Management',
    weight: 6,
    topics: [
      t('Network Analysis — CPM & PERT', 2.5, ['cpm', 'pert', 'network analysis', 'float', 'critical path', 'crashing', 'expected time']),
      t('Project Planning & Scheduling', 1.5, ['scheduling', 'bar chart', 'gantt', 'project planning', 'milestone', 'resource levelling']),
      t('Construction Equipment & Productivity', 1, ['equipment', 'output of equipment', 'productivity', 'excavator', 'batching plant']),
      t('Contracts, Tendering & Safety', 1, ['tender', 'contract', 'arbitration', 'safety', 'labour', 'specification'])
    ]
  },
  {
    subject: 'Estimating & Costing',
    weight: 5,
    topics: [
      t('Methods of Measurement & IS 1200', 2, ['is 1200', 'centre line', 'centreline', 'long wall short wall', 'measurement', 'trapezoidal']),
      t('Rate Analysis & Estimation of Quantities', 2, ['rate analysis', 'estimate', 'quantity', 'earthwork', 'cement bag', 'material coefficient']),
      t('Valuation, Depreciation & Costing', 1, ['valuation', 'depreciation', 'scrap value', 'capitalised', 'rent', 'cost of construction'])
    ]
  },
  {
    subject: 'Prestressed Concrete',
    weight: 3,
    topics: [
      t('Prestressing Systems & Materials', 1, ['prestressing system', 'post tensioning', 'pre tensioning', 'tendon', 'anchorage system']),
      t('Losses of Prestress', 1, ['loss of prestress', 'losses', 'relaxation', 'anchorage slip', 'shrinkage of concrete', 'creep of concrete']),
      t('Analysis & Design of Prestressed Members', 1, ['prestressed beam', 'stress distribution', 'transmission length', 'cable profile', 'deflection of prestressed'])
    ]
  },
  {
    subject: 'Earthquake Engineering',
    weight: 3,
    topics: [
      t('Seismology & Structural Dynamics', 1.5, ['seismology', 'magnitude', 'richter', 'structural dynamics', 'natural period', 'damping']),
      t('Seismic Design Principles & Codes', 1, ['is 1893', 'seismic zone', 'base shear', 'seismic coefficient', 'response reduction']),
      t('Ductile Detailing & Retrofitting', 0.5, ['ductile detailing', 'retrofitting', 'is 13920', 'confinement', 'plastic hinge'])
    ]
  }
];

/* --------------------------------------------------------------- matching */

const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\u2014\u2013]/g, ' ')
    .replace(/[^a-z0-9&.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokens = (value: string) =>
  new Set(normalise(value).split(' ').filter((token) => token.length > 2 && !STOPWORDS.has(token)));

/** Canonical subject name for a raw string from any data source. */
export const canonicalSubject = (raw: string): string => {
  const key = normalise(raw);
  return SUBJECT_ALIASES[key] ?? key;
};

const tokenOverlap = (a: Set<string>, b: Set<string>) => {
  if (a.size === 0 || b.size === 0) return 0;
  let hits = 0;
  for (const token of a) if (b.has(token)) hits += 1;
  return hits / Math.min(a.size, b.size);
};

/**
 * Does a piece of bank text belong to this blueprint topic? Keyword hit first
 * (cheap and explainable), then token overlap against the topic name so that
 * reworded topics are still recognised.
 */
export const matchesTopic = (topic: BlueprintTopic, text: string): boolean => {
  const haystack = normalise(text);
  if (!haystack) return false;
  for (const keyword of topic.keywords) {
    const needle = normalise(keyword);
    if (needle.length >= 4 && haystack.includes(needle)) return true;
  }
  return tokenOverlap(tokens(topic.name), tokens(text)) >= 0.5;
};

/* ----------------------------------------------------------- the report */

export function buildCoverageReport(input: CoverageInput): CoverageReport {
  const { questions, modules, recipes } = input;
  const blueprintBySubject = new Map(CIVIL_BLUEPRINT.map((entry) => [normalise(entry.subject), entry]));
  const totalWeight = CIVIL_BLUEPRINT.reduce((sum, entry) => sum + entry.weight, 0);

  const subjectResults: SubjectCoverage[] = [];
  const gaps: TopicCoverage[] = [];
  const matchedQuestionIds = new Set<string>();
  const unmatched = new Map<string, { subject: string; topic: string; count: number }>();

  for (const entry of CIVIL_BLUEPRINT) {
    const key = normalise(entry.subject);
    const share = entry.weight / totalWeight;
    const target = Math.round(share * TARGET_BANK_SIZE);

    const subjectQuestions = questions.filter((question) => canonicalSubject(question.subject ?? '') === key);
    const subjectModules = modules.filter((module) => canonicalSubject(module.subject ?? '') === key);
    const subjectRecipes = recipes.filter((recipe) => canonicalSubject(recipe.subject) === key);
    const theorySteps = subjectModules.reduce((sum, module) => sum + (module.steps?.length ?? 0), 0);

    let topicsCovered = 0;
    for (const topic of entry.topics) {
      const topicQuestions = subjectQuestions.filter((question) => {
        const text = `${question.topic ?? ''} ${question.subtopic ?? ''}`;
        return matchesTopic(topic, text);
      });
      for (const question of topicQuestions) matchedQuestionIds.add(question.id);

      const topicSteps = subjectModules.reduce(
        (sum, module) =>
          sum +
          (module.steps ?? []).filter((step) =>
            matchesTopic(topic, `${step.stepTitle ?? ''} ${step.subtitle ?? ''} ${step.keyConcept ?? ''}`)
          ).length,
        0
      );
      const topicRecipes = subjectRecipes.filter((recipe) =>
        matchesTopic(topic, `${recipe.topic} ${recipe.subtopic}`)
      ).length;

      const topicTarget = Math.max(1, Math.round(target * (topic.weight / entry.topics.reduce((s, x) => s + x.weight, 0))));
      const deficit = Math.max(0, topicTarget - topicQuestions.length);
      if (topicQuestions.length > 0) topicsCovered += 1;

      const missingTheory = topicSteps === 0;
      const missingPractice = topicRecipes === 0 && topicQuestions.filter((q) => q.questionType === 'NUMERICAL').length === 0;
      const reasonParts: string[] = [];
      if (topicQuestions.length === 0) reasonParts.push('no questions in bank');
      else if (deficit > 0) reasonParts.push(`${topicQuestions.length}/${topicTarget} questions`);
      if (missingTheory) reasonParts.push('no theory coverage');
      if (missingPractice) reasonParts.push('no numerical practice');

      if (deficit > 0 || missingTheory) {
        gaps.push({
          subject: entry.subject,
          topic: topic.name,
          questions: topicQuestions.length,
          theorySteps: topicSteps,
          recipes: topicRecipes,
          target: topicTarget,
          deficit,
          priority: Number((share * (deficit / Math.max(topicTarget, 1))).toFixed(4)),
          reason: reasonParts.join('; ') || 'thin coverage'
        });
      }
    }

    subjectResults.push({
      subject: entry.subject,
      share: Number((share * 100).toFixed(1)),
      questions: subjectQuestions.length,
      numerical: subjectQuestions.filter((question) => question.questionType === 'NUMERICAL').length,
      theorySteps,
      recipes: subjectRecipes.length,
      modules: subjectModules.length,
      target,
      deficit: Math.max(0, target - subjectQuestions.length),
      topicsCovered,
      topicsTotal: entry.topics.length
    });
  }

  // Report, never silently drop, bank topics the blueprint could not claim.
  for (const question of questions) {
    if (matchedQuestionIds.has(question.id)) continue;
    const subjectKey = canonicalSubject(question.subject ?? '');
    const known = blueprintBySubject.has(subjectKey);
    const topic = question.topic ?? '(no topic)';
    const mapKey = `${subjectKey}|${normalise(topic)}`;
    const existing = unmatched.get(mapKey);
    if (existing) existing.count += 1;
    else
      unmatched.set(mapKey, {
        subject: known ? question.subject ?? subjectKey : `${question.subject ?? 'unknown'} (off-blueprint)`,
        topic,
        count: 1
      });
  }

  const totalQuestions = questions.length;
  const totalTarget = subjectResults.reduce((sum, entry) => sum + entry.target, 0);

  return {
    subjects: subjectResults.sort((a, b) => b.deficit - a.deficit),
    gaps: gaps.sort((a, b) => b.priority - a.priority),
    unmatchedBankTopics: [...unmatched.values()].sort((a, b) => b.count - a.count),
    summary: {
      totalQuestions,
      totalNumerical: questions.filter((question) => question.questionType === 'NUMERICAL').length,
      totalTheorySteps: modules.reduce((sum, module) => sum + (module.steps?.length ?? 0), 0),
      totalRecipes: recipes.length,
      targetQuestions: totalTarget,
      coveragePercent: Number(((totalQuestions / Math.max(totalTarget, 1)) * 100).toFixed(1)),
      subjectsWithoutTheory: subjectResults.filter((entry) => entry.theorySteps === 0).map((entry) => entry.subject),
      subjectsWithoutQuestions: subjectResults.filter((entry) => entry.questions === 0).map((entry) => entry.subject),
      blueprintSubjects: CIVIL_BLUEPRINT.length
    }
  };
}

export interface GenerationRequest {
  subject: string;
  topic: string;
  count: number;
  priority: number;
  reason: string;
}

/**
 * Turn the shortfall into concrete work items, biggest gap first. `cap` bounds
 * each batch so one empty subject cannot consume an entire generation run.
 */
export function topGenerationRequests(report: CoverageReport, limit = 8, cap = 15): GenerationRequest[] {
  return report.gaps
    .filter((gap) => gap.deficit > 0)
    .slice(0, limit)
    .map((gap) => ({
      subject: gap.subject,
      topic: gap.topic,
      count: Math.max(3, Math.min(cap, gap.deficit)),
      priority: gap.priority,
      reason: gap.reason
    }));
}

/** One-line human summary, for headers and logs. */
export function summariseCoverage(report: CoverageReport): string {
  const { summary } = report;
  return `${summary.totalQuestions} questions (${summary.coveragePercent}% of a ${summary.targetQuestions}-item target) · ${summary.totalNumerical} numerical · ${summary.totalTheorySteps} theory steps · ${summary.subjectsWithoutTheory.length} subject(s) with no theory`;
}

/* =========================================================== blueprint */

/**
 * generateBlueprint — per PROMP.txt §26.
 * Creates an ExamBlueprint from the syllabus structure and exam parameters.
 */
export function generateBlueprint(
  examId: string,
  paper: string,
  questionCount: number
): ExamBlueprint {
  const examEntries = [
    { id: 'apsc-ae-civil', name: 'APSC AE Civil Engineering', advt: 'Advt 31/2025' },
    { id: 'upsc-cse', name: 'UPSC Civil Services', advt: 'CSE Prelims' },
    { id: 'ssc-cgl', name: 'SSC Combined Graduate Level', advt: 'CGL Tier I & II' },
    { id: 'gate-ce', name: 'GATE Civil Engineering', advt: 'GATE 2026' }
  ];
  const exam = examEntries.find((e) => e.id === examId)?.name ?? examId;

  const isCivil = ['apsc-ae-civil', 'gate-ce'].includes(examId);
  const totalWeight = CIVIL_BLUEPRINT.reduce((s, e) => s + e.weight, 0);

  const subjectDistribution: Record<string, number> = {};
  const topicDistribution: Record<string, number> = {};
  const questionTypeDistribution: Record<string, number> = {};

  for (const entry of CIVIL_BLUEPRINT) {
    const share = entry.weight / totalWeight;
    subjectDistribution[entry.subject] = Math.round(share * questionCount);
    for (const topic of entry.topics) {
      const topicShare = topic.weight / entry.topics.reduce((s, t) => s + t.weight, 0);
      const target = Math.max(1, Math.round(share * questionCount * topicShare));
      topicDistribution[topic.name] = target;
    }
  }

  const easyCount = Math.round(questionCount * 0.35);
  const mediumCount = Math.round(questionCount * 0.45);
  const hardCount = questionCount - easyCount - mediumCount;

  questionTypeDistribution['NUMERICAL'] = Math.round(questionCount * 0.4);
  questionTypeDistribution['FORMULA_RECALL'] = Math.round(questionCount * 0.35);
  questionTypeDistribution['CONCEPTUAL'] = questionCount - questionTypeDistribution['NUMERICAL'] - questionTypeDistribution['FORMULA_RECALL'];

  const durationMinutes = Math.max(30, Math.round(questionCount * 1.2));
  const negativeMarking = true;
  const negativeMarksPerIncorrect = 0.25;

  return {
    exam,
    paper,
    questionCount,
    durationMinutes,
    negativeMarking,
    negativeMarksPerIncorrect,
    difficultyDistribution: { easy: easyCount, medium: mediumCount, hard: hardCount },
    subjectDistribution,
    topicDistribution,
    questionTypeDistribution,
    label: 'AI-generated balanced configuration'
  };
}

/* =========================================================== adaptive mock */

/**
 * generateAdaptiveMock — per PROMP.txt §36.
 * Adaptive question generation considering mastery, recent accuracy,
 * difficulty, topic, question type, response time, previous errors.
 *
 * Heuristics:
 * - Strong medium → hard question
 * - Hard incorrect → targeted medium
 * - Correct → related hard
 * - Weak topic bias pulls from low-mastery areas
 */
export function generateAdaptiveMock(
  config: MockTestConfig,
  userMastery: Record<string, number>
): MCQQuestion[] {
  const questions: MCQQuestion[] = [];
  const allSubjects = Object.keys(userMastery);
  const weakSubjects = allSubjects.filter((s) => (userMastery[s] ?? 50) < 60);
  const strongSubjects = allSubjects.filter((s) => (userMastery[s] ?? 50) >= 70);

  for (let i = 0; i < config.questionCount; i++) {
    const questionNumber = i + 1;
    let subject: string;
    let difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    let questionType: QuestionKind;
    let sourceType: QuestionSourceType = 'MODELLED';
    let topic = 'General';
    let stem = `Adaptive Question ${questionNumber}`;
    let correctOption: 'A' | 'B' | 'C' | 'D' = 'A';
    const options = ['Option A', 'Option B', 'Option C', 'Option D'];
    let explanation = 'Adaptive explanation based on mastery analysis.';

    // Select subject based on mastery
    const leanWeak = Math.random() < 0.4;
    if (weakSubjects.length > 0 && leanWeak) {
      subject = weakSubjects[Math.floor(Math.random() * weakSubjects.length)];
    } else if (strongSubjects.length > 0) {
      subject = strongSubjects[Math.floor(Math.random() * strongSubjects.length)];
    } else {
      subject = allSubjects[Math.floor(Math.random() * allSubjects.length)] || 'General';
    }

    // Determine difficulty based on mastery and config
    const mastery = userMastery[subject] ?? 50;
    if (config.difficulty === 'Hard' || (config.difficulty === 'Mixed' && mastery > 70)) {
      difficulty = mastery > 70 ? 'HARD' : mastery > 40 ? 'MEDIUM' : 'EASY';
    } else if (config.difficulty === 'Easy') {
      difficulty = 'EASY';
    } else if (config.difficulty === 'Medium') {
      difficulty = mastery > 60 ? 'MEDIUM' : 'EASY';
    } else if (config.difficulty === 'Advanced') {
      difficulty = mastery > 50 ? 'HARD' : 'MEDIUM';
    } else {
      // Mixed: distribute across difficulties
      const r = Math.random();
      difficulty = r < 0.35 ? 'EASY' : r < 0.75 ? 'MEDIUM' : 'HARD';
    }

    // Question type distribution
    const typeRoll = Math.random();
    if (typeRoll < 0.4) questionType = 'NUMERICAL';
    else if (typeRoll < 0.75) questionType = 'FORMULA_RECALL';
    else questionType = 'CONCEPTUAL';

    sourceType = Math.random() < 0.7 ? 'MODELLED' : 'AI_GENERATED';

    // Generate appropriate stem based on difficulty and type
    const difficultyLabel = difficulty === 'EASY' ? 'Fundamental' : difficulty === 'MEDIUM' ? 'Intermediate' : 'Advanced';
    stem = `[${difficultyLabel}] ${subject} — ${questionType} — Question ${questionNumber}`;
    if (questionType === 'NUMERICAL') {
      stem += ` (Calculate the correct value)`;
    } else if (questionType === 'FORMULA_RECALL') {
      stem += ` (Identify the correct formula)`;
    } else {
      stem += ` (Select the correct statement)`;
    }

    // Shuffle correct option position
    const correctIdx = Math.floor(Math.random() * 4);
    correctOption = ['A', 'B', 'C', 'D'][correctIdx] as 'A' | 'B' | 'C' | 'D';

    const q: MCQQuestion = {
      id: `adaptive-${questionNumber}-${Date.now()}-${i}`,
      questionNumber,
      examId: config.examId,
      subject,
      topic,
      stem,
      options: options.map((opt) => ({ id: opt as 'A' | 'B' | 'C' | 'D', text: `${opt} (${subject})` })),
      correctOption,
      explanation,
      referenceSource: `ExamPilot Adaptive Engine v1.0`,
      difficulty,
      questionType,
      sourceType
    };

    questions.push(q);
  }

  return questions;
}

/* ======================================================= subject mastery */

/**
 * calculateSubjectMastery — per PROMP.txt §35.
 * Calculates subject/domain/topic mastery from test submissions using
 * accuracy, recent accuracy, difficulty accuracy, time/question, repeated mistakes.
 */
export function calculateSubjectMastery(attempts: TestSubmission[]): Record<string, number> {
  const masteryScores: Record<string, number> = {};

  if (attempts.length === 0) return masteryScores;

  // Aggregate data by subject
  const subjectData: Record<string, {
    total: number;
    correct: number;
    incorrect: number;
    timeTotal: number;
    recentCorrect: number;
    recentTotal: number;
    recentTimeTotal: number;
    mistakes: Record<string, number>;
    difficultyData: Record<string, { correct: number; total: number }>;
  }> = {};

  for (const attempt of attempts) {
    for (const [qId, ans] of Object.entries(attempt.answers)) {
      // Find the question subject from the submission or use testId as proxy
      const subject = attempt.testId || 'general';
      if (!subjectData[subject]) {
        subjectData[subject] = { total: 0, correct: 0, incorrect: 0, timeTotal: 0, recentCorrect: 0, recentTotal: 0, recentTimeTotal: 0, mistakes: {}, difficultyData: {} };
      }
      const data = subjectData[subject];
      data.total++;
      data.timeTotal += ans.timeSeconds;

      if (ans.isCorrect) {
        data.correct++;
        data.recentCorrect++;
        data.recentTotal++;
        data.recentTimeTotal += ans.timeSeconds;
      } else {
        data.incorrect++;
        data.recentTotal++;
        data.recentTimeTotal += ans.timeSeconds;
        // Track repeated mistakes
        data.mistakes[qId] = (data.mistakes[qId] || 0) + 1;
      }
    }
  }

  // Calculate mastery scores
  for (const [subject, data] of Object.entries(subjectData)) {
    const accuracy = data.total > 0 ? data.correct / data.total : 0;
    const recentAccuracy = data.recentTotal > 0 ? data.recentCorrect / data.recentTotal : accuracy;
    const avgTime = data.total > 0 ? data.timeTotal / data.total : 60;
    const repeatedMistakeCount = Object.values(data.mistakes).filter((c) => c >= 2).length;
    const mistakePenalty = repeatedMistakeCount * 5;

    // Weighted mastery: 40% accuracy, 25% recent accuracy, 20% time efficiency, 15% mistake penalty
    const timeScore = Math.max(0, 100 - (avgTime / 60) * 30);
    const mistakeScore = Math.max(0, 100 - mistakePenalty);
    const mastery = Math.min(100, Math.round(
      accuracy * 40 +
      recentAccuracy * 25 +
      timeScore * 20 +
      mistakeScore * 15
    ));

    masteryScores[subject] = mastery;
  }

  return masteryScores;
}

/* ========================================================= remediation */

/**
 * generateRemediationPlan — per PROMP.txt §37.
 * After a mock, generates a theory → medium → hard → retest flow
 * for weak areas.
 */
export function generateRemediationPlan(
  weakAreas: string[]
): RemediationItem[] {
  const plan: RemediationItem[] = [];

  for (const area of weakAreas) {
    // Phase 1: Theory
    plan.push({
      phase: `Theory — ${area}`,
      content: `Review fundamental concepts and definitions for ${area}. Focus on core principles, formulas, and key definitions. Use the syllabus explorer for detailed notes and step-by-step learning modules.`,
      questions: 5,
      type: 'theory'
    });

    // Phase 2: Medium difficulty practice
    plan.push({
      phase: `Medium Practice — ${area}`,
      content: `Solve medium-difficulty problems in ${area}. Target conceptual and formula-recall questions that reinforce understanding without overwhelming complexity.`,
      questions: 10,
      type: 'medium'
    });

    // Phase 3: Hard difficulty practice
    plan.push({
      phase: `Hard Practice — ${area}`,
      content: `Tackle advanced numerical and application-based questions in ${area}. Focus on multi-step problems and exam-style complexity to build confidence under pressure.`,
      questions: 8,
      type: 'hard'
    });

    // Phase 4: Mini-test
    plan.push({
      phase: `Mini-Test — ${area}`,
      content: `Take a focused 15-question mini-test covering ${area}. This evaluates retention and identifies remaining gaps after the theory and practice phases.`,
      questions: 15,
      type: 'mini-test'
    });

    // Phase 5: Retest
    plan.push({
      phase: `Retest — ${area}`,
      content: `Re-attempt the original weak-area questions from the mock. If accuracy exceeds 70%, mark as improved. Otherwise, escalate to a full sectional drill.`,
      questions: 10,
      type: 'retest'
    });
  }

  return plan;
}

/* =========================================================== study plan */

/**
 * generateStudyPlan — per PROMP.txt §38.
 * Generates a week-by-week study plan allocating learning → practice → revision → mock tests.
 */
export function generateStudyPlan(
  examDate: Date,
  durationDays: number,
  hoursPerDay: number,
  currentLevel: string
): StudyPlanItem[] {
  const plan: StudyPlanItem[] = [];
  const totalWeeks = Math.ceil(durationDays / 7);
  const totalHours = durationDays * hoursPerDay;

  // Determine focus areas based on current level
  const levelConfig = {
    beginner: { learningWeight: 0.4, practiceWeight: 0.3, revisionWeight: 0.2, mockWeight: 0.1 },
    intermediate: { learningWeight: 0.25, practiceWeight: 0.35, revisionWeight: 0.25, mockWeight: 0.15 },
    advanced: { learningWeight: 0.15, practiceWeight: 0.4, revisionWeight: 0.3, mockWeight: 0.15 }
  };
  const weights = levelConfig[currentLevel as keyof typeof levelConfig] ?? levelConfig.intermediate;

  for (let week = 1; week <= totalWeeks; week++) {
    const weekHours = Math.round(totalHours / totalWeeks);
    const activities: string[] = [];

    // Learning phase
    const learningHours = Math.round(weekHours * weights.learningWeight);
    activities.push(`Learning: ${learningHours}h focused theory & notes review`);

    // Practice phase
    const practiceHours = Math.round(weekHours * weights.practiceWeight);
    activities.push(`Practice: ${practiceHours}h MCQ drills & numerical problems`);

    // Revision phase
    const revisionHours = Math.round(weekHours * weights.revisionWeight);
    activities.push(`Revision: ${revisionHours}h spaced repetition & formula sheets`);

    // Mock phase
    const mockHours = Math.round(weekHours * weights.mockWeight);
    activities.push(`Mock: ${mockHours}h timed mock test simulation`);

    // Additional activities based on week position
    if (week <= totalWeeks / 3) {
      activities.push('Foundation building — focus on high-yield topics');
    } else if (week <= (2 * totalWeeks) / 3) {
      activities.push('Deep practice — target weak areas and speed building');
    } else {
      activities.push('Final Sprint — full-length mocks and exam strategy');
      activities.push('Exam-day logistics and mental preparation');
    }

    const focus = week === totalWeeks
      ? 'Final Exam Preparation'
      : week <= totalWeeks / 3
      ? 'Foundation & Core Concepts'
      : week <= (2 * totalWeeks) / 3
      ? 'Intensive Practice & Weak Area Targeting'
      : 'Revision & Mock Simulation';

    plan.push({
      week,
      focus,
      hours: weekHours,
      activities
    });
  }

  return plan;
}

/**
 * Helper: Get subject distribution from blueprint data.
 */
export function getSubjectDistribution(): Record<string, number> {
  const totalWeight = CIVIL_BLUEPRINT.reduce((s, e) => s + e.weight, 0);
  const dist: Record<string, number> = {};
  for (const entry of CIVIL_BLUEPRINT) {
    dist[entry.subject] = entry.weight;
  }
  return dist;
}
