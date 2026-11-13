import featured_data from "./featured_data";

export const DEFAULT_PROFILE = {
  name: "Sami Kazah",
  name_de: "Sami Kazah",
  name_ar: "سامي قزح",
  title: "Software & Full-Stack Engineer",
  title_de: "Software- & Full-Stack-Entwickler",
  title_ar: "مهندس برمجيات ومطور متكامل",
  bio: [
    "Information Technology Engineer specialized in Software Engineering, published computer science author, and current full-stack software builder at cloudvibe GmbH in Goch, Germany.",
    "Co-architect and developer of shelforia.de — a cloud ERP platform for antiquarian booksellers and art dealers hosted in Frankfurt — combining resilient backend design with fast, accessible user interfaces.",
  ],
  bio_de: [
    "Ingenieur für Informationstechnologie mit Schwerpunkt Software Engineering, veröffentlichter Fachbuchautor und aktuell Softwareentwickler bei der cloudvibe GmbH in Goch.",
    "Mitentwickler und Planer von shelforia.de — einer Cloud-Warenwirtschaft für Antiquariate und Kunsthandel mit Hosting in Frankfurt — mit Fokus auf Performance, GoBD-Sicherheit und moderne UX.",
  ],
  bio_ar: [
    "مهندس تكنولوجيا معلومات متخصص في هندسة البرمجيات، ومؤلف منشور في علوم الحاسوب، وأعمل حالياً في تطوير البرمجيات والأنظمة السحابية لدى cloudvibe GmbH في ألمانيا.",
    "مشارك في التخطيط والتطوير الكامل لمنصة shelforia.de — منصة تخطيط موارد سحابية مخصصة لمتاجر الكتب النادرة والتحف الفنية — مع تركيز على الأداء العالي وتجربة المستخدم الحديثة.",
  ],
  email: "samkazah444@gmail.com",
  phone: "",
  avatarUrl: "/assets/images/sami.jpg",
  cvUrl: "",
  socialLinks: {
    github: "https://github.com/sami16kazah",
    linkedin: "https://www.linkedin.com/in/sami-kazah-6aa67648/",
    twitter: "",
    instagram: "",
  },
  languages: [
    { name: "Arabic", name_de: "Arabisch", name_ar: "العربية", proficiency: "C2" },
    { name: "English", name_de: "Englisch", name_ar: "الإنجليزية", proficiency: "B2" },
    { name: "German", name_de: "Deutsch", name_ar: "الألمانية", proficiency: "B1" },
  ],
};

