/**
 * SYLLABUS BLUEPRINT & CURRICULUM INGESTION SERVICE
 *
 * Manages official examination syllabi (such as APSC PHED AE Civil Advt 31/2025)
 * and enables creating, importing, parsing, and storing custom syllabi from which
 * calibrated CBT mock tests can be assembled.
 */

import { isFirebaseConfigured, db } from '../firebase/config';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { notifyDataSync } from './questionBankSyncService';

export interface SyllabusModule {
  id: string;
  name: string;
  description?: string;
  topics: string[];
  suggestedWeight?: number; // suggested number of questions out of total
}

export interface SyllabusBlueprint {
  id: string;
  title: string;
  examAgency: string;
  department?: string;
  advertNo?: string;
  paper: string;
  standard: string;
  fullMarks: number;
  durationMinutes: number;
  totalQuestions: number;
  negativeMarksPerIncorrect: number;
  isOfficial: boolean;
  branch: 'civil' | 'mechanical' | 'electrical' | 'gs' | 'all';
  modules: SyllabusModule[];
  createdAt?: string;
}

// -----------------------------------------------------------------------------
// Official APSC AE Civil (PHED) Paper-II (Advt. No. 31/2025) Syllabus
// Transcribed faithfully from official Assam Public Service Commission notification
// -----------------------------------------------------------------------------
export const APSC_PHED_AE_CIVIL_2025_SYLLABUS: SyllabusBlueprint = {
  id: 'apsc-phed-ae-civil-2025',
  title: 'APSC AE (Civil) — Public Health Engineering Department (PHED)',
  examAgency: 'Assam Public Service Commission (APSC)',
  department: 'Public Health Engineering Department',
  advertNo: 'Advt. No. 31/2025 dated 09.09.2025',
  paper: 'PAPER-II CIVIL ENGINEERING (Multiple Choice Objective Type)',
  standard: 'Bachelor Degree Standard',
  fullMarks: 100,
  durationMinutes: 120, // 2:00 hours
  totalQuestions: 100,
  negativeMarksPerIncorrect: 0.25,
  isOfficial: true,
  branch: 'civil',
  modules: [
    {
      id: 'mod-statics',
      name: '1. Statics',
      description: 'Force systems, equilibrium, virtual work, and suspension systems',
      suggestedWeight: 10,
      topics: [
        'Coplanar and multiplanar force systems',
        'Free body diagrams & equilibrium conditions',
        'Centroid and second moment of plane figures',
        'Force polygons and funicular polygons',
        'Principle of virtual work',
        'Suspension systems and catenary cables'
      ]
    },
    {
      id: 'mod-dynamics',
      name: '2. Dynamics',
      description: 'Physical units, dimensions, and coordinate reference systems',
      suggestedWeight: 8,
      topics: [
        'Units and Dimensions in engineering mechanics',
        'Gravitational system vs Absolute system',
        'MKS system & International SI Units conversions'
      ]
    },
    {
      id: 'mod-kinematics',
      name: '3. Kinematics',
      description: 'Particle & rigid body motion without consideration of forces',
      suggestedWeight: 8,
      topics: [
        'Rectilinear motion (velocity, acceleration, displacement-time relations)',
        'Curvilinear motion and projectile trajectory',
        'Relative motion of particles',
        'Instantaneous centre of rotation'
      ]
    },
    {
      id: 'mod-kinetics',
      name: '4. Kinetics',
      description: 'Forces producing motion, energy, momentum, and rotational inertia',
      suggestedWeight: 10,
      topics: [
        'Mass moment of inertia of standard geometric solids',
        'Simple Harmonic Motion (SHM) and natural frequency',
        'Linear momentum, angular momentum, and impulse equations',
        'Equations of motion of rigid body rotating about a fixed axis'
      ]
    },
    {
      id: 'mod-som',
      name: '5. Strength of Materials',
      description: 'Stress-strain, failure theories, SFD/BMD, bending, deflection, columns, and torsion',
      suggestedWeight: 20,
      topics: [
        'Homogeneous and isotropic media & stress-strain elastic constants (E, G, K, μ)',
        'Uniaxial tension and compression, riveted and welded joints',
        'Compound stresses, principal stresses, Mohr circle and principal strains',
        'Simple theories of failure (Rankine, Tresca, Von Mises, St. Venant, Mohr-Coulomb)',
        'Shear force and bending moment diagrams (SFD & BMD) for determinate beams',
        'Theory of pure bending and shear stress distribution in beam cross-sections',
        'Deflection of beams (Macaulay, Moment-Area, Conjugate Beam methods)',
        'Analysis of laminated beams and non-prismatic structures',
        'Theories of columns (Euler & Rankine formulas, effective length) & middle-fourth rule',
        'Three-pinned arch analysis and simple frame analysis',
        'Torsion of circular shafts, combined bending direct and torsional stresses',
        'Strain energy in elastic deformation, impact loading, fatigue, and creep'
      ]
    },
    {
      id: 'mod-soil',
      name: '6. Soil Mechanics',
      description: 'Soil properties, seepage, shear strength, earth pressures, consolidation, and foundations',
      suggestedWeight: 16,
      topics: [
        'Origin of soils, phase relationships, void ratio, porosity, moisture content',
        'Soil classification (ISCS / USCS) and compaction (Standard & Modified Proctor)',
        'Permeability, seepage, and construction of flow nets',
        'Shear strength parameters for drained/undrained conditions (triaxial, unconfined, direct shear tests)',
        'Earth pressure theories: Rankine and Coulomb analytical and graphical methods',
        'Stability of finite and infinite slopes',
        'Soil consolidation: Terzaghi one-dimensional consolidation theory, settlement rate & ultimate settlement',
        'Effective stress concept and stress distribution in soils (Boussinesq & Westergaard)',
        'Soil stabilization techniques (mechanical, cement, lime, chemical)',
        'Foundation engineering: Terzaghi & Meyerhof bearing capacity of shallow footings',
        'Deep foundations: pile load capacity, group action, well foundations, and sheet piles'
      ]
    },
    {
      id: 'mod-fluids',
      name: '7. Fluid Mechanics',
      description: 'Fluid statics, Bernoulli, pipe flow, dimensional analysis, and open channel hydraulics',
      suggestedWeight: 16,
      topics: [
        'Physical properties of fluids (viscosity, surface tension, capillarity, compressibility)',
        'Fluid statics: pressure measurement, hydrostatic force on plane and curved surfaces',
        'Buoyancy, flotation, metacentre, and stability of submerged and floating bodies',
        'Fluid kinematics: continuity equation, velocity potential, stream function, flow nets',
        'Fluid dynamics: Euler equation, momentum equation, and Bernoulli theorem applications',
        'Rotational and irrotational flow vortices, flow measurement (Venturi, orifice, notches, weirs)',
        'Cavitation causes and prevention in hydraulic systems',
        'Dimensional analysis: Buckingham Pi theorem, similitude, Reynolds & Froude model laws',
        'Viscous laminar flow between parallel plates and circular pipes (Hagen-Poiseuille)',
        'Boundary layer theory: laminar & turbulent boundary layers, separation, drag and lift',
        'Incompressible pipe flow: Darcy-Weisbach friction losses, minor losses, HGL and TEL',
        'Open channel flow: uniform flow (Manning & Chezy), specific energy, critical depth',
        'Gradually Varied Flow (GVF) surface profiles, hydraulic jump (standing wave flume), surges & waves'
      ]
    },
    {
      id: 'mod-surveying',
      name: '8. Surveying',
      description: 'Instruments, adjustments, traversing, leveling, curves, and foundation layout',
      suggestedWeight: 12,
      topics: [
        'General principles of surveying, sign conventions, and error theory',
        'Surveying instruments, adjustments, observation recording, plotting maps and sections',
        'Linear measurements, chain surveying, tape corrections (temperature, pull, sag)',
        'Compass surveying, magnetic declination, and local attraction correction',
        'Measurement of horizontal and vertical angles with vernier and electronic theodolites',
        'Levelling operations, bench marks, curvature and refraction corrections',
        'Theodolite traversing, tacheometric traversing, and traverse computations (Gale table)',
        'Plane table surveying methods: two-point problem and three-point problem solutions',
        'Contour surveying: characteristics, interpolation, and uses of contour maps',
        'Setting out direction, grades, and types of horizontal & vertical curves',
        'Setting out transition curves, compound curves, and excavation lines for building foundations'
      ]
    }
  ]
};

