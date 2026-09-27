import type { Lang } from '../i18n/ui';

// CV is hosted externally; PDFs are not committed.
export const CV_URL = 'https://drive.google.com/file/d/1bi1W2VUtRxUVX_Y6YTz5tqyPL3ofh_YH/view?usp=sharing';

export interface ContactChannel {
  id: string;
  name: string;
  label: string;
  value: string;
  url: string;
  primary?: boolean;
}

export interface ContactData {
  badge: string;
  title: string;
  subtitle: string;
  ctaButtonText: string;
  statusText: string;
  locationText: string;
  channels: ContactChannel[];
}

export const contactData: Record<Lang, ContactData> = {
  es: {
    badge: 'DISPONIBILIDAD & CONTRATACIÓN',
    title: '¿Tenés un cuello de botella o buscás sumar visión práctica a tu equipo?',
    subtitle: 'Busco sumarme como Desarrollador Full Stack / Consultor de Procesos en un equipo técnico de alto impacto. NodoSur es mi mejor carta de presentación: capacidad probada de idear, programar y mantener software vivo en producción.',
    ctaButtonText: 'Conversar por WhatsApp',
    statusText: 'Disponible para incorporación a equipos de producto & ingeniería',
    locationText: 'Rosario, Santa Fe, Argentina · Modalidad Remota / Híbrida / On-site',
    channels: [
      {
        id: 'whatsapp',
        name: 'WhatsApp Directo',
        label: '+54 9 341 319-2179',
        value: '+5493413192179',
        url: 'https://wa.me/5493413192179',
        primary: true
      },
      {
        id: 'email',
        name: 'Email Directo',
        label: 'juan.pucciom@gmail.com',
        value: 'juan.pucciom@gmail.com',
        url: 'mailto:juan.pucciom@gmail.com'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        label: 'in/jmpuc92',
        value: 'linkedin.com/in/jmpuc92',
        url: 'https://www.linkedin.com/in/jmpuc92'
      },
      {
        id: 'github',
        name: 'GitHub',
        label: 'github.com/juanmapuccio',
        value: 'github.com/juanmapuccio',
        url: 'https://github.com/juanmapuccio'
      },
      {
        id: 'nodosur',
        name: 'NodoSur (Prueba de Producción)',
        label: 'nodosur.dev',
        value: 'nodosur.dev',
        url: 'https://nodosur.dev/'
      }
    ]
  },
  en: {
    badge: 'CAREER & HIRING',
    title: 'Facing an operational bottleneck or looking to add pragmatic engineering to your team?',
    subtitle: 'Looking to join an ambitious engineering or product team as a Full Stack Developer / Process Consultant. NodoSur is my live track record: proven ability to design, build, and maintain production software.',
    ctaButtonText: 'Chat on WhatsApp',
    statusText: 'Available for full-time engineering & product roles',
    locationText: 'Rosario, Argentina · Remote / Hybrid / On-site',
    channels: [
      {
        id: 'whatsapp',
        name: 'WhatsApp Direct',
        label: '+54 9 341 319-2179',
        value: '+5493413192179',
        url: 'https://wa.me/5493413192179',
        primary: true
      },
      {
        id: 'email',
        name: 'Direct Email',
        label: 'juan.pucciom@gmail.com',
        value: 'juan.pucciom@gmail.com',
        url: 'mailto:juan.pucciom@gmail.com'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        label: 'in/jmpuc92',
        value: 'linkedin.com/in/jmpuc92',
        url: 'https://www.linkedin.com/in/jmpuc92'
      },
      {
        id: 'github',
        name: 'GitHub',
        label: 'github.com/juanmapuccio',
        value: 'github.com/juanmapuccio',
        url: 'https://github.com/juanmapuccio'
      },
      {
        id: 'nodosur',
        name: 'NodoSur (Production Evidence)',
        label: 'nodosur.dev',
        value: 'nodosur.dev',
        url: 'https://nodosur.dev/'
      }
    ]
  },
  pt: {
    badge: 'CONTRATAÇÃO & DISPONIBILIDADE',
    title: 'Tem um gargalo operacional ou quer somar visão prática à sua equipe?',
    subtitle: 'Busco ingressar como Desenvolvedor Full Stack / Consultor de Processos em uma equipe técnica de alto impacto. NodoSur é meu histórico comprovado: capacidade de projetar, codificar e sustentar software vivo em produção.',
    ctaButtonText: 'Conversar no WhatsApp',
    statusText: 'Disponível para contratação em equipes de produto & engenharia',
    locationText: 'Rosário, Argentina · Remoto / Híbrido / Presencial',
    channels: [
      {
        id: 'whatsapp',
        name: 'WhatsApp Direto',
        label: '+54 9 341 319-2179',
        value: '+5493413192179',
        url: 'https://wa.me/5493413192179',
        primary: true
      },
      {
        id: 'email',
        name: 'Email Direto',
        label: 'juan.pucciom@gmail.com',
        value: 'juan.pucciom@gmail.com',
        url: 'mailto:juan.pucciom@gmail.com'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        label: 'in/jmpuc92',
        value: 'linkedin.com/in/jmpuc92',
        url: 'https://www.linkedin.com/in/jmpuc92'
      },
      {
        id: 'github',
        name: 'GitHub',
        label: 'github.com/juanmapuccio',
        value: 'github.com/juanmapuccio',
        url: 'https://github.com/juanmapuccio'
      },
      {
        id: 'nodosur',
        name: 'NodoSur (Evidência de Produção)',
        label: 'nodosur.dev',
        value: 'nodosur.dev',
        url: 'https://nodosur.dev/'
      }
    ]
  }
};