export const DEFAULT_JOBS = [
  {
    _id: "job-cloudvibe-current",
    company: "cloudvibe GmbH",
    companyUrl: "https://cloudvibe.de/",
    logoUrl: "/assets/companies/cloudvibe-logo.webp",
    role: "Software Engineer & Cloud Systems Developer",
    role_de: "Softwareentwickler & Cloud-Systementwickler",
    role_ar: "مهندس برمجيات ومطور أنظمة سحابية",
    location: "Goch, Germany",
    location_de: "Goch, Deutschland",
    location_ar: "غوخ، ألمانيا",
    employmentType: "Current Role",
    startDate: "2025",
    endDate: "Present",
    isCurrent: true,
    summary:
      "Building cloud software products and supporting managed IT infrastructure for SMEs, healthcare practices, and specialized commerce at cloudvibe GmbH — including full-stack engineering of shelforia.de.",
    summary_de:
      "Entwicklung von Cloud-Softwareprodukten und Unterstützung von Managed-IT-Infrastrukturen für KMU, Arztpraxen, Apotheken und den Fachhandel bei der cloudvibe GmbH — inklusive der Full-Stack-Entwicklung von shelforia.de.",
    summary_ar:
      "تطوير منتجات برمجية سحابية ودعم البنية التحتية المُدارة للشركات الصغيرة والمتوسطة والقطاع الصحي والتجاري لدى cloudvibe GmbH، بما في ذلك التطوير المتكامل لمنصة shelforia.de.",
    highlights: [
      "Planned & fully developed shelforia.de cloud ERP alongside Lukas Kowal with the help of Leon Kuck.",
      "Engineered GoBD-compliant billing, XRechnung / ZUGFeRD validation, and multi-marketplace sync workflows.",
      "Contributed to cloud-native architecture hosted on AWS Frankfurt with strict tenant isolation & DSGVO compliance.",
      "Collaborated across managed infrastructure, automated backup pipelines, and business software integrations.",
    ],
    highlights_de: [
      "Gemeinsame Planung & vollständige Entwicklung der Cloud-Warenwirtschaft shelforia.de mit Lukas Kowal und Unterstützung von Leon Kuck.",
      "Entwicklung GoBD-konformer Belegprozesse, XRechnung-/ZUGFeRD-Prüfung und Marktplatz-Synchronisation.",
      "Mitarbeit an mandantenfähiger Cloud-Architektur auf AWS Frankfurt nach DSGVO-Standards.",
      "Integration von Managed Infrastructure, automatisierten Backup-Strategien und Branchenlösungen.",
    ],
    highlights_ar: [
      "التخطيط والتطوير الكامل لمنصة shelforia.de السحابية بالشراكة مع لوكاس كوفال وبمساعدة ليون كوك.",
      "هندسة الفوترة المتوافقة مع معايير GoBD و XRechnung / ZUGFeRD ومزامنة الأسواق الإلكترونية.",
      "المساهمة في بنية سحابية متعددة المستأجرين مستضافة على AWS فرانكفورت وفق معايير الخصوصية DSGVO.",
      "العمل ضمن منظومة البنية التحتية المُدارة والنسخ الاحتياطي الآلي وتكامل برمجيات الأعمال.",
    ],
    techStack: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "AWS Frankfurt",
      "GoBD / XRechnung",
      "Managed Cloud",
    ],
    performanceMetrics: [
      {
        label: "Cloud Region",
        label_de: "Cloud-Region",
        label_ar: "المنطقة السحابية",
        value: "AWS Frankfurt",
        detail: "DSGVO multi-tenant hosting",
        detail_de: "DSGVO-konformes Multi-Tenant-Hosting",
        detail_ar: "استضافة متوافقة مع الخصوصية",
      },
      {
        label: "Compliance Core",
        label_de: "Compliance-Kern",
        label_ar: "الامتثال المحاسبي",
        value: "GoBD + EN 16931",
        detail: "Immutable ledger & E-Invoicing",
        detail_de: "Unveränderliche Belege & E-Rechnung",
        detail_ar: "سجلات غير قابلة للتعديل وفوترة إلكترونية",
      },
      {
        label: "Core Domains",
        label_de: "Kernbereiche",
        label_ar: "المجالات الأساسية",
        value: "IT · TI · ERP",
        detail: "Managed IT, healthcare & SaaS",
        detail_de: "Managed IT, Gesundheitswesen & SaaS",
        detail_ar: "بنية تحتية وقطاع صحي وبرمجيات سحابية",
      },
    ],
    featured: true,
    order: 0,
  },
];

