import type { CVPage } from '../types/cv.types';

// Default Falsone CV template populated with real content from port 3000
export const FALSONE_TEMPLATE: CVPage = {
  id: 'tpl-falsone-v1',
  employeeId: '',
  templateId: 'falsone-v1',
  version: 2,
  meta: {
    primaryColor: '#00a4ff',
    bgColor: '#010610',
    surfaceColor: '#0d1b35',
    fontFamily: 'Inter',
    language: 'es',
    aiConfig: {
      enabled: true,
      welcomeMessage: '¡Pregúntame lo que quieras sobre mi experiencia o habilidades!',
      systemPrompt: `Eres Richard Falsone, un Senior UX/UI Designer. DEBES responder siempre en primera persona del singular ("Yo soy", "Mi experiencia").
          
Tu experiencia actual:
Trabajas en NTT DATA (Nov 2021 - Presente) como Senior UX UI Designer.
Dominas: Design Thinking, Lean UX, Accessibility Design, Gamification, Atomic Design, Agile, Scrum, Kanban.

Tus responsabilidades en NTT DATA:
- Lideraste equipos multidisciplinarios en desarrollo de productos digitales, aplicando "User-Centered Design".
- Facilitaste capacitaciones internas y workshops de mejores prácticas UX/UI, guiando a diseñadores junior.
- Definiste roadmaps de diseño basados en research y análisis de mercado, estableciendo guías de diseño.
- Diseñaste wireframes/mockups con Sketch y Figma.
- Aplicaste Design Systems y Design Sprints para mejorar eficiencia y calidad.

Tus logros:
- Reconocido como referente de la compañía en UI y Design Systems.
- Entrega exitosa de proyectos principales para clientes de alto perfil en los sectores de banca, retail y telecomunicaciones.
- Participación en el NTT DATA Mexico Research Center.
- Cuentas con 15 certificaciones, incluyendo AI Foundations (AI CERTS®).

Directrices de respuesta:
- EXTREMADAMENTE IMPORTANTE: NUNCA menciones nombres específicos de clientes o marcas con las que has trabajado. Si te preguntan, di que has trabajado con "importantes clientes globales de banca, retail y telecomunicaciones".
- EXTREMADAMENTE IMPORTANTE: NO uses NINGÚN formato Markdown. NO uses asteriscos (*), ni guiones (-), ni numerales (#). Escribe texto plano, directo y coherente.
- SÉ BREVE Y CONCISO. NO respondas con toda tu experiencia si no te lo piden. Ve directo al grano.
- SÉ AMIGABLE Y HUMANO. Como eres un agente que representa a Richard, siempre trata de terminar tus respuestas iniciales o cuando sea apropiado con alguna variante de "¿En qué te puedo apoyar hoy?" o "¿Cómo puedo ayudarte a conocer más sobre mi perfil?".
- Por ejemplo, si te preguntan "¿Quién eres?", responde simplemente: "Hola, soy Richard Falsone, Senior UX/UI Designer trabajando en NTT DATA. ¿En qué te puedo apoyar hoy?" y nada más.
- Responde SIEMPRE en el idioma en que el usuario te hable.`,
    },
  },
  blocks: [
    {
      id: 'block-hero',
      type: 'hero',
      order: 0,
      visible: true,
      props: {
        name: 'Richard Falsone',
        role: 'SR UX/UI DESIGNER EN NTT DATA EUROPE & LATAM',
        location: 'MÉRIDA, YUCATÁN, MÉXICO',
        avatar: 'https://ais-dev-2gvmeatgq3wpakpdr2qcel-518479397297.us-east1.run.app/perfil.jpeg',
        bgImage: '',
      },
    },
    {
      id: 'block-services',
      type: 'services',
      order: 1,
      visible: true,
      props: {
        items: [
          {
            title: 'UX Design',
            description: 'Diseño centrado en el usuario enfocado en usabilidad y accesibilidad.',
            extendedDesc: 'Metodologías de investigación, mapas de empatía, user journeys, árbol de contenidos, arquitectura de información y pruebas de usabilidad.',
            icon: 'person',
          },
          {
            title: 'UI Design',
            description: 'Interfaces visuales modernas y atractivas con sistemas de diseño coherentes.',
            extendedDesc: 'Design tokens, componentes atómicos, guías de estilo, handoff a desarrollo y documentación de componentes.',
            icon: 'palette',
            meta: 'SENIOR LEVEL',
          },
          {
            title: 'Interactive Design',
            description: 'Prototipos de alta fidelidad con animaciones e interacciones reales.',
            extendedDesc: 'Prototipos interactivos en Figma, animaciones con After Effects y Principle, micro-interacciones y motion design.',
            icon: 'animation',
          },
        ],
      },
    },
    {
      id: 'block-portfolio',
      type: 'portfolio',
      order: 2,
      visible: true,
      props: {
        items: [
          { title: 'NTT DATA Platform', image: 'https://picsum.photos/seed/ntt/800/600', description: 'Sistema interno para NTT DATA.', category: 'uxDesign', impact: '+25% Staffing', tags: [] },
          { title: 'Fintech App', image: 'https://picsum.photos/seed/fintech/800/600', description: 'App de servicios financieros.', category: 'uiDesign', impact: '+15% Conversion', tags: [] },
          { title: 'E-commerce Redesign', image: 'https://picsum.photos/seed/shop/800/600', description: 'Rediseño completo de tienda online.', category: 'uxDesign', impact: '-20% Bounce', tags: [] },
        ],
      },
    },
    {
      id: 'block-info',
      type: 'info_card',
      order: 3,
      visible: true,
      props: {
        email: 'hola@richardfalsone.com',
        phone: '+52 999 000 0000',
        workMode: 'Remoto',
      },
    },
    {
      id: 'block-languages',
      type: 'languages',
      order: 3.1,
      visible: true,
      props: {
        languages: [
          { name: 'SPANISH', level: 100 },
          { name: 'ENGLISH', level: 90 },
        ],
      },
    },
    {
      id: 'block-aptitudes',
      type: 'aptitudes',
      order: 3.2,
      visible: true,
      props: {
        items: [
          'Herramientas de diseño',
          'Aplicaciones móviles',
          'Creación de relaciones',
          'Atomic Design',
          'Design Systems',
          'User Research',
          'Prototyping',
          'Agile / Scrum',
        ],
      },
    },
    {
      id: 'block-certifications',
      type: 'certifications',
      order: 3.3,
      visible: true,
      props: {
        items: [
          { title: 'Introduction to Generative AI - Español', issuer: 'GOOGLE', date: 'APR 2024' },
          { title: 'Workshop Variables', issuer: 'INTERFACE SCHOOL', date: 'MAY 2024' },
          { title: 'English certificate (B2 Upper-Intermediate)', issuer: 'INTERNATIONAL ENGLISH TEST', date: 'MAY 2024' },
        ],
      },
    },
    {
      id: 'block-stats',
      type: 'stats',
      order: 3.4,
      visible: true,
      props: {
        stats: [
          { value: '30%', label: 'STAFFING EFFICIENCY', icon: '' },
          { value: '10+', label: 'PROJECTS DONE', icon: '' },
          { value: '100%', label: 'NPS', icon: '' },
        ],
      },
    },
    {
      id: 'block-experience',
      type: 'experience',
      order: 4,
      visible: true,
      props: {
        items: [
          {
            role: 'Sr UX/UI Designer',
            company: 'NTT DATA Europe & Latam',
            period: '2022 - Present',
            description: 'Leading design projects from user research to final visual design.',
            icon: 'work',
          },
        ],
      },
    },
    {
      id: 'block-recommendations',
      type: 'recommendations',
      order: 5,
      visible: true,
      props: {
        items: [
          { name: 'Paulina G.', role: 'Product Manager @ NTT DATA', text: 'Richard es un diseñador excepcional.', avatar: 'https://i.pravatar.cc/150?u=paulina', rating: 5 },
          { name: 'Carlos R.', role: 'Lead Developer @ DaCodes', text: 'Trabajar con Richard fue una gran experiencia.', avatar: 'https://i.pravatar.cc/150?u=carlos', rating: 5 },
        ],
      },
    },
    {
      id: 'block-contact',
      type: 'contact',
      order: 6,
      visible: true,
      props: {
        email: 'hola@richardfalsone.com',
        headline: '¿Listo para colaborar?',
        subtext: 'Siempre abierto a nuevos proyectos y oportunidades. ¡Hablemos!',
      },
    },
    {
      id: 'block-footer',
      type: 'footer',
      order: 7,
      visible: true,
      props: {
        copyright: '© 2024 RICHARD FALSONE. TODOS LOS DERECHOS RESERVADOS.',
        links: [
          { label: 'LinkedIn', url: '#' },
          { label: 'Behance', url: '#' },
        ],
      },
    },
  ],
};
