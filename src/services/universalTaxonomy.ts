import { canonicalSubject } from './curriculumBlueprint';

export interface ExamEntry {
  id: string;
  name: string;
  category: string;
  color: string;
  totalMarks: number;
  durationHours: number;
  description: string;
}

export interface ExamNode {
  id: string;
  name: string;
  exams: ExamEntry[];
}

export interface SubjectNode {
  id: string;
  name: string;
  domains: DomainNode[];
}

export interface DomainNode {
  id: string;
  name: string;
  topics: TopicNode[];
}

export interface TopicNode {
  id: string;
  name: string;
  subtopics: SubTopicNode[];
  weight?: number;
}

export interface SubTopicNode {
  id: string;
  name: string;
  concepts: string[];
}

export const UNIVERSAL_EXAMS: ExamEntry[] = [
  { id: 'apsc-ae-civil', name: 'APSC Assistant Engineer (Civil)', category: 'State PSC Engineering', color: '#4F46E5', totalMarks: 200, durationHours: 2, description: 'Assam Public Service Commission Assistant Engineer (Civil) under PWD / WRD / PHED.' },
  { id: 'upsc-cse', name: 'UPSC Civil Services Examination', category: 'Central Civil Services', color: '#0284C7', totalMarks: 400, durationHours: 4, description: 'Union Public Service Commission Preliminary Examination (GS Paper I & CSAT).' },
  { id: 'gate-ce', name: 'GATE Civil Engineering', category: 'National Engineering Entrance', color: '#7C3AED', totalMarks: 100, durationHours: 3, description: 'Graduate Aptitude Test in Engineering for M.Tech admissions and PSU recruitments.' },
  { id: 'gate-gs', name: 'GATE Computer Science', category: 'National Engineering Entrance', color: '#0891B2', totalMarks: 100, durationHours: 3, description: 'Graduate Aptitude Test in Engineering for Computer Science & Information Technology.' },
  { id: 'gate-me', name: 'GATE Mechanical Engineering', category: 'National Engineering Entrance', color: '#DC2626', totalMarks: 100, durationHours: 3, description: 'Graduate Aptitude Test in Engineering for Mechanical Engineering.' },
  { id: 'ssc-cgl', name: 'SSC Combined Graduate Level', category: 'Staff Selection Commission', color: '#059669', totalMarks: 200, durationHours: 1, description: 'Tier-1 computer based objective exam covering Quantitative Aptitude, Reasoning, and General Awareness.' },
  { id: 'ssc-ch', name: 'SSC Chemistry', category: 'Staff Selection Commission', color: '#7C3AED', totalMarks: 200, durationHours: 2, description: 'SSC Combined Graduate Level Chemistry paper covering Physical, Organic, and Inorganic Chemistry.' }
];

