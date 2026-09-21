import type {
  CivilKnowledgeBranch,
  CivilKnowledgeConcept,
  CivilKnowledgeSubject
} from '../../types/civilKnowledge';

import { STRUCTURAL_CONCEPTS, STRUCTURAL_SUBJECTS } from './branches/structuralMechanics';
import { GEOTECHNICAL_CONCEPTS, GEOTECHNICAL_SUBJECTS } from './branches/geotechnical';
import { WATER_RESOURCES_CONCEPTS, WATER_RESOURCES_SUBJECTS } from './branches/waterResources';
import { ENVIRONMENTAL_CONCEPTS, ENVIRONMENTAL_SUBJECTS } from './branches/environmental';
import { TRANSPORTATION_CONCEPTS, TRANSPORTATION_SUBJECTS } from './branches/transportation';
import { GEOMATICS_MANAGEMENT_CONCEPTS, GEOMATICS_MANAGEMENT_SUBJECTS } from './branches/geomaticsManagement';

export * from './banks/formulaBank';
export * from './banks/definitionBank';
export * from './banks/symbolUnitBank';
export * from './banks/quickRevisionBank';
export * from './banks/conceptTrapBank';

/** Complete list of all Civil Engineering Concepts */
export const ALL_CIVIL_CONCEPTS: CivilKnowledgeConcept[] = [
  ...STRUCTURAL_CONCEPTS,
  ...GEOTECHNICAL_CONCEPTS,
  ...WATER_RESOURCES_CONCEPTS,
  ...ENVIRONMENTAL_CONCEPTS,
  ...TRANSPORTATION_CONCEPTS,
  ...GEOMATICS_MANAGEMENT_CONCEPTS
];

/** Complete list of all Civil Engineering Subjects */
export const ALL_CIVIL_SUBJECTS: CivilKnowledgeSubject[] = [
  ...STRUCTURAL_SUBJECTS,
  ...GEOTECHNICAL_SUBJECTS,
  ...WATER_RESOURCES_SUBJECTS,
  ...ENVIRONMENTAL_SUBJECTS,
  ...TRANSPORTATION_SUBJECTS,
  ...GEOMATICS_MANAGEMENT_SUBJECTS
];

/** The 6 Core Branches of Civil Engineering */
export const CIVIL_BRANCHES: CivilKnowledgeBranch[] = [
  {
    id: 'structural-mechanics',
    name: 'Structural Mechanics & Design',
    description: 'Engineering Mechanics, Strength of Materials, Structural Analysis, RCC Design (IS 456), Steel Structures (IS 800), Prestressed Concrete (IS 1343), and Earthquake Engineering (IS 1893).',
    iconName: 'Building2',
    subjects: STRUCTURAL_SUBJECTS
  },
  {
    id: 'geotechnical',
    name: 'Geotechnical & Foundation Engineering',
    description: 'Soil Mechanics, Phase Relationships, Permeability, Seepage, Consolidation, Shear Strength, Shallow & Deep Foundations, Retaining Walls, and Engineering Geology.',
    iconName: 'Layers',
    subjects: GEOTECHNICAL_SUBJECTS
  },
  {
    id: 'water-resources',
    name: 'Water Resources & Fluid Mechanics',
    description: 'Fluid Statics, Pipe Hydraulics, Open Channel Flow, Hydraulic Jump, Turbines, Pumps, Precipitation, Hydrographs, Silt Theories, and Irrigation Canal Design.',
    iconName: 'Droplets',
    subjects: WATER_RESOURCES_SUBJECTS
  },
  {
    id: 'environmental',
    name: 'Environmental & Public Health Engineering',
    description: 'Water Quality (IS 10500), Water Treatment, Wastewater Engineering, BOD Kinetics, Streeter-Phelps Dissolved Oxygen Sag, Sewer Design, and Air/Noise Pollution.',
    iconName: 'ShieldCheck',
    subjects: ENVIRONMENTAL_SUBJECTS
  },
  {
    id: 'transportation',
    name: 'Transportation & Highway Engineering',
    description: 'Highway Geometric Design (IRC:73), Super-Elevation, Stopping Sight Distance, Pavement Design (IRC:37 & IRC:58), Traffic Engineering, Railways, and Airport Engineering.',
    iconName: 'Compass',
    subjects: TRANSPORTATION_SUBJECTS
  },
  {
    id: 'geomatics-management',
    name: 'Geomatics, Materials & Management',
    description: 'Surveying, Leveling, Tachometry, Total Station, GPS/GIS, Building Materials, Concrete Technology, Construction Planning & Scheduling (CPM/PERT), Estimating, and Valuation.',
    iconName: 'Briefcase',
    subjects: GEOMATICS_MANAGEMENT_SUBJECTS
  }
];

/** Fast Indexed Lookup Maps */
export const CONCEPT_MAP_BY_SLUG = new Map<string, CivilKnowledgeConcept>(
  ALL_CIVIL_CONCEPTS.map((c) => [c.slug, c])
);

export const CONCEPTS_BY_SUBJECT_MAP = new Map<string, CivilKnowledgeConcept[]>();
ALL_CIVIL_CONCEPTS.forEach((concept) => {
  const existing = CONCEPTS_BY_SUBJECT_MAP.get(concept.subject) || [];
  existing.push(concept);
  CONCEPTS_BY_SUBJECT_MAP.set(concept.subject, existing);
});

export const CONCEPTS_BY_BRANCH_MAP = new Map<string, CivilKnowledgeConcept[]>();
ALL_CIVIL_CONCEPTS.forEach((concept) => {
  const existing = CONCEPTS_BY_BRANCH_MAP.get(concept.branchId) || [];
  existing.push(concept);
  CONCEPTS_BY_BRANCH_MAP.set(concept.branchId, existing);
});
