"use client";

import { useEffect, useState } from "react";

export function ScrollObserver() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            
            // Add focus class to active section and remove from others
            document.querySelectorAll("section").forEach((section) => {
              section.classList.remove("opacity-100", "scale-100");
              section.classList.add("opacity-50", "scale-95");
            });
            
            entry.target.classList.remove("opacity-50", "scale-95");
            entry.target.classList.add("opacity-100", "scale-100", "transition-all", "duration-500");
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
        rootMargin: "-10% 0px -10% 0px"
      }
    );

    // Select all sections on the page
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      // Add initial styles
      section.classList.add("transition-all", "duration-500", "opacity-50", "scale-95");
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return null; // This component doesn't render anything visible itself
}