export const CIVIL_SUBJECTS: SubjectNode[] = [
  { id: 'sub-engineering-mechanics', name: 'Engineering Mechanics', domains: [
    { id: 'dom-statics', name: 'Statics & Equilibrium', topics: [
      { id: 'tp-equilibrium', name: 'Equilibrium of Rigid Bodies', subtopics: [{ id: 'st-fbd', name: 'Free Body Diagrams', concepts: ['resolution of forces', 'moment of a force', 'couple'] }, { id: 'st-resultant', name: 'Resultant & Centroid', concepts: ['resultant force', 'centroid of area', 'parallel axis theorem'] }], weight: 2 },
      { id: 'tp-friction', name: 'Friction', subtopics: [{ id: 'fr-dry', name: 'Dry Friction', concepts: ['Coulomb friction', 'angle of repose', 'belt friction'] }], weight: 1.5 }
    ]},
    { id: 'dom-dynamics', name: 'Dynamics & Kinematics', topics: [
      { id: 'tp-kinematics', name: 'Kinematics of Particles', subtopics: [{ id: 'kn-rectilinear', name: 'Rectilinear & Curvilinear Motion', concepts: ['velocity', 'acceleration', 'tangential & normal components'] }], weight: 1.5 }
    ]}
  ]},
  { id: 'sub-strength-materials', name: 'Strength of Materials', domains: [
    { id: 'dom-stress-strain', name: 'Stress & Strain', topics: [
      { id: 'tp-elastic', name: 'Elastic Constants', subtopics: [{ id: 'es-poisson', name: 'Poisson Ratio & Young Modulus', concepts: ['stress', 'strain', 'Hooke law', 'elastic limit'] }], weight: 2.5 },
      { id: 'tp-principal', name: 'Principal Stresses & Mohr Circle', subtopics: [{ id: 'pc-mohr', name: 'Mohr Circle', concepts: ['principal stress', 'maximum shear stress', 'stress transformation'] }], weight: 2 }
    ]},
    { id: 'dom-shear-bending', name: 'Shear Force & Bending Moment', topics: [
      { id: 'tp-sfd-bmd', name: 'SFD & BMD', subtopics: [{ id: 'sb-diagrams', name: 'Diagram Construction', concepts: ['shear force diagram', 'bending moment diagram', 'loading relationships'] }], weight: 2 }
    ]},
    { id: 'dom-torsion-deflection', name: 'Torsion & Deflection', topics: [
      { id: 'tp-torsion', name: 'Torsion of Circular Shafts', subtopics: [{ id: 'to-formula', name: 'Torsion Formula', concepts: ['torsional shear stress', 'polar moment of inertia', 'angle of twist'] }], weight: 1 },
      { id: 'tp-deflection', name: 'Deflection of Beams', subtopics: [{ id: 'df-macaulay', name: 'Macaulay Method', concepts: ['double integration', 'Macaulay brackets', 'moment area method'] }], weight: 1.5 }
    ]}
  ]},
  { id: 'sub-structural-analysis', name: 'Structural Analysis', domains: [
    { id: 'dom-determinacy', name: 'Determinacy & Methods', topics: [
      { id: 'tp-determinate', name: 'Determinacy & Indeterminacy', subtopics: [{ id: 'dt-static', name: 'Static & Kinematic Indeterminacy', concepts: ['degree of freedom', 'equations of equilibrium', 'redundant constraints'] }], weight: 1 },
      { id: 'tp-moment-dist', name: 'Moment Distribution Method', subtopics: [{ id: 'md-stiffness', name: 'Stiffness & Carry-over', concepts: ['distribution factor', 'carry-over factor', 'moment distribution'] }], weight: 2 }
    ]},
    { id: 'dom-influence-arches', name: 'Influence Lines & Arches', topics: [
      { id: 'tp-ild', name: 'Influence Lines', subtopics: [{ id: 'il-muller', name: 'Muller-Breslau Principle', concepts: ['influence line diagram', 'rolling loads', 'critical position'] }], weight: 1.5 },
      { id: 'tp-arches', name: 'Arches & Cables', subtopics: [{ id: 'ar-three-hinged', name: 'Three-Hinged Arches', concepts: ['thrust', 'bending moment in arches', 'cable tension'] }], weight: 1.5 }
    ]}
  ]},
  { id: 'sub-rcc', name: 'Reinforced Concrete Structures', domains: [
    { id: 'dom-flexure', name: 'Flexure Design', topics: [
      { id: 'tp-limit-state', name: 'Limit State Philosophy', subtopics: [{ id: 'ls-philosophy', name: 'Limit State of Collapse', concepts: ['under-reinforced', 'over-reinforced', 'balanced section', 'IS 456'] }], weight: 2.5 },
      { id: 'tp-singly', name: 'Singly Reinforced Beams', subtopics: [{ id: 'sr-flexure', name: 'Flexural Design', concepts: ['moment of resistance', 'neutral axis', 'section modulus'] }], weight: 2 }
    ]},
    { id: 'dom-shear-column', name: 'Shear, Bond & Columns', topics: [
      { id: 'tp-shear', name: 'Design for Shear', subtopics: [{ id: 'sv-reinforcement', name: 'Shear Reinforcement', concepts: ['stirrups', 'development length', 'anchorage'] }], weight: 2 },
      { id: 'tp-columns', name: 'Column Design', subtopics: [{ id: 'cl-axial', name: 'Axial & Eccentric Loading', concepts: ['slenderness ratio', 'eccentricity', 'IS 456 column design'] }], weight: 2 }
    ]},
    { id: 'dom-ftwd', name: 'Footings, Retaining Walls & Water Tanks', topics: [
      { id: 'tp-footings', name: 'Footing Design', subtopics: [{ id: 'ft-shallow', name: 'Shallow & Deep Foundations', concepts: ['bearing capacity', 'settlement', 'pile foundations'] }], weight: 1.5 }
    ]}
  ]},
  { id: 'sub-steel', name: 'Design of Steel Structures', domains: [
    { id: 'dom-lds', name: 'Limit State Design', topics: [
      { id: 'tp-steel-lds', name: 'Limit State of Steel', subtopics: [{ id: 'sl-is800', name: 'IS 800 Design', concepts: ['partial safety factor', 'limit state design', 'connection design'] }], weight: 1.5 },
      { id: 'tp-members', name: 'Tension & Compression Members', subtopics: [{ id: 'tc-capacity', name: 'Member Capacity', concepts: ['effective length', 'net area', 'gross area', 'buckling'] }], weight: 2 }
    ]},
    { id: 'dom-connections', name: 'Connections', topics: [
      { id: 'tp-bolts', name: 'Bolted & Welded Connections', subtopics: [{ id: 'bc-design', name: 'Connection Design', concepts: ['fillet weld', 'bolted connection', 'eccentric loading'] }], weight: 2 }
    ]}
  ]},
  { id: 'sub-geotech', name: 'Geotechnical Engineering', domains: [
    { id: 'dom-properties', name: 'Index Properties', topics: [
      { id: 'tp-phase', name: 'Three-Phase System', subtopics: [{ id: 'tp-relations', name: 'Phase Relationships', concepts: ['void ratio', 'porosity', 'degree of saturation', 'specific gravity'] }], weight: 2 },
      { id: 'tp-compaction', name: 'Compaction & Classification', subtopics: [{ id: 'cp-atterberg', name: 'Atterberg Limits', concepts: ['liquid limit', 'plastic limit', 'flow index', 'consistency index'] }], weight: 2 }
    ]},
    { id: 'dom-permeation', name: 'Permeability & Seepage', topics: [
      { id: 'tp-seepage', name: 'Seepage & Flow Nets', subtopics: [{ id: 'sg-darcy', name: 'Darcy Law', concepts: ['permeability', 'seepage force', 'piping', 'quick sand'] }], weight: 2.5 }
    ]},
    { id: 'dom-consolidation', name: 'Consolidation & Shear Strength', topics: [
      { id: 'tp-consolidation', name: 'Terzaghi Consolidation', subtopics: [{ id: 'co-theory', name: '1D Consolidation Theory', concepts: ['coefficient of consolidation', 'time factor', 'degree of consolidation', 'Terzaghi theory'] }], weight: 2 },
      { id: 'tp-shear', name: 'Shear Strength', subtopics: [{ id: 'sh-tests', name: 'Shear Tests', concepts: ['direct shear', 'triaxial', 'vane shear', 'Mohr-Coulomb'] }], weight: 2 }
    ]},
    { id: 'dom-bearings', name: 'Bearing Capacity & Slope Stability', topics: [
      { id: 'tp-bearing', name: 'Bearing Capacity', subtopics: [{ id: 'bt-theory', name: 'Terzaghi & Meyerhof', concepts: ['bearing capacity factors', 'shallow foundation', 'pile foundations'] }], weight: 2 },
      { id: 'tp-slope', name: 'Slope Stability', subtopics: [{ id: 'sl-stability', name: 'Factor of Safety', concepts: ['method of slices', 'Bishop', 'Fellenius'] }], weight: 1 }
    ]}
  ]},
  { id: 'sub-fluids', name: 'Fluid Mechanics & Hydraulics', domains: [
    { id: 'dom-hydrostatics', name: 'Hydrostatics', topics: [
      { id: 'tp-hydrostatic', name: 'Hydrostatic Force', subtopics: [{ id: 'hp-force', name: 'Force on Submerged Surfaces', concepts: ['pressure', 'centre of pressure', 'buoyancy'] }], weight: 2 }
    ]},
    { id: 'dom-flow', name: 'Fluid Flow', topics: [
      { id: 'tp-bernoulli', name: 'Bernoulli Theorem', subtopics: [{ id: 'bn-equation', name: 'Euler & Bernoulli', concepts: ['energy equation', 'Venturimeter', 'orifice meter'] }], weight: 2 },
      { id: 'tp-pipe', name: 'Pipe Flow', subtopics: [{ id: 'pf-losses', name: 'Losses in Pipes', concepts: ['Darcy-Weisbach', 'friction factor', 'minor losses'] }], weight: 2 },
      { id: 'tp-open-channel', name: 'Open Channel Flow', subtopics: [{ id: 'oc-specific', name: 'Specific Energy', concepts: ['critical depth', 'Froude number', 'hydraulic jump'] }], weight: 2 }
    ]}
  ]},
  { id: 'sub-environmental', name: 'Environmental Engineering', domains: [
    { id: 'dom-water', name: 'Water Treatment', topics: [
      { id: 'tp-treatment', name: 'Treatment Processes', subtopics: [{ id: 'wt-stages', name: 'Coagulation to Disinfection', concepts: ['sedimentation', 'filtration', 'chlorination'] }], weight: 2 }
    ]},
    { id: 'dom-waste', name: 'Wastewater & Pollution', topics: [
      { id: 'tp-bod', name: 'BOD Kinetics', subtopics: [{ id: 'bk-first-order', name: 'First Order BOD', concepts: ['BOD', 'COD', 'temperature coefficient'] }], weight: 1.5 },
      { id: 'tp-pollution', name: 'Pollution Control', subtopics: [{ id: 'pc-types', name: 'Air, Noise & Solid Waste', concepts: ['LAPSE rate', 'stack', 'septic tank'] }], weight: 1.5 }
    ]}
  ]},
  { id: 'sub-transport', name: 'Highway & Transportation Engineering', domains: [
    { id: 'dom-geometric', name: 'Geometric Design', topics: [
      { id: 'tp-sight', name: 'Sight Distance', subtopics: [{ id: 'sd-stopping', name: 'Stopping & Passing', concepts: ['sight distance', 'superelevation', 'camber'] }], weight: 2 }
    ]},
    { id: 'dom-pavement', name: 'Pavement Design', topics: [
      { id: 'tp-flexible', name: 'Flexible & Rigid Pavement', subtopics: [{ id: 'pp-design', name: 'Pavement Design', concepts: ['CBR', 'Westergaard', 'IS 383'] }], weight: 2 }
    ]},
    { id: 'dom-traffic', name: 'Traffic Engineering', topics: [
      { id: 'tp-traffic', name: 'Traffic Engineering', subtopics: [{ id: 'tt-signals', name: 'Signals & Capacity', concepts: ['PCU', 'signal timing', 'capacity'] }], weight: 1 }
    ]}
  ]},
  { id: 'sub-surveying', name: 'Surveying & Geomatics', domains: [
    { id: 'dom-chain', name: 'Chain & Compass Surveying', topics: [
      { id: 'tp-chain', name: 'Chain Surveying', subtopics: [{ id: 'cs-principles', name: 'Principles & Errors', concepts: ['chain survey', 'compass survey', 'traverse'] }], weight: 1.5 }
    ]},
    { id: 'dom-theodolite', name: 'Theodolite & Curves', topics: [
      { id: 'tp-theodolite', name: 'Theodolite', subtopics: [{ id: 'th-transit', name: 'Transit & Traverse', concepts: ['theodolite', 'traverse', 'tacheometry'] }], weight: 1.5 }
    ]},
    { id: 'dom-modern', name: 'Modern Surveying', topics: [
      { id: 'tp-remote', name: 'Remote Sensing & GIS', subtopics: [{ id: 'rs-gis', name: 'GPS & GIS', concepts: ['total station', 'GPS', 'GIS', 'photogrammetry'] }], weight: 1 }
    ]}
  ]},
  { id: 'sub-water-resources', name: 'Hydrology & Irrigation Engineering', domains: [
    { id: 'dom-precipitation', name: 'Precipitation & Runoff', topics: [
      { id: 'tp-hydrograph', name: 'Hydrographs', subtopics: [{ id: 'hg-unit', name: 'Unit Hydrograph', concepts: ['unit hydrograph', 'S-curve', 'flood estimation'] }], weight: 1.5 }
    ]},
    { id: 'dom-irrigation', name: 'Irrigation', topics: [
      { id: 'tp-duty', name: 'Duty & Delta', subtopics: [{ id: 'dd-crop', name: 'Crop Water Requirement', concepts: ['duty', 'delta', 'kor watering'] }], weight: 1.5 },
      { id: 'tp-canal', name: 'Canals & Weirs', subtopics: [{ id: 'cw-design', name: 'Canal & Weir Design', concepts: ['regime theory', 'Lacey', 'Kennedy'] }], weight: 1.5 }
    ]}
  ]},
  { id: 'sub-bldg-materials', name: 'Building Materials & Construction', domains: [
    { id: 'dom-materials', name: 'Building Materials', topics: [
      { id: 'tp-cement', name: 'Cement & Aggregates', subtopics: [{ id: 'cm-properties', name: 'Cement Properties', concepts: ['Bogue compounds', 'setting time', 'fineness'] }], weight: 2 }
    ]},
    { id: 'dom-construction', name: 'Construction Management', topics: [
      { id: 'tp-cpm', name: 'CPM & PERT', subtopics: [{ id: 'cp-network', name: 'Network Analysis', concepts: ['CPM', 'PERT', 'float', 'critical path'] }], weight: 2.5 }
    ]}
  ]},
  { id: 'sub-prestressed', name: 'Prestressed Concrete', domains: [
    { id: 'dom-systems', name: 'Prestressing Systems', topics: [
      { id: 'tp-systems', name: 'Prestressing Systems', subtopics: [{ id: 'ps-methods', name: 'Pre & Post Tensioning', concepts: ['tendon', 'anchorage', 'losses of prestress'] }], weight: 1 }
    ]}
  ]},
  { id: 'sub-earthquake', name: 'Earthquake Engineering', domains: [
    { id: 'dom-seismic', name: 'Seismic Design', topics: [
      { id: 'tp-seismic', name: 'Seismic Design Principles', subtopics: [{ id: 'se-is1893', name: 'IS 1893 & IS 13920', concepts: ['seismic zone', 'base shear', 'ductile detailing'] }], weight: 1 }
    ]}
  ]},
  { id: 'sub-gs', name: 'General Studies', domains: [
    { id: 'dom-polity', name: 'Indian Polity & Governance', topics: [
      { id: 'tp-rights', name: 'Fundamental Rights', subtopics: [{ id: 'fr-articles', name: 'Articles 14-32', concepts: ['Right to Equality', 'Right to Freedom', 'Writs'] }], weight: 2 },
      { id: 'tp-dpsp', name: 'Directive Principles', subtopics: [{ id: 'dp-fundamental', name: 'DPSP & FRD', concepts: ['Directive Principles', 'Fundamental Duties', 'amendments'] }], weight: 2 }
    ]},
    { id: 'dom-history', name: 'Indian History', topics: [
      { id: 'tp-modern', name: 'Modern History', subtopics: [{ id: 'hm-freedom', name: 'Freedom Struggle', concepts: ['Revolt of 1857', 'Non-Cooperation', 'Quit India'] }], weight: 2 }
    ]},
    { id: 'dom-geography', name: 'Geography & Ecology', topics: [
      { id: 'tp-physical', name: 'Physical Geography', subtopics: [{ id: 'gp-features', name: 'Indian Geography', concepts: ['rivers', 'mountains', 'climate', 'monsoon'] }], weight: 2 }
    ]}
  ]}
];

