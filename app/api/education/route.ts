import { Education } from "@/models/Education";
import { createCollectionHandlers } from "@/lib/apiUtils";
import { EDUCATION_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, POST } = createCollectionHandlers({
  model: Education,
  entityName: "Education",
  sanitize: EDUCATION_SANITIZE,
  sort: { year: -1, createdAt: -1 },
  requiredOnCreate: ["degree", "institution"],
});
