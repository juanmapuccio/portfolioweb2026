import type { Lang } from '../i18n/ui';

export interface TkdPrinciple {
  key: 'courtesy' | 'integrity' | 'perseverance' | 'self-control' | 'indomitable-spirit';
  /** Hangul is not translated: it is the seal itself. */
  hangul: string;
  name: string;
  line: string;
}

export interface PrinciplesContent {
  label: string;
  items: TkdPrinciple[];
}

export const principlesData: Record<Lang, PrinciplesContent> = {
  es: {
    label: 'PRINCIPIOS DEL TAEKWON-DO',
    items: [
      { key: 'courtesy', hangul: '예의', name: 'Cortesía', line: 'Trato con stakeholders y usuarios.' },
      { key: 'integrity', hangul: '염치', name: 'Integridad', line: 'Solo muestro lo que construí.' },
      { key: 'perseverance', hangul: '인내', name: 'Perseverancia', line: 'Reconversión técnica paso a paso.' },
      { key: 'self-control', hangul: '극기', name: 'Autocontrol', line: 'Humano en el loop, no automatizo a ciegas.' },
      { key: 'indomitable-spirit', hangul: '백절불굴', name: 'Espíritu indomable', line: 'Me levanto ante cada revés.' }
    ]
  },
  en: {
    label: 'TAEKWON-DO TENETS',
    items: [
      { key: 'courtesy', hangul: '예의', name: 'Courtesy', line: 'How I treat stakeholders and users.' },
      { key: 'integrity', hangul: '염치', name: 'Integrity', line: 'I only show what I built.' },
      { key: 'perseverance', hangul: '인내', name: 'Perseverance', line: 'Career change into tech, one step at a time.' },
      { key: 'self-control', hangul: '극기', name: 'Self-control', line: 'Human in the loop, I never automate blindly.' },
      { key: 'indomitable-spirit', hangul: '백절불굴', name: 'Indomitable spirit', line: 'I get back up after every setback.' }
    ]
  },
  pt: {
    label: 'PRINCÍPIOS DO TAEKWON-DO',
    items: [
      { key: 'courtesy', hangul: '예의', name: 'Cortesia', line: 'Trato com stakeholders e usuários.' },
      { key: 'integrity', hangul: '염치', name: 'Integridade', line: 'Só mostro o que construí.' },
      { key: 'perseverance', hangul: '인내', name: 'Perseverança', line: 'Reconversão técnica passo a passo.' },
      { key: 'self-control', hangul: '극기', name: 'Autocontrole', line: 'Humano no loop, não automatizo às cegas.' },
      { key: 'indomitable-spirit', hangul: '백절불굴', name: 'Espírito indomável', line: 'Levanto-me a cada revés.' }
    ]
  }
};