export const CS_SUBJECTS: SubjectNode[] = [
  { id: 'sub-algorithms', name: 'Algorithms', domains: [
    { id: 'dom-sorting', name: 'Sorting & Searching', topics: [
      { id: 'tp-sorting', name: 'Sorting Algorithms', subtopics: [{ id: 'so-comparison', name: 'Comparison Sorts', concepts: ['quick sort', 'merge sort', 'heap sort', 'time complexity'] }, { id: 'so-linear', name: 'Linear Sorts', concepts: ['counting sort', 'radix sort', 'bucket sort'] }], weight: 2 },
      { id: 'tp-searching', name: 'Searching Algorithms', subtopics: [{ id: 'sb-binary', name: 'Binary Search', concepts: ['binary search', 'binary search tree', 'lower bound'] }], weight: 1.5 }
    ]},
    { id: 'dom-graph', name: 'Graph Algorithms', topics: [
      { id: 'tp-traversal', name: 'Graph Traversal', subtopics: [{ id: 'gr-bfs-dfs', name: 'BFS & DFS', concepts: ['breadth-first search', 'depth-first search', 'adjacency list'] }], weight: 2 },
      { id: 'tp-shortest', name: 'Shortest Path', subtopics: [{ id: 'sp-dijkstra', name: 'Dijkstra & Bellman-Ford', concepts: ['shortest path', 'negative weights', 'DAG'] }], weight: 2 }
    ]}
  ]},
  { id: 'sub-os', name: 'Operating Systems', domains: [
    { id: 'dom-process', name: 'Process Management', topics: [
      { id: 'tp-scheduling', name: 'CPU Scheduling', subtopics: [{ id: 'sc-algorithms', name: 'Scheduling Algorithms', concepts: ['FCFS', 'SJF', 'Round Robin', 'Priority', 'MLFQ'] }], weight: 2 },
      { id: 'tp-synchronization', name: 'Process Synchronization', subtopics: [{ id: 'sy-mutex', name: 'Mutual Exclusion', concepts: ['critical section', 'semaphore', 'monitor', 'deadlock'] }], weight: 2 }
    ]},
    { id: 'dom-memory', name: 'Memory Management', topics: [
      { id: 'tp-paging', name: 'Paging & Virtual Memory', subtopics: [{ id: 'mm-paging', name: 'Paging', concepts: ['page table', 'TLB', 'virtual address', 'page fault'] }], weight: 2 },
      { id: 'tp-segmentation', name: 'Segmentation', subtopics: [{ id: 'sg-segment', name: 'Segmentation & Segments', concepts: ['segmentation', 'shared memory', 'protected mode'] }], weight: 1 }
    ]}
  ]},
  { id: 'sub-dbms', name: 'Database Management Systems', domains: [
    { id: 'dom-relational', name: 'Relational Model', topics: [
      { id: 'tp-sql', name: 'SQL & Queries', subtopics: [{ id: 'sq-commands', name: 'SQL Commands', concepts: ['SELECT', 'JOIN', 'GROUP BY', 'subquery', 'trigger'] }], weight: 2 },
      { id: 'tp-normalization', name: 'Normalization', subtopics: [{ id: 'nf-forms', name: 'Normal Forms', concepts: ['1NF', '2NF', '3NF', 'BCNF', 'functional dependency'] }], weight: 2 }
    ]},
    { id: 'dom-indexing', name: 'Indexing & Transactions', topics: [
      { id: 'tp-index', name: 'Indexing', subtopics: [{ id: 'ix-types', name: 'Index Types', concepts: ['B-tree', 'B+ tree', 'hash index', 'clustered index'] }], weight: 1.5 },
      { id: 'tp-transaction', name: 'Transactions', subtopics: [{ id: 'tx-acid', name: 'ACID Properties', concepts: ['atomicity', 'consistency', 'isolation', 'durability', 'concurrency'] }], weight: 1.5 }
    ]}
  ]},
  { id: 'sub-cn', name: 'Computer Networks', domains: [
    { id: 'dom-osi', name: 'OSI & TCP/IP', topics: [
      { id: 'tp-osi', name: 'OSI Model', subtopics: [{ id: 'os-layers', name: 'OSI Layers', concepts: ['7 layers', 'TCP/IP model', 'encapsulation'] }], weight: 2 }
    ]},
    { id: 'dom-protocols', name: 'Protocols', topics: [
      { id: 'tp-http', name: 'Application Protocols', subtopics: [{ id: 'ap-http', name: 'HTTP & DNS', concepts: ['HTTP', 'DNS', 'DHCP', 'FTP', 'SMTP'] }], weight: 1.5 }
    ]}
  ]},
  { id: 'sub-ai', name: 'AI/ML', domains: [
    { id: 'dom-ml', name: 'Machine Learning', topics: [
      { id: 'tp-supervised', name: 'Supervised Learning', subtopics: [{ id: 'ml-regression', name: 'Regression', concepts: ['linear regression', 'logistic regression', 'decision tree'] }], weight: 2 },
      { id: 'tp-unsupervised', name: 'Unsupervised Learning', subtopics: [{ id: 'ml-clustering', name: 'Clustering', concepts: ['k-means', 'DBSCAN', 'hierarchical'] }], weight: 1.5 }
    ]}
  ]}
];

