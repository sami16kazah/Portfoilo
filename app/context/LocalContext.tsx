"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

export type Locale = "en" | "de" | "ar";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (typeof translations)["en"];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations = {
  en: {
    nav: {
      experience: "Experience",
      projects: "Projects",
      skills: "Stack",
      education: "Education",
      books: "Books",
      gallery: "Gallery",
      contact: "Contact",
    },
    hero: {
      badge: "Software Engineer at cloudvibe GmbH",
      viewWork: "Explore Projects",
      contactMe: "Get in Touch",
      resume: "Resume / CV",
      languagesLabel: "Languages",
      scrollHint: "Scroll to explore",
    },
    jobs: {
      eyebrow: "Experience",
      heading: "Work Experience & Performance",
      subtitle: "Current software engineering work in Germany alongside live client-side runtime metrics and cloud architecture.",
      currentBadge: "Current",
      visitCompany: "cloudvibe.de",
      highlightsTitle: "Key Responsibilities",
      stackTitle: "Technologies",
      perfTitle: "Runtime & Architecture",
      tabTelemetry: "Browser Runtime",
      tabPipeline: "System Flow",
      fpsLabel: "Display Refresh",
      fcpLabel: "First Paint",
      domLabel: "DOM Ready",
      ttfbLabel: "Response",
      motionLabel: "Compositor",
      motionActive: "Browser Performance API",
      measureNote: "Live navigation timing measured in your browser",
      pipelineSteps: [
        { title: "Web Client", detail: "Next.js server rendering & optimized assets" },
        { title: "Application Core", detail: "TypeScript APIs & GoBD validation" },
        { title: "AWS Frankfurt", detail: "Multi-tenant PostgreSQL & DSGVO" },
        { title: "Backups & Sync", detail: "Automated snapshots & marketplace feeds" },
      ],
    },
    projects: {
      eyebrow: "Projects",
      heading: "Selected Work",
      subtitle: "Switch between projects to review architecture notes, interactive modules, video clips, and team credits.",
      tabPreview: "Overview & Preview",
      tabArchitecture: "Key Features",
      tabCredits: "Credits",
      visitSite: "Visit Site",
      viewCode: "Source Code",
      demoPendingTitle: "Walkthrough Video (Coming Soon)",
      demoPendingDesc: "An earlier Shelforia walkthrough recording will be uploaded here soon. You can explore the modules below or visit shelforia.de.",
      chaptersLabel: "Video Clips",
      allProjectsLabel: "All Projects",
      inspectProject: "View Details",
    },
    skills: {
      eyebrow: "Technologies",
      heading: "Technical Stack",
      all: "All",
      categories: {
        Cloud: "Cloud & AWS",
        Frontend: "Frontend",
        Backend: "Backend",
        Database: "Database",
        Languages: "Languages",
        Tools: "Tools",
        DevOps: "DevOps",
        "Soft Skills": "Soft Skills",
      } as Record<string, string>,
    },
    education: {
      eyebrow: "Education",
      heading: "Education & Certifications",
      certHeading: "Certificates",
      viewCert: "View Certificate",
    },
    books: {
      eyebrow: "Publications",
      heading: "Published Books",
      subtitle: "Select a title to read the full synopsis and open it across digital libraries.",
      readMore: "Read full description",
      readLess: "Show less",
      publishedAt: "Available In",
      openLibrary: "Open",
      noLibraries: "Publication links will be added soon.",
      inspectBook: "Read Synopsis",
      librarySingular: "Library",
      libraryPlural: "Libraries",
    },
    gallery: {
      eyebrow: "Photos",
      heading: "Gallery",
      close: "Close preview",
    },
    contact: {
      eyebrow: "Contact",
      heading: "Get in Touch",
      subtitle: "Interested in collaborating on a web application, cloud ERP system, or engineering role? Send a message or email directly.",
      name: "Your Name",
      namePlaceholder: "John Doe",
      email: "Email Address",
      subject: "Subject",
      subjectPlaceholder: "Project or opportunity",
      message: "Message",
      servicesLabel: "Topics",
      budgetLabel: "Scope",
      send: "Send Message",
      sending: "Sending...",
      sentSuccess: "Message sent. I will get back to you soon.",
      copyEmail: "Copy Email",
      copied: "Copied",
      directEmail: "Send Email",
      locationLabel: "Based in Germany",
    },
    footer: {
      rights: "All rights reserved.",
      builtWith: "",
    },
    // Legacy compatibility keys for older components
    resume: "Resume",
    contactWord: "Contact",
    another: "Another",
    send: "Send",
    full_name: "Full name",
    email: "Email address",
    subject: "Subject",
    message: "Message",
    q1: "What services are you in need of?",
    q2: "What is your budget?",
    q3: "Tell us about your project",
    call_us_dir: "Call Us Directly at",
    chat_with_us: "Chat with Us",
    background:
      "I come from a multicultural family and have read over 200 books in politics, religion, self-improvement, and information technology. I'm a published author, have worked under contract for local clients, and actively engaged in volunteer projects.",
    languages: "Languages",
    arabic: "Arabic",
    english: "English",
    german: "German",
    about: "About",
    me: "me",
    myTechStack: "My Tech Stack",
    myPublishedBooks: "My Published Books",
    project: "project",
    educationWord: "Education",
    university: "Information technology engineer (bachelor's degree)",
    hr: "Human resources manager (course certificate)",
    slogan: ["Software", "Engineer"],
    talk: "Let's Talk",
    heading1: "Latest",
    heading2: "Featured Projects",
    short_resume:
      "Sami Kazah is an Information Technology Engineer specialized in Software Engineering and a published author in both religious studies and computer science.",
    rights: "All rights reserved.",
    certifications: "Certifications",
    photo_slogan: [
      "Liberal",
      "Honest & Transparent",
      "Critical Thinker",
      "Self-Motivated",
      "Problem Solver",
      "Accountable",
    ],
  },
  de: {
    nav: {
      experience: "Berufserfahrung",
      projects: "Projekte",
      skills: "Tech-Stack",
      education: "Ausbildung",
      books: "Bücher",
      gallery: "Galerie",
      contact: "Kontakt",
    },
    hero: {
      badge: "Softwareentwickler bei cloudvibe GmbH",
      viewWork: "Projekte entdecken",
      contactMe: "Kontakt aufnehmen",
      resume: "Lebenslauf",
      languagesLabel: "Sprachen",
      scrollHint: "Nach unten scrollen",
    },
    jobs: {
      eyebrow: "Berufserfahrung",
      heading: "Berufserfahrung & Performance",
      subtitle: "Aktuelle Position in Deutschland kombiniert mit gemessener Browser-Laufzeit und Cloud-Architektur.",
      currentBadge: "Aktuell",
      visitCompany: "cloudvibe.de",
      highlightsTitle: "Aufgaben & Schwerpunkte",
      stackTitle: "Technologien",
      perfTitle: "Laufzeit & Architektur",
      tabTelemetry: "Browser-Laufzeit",
      tabPipeline: "System-Aufbau",
      fpsLabel: "Bildwiederholrate",
      fcpLabel: "First Paint",
      domLabel: "DOM bereit",
      ttfbLabel: "Antwortzeit",
      motionLabel: "Messwert",
      motionActive: "Browser Performance API",
      measureNote: "Direkt im Browser gemessene Lade- und Renderzeiten",
      pipelineSteps: [
        { title: "Web-Client", detail: "Next.js Server-Rendering & optimierte Assets" },
        { title: "Applikationskern", detail: "TypeScript-APIs & GoBD-Prüfung" },
        { title: "AWS Frankfurt", detail: "Mandantenfähiges PostgreSQL & DSGVO" },
        { title: "Backups & Sync", detail: "Automatisierte Sicherungen & Marktplätze" },
      ],
    },
    projects: {
      eyebrow: "Projekte",
      heading: "Ausgewählte Projekte",
      subtitle: "Wählen Sie ein Projekt aus, um Architektur, Module, Demo-Videos und Team-Credits anzusehen.",
      tabPreview: "Übersicht & Vorschau",
      tabArchitecture: "Funktionen",
      tabCredits: "Mitwirkende",
      visitSite: "Website öffnen",
      viewCode: "Quellcode",
      demoPendingTitle: "Demo-Video (folgt in Kürze)",
      demoPendingDesc: "Eine frühere Video-Tour durch Shelforia wird hier demnächst hochgeladen. Bis dahin finden Sie unten die wichtigsten Module oder besuchen shelforia.de.",
      chaptersLabel: "Video-Abschnitte",
      allProjectsLabel: "Alle Projekte",
      inspectProject: "Details ansehen",
    },
    skills: {
      eyebrow: "Technologien",
      heading: "Tech-Stack",
      all: "Alle",
      categories: {
        Cloud: "Cloud & AWS",
        Frontend: "Frontend",
        Backend: "Backend",
        Database: "Datenbanken",
        Languages: "Sprachen",
        Tools: "Tools",
        DevOps: "DevOps",
        "Soft Skills": "Soft Skills",
      } as Record<string, string>,
    },
    education: {
      eyebrow: "Ausbildung",
      heading: "Ausbildung & Zertifikate",
      certHeading: "Zertifikate",
      viewCert: "Zertifikat öffnen",
    },
    books: {
      eyebrow: "Veröffentlichungen",
      heading: "Veröffentlichte Bücher",
      subtitle: "Wählen Sie ein Buch aus, um die vollständige Beschreibung und alle Bibliotheks-Links anzuzeigen.",
      readMore: "Vollständige Beschreibung lesen",
      readLess: "Weniger anzeigen",
      publishedAt: "Veröffentlicht auf",
      openLibrary: "Öffnen",
      noLibraries: "Links zu Bibliotheken werden bald ergänzt.",
      inspectBook: "Details & Links",
      librarySingular: "Bibliothek",
      libraryPlural: "Bibliotheken",
    },
    gallery: {
      eyebrow: "Fotos",
      heading: "Galerie",
      close: "Vorschau schließen",
    },
    contact: {
      eyebrow: "Kontakt",
      heading: "Kontakt",
      subtitle: "Sie planen eine Webanwendung, eine ERP-Integration oder suchen Verstärkung? Schreiben Sie mir gerne direkt.",
      name: "Ihr Name",
      namePlaceholder: "Max Mustermann",
      email: "E-Mail-Adresse",
      subject: "Betreff",
      subjectPlaceholder: "Projekt oder Anfrage",
      message: "Nachricht",
      servicesLabel: "Themen",
      budgetLabel: "Rahmen",
      send: "Nachricht senden",
      sending: "Wird gesendet...",
      sentSuccess: "Nachricht gesendet. Ich melde mich in Kürze.",
      copyEmail: "E-Mail kopieren",
      copied: "Kopiert",
      directEmail: "Per E-Mail schreiben",
      locationLabel: "Standort Deutschland",
    },
    footer: {
      rights: "Alle Rechte vorbehalten.",
      builtWith: "",
    },
    resume: "Lebenslauf",
    contactWord: "Kontakt",
    another: "Andere",
    send: "Senden",
    full_name: "Vollständiger Name",
    email: "E-Mail-Adresse",
    subject: "Betreff",
    message: "Nachricht",
    q1: "Welche Dienstleistungen benötigen Sie?",
    q2: "Wie hoch ist Ihr Budget?",
    q3: "Erzählen Sie uns von Ihrem Projekt",
    call_us_dir: "Rufen Sie uns direkt an unter",
    chat_with_us: "Chatten Sie mit uns",
    background:
      "Ich komme aus einer multikulturellen Familie und habe über 200 Bücher in den Bereichen Politik, Religion, Selbstverbesserung und Informationstechnologie gelesen.",
    languages: "Sprachen",
    arabic: "Arabisch",
    english: "Englisch",
    german: "Deutsch",
    about: "Über",
    me: "mich",
    myTechStack: "Mein Tech-Stack",
    myPublishedBooks: "Meine veröffentlichten Bücher",
    project: "Projekt",
    educationWord: "Ausbildung",
    university: "Informationstechnologie-Ingenieur (Bachelorabschluss)",
    hr: "Personalmanager (Kurszertifikat)",
    slogan: ["Software", "Ingenieur"],
    talk: "Lass uns reden",
    heading1: "Letzte",
    heading2: "Ausgewählte Projekte",
    short_resume:
      "Sami Kazah ist ein Ingenieur der Informationstechnologie mit Schwerpunkt Softwareentwicklung und veröffentlichter Fachbuchautor.",
    rights: "Alle Rechte vorbehalten.",
    certifications: "Zertifizierungen",
    photo_slogan: [
      "Liberal",
      "Ehrlich & Transparent",
      "Kritisch denkend",
      "Selbstmotiviert",
      "Lösungsorientiert",
      "Verantwortungsbewusst",
    ],
  },
  ar: {
    nav: {
      experience: "الخبرات",
      projects: "المشاريع",
      skills: "التقنيات",
      education: "التعليم",
      books: "الكتب",
      gallery: "المعرض",
      contact: "تواصل",
    },
    hero: {
      badge: "مهندس برمجيات لدى cloudvibe GmbH",
      viewWork: "استكشف المشاريع",
      contactMe: "تواصل معي",
      resume: "السيرة الذاتية",
      languagesLabel: "اللغات",
      scrollHint: "مرّر للاستكشاف",
    },
    jobs: {
      eyebrow: "الخبرات",
      heading: "الخبرة العملية والأداء",
      subtitle: "عملي الحالي في ألمانيا إلى جانب قياس سرعة المتصفح الفعلية وبنية الأنظمة السحابية.",
      currentBadge: "حالياً",
      visitCompany: "cloudvibe.de",
      highlightsTitle: "المسؤوليات الرئيسية",
      stackTitle: "التقنيات",
      perfTitle: "الأداء وبنية النظام",
      tabTelemetry: "سرعة التصفح",
      tabPipeline: "مراحل النظام",
      fpsLabel: "معدل الإطارات",
      fcpLabel: "أول رسم",
      domLabel: "جاهزية الصفحة",
      ttfbLabel: "استجابة الخادم",
      motionLabel: "المصدر",
      motionActive: "Browser Performance API",
      measureNote: "قياسات تحميل فعلية عبر واجهة المتصفح",
      pipelineSteps: [
        { title: "واجهة الويب", detail: "تصيير خادمي عبر Next.js وأصول محسّنة" },
        { title: "نواة النظام", detail: "واجهات TypeScript وتحقق GoBD" },
        { title: "AWS فرانكفورت", detail: "قواعد بيانات PostgreSQL وفق DSGVO" },
        { title: "النسخ والمزامنة", detail: "نسخ احتياطي آلي وربط الأسواق" },
      ],
    },
    projects: {
      eyebrow: "المشاريع",
      heading: "أبرز المشاريع",
      subtitle: "اختر مشروعاً للاطلاع على التفاصيل التقنية، الوحدات التفاعلية، ومقاطع الفيديو وفريق العمل.",
      tabPreview: "نظرة عامة",
      tabArchitecture: "المزايا الرئيسية",
      tabCredits: "فريق العمل",
      visitSite: "زيارة الموقع",
      viewCode: "الكود المصدري",
      demoPendingTitle: "فيديو توضيحي (قريباً)",
      demoPendingDesc: "سيتم رفع تسجيل فيديو قديم لمنصة Shelforia هنا لاحقاً. يمكنك استعراض الوحدات أدناه أو زيارة shelforia.de.",
      chaptersLabel: "مقاطع الفيديو",
      allProjectsLabel: "كل المشاريع",
      inspectProject: "عرض التفاصيل",
    },
    skills: {
      eyebrow: "التقنيات",
      heading: "التقنيات والأدوات",
      all: "الكل",
      categories: {
        Cloud: "السحابة و AWS",
        Frontend: "الواجهات الأمامية",
        Backend: "الخوادم والخلفيات",
        Database: "قواعد البيانات",
        Languages: "لغات البرمجة",
        Tools: "الأدوات",
        DevOps: "DevOps",
        "Soft Skills": "المهارات الشخصية",
      } as Record<string, string>,
    },
    education: {
      eyebrow: "التعليم",
      heading: "التعليم والشهادات",
      certHeading: "الشهادات",
      viewCert: "عرض الشهادة",
    },
    books: {
      eyebrow: "المؤلفات",
      heading: "الكتب المنشورة",
      subtitle: "اختر أي كتاب لقراءة الوصف الكامل واستعراض روابطه في المكتبات والمنصات الرقمية.",
      readMore: "قراءة الوصف كاملاً",
      readLess: "عرض أقل",
      publishedAt: "متوفر في المكتبات التالية",
      openLibrary: "فتح",
      noLibraries: "ستُضاف روابط المكتبات قريباً.",
      inspectBook: "عرض التفاصيل والروابط",
      librarySingular: "مكتبة",
      libraryPlural: "مكتبات",
    },
    gallery: {
      eyebrow: "الصور",
      heading: "المعرض",
      close: "إغلاق المعاينة",
    },
    contact: {
      eyebrow: "التواصل",
      heading: "تواصل معي",
      subtitle: "هل لديك مشروع ويب، نظام سحابي، أو فرصة عمل هندسية؟ أرسل رسالة مباشرة أو راسلني عبر البريد.",
      name: "الاسم",
      namePlaceholder: "اسمك الكامل",
      email: "البريد الإلكتروني",
      subject: "الموضوع",
      subjectPlaceholder: "مشروع أو استفسار",
      message: "الرسالة",
      servicesLabel: "المجالات",
      budgetLabel: "النطاق",
      send: "إرسال الرسالة",
      sending: "جاري الإرسال...",
      sentSuccess: "تم إرسال رسالتك. سأرد عليك قريباً.",
      copyEmail: "نسخ البريد",
      copied: "تم النسخ",
      directEmail: "مراسلة عبر البريد",
      locationLabel: "مقيم في ألمانيا",
    },
    footer: {
      rights: "جميع الحقوق محفوظة.",
      builtWith: "",
    },
    resume: "السيرة الذاتية",
    contactWord: "تواصل",
    another: "أخرى",
    send: "إرسال",
    full_name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    subject: "الموضوع",
    message: "الرسالة",
    q1: "ما هي الخدمات التي تحتاجها؟",
    q2: "ما هي ميزانيتك؟",
    q3: "أخبرنا عن مشروعك",
    call_us_dir: "اتصل بنا مباشرة على",
    chat_with_us: "دردش معنا",
    background:
      "أنحدر من عائلة متعددة الثقافات وقرأت أكثر من 200 كتاب في السياسة والدين وتطوير الذات وتكنولوجيا المعلومات.",
    languages: "اللغات",
    arabic: "العربية",
    english: "الإنجليزية",
    german: "الألمانية",
    about: "حول",
    me: "أنا",
    myTechStack: "التقنيات التي أستخدمها",
    myPublishedBooks: "كتبي المنشورة",
    project: "مشروع",
    educationWord: "التعليم",
    university: "مهندس تكنولوجيا المعلومات (درجة البكالوريوس)",
    hr: "مدير الموارد البشرية (شهادة دورة)",
    slogan: ["مهندس", "برمجيات"],
    talk: "لنتحدث",
    heading1: "أحدث",
    heading2: "أبرز المشاريع",
    short_resume:
      "سامي قزح هو مهندس تكنولوجيا معلومات متخصص في هندسة البرمجيات ومؤلف منشور في الدراسات الدينية وعلوم الحاسوب.",
    rights: "جميع الحقوق محفوظة.",
    certifications: "الشهادات",
    photo_slogan: [
      "ليبرالي",
      "صادق وشفاف",
      "مفكر نقدي",
      "مدفوع ذاتيًا",
      "حلال مشاكل",
      "مسؤول",
    ],
  },
};

const LOCALE_ROUTES = new Set(["/", "/en", "/de", "/ar"]);

function getLocaleFromPathname(pathname: string | null): Locale | null {
  if (!pathname) return null;
  if (pathname === "/ar" || pathname.startsWith("/ar/")) return "ar";
  if (pathname === "/de" || pathname.startsWith("/de/")) return "de";
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return null;
}

export const LocaleProvider = ({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathLocale = getLocaleFromPathname(pathname);
  const [locale, setLocaleState] = useState<Locale>(pathLocale ?? initialLocale);

  useEffect(() => {
    if (pathLocale) {
      setLocaleState(pathLocale);
    }
  }, [pathLocale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    if (pathname && LOCALE_ROUTES.has(pathname)) {
      const target = `/${nextLocale}`;
      if (pathname !== target) {
        router.push(target, { scroll: false });
      }
    }
  };

  const toggleLocale = () => {
    const next: Locale = locale === "en" ? "de" : locale === "de" ? "ar" : "en";
    setLocale(next);
  };

  const t = translations[locale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
