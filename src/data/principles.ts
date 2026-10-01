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
    label: 'PRINCIPIOS DEL TAEKWONDO',
    items: [
      {
        key: 'courtesy',
        hangul: '예의',
        name: 'Cortesía',
        line: 'Empatía y escucha activa: dialogar de igual a igual con directivos, personal operativo y usuarios antes de escribir una línea de código.'
      },
      {
        key: 'integrity',
        hangul: '염치',
        name: 'Integridad',
        line: 'Transparencia técnica sin atajos: solo presento sistemas que diseñé, probé y audité personalmente; código limpio con métricas reales.'
      },
      {
        key: 'perseverance',
        hangul: '인내',
        name: 'Perseverancia',
        line: 'Constancia ante problemas complejos: la paciencia técnica para depurar fallas silenciosas, optimizar consultas y culminar cada entrega.'
      },
      {
        key: 'self-control',
        hangul: '극기',
        name: 'Autocontrol',
        line: 'Criterio humano y sobriedad: no sobreingenierizar por impulso ni automatizar a ciegas; mantener al profesional en el loop en procesos críticos.'
      },
      {
        key: 'indomitable-spirit',
        hangul: '백절불굴',
        name: 'Espíritu indomable',
        line: 'Templanza bajo presión: calma para responder ante caídas de servicio o plazos exigentes, convirtiendo cada fricción en un sistema más robusto.'
      }
    ]
  },
  en: {
    label: 'TAEKWONDO TENETS',
    items: [
      {
        key: 'courtesy',
        hangul: '예의',
        name: 'Courtesy',
        line: 'Operational empathy: engaging as an equal with directors, frontline staff, and users to understand real friction before writing code.'
      },
      {
        key: 'integrity',
        hangul: '염치',
        name: 'Integrity',
        line: 'Technical transparency without shortcuts: I only claim systems I personally engineered and audited; clean code with verified metrics.'
      },
      {
        key: 'perseverance',
        hangul: '인내',
        name: 'Perseverance',
        line: 'Tenacity through complex problems: the patience to debug silent issues, optimize bottlenecks, and complete each stage of technical growth.'
      },
      {
        key: 'self-control',
        hangul: '극기',
        name: 'Self-control',
        line: 'Engineering restraint: avoiding impulsive over-engineering and blind automation; keeping human validation in the loop for critical workflows.'
      },
      {
        key: 'indomitable-spirit',
        hangul: '백절불굴',
        name: 'Indomitable spirit',
        line: 'Poise under pressure: composure when resolving service outages or meeting strict deadlines, transforming friction into resilient systems.'
      }
    ]
  },
  pt: {
    label: 'PRINCÍPIOS DO TAEKWONDO',
    items: [
      {
        key: 'courtesy',
        hangul: '예의',
        name: 'Cortesia',
        line: 'Empatia operacional: dialogar de igual para igual com diretores, equipes de campo e usuários para entender problemas antes de codificar.'
      },
      {
        key: 'integrity',
        hangul: '염치',
        name: 'Integridade',
        line: 'Transparência técnica sem atalhos: só apresento sistemas que projetei, testei e auditei pessoalmente; código limpo com métricas reais.'
      },
      {
        key: 'perseverance',
        hangul: '인내',
        name: 'Perseverança',
        line: 'Constância em desafios complexos: a paciência técnica para depurar falhas silenciosas, otimizar consultas e concluir cada etapa de evolução.'
      },
      {
        key: 'self-control',
        hangul: '극기',
        name: 'Autocontrole',
        line: 'Sobriedade técnica: evitar superdimensionar por impulso ou automatizar às cegas; manter validação humana em fluxos operacionais críticos.'
      },
      {
        key: 'indomitable-spirit',
        hangul: '백절불굴',
        name: 'Espírito indomável',
        line: 'Firmeza sob pressão: serenidade diante de incidentes ou prazos exigentes, transformando cada atrito em um sistema mais resiliente.'
      }
    ]
  }
};
