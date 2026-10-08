import type { Lang } from '../i18n/ui';

export interface EducationEntry {
  id: string;
  dates: string;
  title: string;
  institution: string;
  /** Short status note, e.g. in progress. */
  status?: string;
}

export interface EducationContent {
  title: string;
  entries: EducationEntry[];
  /** Taekwon-Do teaching credential, shown beside formal education. */
  teaching: { title: string; org: string; note: string };
}

export const educationContent: Record<Lang, EducationContent> = {
  es: {
    title: 'Formación',
    entries: [
      { id: 'filosofia-unr', dates: '2024 — Presente', title: 'Licenciatura en Filosofía', institution: 'UNR', status: 'En curso' },
      { id: 'secundario-belgrano', dates: 'Dic 2011', title: 'Secundario Técnico: Robótica y Programación', institution: 'Instituto Belgrano (ex Escuela Técnica Nº 2060)' }
    ],
    teaching: {
      title: 'Profesor Internacional de Taekwon-Do',
      org: 'ITF Argentina',
      note: 'Más de una década enseñando.'
    }
  },
  en: {
    title: 'Education',
    entries: [
      { id: 'filosofia-unr', dates: '2024 — Present', title: "Bachelor's degree in Philosophy", institution: 'UNR', status: 'In progress' },
      { id: 'secundario-belgrano', dates: 'Dec 2011', title: 'Technical High School: Robotics & Programming', institution: 'Instituto Belgrano (formerly Technical School No. 2060)' }
    ],
    teaching: {
      title: 'International Taekwon-Do Instructor',
      org: 'ITF Argentina',
      note: 'More than a decade of teaching.'
    }
  },
  pt: {
    title: 'Formação',
    entries: [
      { id: 'filosofia-unr', dates: '2024 — Presente', title: 'Graduação em Filosofia', institution: 'UNR', status: 'Em andamento' },
      { id: 'secundario-belgrano', dates: 'Dez 2011', title: 'Ensino Médio Técnico: Robótica e Programação', institution: 'Instituto Belgrano (ex Escola Técnica Nº 2060)' }
    ],
    teaching: {
      title: 'Professor Internacional de Taekwon-Do',
      org: 'ITF Argentina',
      note: 'Mais de uma década ensinando.'
    }
  }
};