export const ME_SUBJECTS: SubjectNode[] = [
  { id: 'sub-thermodynamics', name: 'Thermodynamics', domains: [
    { id: 'dom-laws', name: 'Thermodynamic Laws', topics: [
      { id: 'tp-first', name: 'First Law', subtopics: [{ id: 'fl-energy', name: 'Energy & Energy Balance', concepts: ['first law', 'internal energy', 'enthalpy', 'work'] }], weight: 2 },
      { id: 'tp-second', name: 'Second Law', subtopics: [{ id: 'sl-entropy', name: 'Entropy & Carnot', concepts: ['second law', 'entropy', 'Carnot cycle', 'efficiency'] }], weight: 2 }
    ]},
    { id: 'dom-power', name: 'Power Cycles', topics: [
      { id: 'tp-rankine', name: 'Rankine Cycle', subtopics: [{ id: 'rc-cycle', name: 'Rankine Cycle Analysis', concepts: ['boiler', 'turbine', 'condenser', 'pump'] }], weight: 2 }
    ]}
  ]},
  { id: 'sub-ic-engines', name: 'IC Engines', domains: [
    { id: 'dom-si', name: 'SI & CI Engines', topics: [
      { id: 'tp-cycle', name: 'Engine Cycles', subtopics: [{ id: 'cy-otto', name: 'Otto & Diesel Cycles', concepts: ['Otto cycle', 'Diesel cycle', 'dual cycle', 'compression ratio'] }], weight: 2 }
    ]},
    { id: 'dom-fuel', name: 'Fuels & Combustion', topics: [
      { id: 'tp-combustion', name: 'Combustion', subtopics: [{ id: 'co-theory', name: 'Combustion Theory', concepts: ['stoichiometry', 'air-fuel ratio', 'knock', 'emissions'] }], weight: 1.5 }
    ]}
  ]},
  { id: 'sub-heat-transfer', name: 'Heat Transfer', domains: [
    { id: 'dom-conduction', name: 'Conduction', topics: [
      { id: 'tp-fourier', name: 'Fourier Law', subtopics: [{ id: 'fl-heat', name: 'Heat Conduction', concepts: ['Fourier law', 'thermal conductivity', 'steady state'] }], weight: 2 }
    ]},
    { id: 'dom-convection', name: 'Convection & Radiation', topics: [
      { id: 'tp-convection', name: 'Convection', subtopics: [{ id: 'cv-forced', name: 'Forced & Free Convection', concepts: ['Nusselt', 'Reynolds', 'Prandtl'] }], weight: 2 },
      { id: 'tp-radiation', name: 'Radiation', subtopics: [{ id: 'ra-stefan', name: 'Stefan-Boltzmann', concepts: ['Stefan-Boltzmann law', 'view factor', 'radiation exchange'] }], weight: 1.5 }
    ]}
  ]},
  { id: 'sub-machine-design', name: 'Machine Design', domains: [
    { id: 'dom-strength', name: 'Strength of Materials', topics: [
      { id: 'tp-fatigue', name: 'Fatigue & Failure', subtopics: [{ id: 'fa-theory', name: 'Failure Theories', concepts: ['Gerber', 'Goodman', 'Soderberg', 'S-N curve'] }], weight: 2 }
    ]},
    { id: 'dom-components', name: 'Machine Elements', topics: [
      { id: 'tp-bearings', name: 'Bearings', subtopics: [{ id: 'be-types', name: 'Bearing Types', concepts: ['journal bearing', 'rolling element', 'hydrodynamic'] }], weight: 1.5 }
    ]}
  ]},
  { id: 'sub-refrigeration', name: 'Refrigeration & HVAC', domains: [
    { id: 'dom-cycle', name: 'Refrigeration Cycles', topics: [
      { id: 'tp-vapor', name: 'Vapor Compression', subtopics: [{ id: 'vc-cycle', name: 'Vapor Compression Cycle', concepts: ['evaporator', 'compressor', 'condenser', 'expansion valve'] }], weight: 2 }
    ]},
    { id: 'dom-hvac', name: 'HVAC', topics: [
      { id: 'tp-hvac', name: 'HVAC Systems', subtopics: [{ id: 'ha-systems', name: 'HVAC Design', concepts: ['load calculation', 'air conditioning', 'heat pump'] }], weight: 1.5 }
    ]}
  ]}
];

