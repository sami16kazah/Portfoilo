export type Locale = 'en' | 'de' | 'ar';

export interface LocalizedLanguage {
  name: string;
  name_de?: string;
  name_ar?: string;
  proficiency?: string;
}

export interface ProfileData {
  name?: string;
  name_de?: string;
  name_ar?: string;
  title?: string;
  title_de?: string;
  title_ar?: string;
  bio?: string[] | string;
  bio_de?: string[] | string;
  bio_ar?: string[] | string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  cvUrl?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  languages?: LocalizedLanguage[];
}

export interface JobMetric {
  label: string;
  label_de?: string;
  label_ar?: string;
  value: string;
  detail?: string;
  detail_de?: string;
  detail_ar?: string;
}

export interface JobData {
  _id: string;
  company: string;
  companyUrl?: string;
  logoUrl?: string;
  role: string;
  role_de?: string;
  role_ar?: string;
  location?: string;
  location_de?: string;
  location_ar?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  summary?: string;
  summary_de?: string;
  summary_ar?: string;
  highlights?: string[];
  highlights_de?: string[];
  highlights_ar?: string[];
  techStack?: string[];
  performanceMetrics?: JobMetric[];
}

export interface VideoChapter {
  title: string;
  title_de?: string;
  title_ar?: string;
  url: string;
}

export interface ProjectData {
  _id: string;
  title: string;
  title_de?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_de?: string;
  subtitle_ar?: string;
  description?: string[] | string;
  description_de?: string[] | string;
  description_ar?: string[] | string;
  credits?: string;
  credits_de?: string;
  credits_ar?: string;
  highlights?: string[];
  highlights_de?: string[];
  highlights_ar?: string[];
  tags?: string[];
  repoUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  videoChapters?: VideoChapter[];
  imageUrl?: string;
  logoUrl?: string;
  brandColor?: string;
  demoStatus?: string;
  featured?: boolean;
  date?: string;
}

export interface SkillData {
  _id: string;
  name: string;
  name_de?: string;
  name_ar?: string;
  category: string;
  icon?: string;
  proficiency?: number;
}

export interface EducationData {
  _id: string;
  degree: string;
  degree_de?: string;
  degree_ar?: string;
  institution: string;
  institution_de?: string;
  institution_ar?: string;
  year?: string;
  description?: string;
  description_de?: string;
  description_ar?: string;
}

export interface CertificationData {
  _id: string;
  name: string;
  name_de?: string;
  name_ar?: string;
  issuer: string;
  date?: string;
  link?: string;
}

export interface BookLibraryLink {
  name: string;
  url: string;
}

export interface BookData {
  _id: string;
  title: string;
  title_de?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_de?: string;
  subtitle_ar?: string;
  coverUrl?: string;
  link?: string;
  libraryLinks?: BookLibraryLink[];
  topics?: string[];
  downloadsLabel?: string;
  description?: string;
  description_de?: string;
  description_ar?: string;
}

export interface PhotoData {
  _id?: string;
  url: string;
  title?: string;
  category?: string;
}

export interface SiteSettingsData {
  key?: string;
  heroBadge?: string;
  heroBadge_de?: string;
  heroBadge_ar?: string;
  availabilityLabel?: string;
  availabilityLabel_de?: string;
  availabilityLabel_ar?: string;
  locationLabel?: string;
  locationLabel_de?: string;
  locationLabel_ar?: string;
  featuredCompanyLabel?: string;
  featuredProjectLabel?: string;
  serviceOptions?: string[];
  budgetOptions?: string[];
  showExperienceSection?: boolean;
  showPerformanceTelemetry?: boolean;
  showProjectsSection?: boolean;
  showSkillsSection?: boolean;
  showBooksSection?: boolean;
  showEducationSection?: boolean;
  showGallerySection?: boolean;
  showContactSection?: boolean;
}

export function resolveAssetUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('./assets/')) {
    return url.slice(1);
  }
  return url;
}

export function getLocalizedValue<T extends object>(
  item: T | null | undefined,
  field: string,
  locale: Locale
): unknown {
  if (!item) return undefined;
  const record = item as Record<string, unknown>;
  if (locale === 'de') {
    const deVal = record[`${field}_de`];
    if (Array.isArray(deVal) ? deVal.length > 0 : Boolean(deVal)) return deVal;
  }
  if (locale === 'ar') {
    const arVal = record[`${field}_ar`];
    if (Array.isArray(arVal) ? arVal.length > 0 : Boolean(arVal)) return arVal;
  }
  return record[field];
}

export function getLocalizedText<T extends object>(
  item: T | null | undefined,
  field: string,
  locale: Locale,
  fallback = ''
): string {
  const value = getLocalizedValue(item, field, locale);
  if (Array.isArray(value)) return value.join(' ');
  if (typeof value === 'string') return value;
  return fallback;
}

