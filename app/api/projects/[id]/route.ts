import { Project } from "@/models/Project";
import { createItemHandlers } from "@/lib/apiUtils";
import { PROJECT_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, PUT, DELETE } = createItemHandlers({
  model: Project,
  entityName: "Project",
  sanitize: PROJECT_SANITIZE,
});