export const CHEMISTRY_SUBJECTS: SubjectNode[] = [
  { id: 'sub-physical', name: 'Physical Chemistry', domains: [
    { id: 'dom-gas', name: 'Gaseous State', topics: [
      { id: 'tp-gas-laws', name: 'Gas Laws', subtopics: [{ id: 'gl-ideal', name: 'Ideal Gas Laws', concepts: ['Boyle law', 'Charles law', 'Gay-Lussac', 'van der Waals'] }], weight: 2 },
      { id: 'tp-kinetic', name: 'Kinetic Theory', subtopics: [{ id: 'kt-speed', name: 'Molecular Speed', concepts: ['root mean square speed', 'Maxwell distribution'] }], weight: 1.5 }
    ]},
    { id: 'dom-thermo', name: 'Chemical Thermodynamics', topics: [
      { id: 'tp-thermo', name: 'Thermodynamics', subtopics: [{ id: 'th-functions', name: 'Thermodynamic Functions', concepts: ['enthalpy', 'entropy', 'Gibbs energy', 'spontaneity'] }], weight: 2 }
    ]},
    { id: 'dom-electro', name: 'Electrochemistry', topics: [
      { id: 'tp-electrode', name: 'Electrochemical Cells', subtopics: [{ id: 'ec-nernst', name: 'Nernst Equation', concepts: ['Nernst equation', 'cell potential', 'electrode potential'] }], weight: 2 }
    ]}
  ]},
  { id: 'sub-organic', name: 'Organic Chemistry', domains: [
    { id: 'dom-mechanism', name: 'Reaction Mechanisms', topics: [
      { id: 'tp-nucleophilic', name: 'Nucleophilic Substitution', subtopics: [{ id: 'ns-sn1-sn2', name: 'SN1 & SN2', concepts: ['SN1', 'SN2', 'carbocation', 'stereochemistry'] }], weight: 2 },
      { id: 'tp-elimination', name: 'Elimination Reactions', subtopics: [{ id: 'el-e1-e2', name: 'E1 & E2', concepts: ['E1', 'E2', 'Zaitsev rule', 'anti-periplanar'] }], weight: 2 }
    ]},
    { id: 'dom-alkene', name: 'Alkenes & Aromatics', topics: [
      { id: 'tp-addition', name: 'Addition Reactions', subtopics: [{ id: 'ad-markovnikov', name: 'Markovnikov Rule', concepts: ['Markovnikov', 'anti-Markovnikov', 'hydroboration'] }], weight: 1.5 },
      { id: 'tp-aromatic', name: 'Aromatic Compounds', subtopics: [{ id: 'ar-electrophilic', name: 'Electrophilic Substitution', concepts: ['electrophilic aromatic substitution', 'directing effects'] }], weight: 1.5 }
    ]},
    { id: 'dom-carbonyl', name: 'Carbonyl Compounds', topics: [
      { id: 'tp-carbonyl', name: 'Aldehydes & Ketones', subtopics: [{ id: 'ck-reactions', name: 'Nucleophilic Addition', concepts: ['Grignard', 'aldol', 'Cannizzaro', 'Clemmensen'] }], weight: 2 }
    ]}
  ]},
  { id: 'sub-inorganic', name: 'Inorganic Chemistry', domains: [
    { id: 'dom-periodic', name: 'Periodic Table', topics: [
      { id: 'tp-trends', name: 'Periodic Trends', subtopics: [{ id: 'pt-properties', name: 'Atomic Properties', concepts: ['atomic radius', 'ionization energy', 'electron affinity', 'electronegativity'] }], weight: 2 }
    ]},
    { id: 'dom-bonding', name: 'Chemical Bonding', topics: [
      { id: 'tp-bonding', name: 'Bonding Theories', subtopics: [{ id: 'bt-vsepr', name: 'VSEPR Theory', concepts: ['VSEPR', 'hybridization', 'molecular orbital theory'] }], weight: 2 },
      { id: 'tp-crystal', name: 'Crystal Structures', subtopics: [{ id: 'cs-lattices', name: 'Crystal Lattices', concepts: ['BCC', 'FCC', 'HCP', 'unit cell', 'packing'] }], weight: 1.5 }
    ]},
    { id: 'dom-coordination', name: 'Coordination Compounds', topics: [
      { id: 'tp-crystal-field', name: 'Crystal Field Theory', subtopics: [{ id: 'cf-splitting', name: 'Crystal Field Splitting', concepts: ['crystal field splitting', 'CFSE', 'color', 'magnetism'] }], weight: 1.5 }
    ]}
  ]}
];

