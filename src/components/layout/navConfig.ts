import { ClipboardList, PlayCircle, BarChart2, History, ShieldCheck, Archive } from 'lucide-react';

export type ActiveTab = 'creator' | 'test' | 'results' | 'history' | 'admin' | 'pyq';

export interface NavItem {
  id: ActiveTab;
  label: string;
  desc: string;
  icon: typeof ClipboardList;
  short?: string;
  role?: 'student' | 'admin' | 'common';
}

export const ALL_NAV_ITEMS: NavItem[] = [
  {
    id: 'creator',
    label: 'Mock Test Creator',
    short: 'Create',
    desc: 'Configure & launch multi-topic tests',
    icon: ClipboardList,
    role: 'student',
  },
  {
    id: 'pyq',
    label: 'Previous Year Papers',
    short: 'PYQ Archive',
    desc: 'Official 100-Q papers with verified answer keys (Assam DWR 2026, APSC AE, GS)',
    icon: Archive,
    role: 'student',
  },
  {
    id: 'test',
    label: 'Active Exam Session',
    short: 'Test',
    desc: 'Timed CBT test session',
    icon: PlayCircle,
    role: 'student',
  },
  {
    id: 'results',
    label: 'Results & Diagnostics',
    short: 'Results',
    desc: 'Test score and performance',
    icon: BarChart2,
    role: 'student',
  },
  {
    id: 'history',
    label: 'My Test Records & Review',
    short: 'Records',
    desc: 'Historical tests, mistake review & drafts',
    icon: History,
    role: 'student',
  },
];

export const findNavItem = (id: ActiveTab): NavItem | undefined =>
  ALL_NAV_ITEMS.find((item) => item.id === id);
