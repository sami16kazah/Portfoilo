"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Locale = "en" | "de" | "ar";

interface LocaleContextType {
  locale: Locale;
  toggleLocale: () => void;
  t: (typeof translations)["en"];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);
const translations = {
  en: {
    resume: "Resume",
    contact: "Contact ",
    another: "Another",
    send: "send",
    full_name: "full name",
    email: "email address",
    subject: "subject",
    message: "message",
    q1: "What services are you in need of?",
    q2: "What is your budget?",
    q3: "tell us about your project",
    call_us_dir: "Call Us Directly at",
    chat_with_us: "Chat with Us",
    background: `I come from a multicultural family and have read over 200 books in politics, religion, self-improvement, and information technology. I'm a published author, have worked under contract for local clients, and actively engaged in various volunteer projects throughout my life.`,
    languages: "Languages",
    arabic: "Arabic",
    english: "English",
    german: "German",
    about: "About",
    me: "me",
    myTechStack: "My Tech Stack",
    myPublishedBooks: "My published books",
    project: "project",
    education: "Education",
    university: "Information technology engineer (bachelor's degree)",
    hr: "Human resources manager (course certifcate)",
    slogan: ["Software", "Engineer"],
    talk: "Let's Talk",
    heading1: "Latest",
    heading2: "Project",
    cardTitle: "De Gastuin ecommerce platform",
    description: [
      "This website serves as a comprehensive event management platform designed for both attendees and administrators. The frontend delivers a polished, responsive user experience, while the backend is empowered by a robust, highly customizable dashboard for management control.",
      "🛠️ Core Features & Functionality",
      "• Customizable Admin Dashboard: Fully modular UI. Admins can reconfigure layouts, widgets, and content sections on the fly.",
      "• Dynamic Homepage Main Event: Admins can update the homepage banner (title, description, image, link) in real-time without redeployment.",
      "• Invoice Management: Admins can generate and download invoices in PDF format directly from the dashboard.",
      "• Flexible FAQ System: FAQs can be added, edited, reordered, or removed on any page using a built-in WYSIWYG editor.",
      "• Event, User & Content Controls: Full CRUD (Create, Read, Update, Delete) support for events, users, and media assets.",
      "🌐 UX and Design Highlights",
      "• Responsive & Intuitive Interface: Clean, mobile-friendly design with smooth navigation.",
      "• Real-Time Feedback: Changes made by admins are instantly reflected on the live site.",
      "• Clear Data Presentation: Structured data tables, charts, and downloads for admin use.",
      "✅ Why It Stands Out",
      "• End-to-End Control: Full control over promotional content, invoices, and structure.",
      "• Scalability: Built with modular architecture for future expansion.",
      "• User-Centric Approach: Designed to provide attendees with a seamless, informative experience.",
    ],
    tcp_card_title: "TCP-ERP",
    tcp: [
      "🚛 TCP-ERP: A Collaborative Retail Logistics Platform, an innovative platform, was developed as my collegiate capstone project.",
      "🔧 It is meticulously designed to streamline the logistics process for retail dealers and companies.",
      "🌐 By leveraging a network of freelance drivers, TCP-ERP facilitates the efficient movement of goods and supplies, ensuring a seamless supply chain management experience.",
      "👥 This project was brought to fruition through the collective expertise of a team of highly skilled professionals:",
      "🎨 Basel Hijazi: Spearheaded the UI/UX design and Flutter development.",
      "🖥️ Ahmad Zaza: Expertly managed and implemented the backend development.",
      "⚡ Sami Kazah: Specialized in realtime development.",
      "📱 Tarik Nashawati: Contributed significantly as a Flutter Developer.",
      "🌐 Hamze Al Hindi: Specialized in Angular development, enhancing the platform’s functionality.",
      "👩‍🏫 Supervised by Dr. Rawan Qaraouni.",
    ],
    photo_slogan: [
      "Liberal",
      "Honest & Transparent ",
      "Critical Thinker",
      "Self-Motivated",
      "Problem Solver",
      "Accountable ",
    ],
    short_resume: `Sami Kazah is an Information Technology Engineer specialized in Software Engineering, graduated with a grade of 70. He is also a published author in both religious studies and computer science.

 he has built scalable and robust applications for local businesses, combining front-end and back-end technologies with a strong problem-solving mindset.`,
    rights: "All rights reserved.",
    gallery: "Gallery",
    certifications: "Certifications",
  },
  de: {
    resume: "Lebenslauf",
    background: `Ich komme aus einer multikulturellen Familie und habe über 200 Bücher in den Bereichen Politik, Religion, Selbstverbesserung und Informationstechnologie gelesen. Ich bin veröffentlichter Autor, habe für lokale Kunden auf Vertragsbasis gearbeitet und mich in zahlreichen ehrenamtlichen Projekten engagiert.`,
    another: "Andere",
    contact: "Kontaktiere",
    send: "senden",
    full_name: "vollständiger Name",
    email: "E-Mail-Adresse",
    subject: "Betreff",
    message: "Nachricht",
    q1: "Welche Dienstleistungen benötigen Sie?",
    q2: "Wie hoch ist Ihr Budget?",
    q3: "Erzählen Sie uns von Ihrem Projekt",
    call_us_dir: "Rufen Sie uns direkt an unter",
    chat_with_us: "Chatten Sie mit uns",
    languages: "Sprachen",
    arabic: "Arabisch",
    english: "Englisch",
    german: "Deutsch",
    myPublishedBooks: "Meine veröffentlichten Bücher",
    myTechStack: "Mein Tech-Stack",
    about: "Über",
    education: "Ausbildung",
    me: "mich",
    university: "Informationstechnologie-Ingenieur (Bachelorabschluss)",
    hr: "Personalmanager (Kurszertifikat)",
    project: "projekt",
    slogan: ["Software", "Ingenieur"],
    talk: "Lass uns reden",
    heading1: "Letzte",
    heading2: "Project",
    cardTitle: "De Gastuin ecommerce platform",
    description: [
      "Diese Website ist eine umfassende Event-Management-Plattform für Teilnehmer und Administratoren. Die Benutzeroberfläche ist reaktionsschnell und modern gestaltet, während das Admin-Panel vollständig anpassbar und leistungsfähig ist.",
      "🛠️ Hauptfunktionen",
      "• Anpassbares Admin-Dashboard: Modularer Aufbau mit dynamischer Anpassung der Inhalten und Layouts.",
      "• Dynamisches Hauptevent auf der Startseite: Admins können Titel, Bilder und Links in Echtzeit bearbeiten.",
      "• Rechnungsverwaltung: PDF-Rechnungen können direkt vom Dashboard heruntergeladen werden.",
      "• Flexibles FAQ-System: FAQs können auf jeder Seite hinzugefügt, bearbeitet oder entfernt werden.",
      "• Verwaltung von Events, Benutzern und Inhalten: Vollständige CRUD-Funktionalität mit Live-Aktualisierungen.",
      "🌐 UX- und Design-Highlights",
      "• Reaktionsfähiges Interface mit klarer Navigation für alle Geräte.",
      "• Echtzeit-Feedback: Änderungen durch Admins erscheinen sofort auf der Seite.",
      "• Klare Datenpräsentation: Tabellen, Diagramme und Downloads für Admins.",
      "✅ Warum es hervorsticht",
      "• Volle Kontrolle für Admins über Inhalte und Prozesse.",
      "• Skalierbar für zukünftige Erweiterungen.",
      "• Nutzerzentriert: Klare Informationen und einfache Bedienung für Besucher.",
    ],
    tcp_card_title: "TCP-ERP",
    tcp: [
      "🚛 TCP-ERP: Eine kollaborative Plattform für den Einzelhandelslogistikbereich – eine innovative Plattform, die im Rahmen meines Hochschulabschlussprojekts entwickelt wurde.",
      "🔧 Sie wurde sorgfältig entworfen, um den Logistikprozess für Einzelhändler und Unternehmen zu optimieren.",
      "🌐 Durch die Nutzung eines Netzwerks von freiberuflichen Fahrern erleichtert TCP-ERP den effizienten Transport von Waren und Materialien und sorgt so für ein nahtloses Supply-Chain-Management.",
      "👥 Dieses Projekt wurde durch das gebündelte Fachwissen eines Teams hochqualifizierter Fachleute realisiert:",
      "🎨 Basel Hijazi: Leitete das UI/UX-Design und die Flutter-Entwicklung.",
      "🖥️ Ahmad Zaza: Verantwortlich für die Backend-Entwicklung.",
      "⚡ Sami Kazah: Spezialisierte sich auf die Echtzeitentwicklung.",
      "📱 Tarik Nashawati: Leistete einen bedeutenden Beitrag als Flutter-Entwickler.",
      "🌐 Hamze Al Hindi: Spezialisierte sich auf die Angular-Entwicklung und verbesserte die Funktionalität der Plattform.",
      "👩‍🏫 Betreut von Dr. Rawan Qaraouni.",
    ],
    photo_slogan: [
      "Liberal",
      "Ehrlich & Transparent",
      "Kritisch denkend",
      "Selbstmotiviert",
      "Lösungsorientiert",
      "Verantwortungsbewusst",
    ],
    short_resume: `Sami Kazah ist ein Ingenieur der Informationstechnologie mit Spezialisierung auf Softwareentwicklung und schloss sein Studium 2024 mit der Note 70 ab. Er ist zudem veröffentlichter Autor in den Bereichen Religionsvergleich und Informatik.

 er hat für lokale Unternehmen skalierbare und zuverlässige Anwendungen entwickelt – mit Leidenschaft für Frontend- und Backend-Technologien sowie einer lösungsorientierten Denkweise.
`,
    rights: "Alle Rechte vorbehalten.",
    gallery: "Galerie",
    certifications: "Zertifizierungen",
  },
  ar: {
    resume: "السيرة الذاتية",
    background: `أنحدر من عائلة متعددة الثقافات وقرأت أكثر من 200 كتاب في السياسة والدين وتطوير الذات وتكنولوجيا المعلومات. أنا مؤلف منشور، وعملت بموجب عقود لعملاء محليين، وشاركت بنشاط في العديد من المشاريع التطوعية طوال حياتي.`,
    another: "أخرى",
    contact: "تواصل",
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
    languages: "اللغات",
    arabic: "العربية",
    english: "الإنجليزية",
    german: "الألمانية",
    myPublishedBooks: "كتبي المنشورة",
    myTechStack: "التقنيات التي أستخدمها",
    about: "حول",
    education: "التعليم",
    me: "أنا",
    university: "مهندس تكنولوجيا المعلومات (درجة البكالوريوس)",
    hr: "مدير الموارد البشرية (شهادة دورة)",
    project: "مشروع",
    slogan: ["مهندس", "برمجيات"],
    talk: "لنتحدث",
    heading1: "أحدث",
    heading2: "المشاريع",
    cardTitle: "منصة التجارة الإلكترونية De Gastuin",
    description: [
      "تعمل هذه المنصة كحل شامل لإدارة الفعاليات لكل من الحضور والمسؤولين. توفر الواجهة الأمامية تجربة مستخدم مصقولة وسريعة الاستجابة، بينما يتم دعم الواجهة الخلفية بلوحة تحكم قوية وقابلة للتخصيص بدرجة كبيرة.",
      "🛠️ الميزات والوظائف الأساسية",
      "• لوحة تحكم إدارية قابلة للتخصيص: واجهة مستخدم معيارية بالكامل. يمكن للمسؤولين إعادة تكوين التخطيطات والأدوات وأقسام المحتوى بسرعة.",
      "• حدث رئيسي ديناميكي للصفحة الرئيسية: يمكن للمسؤولين تحديث لافتة الصفحة الرئيسية (العنوان، الوصف، الصورة، الرابط) في الوقت الفعلي دون إعادة النشر.",
      "• إدارة الفواتير: يمكن للمسؤولين إنشاء وتنزيل الفواتير بتنسيق PDF مباشرة من لوحة التحكم.",
      "• نظام الأسئلة الشائعة المرن: يمكن إضافة الأسئلة الشائعة أو تحريرها أو إعادة ترتيبها أو إزالتها في أي صفحة باستخدام محرر مدمج.",
      "• ضوابط الفعاليات والمستخدمين والمحتوى: دعم كامل للعمليات (إنشاء، قراءة، تحديث، حذف) للأحداث والمستخدمين والأصول الإعلامية.",
      "🌐 تجربة المستخدم وتصميمها",
      "• واجهة سريعة الاستجابة وبديهية: تصميم نظيف وصديق للجوال مع تنقل سلس.",
      "• ردود فعل في الوقت الفعلي: تظهر التغييرات التي يجريها المسؤولون فورًا على الموقع المباشر.",
      "• عرض واضح للبيانات: جداول بيانات منظمة ورسوم بيانية وتنزيلات لاستخدام المسؤول.",
      "✅ لماذا تبرز",
      "• تحكم شامل: سيطرة كاملة على المحتوى الترويجي والفواتير والهيكل.",
      "• التوسع: مبنية بهندسة معيارية للتوسع المستقبلي.",
      "• نهج يركز على المستخدم: مصممة لتزويد الحضور بتجربة سلسة وغنية بالمعلومات.",
    ],
    tcp_card_title: "TCP-ERP",
    tcp: [
      "🚛 TCP-ERP: منصة لوجستية تعاونية للبيع بالتجزئة، وهي منصة مبتكرة تم تطويرها كمشروع تخرجي الجامعي.",
      "🔧 تم تصميمها بدقة لتبسيط العملية اللوجستية لتجار التجزئة والشركات.",
      "🌐 من خلال الاستفادة من شبكة من السائقين المستقلين، تسهل TCP-ERP الحركة الفعالة للبضائع والإمدادات، مما يضمن تجربة إدارة سلسلة توريد سلسة.",
      "👥 تم إنجاز هذا المشروع من خلال الخبرة الجماعية لفريق من المحترفين ذوي المهارات العالية:",
      "🎨 باسل حجازي: قاد تصميم واجهة المستخدم/تجربة المستخدم وتطوير Flutter.",
      "🖥️ أحمد زازا: أدار ونفذ تطوير الواجهة الخلفية ببراعة.",
      "⚡ سامي قزح: تخصص في التطوير في الوقت الفعلي.",
      "📱 طارق نشواتي: ساهم بشكل كبير كمطور Flutter.",
      "🌐 حمزة الهندي: تخصص في تطوير Angular، مما عزز وظائف المنصة.",
      "👩‍🏫 تحت إشراف الدكتورة روان قرعوني.",
    ],
    photo_slogan: [
      "ليبرالي",
      "صادق وشفاف",
      "مفكر نقدي",
      "مدفوع ذاتيًا",
      "حلال مشاكل",
      "مسؤول",
    ],
    short_resume: `سامي قزح هو مهندس تكنولوجيا معلومات متخصص في هندسة البرمجيات، تخرج بدرجة 70. وهو أيضًا مؤلف منشور في كل من الدراسات الدينية وعلوم الكمبيوتر.

 لقد بنى تطبيقات قابلة للتطوير وقوية للشركات المحلية، جامعًا بين تقنيات الواجهة الأمامية والخلفية مع عقلية قوية لحل المشاكل.`,
    rights: "جميع الحقوق محفوظة.",
    gallery: "المعرض",
    certifications: "الشهادات",
  },
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");

  const toggleLocale = () => {
    setLocale((prev) => {
      if (prev === "en") return "de";
      if (prev === "de") return "ar";
      return "en";
    });
  };

  const t = translations[locale];

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, t }}>
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