export const UPSC_CSE_SUBJECTS: SubjectNode[] = [
  {
    id: 'sub-upsc-polity',
    name: 'Indian Polity & Governance',
    domains: [
      {
        id: 'dom-upsc-constitution',
        name: 'Constitutional Framework',
        topics: [
          {
            id: 'tp-preamble-fr',
            name: 'Preamble, Fundamental Rights & DPSP',
            subtopics: [
              { id: 'st-fr-dpsp', name: 'Articles 12-51A', concepts: ['Right to Equality', 'Right to Freedom', 'Writs', 'Directive Principles', 'Fundamental Duties'] },
              { id: 'st-basic-structure', name: 'Basic Structure Doctrine', concepts: ['Kesavananda Bharati case', 'judicial review', 'amendment procedure (Article 368)'] }
            ],
            weight: 3
          },
          {
            id: 'tp-exec-legislature',
            name: 'Union & State Executive and Legislature',
            subtopics: [
              { id: 'st-parliament', name: 'Parliamentary System', concepts: ['President powers', 'ordinance making', 'bills and budgeting', 'parliamentary committees'] },
              { id: 'st-federalism', name: 'Center-State Relations', concepts: ['Emergency provisions (352, 356, 360)', 'Inter-state councils', 'Finance Commission'] }
            ],
            weight: 3
          }
        ]
      },
      {
        id: 'dom-upsc-judiciary',
        name: 'Judiciary & Constitutional Bodies',
        topics: [
          {
            id: 'tp-judiciary',
            name: 'Supreme Court & High Courts',
            subtopics: [
              { id: 'st-sc-hc', name: 'Jurisdiction & Independence', concepts: ['collegium system', 'curative petition', 'Public Interest Litigation (PIL)', 'tribunals'] }
            ],
            weight: 2
          },
          {
            id: 'tp-bodies',
            name: 'Constitutional & Statutory Bodies',
            subtopics: [
              { id: 'st-ec-cag', name: 'Election Commission, CAG & UPSC', concepts: ['Article 324', 'CAG audits (Article 148)', 'CVC', 'Lokpal & Lokayuktas'] }
            ],
            weight: 2
          }
        ]
      }
    ]
  },
  {
    id: 'sub-upsc-history',
    name: 'History & Indian National Movement',
    domains: [
      {
        id: 'dom-upsc-modern',
        name: 'Modern Indian History & Freedom Struggle',
        topics: [
          {
            id: 'tp-national-movement',
            name: 'Freedom Struggle & National Movement',
            subtopics: [
              { id: 'st-early-nationalism', name: 'Early Resistance & 1857 Revolt', concepts: ['Revolt of 1857 causes', 'drain of wealth theory', 'moderates vs extremists', 'swadeshi movement'] },
              { id: 'st-gandhian-era', name: 'Gandhian Era & Mass Movements', concepts: ['Non-Cooperation Movement', 'Civil Disobedience & Salt March', 'Quit India Movement 1942', 'INA and Subhas Chandra Bose'] }
            ],
            weight: 3.5
          },
          {
            id: 'tp-social-reforms',
            name: 'Socio-Religious Reform Movements',
            subtopics: [
              { id: 'st-reformers', name: '19th & 20th Century Reforms', concepts: ['Brahmo Samaj', 'Arya Samaj', 'Jyotirao Phule', 'Dr. B.R. Ambedkar', 'women education and caste emancipation'] }
            ],
            weight: 2
          }
        ]
      },
      {
        id: 'dom-upsc-art-culture',
        name: 'Ancient, Medieval & Indian Art & Culture',
        topics: [
          {
            id: 'tp-art-architecture',
            name: 'Architecture, Sculpture & Paintings',
            subtopics: [
              { id: 'st-temple-arch', name: 'Temple Architecture Styles', concepts: ['Nagara style', 'Dravida style', 'Vesara style', 'Buddhist rock-cut caves', 'Indo-Islamic architecture'] }
            ],
            weight: 2.5
          }
        ]
      }
    ]
  },
  {
    id: 'sub-upsc-geography',
    name: 'Geography of India & the World',
    domains: [
      {
        id: 'dom-upsc-physical-geo',
        name: 'Physical Geography & Climatology',
        topics: [
          {
            id: 'tp-geomorphology',
            name: 'Geomorphology & Earth Dynamics',
            subtopics: [
              { id: 'st-plate-tectonics', name: 'Plate Tectonics & Earthquakes', concepts: ['continental drift', 'plate boundaries', 'seismic waves (P and S)', 'volcanism'] }
            ],
            weight: 2.5
          },
          {
            id: 'tp-climatology',
            name: 'Atmospheric Circulation & Monsoons',
            subtopics: [
              { id: 'st-monsoon-elnino', name: 'Indian Monsoon Dynamics', concepts: ['ITCZ shift', 'jet streams', 'El Niño & La Niña', 'Indian Ocean Dipole (IOD)', 'tropical cyclones'] }
            ],
            weight: 3
          }
        ]
      },
      {
        id: 'dom-upsc-indian-geo',
        name: 'Indian River Systems & Resources',
        topics: [
          {
            id: 'tp-drainage',
            name: 'Drainage Systems of India',
            subtopics: [
              { id: 'st-himalayan-peninsular', name: 'Himalayan vs Peninsular Rivers', concepts: ['Indus, Ganga, Brahmaputra systems', 'Godavari, Krishna, Cauvery systems', 'inter-linking of rivers'] }
            ],
            weight: 2.5
          }
        ]
      }
    ]
  },
  {
    id: 'sub-upsc-economy',
    name: 'Economic & Social Development',
    domains: [
      {
        id: 'dom-upsc-macro',
        name: 'Macroeconomics & Public Finance',
        topics: [
          {
            id: 'tp-national-income',
            name: 'National Income & Inflation',
            subtopics: [
              { id: 'st-gdp-inflation', name: 'GDP, GVA & Inflation Metrics', concepts: ['nominal vs real GDP', 'CPI vs WPI', 'monetary policy committee (MPC)', 'repo and reverse repo'] }
            ],
            weight: 3
          },
          {
            id: 'tp-fiscal-budget',
            name: 'Fiscal Policy & Government Budgeting',
            subtopics: [
              { id: 'st-fiscal-deficit', name: 'Deficits & Taxation', concepts: ['fiscal deficit', 'revenue deficit', 'primary deficit', 'GST structure', 'FRBM Act'] }
            ],
            weight: 2.5
          }
        ]
      },
      {
        id: 'dom-upsc-external-banking',
        name: 'Banking, External Sector & Agriculture',
        topics: [
          {
            id: 'tp-banking',
            name: 'Banking System & Financial Markets',
            subtopics: [
              { id: 'st-npa-insolvency', name: 'NPA Resolution & IBC', concepts: ['Insolvency and Bankruptcy Code', 'bad bank (NARCL)', 'priority sector lending', 'capital adequacy ratio'] }
            ],
            weight: 2.5
          },
          {
            id: 'tp-agriculture-trade',
            name: 'Agriculture Subsidies & Food Security',
            subtopics: [
              { id: 'st-msp-pds', name: 'MSP & PDS Reforms', concepts: ['minimum support price', 'PM-KISAN', 'crop insurance (PMFBY)', 'WTO green and amber boxes'] }
            ],
            weight: 2.5
          }
        ]
      }
    ]
  },
  {
    id: 'sub-upsc-csat',
    name: 'CSAT (Civil Services Aptitude Test)',
    domains: [
      {
        id: 'dom-upsc-rc',
        name: 'Comprehension & Reasoning',
        topics: [
          {
            id: 'tp-rc-passages',
            name: 'Reading Comprehension',
            subtopics: [
              { id: 'st-inferences', name: 'Logical Inferences & Crux', concepts: ['assumption identification', 'primary implication', 'author perspective'] }
            ],
            weight: 4
          }
        ]
      },
      {
        id: 'dom-upsc-quant',
        name: 'Quantitative Aptitude & Logic',
        topics: [
          {
            id: 'tp-num-aptitude',
            name: 'Number Systems & Arithmetic',
            subtopics: [
              { id: 'st-csat-quant', name: 'Core Arithmetic', concepts: ['divisibility rules', 'permutations and combinations', 'percentages & ratios', 'syllogisms'] }
            ],
            weight: 4
          }
        ]
      }
    ]
  }
];