export const DEFAULT_PROJECTS = [
  {
    _id: "project-shelforia",
    title: "shelforia",
    title_de: "shelforia",
    title_ar: "shelforia — شيلفوريا",
    subtitle: "Cloud ERP for Antiquarian Booksellers & Art Dealers",
    subtitle_de: "Cloud-Warenwirtschaft für Antiquariat & Kunsthandel",
    subtitle_ar: "نظام إدارة موارد سحابي لمتاجر الكتب النادرة والتحف الفنية",
    description: [
      "shelforia is a specialized cloud ERP and inventory management platform built for antiquarian booksellers, art galleries, and autograph dealers — running directly in the browser on AWS Frankfurt.",
      "It unifies catalog & desiderata management, GoBD-compliant invoicing, XRechnung & ZUGFeRD e-invoicing validation, § 25a UStG differential taxation, EU-OSS/UStVA/ZM tax reports, marketplace integrations (eBay, AbeBooks / ZVAB, Booklooker), DHL shipping labels, and PayPal/bank reconciliation.",
    ],
    description_de: [
      "shelforia ist eine spezialisierte Cloud-Warenwirtschaft für Antiquariate, Kunst- und Autographenhandel — direkt im Browser betrieben auf AWS Frankfurt.",
      "Die Plattform vereint Bestands- und Desiderata-Verwaltung, GoBD-konforme Belegerstellung, XRechnung & ZUGFeRD, Differenzbesteuerung (§ 25a UStG), EU-OSS/UStVA/ZM, Marktplatz-Anbindungen (eBay, AbeBooks / ZVAB, Booklooker), DHL-Versand sowie PayPal- und Bankabgleich.",
    ],
    description_ar: [
      "shelforia هي منصة سحابية متخصصة لإدارة المخزون والموارد (ERP) موجهة لمتاجر الكتب النادرة والمعارض الفنية وتجارة المخطوطات، وتعمل مباشرة عبر المتصفح على خوادم AWS في فرانكفورت.",
      "تجمع المنصة إدارة الكتالوجات وطلبات البحث، والفوترة المتوافقة مع معايير GoBD، والفاتورة الإلكترونية XRechnung و ZUGFeRD، والضرائب التفاضلية الأوروبية، والربط المباشر مع أسواق eBay و AbeBooks / ZVAB و Booklooker وشحن DHL.",
    ],
    credits: "Planned & fully developed by Sami Kazah and Lukas Kowal, with the help of Leon Kuck.",
    credits_de: "Geplant und vollständig entwickelt von Sami Kazah und Lukas Kowal, mit Unterstützung von Leon Kuck.",
    credits_ar: "تم التخطيط والتطوير بالكامل بواسطة سامي قزح ولوكاس كوفال، بمساعدة ليون كوك.",
    highlights: [
      "Inventory, Catalogs & Desiderata tracking for unique collectibles",
      "GoBD-immutable invoices + GDPdU audit export",
      "XRechnung (EN 16931) & ZUGFeRD automated validation",
      "§ 25a UStG Differential Tax, EU-OSS, UStVA & ZM reporting",
      "Live sync with eBay, AbeBooks / ZVAB, Booklooker & DHL",
      "Multi-tenant DSGVO hosting in AWS Frankfurt under cloudvibe GmbH",
    ],
    highlights_de: [
      "Bestand, Kataloge & Desiderata für Unikate und Sammlerstücke",
      "GoBD-unveränderliche Belege & GDPdU-Export für Betriebsprüfungen",
      "XRechnung (EN 16931) & ZUGFeRD mit Pflichtfeld-Prüfung",
      "§ 25a UStG Differenzbesteuerung, EU-OSS, UStVA & ZM",
      "Anbindung an eBay, AbeBooks / ZVAB, Booklooker & DHL",
      "Mandantenfähiges DSGVO-Hosting in AWS Frankfurt durch cloudvibe",
    ],
    highlights_ar: [
      "إدارة المخزون والكتالوجات وطلبات الاقتناء الخاصة بالمقتنيات الفريدة",
      "فواتير غير قابلة للتعديل متوافقة مع GoBD وتصدير التدقيق GDPdU",
      "دعم كامل للفوترة الإلكترونية XRechnung و ZUGFeRD",
      "حساب ضريبة الهامش § 25a UStG وتقارير EU-OSS و UStVA",
      "ربط مباشر مع eBay و AbeBooks / ZVAB و Booklooker وشحن DHL",
      "استضافة متعددة المستأجرين متوافقة مع GDPR في AWS فرانكفورت",
    ],
    tags: [
      "TypeScript",
      "React",
      "PostgreSQL",
      "AWS Frankfurt",
      "GoBD / XRechnung",
      "Multi-Tenant ERP",
    ],
    demoUrl: "https://shelforia.de/",
    repoUrl: "",
    videoUrl: "",
    videoChapters: [],
    imageUrl: "/assets/projects/shelforia-og.png",
    logoUrl: "/assets/projects/shelforia-logo.svg",
    brandColor: "#24423A",
    demoStatus: "coming_soon",
    featured: true,
    date: "2025 – Present",
  },
  {
    _id: "project-de-gastuin",
    title: "De Gastuin E-Commerce & Event Platform",
    title_de: "De Gastuin E-Commerce & Event-Plattform",
    title_ar: "منصة De Gastuin للتجارة الإلكترونية والفعاليات",
    subtitle: "Modular Event Ticketing, Shop & Real-Time Admin Studio",
    subtitle_de: "Modulare Event-Ticketing-, Shop- & Admin-Plattform",
    subtitle_ar: "منصة متكاملة لإدارة الفعاليات والتذاكر والمتجر الإلكتروني",
    description: [
      "Comprehensive event management and e-commerce platform built with a responsive attendee storefront and a modular real-time admin control panel.",
      "Includes live homepage hero editing without redeployment, PDF invoice generation, coupon-enabled ticket checkout, drink/shop ordering, and a dynamic FAQ WYSIWYG editor.",
    ],
    description_de: [
      "Umfassende Event-Management- und E-Commerce-Plattform mit reaktionsschnellem Frontend und vollständig anpassbarem Echtzeit-Admin-Dashboard.",
      "Beinhaltet Live-Bearbeitung der Startseite ohne Redeployment, PDF-Rechnungserstellung, Ticket-Kauf mit Gutscheinen, Shop-Checkout und dynamisches FAQ-System.",
    ],
    description_ar: [
      "منصة شاملة لإدارة الفعاليات والتجارة الإلكترونية، توفر واجهة مستخدم سريعة للزوار ولوحة تحكم معيارية متقدمة للمشرفين.",
      "تتضمن تحديث الصفحة الرئيسية في الوقت الفعلي دون إعادة نشر، وإصدار فواتير PDF، وشراء التذاكر مع القسائم، وطلب المشروبات، ومحرر الأسئلة الشائعة.",
    ],
    credits: "Developed by Sami Kazah.",
    credits_de: "Entwickelt von Sami Kazah.",
    credits_ar: "تطوير سامي قزح.",
    highlights: [
      "Modular Admin Dashboard with instant live updates",
      "Automated PDF invoice generation & downloads",
      "Event ticketing with coupon redemption & shop checkout",
      "Full CRUD for events, users, media & FAQs",
    ],
    highlights_de: [
      "Modulares Admin-Dashboard mit Echtzeit-Aktualisierungen",
      "Automatische PDF-Rechnungserstellung & Downloads",
      "Event-Ticketing mit Gutscheinen & Shop-Checkout",
      "Vollständige CRUD-Verwaltung für Events, Nutzer, Medien & FAQs",
    ],
    highlights_ar: [
      "لوحة تحكم إدارية مرنة مع تحديثات فورية",
      "توليد وتحميل فواتير PDF تلقائياً",
      "نظام حجز التذاكر مع القسائم ومتجر الطلبات",
      "إدارة كاملة للفعاليات والمستخدمين والوسائط والأسئلة الشائعة",
    ],
    tags: ["Next.js", "React", "MongoDB", "Cloudinary", "PDF Invoices"],
    demoUrl: "",
    repoUrl: "",
    videoUrl: featured_data[0]?.video || "",
    videoChapters: featured_data.map((item) => ({
      title: item.title,
      url: item.video,
    })),
    imageUrl: "",
    logoUrl: "",
    brandColor: "#4F46E5",
    demoStatus: "live",
    featured: true,
    date: "Jan – Jun 2025",
  },
  {
    _id: "project-tcp-erp",
    title: "TCP-ERP",
    title_de: "TCP-ERP",
    title_ar: "TCP-ERP — منصة اللوجستيات",
    subtitle: "Collaborative Retail Logistics & Real-Time Driver Network",
    subtitle_de: "Kollaborative Einzelhandelslogistik- & Fahrerplattform",
    subtitle_ar: "منصة لوجستية تعاونية لتجارة التجزئة والتتبع الفوري",
    description: [
      "Collegiate capstone platform engineered to streamline retail supply chains by connecting dealers and companies with a real-time network of freelance drivers.",
      "Focused on real-time tracking, route coordination, and multi-client logistics dashboards across web and mobile apps.",
    ],
    description_de: [
      "Hochschulabschlussprojekt zur Optimierung von Einzelhandels-Lieferketten durch Vernetzung von Unternehmen und freiberuflichen Fahrern in Echtzeit.",
      "Schwerpunkt auf Echtzeit-Synchronisation, Routenplanung und Multi-Client-Logistik-Dashboards für Web und Mobile.",
    ],
    description_ar: [
      "مشروع تخرج هندسي صُمم لتبسيط سلاسل الإمداد لمتاجر التجزئة عبر ربط الشركات بشبكة سائقين مستقلين في الوقت الفعلي.",
      "يركز على التتبع اللحظي وتنسيق المسارات ولوحات التحكم اللوجستية عبر تطبيقات الويب والموبايل.",
    ],
    credits:
      "Team: Sami Kazah (Real-Time), Basel Hijazi (UI/UX & Flutter), Ahmad Zaza (Backend), Tarik Nashawati (Flutter), Hamze Al Hindi (Angular) — Supervised by Dr. Rawan Qaraouni.",
    credits_de:
      "Team: Sami Kazah (Echtzeit), Basel Hijazi (UI/UX & Flutter), Ahmad Zaza (Backend), Tarik Nashawati (Flutter), Hamze Al Hindi (Angular) — Betreut von Dr. Rawan Qaraouni.",
    credits_ar:
      "الفريق: سامي قزح (التطوير الفوري)، باسل حجازي، أحمد زازا، طارق نشواتي، حمزة الهندي — إشراف د. روان قرعوني.",
    highlights: [
      "Real-time shipment & driver state updates",
      "Multi-platform architecture (Angular Web + Flutter Mobile)",
      "Supply chain scheduling & fulfillment tracking",
    ],
    highlights_de: [
      "Echtzeit-Statusaktualisierungen für Lieferungen & Fahrer",
      "Multi-Plattform-Architektur (Angular Web + Flutter Mobile)",
      "Lieferketten-Planung & Auftragsverfolgung",
    ],
    highlights_ar: [
      "تحديثات فورية لحالة الشحنات والسائقين",
      "بنية متعددة المنصات (Angular للويب و Flutter للموبايل)",
      "جدولة سلاسل الإمداد ومتابعة التنفيذ",
    ],
    tags: ["Real-Time", "Angular", "Flutter", "Backend API", "Supply Chain"],
    demoUrl: "",
    repoUrl: "",
    videoUrl: "",
    videoChapters: [],
    imageUrl: "",
    logoUrl: "",
    brandColor: "#0EA5E9",
    demoStatus: "ready",
    featured: true,
    date: "2024",
  },
];

