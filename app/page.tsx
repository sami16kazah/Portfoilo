// src/app/page.tsx

import AboutSection from "@/section/About";
import ContactSection from "@/section/Contact";
import AnotherProjectsSection from "@/section/AnotherProjects";
import ClientHome from "./ClientHome"; // This will hold useLocale() logic

export default function Home() {
  return (
    <div>
      <ClientHome />
      <AnotherProjectsSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
}