const STORAGE_KEY_CUSTOM_SYLLABI = 'exampilot_custom_syllabi';

function getLocalCustomSyllabi(): SyllabusBlueprint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_SYLLABI);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCustomSyllabi(syllabi: SyllabusBlueprint[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_SYLLABI, JSON.stringify(syllabi));
  } catch (err) {
    console.warn('[SyllabusBlueprint] Failed to write custom syllabi:', err);
  }
}

/**
 * Get all available syllabus blueprints (official pre-bundled + admin custom)
 */
export function getAllSyllabusBlueprints(): SyllabusBlueprint[] {
  const custom = getLocalCustomSyllabi();
  const customIds = new Set(custom.map((s) => s.id));
  const base = [APSC_PHED_AE_CIVIL_2025_SYLLABUS].filter((s) => !customIds.has(s.id));
  return [...base, ...custom];
}

/**
 * Find a syllabus blueprint by ID
 */
export function getSyllabusBlueprintById(id: string): SyllabusBlueprint | undefined {
  const all = getAllSyllabusBlueprints();
  return all.find((s) => s.id === id);
}

/**
 * Save or update a custom syllabus blueprint
 */
export async function saveSyllabusBlueprint(blueprint: SyllabusBlueprint): Promise<SyllabusBlueprint> {
  const clean: SyllabusBlueprint = {
    ...blueprint,
    id: blueprint.id || `syllabus-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: blueprint.createdAt || new Date().toISOString()
  };

  const existing = getLocalCustomSyllabi();
  const updated = [clean, ...existing.filter((s) => s.id !== clean.id)];
  setLocalCustomSyllabi(updated);

  // Sync to Cloud Firestore if connected
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'syllabi', clean.id), clean, { merge: true });
    } catch (err) {
      console.warn('[SyllabusBlueprint] Firestore sync notice:', err);
    }
  }

  notifyDataSync('mocks');
  window.dispatchEvent(new CustomEvent('exampilot_syllabi_updated', { detail: { syllabusId: clean.id } }));
  return clean;
}

/**
 * Delete a custom syllabus blueprint
 */
export async function deleteSyllabusBlueprint(id: string): Promise<void> {
  const existing = getLocalCustomSyllabi();
  setLocalCustomSyllabi(existing.filter((s) => s.id !== id));

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'syllabi', id));
    } catch (err) {
      console.warn('[SyllabusBlueprint] Firestore delete notice:', err);
    }
  }

  notifyDataSync('mocks');
  window.dispatchEvent(new CustomEvent('exampilot_syllabi_updated', { detail: { syllabusId: id } }));
}

/**
 * Intelligent syllabus text parser:
 * Takes raw text pasted from a syllabus PDF or official document and extracts
 * numbered or bulleted modules, subject headings, and topic lists automatically.
 */
export function parseSyllabusText(rawText: string): SyllabusModule[] {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const modules: SyllabusModule[] = [];
  let currentModule: SyllabusModule | null = null;

  // Patterns for module headings:
  // "1. Statics:", "Module 1: Soil Mechanics", "SECTION A: Strength of Materials", "1. Statics"
  const moduleHeadingRegex = /^(?:(?:Module|Unit|Section|Paper|Part)\s*[A-Za-z0-9]+[:.]?|\d+\s*[.:])\s*([A-Za-z\s&/,()-]+)(?:[:.-]|$)/i;

  for (const line of lines) {
    const match = line.match(moduleHeadingRegex);

    if (match) {
      // If we had an active module, push it
      if (currentModule && currentModule.topics.length > 0) {
        modules.push(currentModule);
      }

      const modName = match[1].trim();
      const afterHeading = line.slice(match[0].length).trim();

      currentModule = {
        id: `mod-${Date.now()}-${modules.length + 1}`,
        name: line.includes(':') ? line.split(':')[0].trim() : `${modules.length + 1}. ${modName}`,
        description: `${modName} concepts and syllabus scope`,
        topics: []
      };

      // If there's text on the same line after colon, add it
      if (afterHeading) {
        const subItems = afterHeading
          .split(/[,;.]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 2);
        currentModule.topics.push(...subItems);
      }
    } else if (currentModule) {
      // Topic lines or comma-separated paragraphs
      const subItems = line
        .split(/[,;.]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 2);

      if (subItems.length > 0) {
        currentModule.topics.push(...subItems);
      }
    }
  }

  if (currentModule && currentModule.topics.length > 0) {
    modules.push(currentModule);
  }

  // Fallback: If no numbered regex matched, group lines into a single comprehensive module
  if (modules.length === 0) {
    modules.push({
      id: `mod-${Date.now()}-1`,
      name: 'General Syllabus Module',
      description: 'Extracted topics from syllabus document',
      topics: lines.filter((l) => l.length > 3)
    });
  }

  return modules;
}