export const DEFAULT_SKILLS = [
  { _id: "sk-ts", name: "TypeScript", category: "Frontend", proficiency: 92, icon: "/assets/stack/java-script.png" },
  { _id: "sk-next", name: "Next.js", category: "Frontend", proficiency: 92, icon: "/assets/stack/Next.js.png" },
  { _id: "sk-react", name: "React", category: "Frontend", proficiency: 94, icon: "/assets/stack/react.png" },
  { _id: "sk-tw", name: "Tailwind CSS", category: "Frontend", proficiency: 92, icon: "/assets/stack/Tailwind CSS.png" },
  { _id: "sk-node", name: "Node.js", category: "Backend", proficiency: 88, icon: "/assets/stack/programing.png" },
  { _id: "sk-spring", name: "Spring Boot", category: "Backend", proficiency: 80, icon: "/assets/stack/Spring.png" },
  { _id: "sk-pg", name: "PostgreSQL", category: "Database", proficiency: 86, icon: "/assets/stack/postgre.png" },
  { _id: "sk-mongo", name: "MongoDB", category: "Database", proficiency: 88, icon: "/assets/stack/MongoDB.png" },
  { _id: "sk-mysql", name: "MySQL", category: "Database", proficiency: 84, icon: "/assets/stack/mysql.png" },
  { _id: "sk-java", name: "Java", category: "Languages", proficiency: 84, icon: "/assets/stack/java.png" },
  { _id: "sk-py", name: "Python", category: "Languages", proficiency: 80, icon: "/assets/stack/Python.png" },
  { _id: "sk-c", name: "C / C++", category: "Languages", proficiency: 78, icon: "/assets/stack/c.png" },
  { _id: "sk-ue", name: "Unreal Engine", category: "Tools", proficiency: 70, icon: "/assets/stack/Unreal Engine.png" },
];

