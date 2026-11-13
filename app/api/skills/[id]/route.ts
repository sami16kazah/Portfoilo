import { Skill } from "@/models/Skill";
import { createItemHandlers } from "@/lib/apiUtils";
import { SKILL_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, PUT, DELETE } = createItemHandlers({
  model: Skill,
  entityName: "Skill",
  sanitize: SKILL_SANITIZE,
});
