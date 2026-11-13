import { Project } from "@/models/Project";
import { createCollectionHandlers } from "@/lib/apiUtils";
import { PROJECT_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, POST } = createCollectionHandlers({
  model: Project,
  entityName: "Project",
  sanitize: PROJECT_SANITIZE,
  sort: { createdAt: -1 },
  requiredOnCreate: ["title"],
});