export const DEFAULT_EDUCATION = [
  {
    _id: "edu-damascus",
    degree: "Information Technology Engineer (Bachelor's Degree)",
    degree_de: "Ingenieur der Informationstechnologie (Bachelorabschluss)",
    degree_ar: "مهندس تكنولوجيا المعلومات (درجة البكالوريوس)",
    institution: "Damascus University",
    institution_de: "Universität Damaskus",
    institution_ar: "جامعة دمشق",
    year: "2017 – 2024",
    description: "Specialized in Software Engineering. Graduated with a grade of 70.",
    description_de: "Schwerpunkt Softwareentwicklung. Abschluss 2024 mit Note 70.",
    description_ar: "تخصص هندسة البرمجيات، التخرج بدرجة 70.",
  },
  {
    _id: "edu-hr",
    degree: "Human Resources Manager (Course Certificate)",
    degree_de: "Personalmanager (Kurszertifikat)",
    degree_ar: "مدير الموارد البشرية (شهادة دورة)",
    institution: "Alarabi Institute",
    institution_de: "Alarabi Institut",
    institution_ar: "المعهد العربي",
    year: "2017 – 2018",
    description: "Organizational communication, team leadership, and HR workflows.",
    description_de: "Organisationskommunikation, Teamführung und Personalprozesse.",
    description_ar: "التواصل المؤسسي وقيادة الفرق وإدارة الموارد البشرية.",
  },
];

