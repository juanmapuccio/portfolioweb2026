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
  channels: ContactChannel[];
}

export const contactData: Record<Lang, ContactData> = {
  es: {
    badge: 'DISPONIBILIDAD & CONTRATACIÓN',
    title: 'Busco sumarme a un equipo técnico con desafíos reales.',
    subtitle: 'Diseño, despliego y estabilizo sistemas de negocio en producción, usados por clientes reales.',
    ctaButtonText: 'Conversar por WhatsApp',
    channels: [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        label: '+54 9 341 319-2179',
        value: '+5493413192179',
        url: 'https://wa.me/5493413192179',
        primary: true
      },
      {
        id: 'email',
        name: 'Email',
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
        name: 'NodoSur',
        label: 'nodosur.dev',
        value: 'nodosur.dev',
        url: 'https://nodosur.dev/'
      }
    ]
  },
  en: {
    badge: 'AVAILABILITY & HIRING',
    title: 'Looking to join a technical team with real challenges.',
    subtitle: 'I design, ship, and stabilize production business systems used by real customers.',
    ctaButtonText: 'Chat on WhatsApp',
    channels: [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        label: '+54 9 341 319-2179',
        value: '+5493413192179',
        url: 'https://wa.me/5493413192179',
        primary: true
      },
      {
        id: 'email',
        name: 'Email',
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
        name: 'NodoSur',
        label: 'nodosur.dev',
        value: 'nodosur.dev',
        url: 'https://nodosur.dev/'
      }
    ]
  },
  pt: {
    badge: 'DISPONIBILIDADE & CONTRATAÇÃO',
    title: 'Busco ingressar em uma equipe técnica com desafios reais.',
    subtitle: 'Projeto, implanto e estabilizo sistemas de negócio em produção, usados por clientes reais.',
    ctaButtonText: 'Conversar pelo WhatsApp',
    channels: [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        label: '+54 9 341 319-2179',
        value: '+5493413192179',
        url: 'https://wa.me/5493413192179',
        primary: true
      },
      {
        id: 'email',
        name: 'E-mail',
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
        name: 'NodoSur',
        label: 'nodosur.dev',
        value: 'nodosur.dev',
        url: 'https://nodosur.dev/'
      }
    ]
  }
};

/**
 * The channels listed in the close (KyongYe). The email lives in its CTA and NodoSur in its colophon,
 * so the list stays at three channels plus the CV link: a 2x2 grid on phones. The CV page lists all.
 */
export const CLOSE_CHANNEL_IDS = ['whatsapp', 'linkedin', 'github'] as const;

export const closeChannels = (lang: Lang): ContactChannel[] =>
  CLOSE_CHANNEL_IDS.flatMap((id) => contactData[lang].channels.filter((c) => c.id === id));
