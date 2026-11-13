import { Education } from "@/models/Education";
import { createItemHandlers } from "@/lib/apiUtils";
import { EDUCATION_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, PUT, DELETE } = createItemHandlers({
  model: Education,
  entityName: "Education",
  sanitize: EDUCATION_SANITIZE,
});