export const SSC_CGL_SUBJECTS: SubjectNode[] = [
  {
    id: 'sub-ssc-reasoning',
    name: 'General Intelligence & Reasoning',
    domains: [
      {
        id: 'dom-ssc-verbal',
        name: 'Verbal Reasoning',
        topics: [
          {
            id: 'tp-analogy-series',
            name: 'Analogy, Classification & Series',
            subtopics: [
              { id: 'st-series-coding', name: 'Number/Letter Series & Coding', concepts: ['pattern identification', 'letter shifting', 'odd one out', 'blood relations'] }
            ],
            weight: 3
          },
          {
            id: 'tp-syllogism-logic',
            name: 'Syllogisms & Venn Diagrams',
            subtopics: [
              { id: 'st-venn-logic', name: 'Deductive Logic', concepts: ['statement and conclusion', 'Venn representations', 'direction & distance'] }
            ],
            weight: 2.5
          }
        ]
      },
      {
        id: 'dom-ssc-nonverbal',
        name: 'Non-Verbal Reasoning',
        topics: [
          {
            id: 'tp-spatial',
            name: 'Spatial & Pattern Analysis',
            subtopics: [
              { id: 'st-paper-mirror', name: 'Folding & Mirror Images', concepts: ['paper folding', 'water images', 'embedded figures', 'cube and dice'] }
            ],
            weight: 2
          }
        ]
      }
    ]
  },
  {
    id: 'sub-ssc-quant',
    name: 'Quantitative Aptitude',
    domains: [
      {
        id: 'dom-ssc-arithmetic',
        name: 'Arithmetic Mathematics',
        topics: [
          {
            id: 'tp-commercial-math',
            name: 'Percentages, Profit & Loss, Ratios',
            subtopics: [
              { id: 'st-profit-loss', name: 'Discount & Marked Price', concepts: ['successive discounts', 'simple and compound interest', 'partnership', 'mixtures and alligations'] }
            ],
            weight: 3.5
          },
          {
            id: 'tp-time-work-speed',
            name: 'Time, Work, Speed & Distance',
            subtopics: [
              { id: 'st-pipes-trains', name: 'Work & Motion', concepts: ['efficiency ratio', 'pipes and cisterns', 'relative speed', 'trains and boats'] }
            ],
            weight: 3
          }
        ]
      },
      {
        id: 'dom-ssc-advance-math',
        name: 'Advance Mathematics',
        topics: [
          {
            id: 'tp-algebra-geom',
            name: 'Algebra, Geometry & Mensuration',
            subtopics: [
              { id: 'st-algebraic-identities', name: 'Identities & Factorization', concepts: ['linear and quadratic equations', 'triangle congruence & similarity', 'circle theorems (chords, tangents)'] },
              { id: 'st-mensuration-3d', name: '2D and 3D Mensuration', concepts: ['surface area and volume', 'prisms and pyramids', 'frustum'] }
            ],
            weight: 4
          },
          {
            id: 'tp-trig-heights',
            name: 'Trigonometry & Heights/Distances',
            subtopics: [
              { id: 'st-trig-ratios', name: 'Trigonometric Identities', concepts: ['standard values', 'complementary angles', 'elevation and depression angles'] }
            ],
            weight: 2.5
          }
        ]
      }
    ]
  },
  {
    id: 'sub-ssc-english',
    name: 'English Language & Comprehension',
    domains: [
      {
        id: 'dom-ssc-grammar',
        name: 'Grammar & Usage',
        topics: [
          {
            id: 'tp-error-spotting',
            name: 'Error Spotting & Sentence Improvement',
            subtopics: [
              { id: 'st-subject-verb', name: 'Rules of Syntax & Tenses', concepts: ['subject-verb agreement', 'prepositions', 'conjunctions', 'active & passive voice', 'direct/indirect speech'] }
            ],
            weight: 3.5
          }
        ]
      },
      {
        id: 'dom-ssc-vocab',
        name: 'Vocabulary & Reading',
        topics: [
          {
            id: 'tp-vocab-idioms',
            name: 'Synonyms, Antonyms, One Word & Idioms',
            subtopics: [
              { id: 'st-high-freq-idioms', name: 'Phrases & Expressions', concepts: ['idiomatic expressions', 'phrasal verbs', 'spelling correction'] }
            ],
            weight: 3
          },
          {
            id: 'tp-cloze-comprehension',
            name: 'Cloze Test & Reading Passages',
            subtopics: [
              { id: 'st-cloze-fillers', name: 'Contextual Fillers', concepts: ['paragraph coherence', 'cloze test evaluation', 'comprehension questions'] }
            ],
            weight: 3
          }
        ]
      }
    ]
  },
  {
    id: 'sub-ssc-ga',
    name: 'General Awareness',
    domains: [
      {
        id: 'dom-ssc-static-gk',
        name: 'Static General Knowledge',
        topics: [
          {
            id: 'tp-history-polity-gk',
            name: 'History, Polity & Geography',
            subtopics: [
              { id: 'st-constitutional-gk', name: 'Articles, Amendments & Dynasties', concepts: ['Fundamental Rights articles', 'Sultanate and Mughal rulers', 'National parks and capitals'] }
            ],
            weight: 3
          }
        ]
      },
      {
        id: 'dom-ssc-science-current',
        name: 'General Science & Current Affairs',
        topics: [
          {
            id: 'tp-everyday-science',
            name: 'Physics, Chemistry & Biology',
            subtopics: [
              { id: 'st-science-facts', name: 'Vitamins, Laws of Motion & Chemical Formulas', concepts: ['diseases and deficiencies', 'Newton laws', 'common chemical names & uses'] }
            ],
            weight: 3
          }
        ]
      }
    ]
  }
];

