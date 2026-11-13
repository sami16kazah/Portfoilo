import { Job } from "@/models/Job";
import { createCollectionHandlers } from "@/lib/apiUtils";
import { JOB_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, POST } = createCollectionHandlers({
  model: Job,
  entityName: "Job",
  sanitize: JOB_SANITIZE,
  sort: { isCurrent: -1, order: 1, createdAt: -1 },
  requiredOnCreate: ["company", "role"],
});
