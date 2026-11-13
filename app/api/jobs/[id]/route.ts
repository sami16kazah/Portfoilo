import { Job } from "@/models/Job";
import { createItemHandlers } from "@/lib/apiUtils";
import { JOB_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, PUT, DELETE } = createItemHandlers({
  model: Job,
  entityName: "Job",
  sanitize: JOB_SANITIZE,
});