export const DEFAULT_CERTIFICATIONS = [
  {
    _id: "cert-hr",
    name: "Human Resources Manager Certificate",
    name_de: "Zertifikat Personalmanager",
    name_ar: "شهادة إدارة الموارد البشرية",
    issuer: "Alarabi Institute",
    date: "2018",
    link: "",
  },
];

export const DEFAULT_BOOKS = [
  {
    _id: "book-design-patterns",
    title: "Design Patterns in Arabic",
    title_de: "Design Patterns auf Arabisch",
    title_ar: "أنماط التصميم (Design Patterns) باللغة العربية",
    description: "Practical software architecture & GoF design patterns guide (7,000+ downloads).",
    description_de: "Praxisleitfaden für Softwarearchitektur & Entwurfsmuster (7.000+ Downloads).",
    description_ar: "دليل عملي لهندسة البرمجيات وأنماط التصميم البرمجية (أكثر من 7 آلاف تحميل).",
    link: "https://www.kotobati.com/book/design-patterns-arabic",
    coverUrl: "",
  },
  {
    _id: "book-antlr",
    title: "Compilers Using ANTLR in Arabic",
    title_de: "Compilerbau mit ANTLR auf Arabisch",
    title_ar: "كتاب المترجمات باستخدام الـ ANTLR",
    description: "Hands-on compiler construction, lexers, parsers, and ASTs (6,000+ downloads).",
    description_de: "Praxisnahe Einführung in Compilerbau, Lexer, Parser & ASTs (6.000+ Downloads).",
    description_ar: "مقدمة تطبيقية لبناء المترجمات والتحليل النحوي (أكثر من 6 آلاف تحميل).",
    link: "https://www.kotobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D9%85%D8%AA%D8%B1%D8%AC%D9%85%D8%A7%D8%AA-%D8%A8%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85-%D8%A7%D9%84-antlr",
    coverUrl: "",
  },
  {
    _id: "book-comparative",
    title: "Islam and Terrorism (Comparative Studies)",
    title_de: "Islam und Terrorismus (Studie)",
    title_ar: "كتاب الإسلام والإرهاب",
    description: "Published analytical book in religious & cultural studies (5,000+ downloads).",
    description_de: "Veröffentlichtes Fachbuch im Bereich Religions- und Kulturstudien (5.000+ Downloads).",
    description_ar: "كتاب تحليلي منشور في الدراسات الدينية والفكرية (أكثر من 5 آلاف تحميل).",
    link: "https://www.kotobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85-%D9%88%D8%A7%D9%84%D8%A5%D8%B1%D9%87%D8%A7%D8%A8",
    coverUrl: "",
  },
];

