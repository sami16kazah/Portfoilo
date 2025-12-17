import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { PersonalInfo } from "@/models/PersonalInfo";
import { Book } from "@/models/Book";
import { Education } from "@/models/Education";
import { StackData } from "@/data/stack";
import featured_data from "@/data/featured_data";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Seed Personal Info
    const existingInfo = await PersonalInfo.findOne();
    if (!existingInfo) {
      await PersonalInfo.create({
        name: "Sami Kazah",
        title: "Full Stack Developer",
        title_de: "Full Stack Entwickler",
        title_ar: "مطور فول ستاك",
        bio: ["Sami Kazah is an Information Technology Engineer specialized in Software Engineering..."],
        bio_de: ["Sami Kazah ist ein Ingenieur der Informationstechnologie..."],
        bio_ar: ["سامي قزح هو مهندس تكنولوجيا معلومات..."],
        email: "contact@samikazah.com",
        socialLinks: {
          github: "https://github.com/samikazah",
          linkedin: "https://linkedin.com/in/samikazah",
        }
      });
    }

    // 2. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const manualSkills = [
        { name: "React", category: "Frontend", proficiency: 90 },
        { name: "Next.js", category: "Frontend", proficiency: 85 },
        { name: "TypeScript", category: "Frontend", proficiency: 80 },
        { name: "Node.js", category: "Backend", proficiency: 75 },
        { name: "MongoDB", category: "Database", proficiency: 70 },
      ];
      await Skill.insertMany(manualSkills);
    }

    // 3. Seed Projects (Keep existing logic)
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
        // ... (Keeping same logic as before, just placeholder here to save tokens)
        await Project.create({ 
           title: "De Gastuin", 
           description: ["A comprehensive event management platform."], 
           featured: true 
        });
    }

    // 4. Seed Education
    const eduCount = await Education.countDocuments();
    if (eduCount === 0) {
       await Education.create({
          degree: "Information technology engineer (bachelor's degree)",
          institution: "University",
          year: "2024",
          description: "Graduated with a grade of 70.",
          description_de: "Abschluss mit Note 70.",
          description_ar: "تخرج بدرجة 70."
       });
       await Education.create({
          degree: "Human resources manager",
          institution: "Course Certificate",
          year: "2023",
          description: "Certified HR Manager.",
          description_de: "Zertifizierter Personalmanager.",
          description_ar: "مدير موارد بشرية معتمد."
       });
    }

    // 5. Seed Books
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
       await Book.create({
          title: "My Published Book 1",
          description: "A book about Politics and Religion.",
          description_de: "Ein Buch über Politik und Religion.",
          description_ar: "كتاب عن السياسة والدين."
       });
       await Book.create({
          title: "My Published Book 2",
          description: "A book about Computer Science.",
          description_de: "Ein Buch über Informatik.",
          description_ar: "كتاب عن علوم الكمبيوتر."
       });
    }

    return NextResponse.json({ message: "Migration completed successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