const HIERARCHY_MAP: Record<string, SubjectNode[]> = {
  'apsc-ae-civil': CIVIL_SUBJECTS,
  'upsc-cse': UPSC_CSE_SUBJECTS,
  'gate-ce': CIVIL_SUBJECTS.filter((s) => s.id !== 'sub-gs'),
  'gate-gs': CS_SUBJECTS,
  'gate-cs': CS_SUBJECTS,
  'gate-me': ME_SUBJECTS,
  'ssc-cgl': SSC_CGL_SUBJECTS,
  'ssc-ch': CHEMISTRY_SUBJECTS,
};

export function getExamHierarchy(examId: string): { subjects: SubjectNode[] } | null {
  const subjects = HIERARCHY_MAP[examId];
  if (!subjects) return null;
  return { subjects };
}

export function expandTopics(subjectName: string, domainName?: string): TopicNode[] {
  const canonical = canonicalSubject(subjectName);
  const results: TopicNode[] = [];
  for (const examId of Object.keys(HIERARCHY_MAP)) {
    const subjects = HIERARCHY_MAP[examId];
    for (const subject of subjects) {
      if (canonicalSubject(subject.name) !== canonical) continue;
      if (domainName) {
        const domain = subject.domains.find(d => canonicalSubject(d.name) === canonicalSubject(domainName));
        if (domain) results.push(...domain.topics);
      } else {
        results.push(...subject.domains.flatMap(d => d.topics));
      }
    }
  }
  return results;
}

export function buildExamNodes(): ExamNode[] {
  const grouped = new Map<string, ExamEntry[]>();
  for (const exam of UNIVERSAL_EXAMS) {
    const cat = exam.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(exam);
  }
  return Array.from(grouped.entries()).map(([name, exams]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'), name, exams
  }));
}

export function getSupportedExamIds(): string[] {
  return UNIVERSAL_EXAMS.map(e => e.id);
}

export function getExamEntry(examId: string): ExamEntry | undefined {
  return UNIVERSAL_EXAMS.find(e => e.id === examId);
}