export const DEFAULT_PHOTOS = [
  { _id: "photo-0", url: "/assets/gallery/Img0.jpg", title: "Portrait & Workspace", category: "Work" },
  { _id: "photo-1", url: "/assets/gallery/Img1.jpg", title: "Engineering Session", category: "Event" },
  { _id: "photo-2", url: "/assets/gallery/Img2.jpg", title: "Conference & Community", category: "Life" },
  { _id: "photo-3", url: "/assets/gallery/Img3.jpg", title: "Project Milestone", category: "Work" },
];

function normalizeKey(value?: string) {
  return (value || "").trim().toLowerCase();
}

export function mergeWithDefaults<T extends Record<string, unknown>>(
  dbItems: T[],
  defaults: T[],
  keyField: keyof T
): T[] {
  if (!dbItems || dbItems.length === 0) return defaults;
  const existingKeys = new Set(dbItems.map((item) => normalizeKey(String(item[keyField] || ""))));
  const missingDefaults = defaults.filter(
    (defItem) => !existingKeys.has(normalizeKey(String(defItem[keyField] || "")))
  );
  return [...missingDefaults, ...dbItems];
}

export function mergeProfileWithDefaults(dbProfile: Record<string, unknown> | null) {
  if (!dbProfile) return DEFAULT_PROFILE;

  const socialDb = (dbProfile.socialLinks as Record<string, string> | undefined) || {};
  const languagesDb = Array.isArray(dbProfile.languages) && dbProfile.languages.length > 0
    ? dbProfile.languages
    : DEFAULT_PROFILE.languages;

  return {
    ...DEFAULT_PROFILE,
    ...dbProfile,
    name: (dbProfile.name as string) || DEFAULT_PROFILE.name,
    title: (dbProfile.title as string) || DEFAULT_PROFILE.title,
    bio: Array.isArray(dbProfile.bio) && dbProfile.bio.length > 0 ? dbProfile.bio : DEFAULT_PROFILE.bio,
    email: (dbProfile.email as string) || DEFAULT_PROFILE.email,
    avatarUrl: (dbProfile.avatarUrl as string) || DEFAULT_PROFILE.avatarUrl,
    socialLinks: {
      github: socialDb.github || DEFAULT_PROFILE.socialLinks.github,
      linkedin: socialDb.linkedin || DEFAULT_PROFILE.socialLinks.linkedin,
      twitter: socialDb.twitter || "",
      instagram: socialDb.instagram || "",
    },
    languages: languagesDb,
  };
}

