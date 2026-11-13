import { Skill } from "@/models/Skill";
import { createCollectionHandlers } from "@/lib/apiUtils";
import { SKILL_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, POST } = createCollectionHandlers({
  model: Skill,
  entityName: "Skill",
  sanitize: SKILL_SANITIZE,
  sort: { proficiency: -1 },
  requiredOnCreate: ["name", "category"],
});
