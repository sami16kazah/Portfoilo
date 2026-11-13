import { Certification } from "@/models/Certification";
import { createItemHandlers } from "@/lib/apiUtils";
import { CERTIFICATION_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, PUT, DELETE } = createItemHandlers({
  model: Certification,
  entityName: "Certification",
  sanitize: CERTIFICATION_SANITIZE,
});