export function getLocalizedList<T extends object>(
  item: T | null | undefined,
  field: string,
  locale: Locale
): string[] {
  const value = getLocalizedValue(item, field, locale);
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

export function getBookLibraryLinks(book: BookData): BookLibraryLink[] {
  const result: BookLibraryLink[] = [];
  const seen = new Set<string>();
  for (const item of book.libraryLinks || []) {
    const cleanUrl = (item.url || '').trim();
    const cleanName = (item.name || '').trim();
    if (!cleanUrl || seen.has(cleanUrl)) continue;
    seen.add(cleanUrl);
    result.push({ name: cleanName || 'Library', url: cleanUrl });
  }
  const legacyUrl = (book.link || '').trim();
  if (legacyUrl && !seen.has(legacyUrl)) {
    result.unshift({ name: 'Kotobati', url: legacyUrl });
  }
  return result;
}

export const PORTFOLIO_COPY = {
  en: {
    nav: {
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Stack',
      books: 'Books',
      education: 'Education',
      gallery: 'Gallery',
      contact: 'Contact',
      cta: 'Get in Touch',
      ctaShort: 'Contact',
    },
    hero: {
      viewWork: 'Explore Projects',
      contactMe: 'Get in Touch',
      resume: 'Resume / CV',
      directEmail: 'Email directly',
      workingAt: 'cloudvibe GmbH · Goch',
      flagship: 'shelforia.de',
    },
    sections: {
      experience: { code: '01', label: 'EXPERIENCE & RUNTIME', meta: 'CLOUDVIBE GMBH · GOCH, GERMANY' },
      projects: { code: '02', label: 'SELECTED WORK', meta: 'CLOUD ERP · E-COMMERCE · REAL-TIME' },
      skills: { code: '03', label: 'TECHNICAL STACK', meta: 'AWS CLOUD · FULL-STACK · DATABASES' },
      books: { code: '04', label: 'PUBLICATIONS', meta: '18,000+ COMBINED DOWNLOADS' },
      credentials: { code: '05', label: 'CREDENTIALS & GALLERY', meta: 'EDUCATION · LANGUAGES · MOMENTS' },
      contact: { code: '06', label: 'CONTACT & INQUIRY', meta: 'AVAILABLE FOR ENGINEERING & CLOUD' },
    },
    jobs: {
      heading: 'Work Experience &',
      headingAccent: 'Live Runtime.',
      subtitle:
        'Full-stack cloud engineering in Germany paired with live client-side browser performance telemetry and production system architecture.',
      currentBadge: 'CURRENT ROLE',
      highlightsTitle: 'Key Responsibilities',
      stackTitle: 'Production Stack',
      tabTelemetry: 'Browser Runtime',
      tabPipeline: 'System Flow',
      fpsLabel: 'Display Refresh',
      fcpLabel: 'First Paint',
      domLabel: 'DOM Ready',
      ttfbLabel: 'Response',
      measureNote: 'Measured live via Browser Performance API',
      pipelineSteps: [
        { code: '01', title: 'Web Client', detail: 'Next.js SSR, React 19 & edge-cached assets' },
        { code: '02', title: 'Application Core', detail: 'TypeScript APIs, GoBD ledger & validation' },
        { code: '03', title: 'AWS Frankfurt', detail: 'Multi-tenant PostgreSQL & DSGVO isolation' },
        { code: '04', title: 'Backups & Sync', detail: 'Automated snapshots & marketplace feeds' },
      ],
    },
    projects: {
      heading: 'Selected',
      headingAccent: 'Engineering Work.',
      subtitle:
        'Production cloud ERP platforms, modular event commerce systems, and real-time logistics architectures.',
      tabPreview: 'Overview & Preview',
      tabArchitecture: 'Key Modules',
      tabCredits: 'Team & Credits',
      visitSite: 'Visit Live Site',
      viewCode: 'Source Code',
      inspectProject: 'Inspect Project',
      chaptersLabel: 'Walkthrough Chapters',
      demoPendingTitle: 'Interactive Module Preview',
      demoPendingDesc:
        'Explore the four core architecture modules of shelforia below or visit shelforia.de directly.',
    },
    skills: {
      heading: 'Technical',
      headingAccent: 'Stack.',
      subtitle:
        'Hands-on depth across AWS cloud infrastructure, modern TypeScript/React frontends, resilient backends, and relational/NoSQL databases.',
      all: 'All',
      categories: {
        Cloud: 'Cloud & AWS',
        Frontend: 'Frontend',
        Backend: 'Backend',
        Database: 'Database',
        Languages: 'Languages',
        Tools: 'Tools',
      } as Record<string, string>,
    },
    books: {
      heading: 'Published',
      headingAccent: 'Books.',
      subtitle:
        'Three published titles spanning software architecture, compiler construction with ANTLR, and comparative studies — downloaded over 18,000 times.',
      openLibrary: 'Open on',
      readSynopsis: 'Read Synopsis',
      close: 'Close',
    },
    credentials: {
      heading: 'Education,',
      headingAccent: 'Languages & Gallery.',
      eduTitle: 'Education & Certifications',
      langTitle: 'Languages',
      galleryTitle: 'Gallery',
      close: 'Close preview',
    },
    contact: {
      heading: "Let's build",
      headingAccent: 'something resilient.',
      subtitle:
        'Interested in collaborating on a web application, cloud ERP platform, or engineering role? Send a message or reach out directly.',
      name: 'Your Name',
      namePlaceholder: 'Alex Rivera',
      email: 'Email Address',
      subject: 'Subject',
      subjectPlaceholder: 'Project or engineering opportunity',
      message: 'Message',
      messagePlaceholder: 'Tell me about your project, timeline, or role...',
      servicesLabel: 'Topics',
      budgetLabel: 'Scope',
      send: 'Send Message',
      sending: 'Sending...',
      sentSuccess: 'Thank you — your message has been received. I will get back to you shortly.',
      copyEmail: 'Copy Email',
      copied: 'Copied',
      directEmail: 'Email Directly',
      locationLabel: 'Goch, Germany · Remote EU',
    },
    footer: {
      bannerEyebrow: 'OPEN FOR COLLABORATION',
      bannerTitle: 'Need a full-stack & cloud engineer who ships cleanly?',
      bannerSub:
        'From GoBD-compliant cloud ERP architecture on AWS Frankfurt to fast, accessible React & Next.js interfaces.',
      featuredLabel: 'CORE STACK',
      backToTop: 'BACK TO TOP',
      rights: 'All rights reserved.',
    },
  },
  de: {
    nav: {
      experience: 'Erfahrung',
      projects: 'Projekte',
      skills: 'Tech-Stack',
      books: 'Bücher',
      education: 'Ausbildung',
      gallery: 'Galerie',
      contact: 'Kontakt',
      cta: 'Kontakt aufnehmen',
      ctaShort: 'Kontakt',
    },
    hero: {
      viewWork: 'Projekte entdecken',
      contactMe: 'Kontakt aufnehmen',
      resume: 'Lebenslauf',
      directEmail: 'Direkt per Mail',
      workingAt: 'cloudvibe GmbH · Goch',
      flagship: 'shelforia.de',
    },
    sections: {
      experience: { code: '01', label: 'BERUFSERFAHRUNG & LAUFZEIT', meta: 'CLOUDVIBE GMBH · GOCH' },
      projects: { code: '02', label: 'AUSGEWÄHLTE PROJEKTE', meta: 'CLOUD ERP · E-COMMERCE · ECHTZEIT' },
      skills: { code: '03', label: 'TECH-STACK', meta: 'AWS CLOUD · FULL-STACK · DATENBANKEN' },
      books: { code: '04', label: 'VERÖFFENTLICHUNGEN', meta: '18.000+ DOWNLOADS GESAMT' },
      credentials: { code: '05', label: 'AUSBILDUNG & GALERIE', meta: 'STUDIUM · SPRACHEN · EINDRÜCKE' },
      contact: { code: '06', label: 'KONTAKT & ANFRAGE', meta: 'VERFÜGBAR FÜR WEB & CLOUD' },
    },
    jobs: {
      heading: 'Berufserfahrung &',
      headingAccent: 'Live-Performance.',
      subtitle:
        'Aktuelle Full-Stack-Entwicklung in Deutschland kombiniert mit echter Browser-Laufzeitmessung und produktiver Cloud-Architektur.',
      currentBadge: 'AKTUELLE POSITION',
      highlightsTitle: 'Aufgaben & Schwerpunkte',
      stackTitle: 'Produktiv-Stack',
      tabTelemetry: 'Browser-Laufzeit',
      tabPipeline: 'System-Aufbau',
      fpsLabel: 'Bildrate',
      fcpLabel: 'First Paint',
      domLabel: 'DOM bereit',
      ttfbLabel: 'Antwortzeit',
      measureNote: 'Live gemessen über die Browser Performance API',
      pipelineSteps: [
        { code: '01', title: 'Web-Client', detail: 'Next.js SSR, React 19 & optimierte Assets' },
        { code: '02', title: 'Applikationskern', detail: 'TypeScript-APIs, GoBD & E-Rechnung' },
        { code: '03', title: 'AWS Frankfurt', detail: 'Mandantenfähiges PostgreSQL & DSGVO' },
        { code: '04', title: 'Backups & Sync', detail: 'Automatisierte Snapshots & Marktplätze' },
      ],
    },
    projects: {
      heading: 'Ausgewählte',
      headingAccent: 'Projekte.',
      subtitle:
        'Produktive Cloud-Warenwirtschaften, modulare Event-Plattformen und Echtzeit-Logistiksysteme.',
      tabPreview: 'Übersicht & Vorschau',
      tabArchitecture: 'Kernmodule',
      tabCredits: 'Team & Credits',
      visitSite: 'Website öffnen',
      viewCode: 'Quellcode',
      inspectProject: 'Details ansehen',
      chaptersLabel: 'Video-Abschnitte',
      demoPendingTitle: 'Interaktive Modul-Übersicht',
      demoPendingDesc:
        'Entdecke die vier Kernmodule von shelforia direkt unten oder besuche shelforia.de.',
    },
    skills: {
      heading: 'Technischer',
      headingAccent: 'Stack.',
      subtitle:
        'Praxiserfahrung in AWS Cloud-Infrastruktur, modernen TypeScript/React-Oberflächen, stabilen Backends und Datenbanken.',
      all: 'Alle',
      categories: {
        Cloud: 'Cloud & AWS',
        Frontend: 'Frontend',
        Backend: 'Backend',
        Database: 'Datenbanken',
        Languages: 'Sprachen',
        Tools: 'Tools',
      } as Record<string, string>,
    },
    books: {
      heading: 'Veröffentlichte',
      headingAccent: 'Bücher.',
      subtitle:
        'Drei veröffentlichte Fachbücher über Software-Design-Patterns, Compilerbau mit ANTLR und vergleichende Studien — über 18.000 Downloads.',
      openLibrary: 'Öffnen auf',
      readSynopsis: 'Beschreibung lesen',
      close: 'Schließen',
    },
    credentials: {
      heading: 'Ausbildung,',
      headingAccent: 'Sprachen & Galerie.',
      eduTitle: 'Ausbildung & Zertifikate',
      langTitle: 'Sprachen',
      galleryTitle: 'Galerie',
      close: 'Vorschau schließen',
    },
    contact: {
      heading: 'Lass uns gemeinsam',
      headingAccent: 'etwas Großes bauen.',
      subtitle:
        'Du planst eine Webanwendung, eine Cloud-ERP-Plattform oder suchst Verstärkung im Engineering? Schreib mir gerne direkt.',
      name: 'Dein Name',
      namePlaceholder: 'Max Mustermann',
      email: 'E-Mail-Adresse',
      subject: 'Betreff',
      subjectPlaceholder: 'Projekt oder Position',
      message: 'Nachricht',
      messagePlaceholder: 'Erzähl mir kurz von deinem Projekt oder Anliegen...',
      servicesLabel: 'Themen',
      budgetLabel: 'Rahmen',
      send: 'Nachricht senden',
      sending: 'Wird gesendet...',
      sentSuccess: 'Vielen Dank — deine Nachricht wurde gesendet. Ich melde mich kurzfristig.',
      copyEmail: 'E-Mail kopieren',
      copied: 'Kopiert',
      directEmail: 'Direkt schreiben',
      locationLabel: 'Goch, Deutschland · Remote',
    },
    footer: {
      bannerEyebrow: 'OFFEN FÜR PROJEKTE & AUSTAUSCH',
      bannerTitle: 'Bereit für saubere Software- & Cloud-Architektur?',
      bannerSub:
        'Von GoBD-konformer Cloud-Warenwirtschaft auf AWS Frankfurt bis zu schnellen React- & Next.js-Oberflächen.',
      featuredLabel: 'KERN-STACK',
      backToTop: 'NACH OBEN',
      rights: 'Alle Rechte vorbehalten.',
    },
  },
  ar: {
    nav: {
      experience: 'الخبرات',
      projects: 'المشاريع',
      skills: 'التقنيات',
      books: 'الكتب',
      education: 'التعليم',
      gallery: 'المعرض',
      contact: 'تواصل',
      cta: 'تواصل معي',
      ctaShort: 'تواصل',
    },
    hero: {
      viewWork: 'استكشف المشاريع',
      contactMe: 'تواصل معي',
      resume: 'السيرة الذاتية',
      directEmail: 'مراسلة بالبريد',
      workingAt: 'cloudvibe GmbH · ألمانيا',
      flagship: 'shelforia.de',
    },
    sections: {
      experience: { code: '01', label: 'الخبرة العملية والأداء', meta: 'CLOUDVIBE GMBH · ألمانيا' },
      projects: { code: '02', label: 'أبرز المشاريع', meta: 'أنظمة سحابية · تجارة · وقت فعلي' },
      skills: { code: '03', label: 'التقنيات والأدوات', meta: 'AWS CLOUD · FULL-STACK · قواعد بيانات' },
      books: { code: '04', label: 'المؤلفات والكتب', meta: 'أكثر من 18,000 تحميل' },
      credentials: { code: '05', label: 'التعليم والمعرض', meta: 'الشهادات · اللغات · الصور' },
      contact: { code: '06', label: 'التواصل المباشر', meta: 'متاح لمشاريع الويب والسحابة' },
    },
    jobs: {
      heading: 'الخبرة العملية و',
      headingAccent: 'قياس الأداء الحي.',
      subtitle:
        'هندسة برمجيات سحابية في ألمانيا إلى جانب قياسات سرعة المتصفح الفعلية وبنية الأنظمة الإنتاجية.',
      currentBadge: 'العمل الحالي',
      highlightsTitle: 'المسؤوليات الرئيسية',
      stackTitle: 'التقنيات المستخدمة',
      tabTelemetry: 'أداء المتصفح',
      tabPipeline: 'بنية النظام',
      fpsLabel: 'معدل الإطارات',
      fcpLabel: 'أول رسم',
      domLabel: 'جاهزية الصفحة',
      ttfbLabel: 'الاستجابة',
      measureNote: 'قياسات حية عبر واجهة Browser Performance API',
      pipelineSteps: [
        { code: '01', title: 'واجهة الويب', detail: 'Next.js و React 19 مع أصول محسّنة' },
        { code: '02', title: 'نواة النظام', detail: 'واجهات TypeScript وتحقق GoBD' },
        { code: '03', title: 'AWS فرانكفورت', detail: 'قواعد PostgreSQL متعددة المستأجرين' },
        { code: '04', title: 'النسخ والمزامنة', detail: 'نسخ احتياطي آلي وربط الأسواق' },
      ],
    },
    projects: {
      heading: 'أبرز',
      headingAccent: 'المشاريع الهندسية.',
      subtitle:
        'منصات تخطيط موارد سحابية، أنظمة تجارة وفعاليات متكاملة، وحلول لوجستية بالوقت الفعلي.',
      tabPreview: 'نظرة عامة ومعاينة',
      tabArchitecture: 'الوحدات الأساسية',
      tabCredits: 'فريق العمل',
      visitSite: 'زيارة الموقع',
      viewCode: 'الكود المصدري',
      inspectProject: 'عرض التفاصيل',
      chaptersLabel: 'مقاطع الفيديو',
      demoPendingTitle: 'استعراض وحدات المنصة',
      demoPendingDesc:
        'استعرض الوحدات الأربع الأساسية لمنصة shelforia أدناه أو قم بزيارة shelforia.de مباشرة.',
    },
    skills: {
      heading: 'التقنيات',
      headingAccent: 'والأدوات.',
      subtitle:
        'خبرة عملية واسعة في سحابة AWS وواجهات TypeScript/React الحديثة والخوادم وقواعد البيانات.',
      all: 'الكل',
      categories: {
        Cloud: 'السحابة و AWS',
        Frontend: 'الواجهات الأمامية',
        Backend: 'الخوادم والخلفيات',
        Database: 'قواعد البيانات',
        Languages: 'لغات البرمجة',
        Tools: 'الأدوات',
      } as Record<string, string>,
    },
    books: {
      heading: 'الكتب',
      headingAccent: 'المنشورة.',
      subtitle:
        'ثلاثة كتب منشورة في أنماط التصميم البرمجية، بناء المترجمات باستخدام ANTLR، والدراسات التحليلية بأكثر من 18,000 تحميل.',
      openLibrary: 'فتح في',
      readSynopsis: 'قراءة الوصف',
      close: 'إغلاق',
    },
    credentials: {
      heading: 'التعليم،',
      headingAccent: 'اللغات والمعرض.',
      eduTitle: 'التعليم والشهادات',
      langTitle: 'اللغات',
      galleryTitle: 'معرض الصور',
      close: 'إغلاق المعاينة',
    },
    contact: {
      heading: 'لنبني معاً',
      headingAccent: 'مشروعاً استثنائياً.',
      subtitle:
        'هل لديك مشروع ويب، نظام ERP سحابي، أو فرصة عمل هندسية؟ أرسل رسالة مباشرة أو راسلني بالبريد.',
      name: 'الاسم الكامل',
      namePlaceholder: 'اسمك الكامل',
      email: 'البريد الإلكتروني',
      subject: 'الموضوع',
      subjectPlaceholder: 'مشروع أو فرصة عمل',
      message: 'الرسالة',
      messagePlaceholder: 'أخبرني المزيد عن مشروعك أو تفاصيل التواصل...',
      servicesLabel: 'المجالات',
      budgetLabel: 'النطاق',
      send: 'إرسال الرسالة',
      sending: 'جاري الإرسال...',
      sentSuccess: 'شكراً لتواصلك — تم استلام رسالتك وسأرد عليك قريباً.',
      copyEmail: 'نسخ البريد',
      copied: 'تم النسخ',
      directEmail: 'مراسلة مباشرة',
      locationLabel: 'غوخ، ألمانيا · عمل عن بُعد',
    },
    footer: {
      bannerEyebrow: 'متاح للتعاون والمشاريع',
      bannerTitle: 'تبحث عن مهندس برمجيات وسحابة يبني بجودة عالية؟',
      bannerSub:
        'من الأنظمة السحابية المتوافقة مع GoBD على AWS فرانكفورت إلى واجهات React و Next.js السريعة.',
      featuredLabel: 'التقنيات الأساسية',
      backToTop: 'العودة للأعلى',
      rights: 'جميع الحقوق محفوظة.',
    },
  },
};

export const DEFAULT_PROFILE: ProfileData = {
  name: 'Sami Kazah',
  name_de: 'Sami Kazah',
  name_ar: 'سامي قزح',
  title: 'Software & Full-Stack Engineer',
  title_de: 'Software- & Full-Stack-Entwickler',
  title_ar: 'مهندس برمجيات ومطور متكامل',
  bio: [
    'Information Technology Engineer specialized in Software Engineering, published computer science author, and full-stack software builder at cloudvibe GmbH in Goch, Germany.',
    'Co-architect and developer of shelforia.de — a cloud ERP platform for antiquarian booksellers and art dealers hosted on AWS Frankfurt — combining resilient backend design with fast, accessible user interfaces.',
  ],
  bio_de: [
    'Ingenieur für Informationstechnologie mit Schwerpunkt Software Engineering, veröffentlichter Fachbuchautor und Softwareentwickler bei der cloudvibe GmbH in Goch.',
    'Mitentwickler und Planer von shelforia.de — einer Cloud-Warenwirtschaft für Antiquariate und Kunsthandel mit Hosting in Frankfurt — mit Fokus auf Performance, GoBD-Sicherheit und moderne UX.',
  ],
  bio_ar: [
    'مهندس تكنولوجيا معلومات متخصص في هندسة البرمجيات، ومؤلف منشور في علوم الحاسوب، وأعمل حالياً في تطوير البرمجيات والأنظمة السحابية لدى cloudvibe GmbH في ألمانيا.',
    'مشارك في التخطيط والتطوير الكامل لمنصة shelforia.de — منصة تخطيط موارد سحابية لمتاجر الكتب النادرة والتحف الفنية — مع تركيز على الأداء العالي وتجربة المستخدم الحديثة.',
  ],
  email: 'samkazah444@gmail.com',
  avatarUrl: '/assets/images/sami.jpg',
  socialLinks: {
    github: 'https://github.com/sami16kazah',
    linkedin: 'https://www.linkedin.com/in/sami-kazah-6aa67648/',
  },
  languages: [
    { name: 'Arabic', name_de: 'Arabisch', name_ar: 'العربية', proficiency: 'C2' },
    { name: 'English', name_de: 'Englisch', name_ar: 'الإنجليزية', proficiency: 'B2' },
    { name: 'German', name_de: 'Deutsch', name_ar: 'الألمانية', proficiency: 'B1' },
  ],
};

export const DEFAULT_JOBS: JobData[] = [
  {
    _id: 'job-cloudvibe-current',
    company: 'cloudvibe GmbH',
    companyUrl: 'https://cloudvibe.de/',
    logoUrl: '/assets/companies/cloudvibe-logo.webp',
    role: 'Software Engineer & Cloud Systems Developer',
    role_de: 'Softwareentwickler & Cloud-Systementwickler',
    role_ar: 'مهندس برمجيات ومطور أنظمة سحابية',
    location: 'Goch, Germany',
    location_de: 'Goch, Deutschland',
    location_ar: 'غوخ، ألمانيا',
    employmentType: 'Current Role',
    startDate: '2025',
    endDate: 'Present',
    isCurrent: true,
    summary:
      'Building cloud software products and supporting managed IT infrastructure for SMEs, healthcare practices, and specialized commerce at cloudvibe GmbH — including full-stack engineering of shelforia.de.',
    summary_de:
      'Entwicklung von Cloud-Softwareprodukten und Unterstützung von Managed-IT-Infrastrukturen für KMU, Arztpraxen, Apotheken und den Fachhandel bei der cloudvibe GmbH — inklusive der Full-Stack-Entwicklung von shelforia.de.',
    summary_ar:
      'تطوير منتجات برمجية سحابية ودعم البنية التحتية المُدارة للشركات الصغيرة والمتوسطة والقطاع الصحي والتجاري لدى cloudvibe GmbH، بما في ذلك التطوير المتكامل لمنصة shelforia.de.',
    highlights: [
      'Planned & fully developed shelforia.de cloud ERP alongside Lukas Kowal with the help of Leon Kuck.',
      'Engineered GoBD-compliant billing, XRechnung / ZUGFeRD validation, and multi-marketplace sync workflows.',
      'Contributed to cloud-native architecture hosted on AWS Frankfurt with strict tenant isolation & DSGVO compliance.',
      'Collaborated across managed infrastructure, automated backup pipelines, and business software integrations.',
    ],
    highlights_de: [
      'Gemeinsame Planung & vollständige Entwicklung der Cloud-Warenwirtschaft shelforia.de mit Lukas Kowal und Unterstützung von Leon Kuck.',
      'Entwicklung GoBD-konformer Belegprozesse, XRechnung-/ZUGFeRD-Prüfung und Marktplatz-Synchronisation.',
      'Mitarbeit an mandantenfähiger Cloud-Architektur auf AWS Frankfurt nach DSGVO-Standards.',
      'Integration von Managed Infrastructure, automatisierten Backup-Strategien und Branchenlösungen.',
    ],
    highlights_ar: [
      'التخطيط والتطوير الكامل لمنصة shelforia.de السحابية بالشراكة مع لوكاس كوفال وبمساعدة ليون كوك.',
      'هندسة الفوترة المتوافقة مع معايير GoBD و XRechnung / ZUGFeRD ومزامنة الأسواق الإلكترونية.',
      'المساهمة في بنية سحابية متعددة المستأجرين مستضافة على AWS فرانكفورت وفق معايير الخصوصية DSGVO.',
      'العمل ضمن منظومة البنية التحتية المُدارة والنسخ الاحتياطي الآلي وتكامل برمجيات الأعمال.',
    ],
    techStack: [
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'PostgreSQL',
      'AWS Frankfurt',
      'GoBD / XRechnung',
      'Managed Cloud',
    ],
    performanceMetrics: [
      {
        label: 'Cloud Region',
        label_de: 'Cloud-Region',
        label_ar: 'المنطقة السحابية',
        value: 'AWS Frankfurt',
        detail: 'DSGVO multi-tenant hosting',
        detail_de: 'DSGVO-konformes Multi-Tenant-Hosting',
        detail_ar: 'استضافة متوافقة مع الخصوصية',
      },
      {
        label: 'Compliance Core',
        label_de: 'Compliance-Kern',
        label_ar: 'الامتثال المحاسبي',
        value: 'GoBD + EN 16931',
        detail: 'Immutable ledger & E-Invoicing',
        detail_de: 'Unveränderliche Belege & E-Rechnung',
        detail_ar: 'سجلات غير قابلة للتعديل وفوترة إلكترونية',
      },
      {
        label: 'Core Domains',
        label_de: 'Kernbereiche',
        label_ar: 'المجالات الأساسية',
        value: 'IT · TI · ERP',
        detail: 'Managed IT, healthcare & SaaS',
        detail_de: 'Managed IT, Gesundheitswesen & SaaS',
        detail_ar: 'بنية تحتية وقطاع صحي وبرمجيات سحابية',
      },
    ],
  },
];

export const DEFAULT_PROJECTS: ProjectData[] = [
  {
    _id: 'project-shelforia',
    title: 'shelforia',
    title_de: 'shelforia',
    title_ar: 'shelforia — شيلفوريا',
    subtitle: 'Cloud ERP for Antiquarian Booksellers & Art Dealers',
    subtitle_de: 'Cloud-Warenwirtschaft für Antiquariat & Kunsthandel',
    subtitle_ar: 'نظام إدارة موارد سحابي لمتاجر الكتب النادرة والتحف الفنية',
    description: [
      'shelforia is a specialized cloud ERP and inventory management platform built for antiquarian booksellers, art galleries, and autograph dealers — running directly in the browser on AWS Frankfurt.',
      'It unifies catalog & desiderata management, GoBD-compliant invoicing, XRechnung & ZUGFeRD e-invoicing validation, § 25a UStG differential taxation, EU-OSS/UStVA/ZM tax reports, marketplace integrations (eBay, AbeBooks / ZVAB, Booklooker), DHL shipping labels, and PayPal/bank reconciliation.',
    ],
    description_de: [
      'shelforia ist eine spezialisierte Cloud-Warenwirtschaft für Antiquariate, Kunst- und Autographenhandel — direkt im Browser betrieben auf AWS Frankfurt.',
      'Die Plattform vereint Bestands- und Desiderata-Verwaltung, GoBD-konforme Belegerstellung, XRechnung & ZUGFeRD, Differenzbesteuerung (§ 25a UStG), EU-OSS/UStVA/ZM, Marktplatz-Anbindungen (eBay, AbeBooks / ZVAB, Booklooker), DHL-Versand sowie PayPal- und Bankabgleich.',
    ],
    description_ar: [
      'shelforia هي منصة سحابية متخصصة لإدارة المخزون والموارد (ERP) موجهة لمتاجر الكتب النادرة والمعارض الفنية وتجارة المخطوطات، وتعمل مباشرة عبر المتصفح على خوادم AWS في فرانكفورت.',
      'تجمع المنصة إدارة الكتالوجات وطلبات البحث، والفوترة المتوافقة مع معايير GoBD، والفاتورة الإلكترونية XRechnung و ZUGFeRD، والضرائب التفاضلية الأوروبية، والربط المباشر مع أسواق eBay و AbeBooks / ZVAB و Booklooker وشحن DHL.',
    ],
    credits: 'Planned & fully developed by Sami Kazah and Lukas Kowal, with the help of Leon Kuck.',
    credits_de: 'Geplant und vollständig entwickelt von Sami Kazah und Lukas Kowal, mit Unterstützung von Leon Kuck.',
    credits_ar: 'تم التخطيط والتطوير بالكامل بواسطة سامي قزح ولوكاس كوفال، بمساعدة ليون كوك.',
    highlights: [
      'Inventory, Catalogs & Desiderata tracking for unique collectibles',
      'GoBD-immutable invoices + GDPdU audit export',
      'XRechnung (EN 16931) & ZUGFeRD automated validation',
      '§ 25a UStG Differential Tax, EU-OSS, UStVA & ZM reporting',
      'Live sync with eBay, AbeBooks / ZVAB, Booklooker & DHL',
      'Multi-tenant DSGVO hosting in AWS Frankfurt under cloudvibe GmbH',
    ],
    highlights_de: [
      'Bestand, Kataloge & Desiderata für Unikate und Sammlerstücke',
      'GoBD-unveränderliche Belege & GDPdU-Export für Betriebsprüfungen',
      'XRechnung (EN 16931) & ZUGFeRD mit Pflichtfeld-Prüfung',
      '§ 25a UStG Differenzbesteuerung, EU-OSS, UStVA & ZM',
      'Anbindung an eBay, AbeBooks / ZVAB, Booklooker & DHL',
      'Mandantenfähiges DSGVO-Hosting in AWS Frankfurt durch cloudvibe',
    ],
    highlights_ar: [
      'إدارة المخزون والكتالوجات وطلبات الاقتناء الخاصة بالمقتنيات الفريدة',
      'فواتير غير قابلة للتعديل متوافقة مع GoBD وتصدير التدقيق GDPdU',
      'دعم كامل للفوترة الإلكترونية XRechnung و ZUGFeRD',
      'حساب ضريبة الهامش § 25a UStG وتقارير EU-OSS و UStVA',
      'ربط مباشر مع eBay و AbeBooks / ZVAB و Booklooker وشحن DHL',
      'استضافة متعددة المستأجرين متوافقة مع GDPR في AWS فرانكفورت',
    ],
    tags: ['TypeScript', 'React', 'PostgreSQL', 'AWS Frankfurt', 'GoBD / XRechnung', 'Multi-Tenant ERP'],
    demoUrl: 'https://shelforia.de/',
    imageUrl: '/assets/projects/shelforia-og.png',
    logoUrl: '/assets/projects/shelforia-logo.svg',
    brandColor: '#10b981',
    featured: true,
    date: '2025 – Present',
  },
  {
    _id: 'project-de-gastuin',
    title: 'De Gastuin E-Commerce & Event Platform',
    title_de: 'De Gastuin E-Commerce & Event-Plattform',
    title_ar: 'منصة De Gastuin للتجارة الإلكترونية والفعاليات',
    subtitle: 'Modular Event Ticketing, Shop & Real-Time Admin Studio',
    subtitle_de: 'Modulare Event-Ticketing-, Shop- & Admin-Plattform',
    subtitle_ar: 'منصة متكاملة لإدارة الفعاليات والتذاكر والمتجر الإلكتروني',
    description: [
      'Comprehensive event management and e-commerce platform built with a responsive attendee storefront and a modular real-time admin control panel.',
      'Includes live homepage hero editing without redeployment, PDF invoice generation, coupon-enabled ticket checkout, drink/shop ordering, and a dynamic FAQ WYSIWYG editor.',
    ],
    description_de: [
      'Umfassende Event-Management- und E-Commerce-Plattform mit reaktionsschnellem Frontend und vollständig anpassbarem Echtzeit-Admin-Dashboard.',
      'Beinhaltet Live-Bearbeitung der Startseite ohne Redeployment, PDF-Rechnungserstellung, Ticket-Kauf mit Gutscheinen, Shop-Checkout und dynamisches FAQ-System.',
    ],
    description_ar: [
      'منصة شاملة لإدارة الفعاليات والتجارة الإلكترونية، توفر واجهة مستخدم سريعة للزوار ولوحة تحكم معيارية متقدمة للمشرفين.',
      'تتضمن تحديث الصفحة الرئيسية في الوقت الفعلي دون إعادة نشر، وإصدار فواتير PDF، وشراء التذاكر مع القسائم، وطلب المشروبات، ومحرر الأسئلة الشائعة.',
    ],
    credits: 'Developed by Sami Kazah.',
    credits_de: 'Entwickelt von Sami Kazah.',
    credits_ar: 'تطوير سامي قزح.',
    highlights: [
      'Modular Admin Dashboard with instant live updates',
      'Automated PDF invoice generation & downloads',
      'Event ticketing with coupon redemption & shop checkout',
      'Full CRUD for events, users, media & FAQs',
    ],
    highlights_de: [
      'Modulares Admin-Dashboard mit Echtzeit-Aktualisierungen',
      'Automatische PDF-Rechnungserstellung & Downloads',
      'Event-Ticketing mit Gutscheinen & Shop-Checkout',
      'Vollständige CRUD-Verwaltung für Events, Nutzer, Medien & FAQs',
    ],
    highlights_ar: [
      'لوحة تحكم إدارية مرنة مع تحديثات فورية',
      'توليد وتحميل فواتير PDF تلقائياً',
      'نظام حجز التذاكر مع القسائم ومتجر الطلبات',
      'إدارة كاملة للفعاليات والمستخدمين والوسائط والأسئلة الشائعة',
    ],
    tags: ['Next.js', 'React', 'MongoDB', 'Cloudinary', 'PDF Invoices'],
    videoUrl: 'https://res.cloudinary.com/depeo6txz/video/upload/v1749979613/full_project_-_Made_with_Clipchamp_i4ffvs.mp4',
    videoChapters: [
      {
        title: 'De Gastuin Full Walkthrough',
        url: 'https://res.cloudinary.com/depeo6txz/video/upload/v1749979613/full_project_-_Made_with_Clipchamp_i4ffvs.mp4',
      },
      {
        title: 'Join De Gastuin',
        url: 'https://res.cloudinary.com/depeo6txz/video/upload/v1749979397/SignTo_-_Made_with_Clipchamp_sjzpsj.mp4',
      },
      {
        title: 'Shop & Drinks Checkout',
        url: 'https://res.cloudinary.com/depeo6txz/video/upload/v1749979361/shop_-_Made_with_Clipchamp_hkdk0t.mp4',
      },
      {
        title: 'Ticket & Coupon Flow',
        url: 'https://res.cloudinary.com/depeo6txz/video/upload/v1749979401/buying_ticket_-_Made_with_Clipchamp_jjk6m4.mp4',
      },
    ],
    brandColor: '#6366f1',
    featured: true,
    date: 'Jan – Jun 2025',
  },
  {
    _id: 'project-tcp-erp',
    title: 'TCP-ERP',
    title_de: 'TCP-ERP',
    title_ar: 'TCP-ERP — منصة اللوجستيات',
    subtitle: 'Collaborative Retail Logistics & Real-Time Driver Network',
    subtitle_de: 'Kollaborative Einzelhandelslogistik- & Fahrerplattform',
    subtitle_ar: 'منصة لوجستية تعاونية لتجارة التجزئة والتتبع الفوري',
    description: [
      'Collegiate capstone platform engineered to streamline retail supply chains by connecting dealers and companies with a real-time network of freelance drivers.',
      'Focused on real-time tracking, route coordination, and multi-client logistics dashboards across web and mobile apps.',
    ],
    description_de: [
      'Hochschulabschlussprojekt zur Optimierung von Einzelhandels-Lieferketten durch Vernetzung von Unternehmen und freiberuflichen Fahrern in Echtzeit.',
      'Schwerpunkt auf Echtzeit-Synchronisation, Routenplanung und Multi-Client-Logistik-Dashboards für Web und Mobile.',
    ],
    description_ar: [
      'مشروع تخرج هندسي صُمم لتبسيط سلاسل الإمداد لمتاجر التجزئة عبر ربط الشركات بشبكة سائقين مستقلين في الوقت الفعلي.',
      'يركز على التتبع اللحظي وتنسيق المسارات ولوحات التحكم اللوجستية عبر تطبيقات الويب والموبايل.',
    ],
    credits:
      'Team: Sami Kazah (Real-Time), Basel Hijazi (UI/UX & Flutter), Ahmad Zaza (Backend), Tarik Nashawati (Flutter), Hamze Al Hindi (Angular) — Supervised by Dr. Rawan Qaraouni.',
    credits_de:
      'Team: Sami Kazah (Echtzeit), Basel Hijazi (UI/UX & Flutter), Ahmad Zaza (Backend), Tarik Nashawati (Flutter), Hamze Al Hindi (Angular) — Betreut von Dr. Rawan Qaraouni.',
    credits_ar:
      'الفريق: سامي قزح (التطوير الفوري)، باسل حجازي، أحمد زازا، طارق نشواتي، حمزة الهندي — إشراف د. روان قرعوني.',
    highlights: [
      'Real-time shipment & driver state updates',
      'Multi-platform architecture (Angular Web + Flutter Mobile)',
      'Supply chain scheduling & fulfillment tracking',
    ],
    highlights_de: [
      'Echtzeit-Statusaktualisierungen für Lieferungen & Fahrer',
      'Multi-Plattform-Architektur (Angular Web + Flutter Mobile)',
      'Lieferketten-Planung & Auftragsverfolgung',
    ],
    highlights_ar: [
      'تحديثات فورية لحالة الشحنات والسائقين',
      'بنية متعددة المنصات (Angular للويب و Flutter للموبايل)',
      'جدولة سلاسل الإمداد ومتابعة التنفيذ',
    ],
    tags: ['Real-Time', 'Angular', 'Flutter', 'Backend API', 'Supply Chain'],
    brandColor: '#0ea5e9',
    featured: true,
    date: '2024',
  },
];

export const DEFAULT_SKILLS: SkillData[] = [
  { _id: 'sk-aws-cloud', name: 'AWS Cloud', category: 'Cloud', proficiency: 86, icon: 'SiAmazonwebservices' },
  { _id: 'sk-aws-ec2', name: 'AWS EC2 & VPC', category: 'Cloud', proficiency: 84, icon: 'SiAmazonec2' },
  { _id: 'sk-aws-s3', name: 'Amazon S3', category: 'Cloud', proficiency: 86, icon: 'SiAmazons3' },
  { _id: 'sk-aws-rds', name: 'Amazon RDS', category: 'Cloud', proficiency: 84, icon: 'SiAmazonrds' },
  { _id: 'sk-aws-lambda', name: 'AWS Lambda', category: 'Cloud', proficiency: 80, icon: 'SiAwslambda' },
  { _id: 'sk-aws-iam', name: 'AWS IAM', category: 'Cloud', proficiency: 84, icon: 'SiAmazoniam' },
  { _id: 'sk-aws-cloudwatch', name: 'AWS CloudWatch', category: 'Cloud', proficiency: 80, icon: 'SiAmazoncloudwatch' },
  { _id: 'sk-ts', name: 'TypeScript', category: 'Frontend', proficiency: 92, icon: '/assets/stack/java-script.png' },
  { _id: 'sk-next', name: 'Next.js', category: 'Frontend', proficiency: 92, icon: '/assets/stack/Next.js.png' },
  { _id: 'sk-react', name: 'React', category: 'Frontend', proficiency: 94, icon: '/assets/stack/react.png' },
  { _id: 'sk-tw', name: 'Tailwind CSS', category: 'Frontend', proficiency: 92, icon: '/assets/stack/Tailwind CSS.png' },
  { _id: 'sk-node', name: 'Node.js', category: 'Backend', proficiency: 88, icon: '/assets/stack/programing.png' },
  { _id: 'sk-spring', name: 'Spring Boot', category: 'Backend', proficiency: 80, icon: '/assets/stack/Spring.png' },
  { _id: 'sk-pg', name: 'PostgreSQL', category: 'Database', proficiency: 86, icon: '/assets/stack/postgre.png' },
  { _id: 'sk-mongo', name: 'MongoDB', category: 'Database', proficiency: 88, icon: '/assets/stack/MongoDB.png' },
  { _id: 'sk-mysql', name: 'MySQL', category: 'Database', proficiency: 84, icon: '/assets/stack/mysql.png' },
  { _id: 'sk-java', name: 'Java', category: 'Languages', proficiency: 84, icon: '/assets/stack/java.png' },
  { _id: 'sk-py', name: 'Python', category: 'Languages', proficiency: 80, icon: '/assets/stack/Python.png' },
  { _id: 'sk-c', name: 'C / C++', category: 'Languages', proficiency: 78, icon: '/assets/stack/c.png' },
  { _id: 'sk-ue', name: 'Unreal Engine', category: 'Tools', proficiency: 70, icon: '/assets/stack/Unreal Engine.png' },
];

export const DEFAULT_BOOKS: BookData[] = [
  {
    _id: 'book-design-patterns',
    title: 'Design Patterns in Arabic',
    title_de: 'Design Patterns auf Arabisch',
    title_ar: 'أنماط التصميم (Design Patterns) باللغة العربية',
    subtitle: 'Software Architecture & GoF Patterns',
    subtitle_de: 'Softwarearchitektur & GoF-Entwurfsmuster',
    subtitle_ar: 'دليل أنماط التصميم البرمجية مع تطبيقات عملية بلغة Java',
    description:
      'Practical guide covering key Gang-of-Four software design patterns, architectural trade-offs, and practical Java examples for writing maintainable object-oriented systems.',
    description_de:
      'Praxisleitfaden zu den bekanntesten Gang-of-Four-Entwurfsmustern, Architekturentscheidungen und konkreten Java-Beispielen für wartbare Softwaresysteme.',
    description_ar:
      'يقدّم شرحاً وافياً لأشهر أنماط التصميم (Design Patterns) المختلفة، والسياقات التي تستدعي استخدامها لمعالجة التحديات البرمجية، مع أمثلة وتطبيقات عملية بلغة Java لتعزيز الفهم.',
    link: 'https://www.kotobati.com/book/design-patterns-arabic',
    libraryLinks: [{ name: 'Kotobati', url: 'https://www.kotobati.com/book/design-patterns-arabic' }],
    topics: ['Design Patterns', 'Java', 'OOP', 'Architecture'],
    downloadsLabel: '7,000+ downloads',
  },
  {
    _id: 'book-antlr',
    title: 'Compilers Using ANTLR in Arabic',
    title_de: 'Compilerbau mit ANTLR auf Arabisch',
    title_ar: 'كتاب المترجمات باستخدام الـ ANTLR',
    subtitle: 'Lexers, Parsers & AST Engineering',
    subtitle_de: 'Lexer, Parser & AST-Entwicklung',
    subtitle_ar: 'دليل مخصص لطلاب الهندسة المعلوماتية في بناء المترجمات',
    description:
      'Hands-on compiler construction guide for Computer Science & Informatics students explaining lexical analysis, parsing, grammars, and AST execution with ANTLR.',
    description_de:
      'Praxisnahe Einführung für Informatikstudierende in den Compilerbau mit Lexer, Parser, Grammatiken und AST-Verarbeitung mithilfe von ANTLR.',
    description_ar:
      'دليل مخصص لطلاب كلية الهندسة المعلوماتية يشرح كيفية بناء مترجمات لغات البرمجة باستخدام أداة ANTLR، مع التركيز على المفاهيم النظرية والتطبيق العملي.',
    link: 'https://www.kotobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D9%85%D8%AA%D8%B1%D8%AC%D9%85%D8%A7%D8%AA-%D8%A8%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85-%D8%A7%D9%84-antlr',
    libraryLinks: [
      {
        name: 'Kotobati',
        url: 'https://www.kotobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D9%85%D8%AA%D8%B1%D8%AC%D9%85%D8%A7%D8%AA-%D8%A8%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85-%D8%A7%D9%84-antlr',
      },
    ],
    topics: ['Compilers', 'ANTLR', 'Grammars', 'AST'],
    downloadsLabel: '6,000+ downloads',
  },
  {
    _id: 'book-comparative',
    title: 'Islam and Terrorism (Comparative Studies)',
    title_de: 'Islam und Terrorismus (Studie)',
    title_ar: 'كتاب الإسلام والإرهاب',
    subtitle: 'Analytical & Comparative Studies',
    subtitle_de: 'Analytische & vergleichende Studie',
    subtitle_ar: 'دراسة تحليلية وفكرية مقارنة',
    description:
      'Published analytical book in religious and cultural studies exploring historical sources, conceptual distinctions, and comparative arguments.',
    description_de:
      'Veröffentlichtes Fachbuch im Bereich Religions- und Kulturstudien mit historischer Einordnung und vergleichender Textanalyse.',
    description_ar:
      'كتاب تحليلي منشور في الدراسات الدينية والفكرية يستعرض السياق التاريخي والمفاهيم المقارنة بأسلوب بحثي.',
    link: 'https://www.kotobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85-%D9%88%D8%A7%D9%84%D8%A5%D8%B1%D9%87%D8%A7%D8%A8',
    libraryLinks: [
      {
        name: 'Kotobati',
        url: 'https://www.kotobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85-%D9%88%D8%A7%D9%84%D8%A5%D8%B1%D9%87%D8%A7%D8%A8',
      },
    ],
    topics: ['Research', 'Comparative Studies'],
    downloadsLabel: '5,000+ downloads',
  },
];

export const DEFAULT_EDUCATION: EducationData[] = [
  {
    _id: 'edu-damascus',
    degree: "Information Technology Engineer (Bachelor's Degree)",
    degree_de: 'Ingenieur der Informationstechnologie (Bachelorabschluss)',
    degree_ar: 'مهندس تكنولوجيا المعلومات (درجة البكالوريوس)',
    institution: 'Damascus University',
    institution_de: 'Universität Damaskus',
    institution_ar: 'جامعة دمشق',
    year: '2017 – 2024',
    description: 'Specialized in Software Engineering. Graduated with a grade of 70.',
    description_de: 'Schwerpunkt Softwareentwicklung. Abschluss 2024 mit Note 70.',
    description_ar: 'تخصص هندسة البرمجيات، التخرج بدرجة 70.',
  },
  {
    _id: 'edu-hr',
    degree: 'Human Resources Manager (Course Certificate)',
    degree_de: 'Personalmanager (Kurszertifikat)',
    degree_ar: 'مدير الموارد البشرية (شهادة دورة)',
    institution: 'Alarabi Institute',
    institution_de: 'Alarabi Institut',
    institution_ar: 'المعهد العربي',
    year: '2017 – 2018',
    description: 'Organizational communication, team leadership, and HR workflows.',
    description_de: 'Organisationskommunikation, Teamführung und Personalprozesse.',
    description_ar: 'التواصل المؤسسي وقيادة الفرق وإدارة الموارد البشرية.',
  },
];

export const DEFAULT_CERTIFICATIONS: CertificationData[] = [
  {
    _id: 'cert-hr',
    name: 'Human Resources Manager Certificate',
    name_de: 'Zertifikat Personalmanager',
    name_ar: 'شهادة إدارة الموارد البشرية',
    issuer: 'Alarabi Institute',
    date: '2018',
  },
];

export const DEFAULT_PHOTOS: PhotoData[] = [
  { _id: 'photo-0', url: '/assets/gallery/Img0.jpg', title: 'Portrait & Outdoors', category: 'Life' },
  { _id: 'photo-1', url: '/assets/gallery/Img1.jpg', title: 'Goch & Niederrhein', category: 'Location' },
  { _id: 'photo-2', url: '/assets/gallery/Img2.jpg', title: 'Engineering & Community', category: 'Event' },
  { _id: 'photo-3', url: '/assets/gallery/Img3.jpg', title: 'Project Milestone', category: 'Work' },
];

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  serviceOptions: ['Full-Stack Web', 'Cloud / ERP', 'UI/UX & Frontend', 'API & Backend'],
  budgetOptions: ['< €1,000', '€1,000 – €5,000', '€5,000+', 'Full-Time / Role'],
  showExperienceSection: true,
  showPerformanceTelemetry: true,
  showProjectsSection: true,
  showSkillsSection: true,
  showBooksSection: true,
  showEducationSection: true,
  showGallerySection: true,
  showContactSection: true,
};
