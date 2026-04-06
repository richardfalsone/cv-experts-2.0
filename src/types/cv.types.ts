// Core block types for the CV CMS
export type BlockType =
  | 'hero'
  | 'info_card'
  | 'languages'
  | 'skills_chart'
  | 'aptitudes'
  | 'stats'
  | 'experience'
  | 'services'
  | 'portfolio'
  | 'recommendations'
  | 'clients'
  | 'contact'
  | 'blog'
  | 'certifications'
  | 'footer'
  | 'uxui_showcase'     // [NEW] Phase 2
  | 'frontend_showcase' // [NEW] Phase 2
  | 'backend_showcase';  // [NEW] Phase 2

export type UserRole = 'admin' | 'talent' | 'sales';
export type Specialization = 'ux_ui' | 'frontend' | 'backend';

export interface BlockBase {
  id: string;
  type: BlockType;
  order: number;
  visible: boolean;
}

export interface HeroBlock extends BlockBase {
  type: 'hero';
  props: {
    name: string;
    role: string;
    location: string;
    avatar: string;
    bgImage: string;
  };
}

export interface InfoCardBlock extends BlockBase {
  type: 'info_card';
  props: {
    email: string;
    phone: string;
    workMode: string;
  };
}

export interface LanguagesBlock extends BlockBase {
  type: 'languages';
  props: {
    languages: Array<{ name: string; level: number }>;
  };
}

export interface SkillsChartBlock extends BlockBase {
  type: 'skills_chart';
  props: {
    skills: Array<{ label: string; value: number }>;
  };
}

export interface AptitudesBlock extends BlockBase {
  type: 'aptitudes';
  props: {
    items: string[];
  };
}

export interface StatsBlock extends BlockBase {
  type: 'stats';
  props: {
    stats: Array<{ value: string; label: string; icon: string }>;
  };
}

export interface ExperienceBlock extends BlockBase {
  type: 'experience';
  props: {
    items: Array<{
      role: string;
      company: string;
      period: string;
      description: string;
      icon: string;
    }>;
  };
}

export interface ServicesBlock extends BlockBase {
  type: 'services';
  props: {
    items: Array<{
      title: string;
      description: string;
      extendedDesc: string;
      icon: string;
      meta?: string;
    }>;
  };
}

export interface PortfolioBlock extends BlockBase {
  type: 'portfolio';
  props: {
    items: Array<{
      title: string;
      image: string;
      description: string;
      category: string;
      impact?: string;
      tags: string[];
      link?: string;
    }>;
  };
}

export interface RecommendationsBlock extends BlockBase {
  type: 'recommendations';
  props: {
    items: Array<{
      name: string;
      role: string;
      text: string;
      avatar: string;
      rating: number;
    }>;
  };
}

export interface ClientsBlock extends BlockBase {
  type: 'clients';
  props: {
    clients: Array<{ name: string; logo: string }>;
  };
}

export interface ContactBlock extends BlockBase {
  type: 'contact';
  props: {
    email: string;
    headline: string;
    subtext: string;
  };
}

export interface BlogBlock extends BlockBase {
  type: 'blog';
  props: {
    items: Array<{
      title: string;
      image: string;
      description: string;
    }>;
  };
}

export interface CertificationsBlock extends BlockBase {
  type: 'certifications';
  props: {
    items: Array<{
      title: string;
      issuer: string;
      date: string;
      image?: string;
    }>;
  };
}

export interface FooterBlock extends BlockBase {
  type: 'footer';
  props: {
    copyright: string;
    links: Array<{ label: string; url: string }>;
  };
}

// --- Phase 2: Specialized Blocks ---

export interface UXUIShowcaseBlock extends BlockBase {
  type: 'uxui_showcase';
  props: {
    figmaUrl: string;
    figmaTitle: string;
    sliderItems: Array<{
      before: string;
      after: string;
      label: string;
    }>;
  };
}

export interface FrontendShowcaseBlock extends BlockBase {
  type: 'frontend_showcase';
  props: {
    sandboxUrl: string;
    lighthouse: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
    };
    techStack: string[];
  };
}

export interface BackendShowcaseBlock extends BlockBase {
  type: 'backend_showcase';
  props: {
    mermaidDiagram: string;
    codeSnippet: string;
    language: string;
    metrics: Array<{ label: string; value: string }>;
  };
}

export interface AIConfig {
  enabled: boolean;
  systemPrompt: string;
  welcomeMessage?: string;
  modelName?: string;
}

export type CVBlock =
  | HeroBlock | InfoCardBlock | LanguagesBlock | SkillsChartBlock
  | AptitudesBlock | StatsBlock | ExperienceBlock | ServicesBlock
  | PortfolioBlock | RecommendationsBlock | ClientsBlock | ContactBlock
  | BlogBlock | CertificationsBlock | FooterBlock
  | UXUIShowcaseBlock | FrontendShowcaseBlock | BackendShowcaseBlock;

export interface CVPage {
  id: string;
  employeeId: string;
  templateId: string;
  blocks: CVBlock[];
  meta: {
    primaryColor: string;
    bgColor: string;
    surfaceColor: string;
    fontFamily: string;
    language: 'es' | 'en';
    aiConfig?: AIConfig;
  };
  version: number;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface Employee {
  id: string;
  fullName: string;
  slug: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  specialization: Specialization;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}
