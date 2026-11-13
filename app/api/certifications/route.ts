import { Certification } from "@/models/Certification";
import { createCollectionHandlers } from "@/lib/apiUtils";
import { CERTIFICATION_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, POST } = createCollectionHandlers({
  model: Certification,
  entityName: "Certification",
  sanitize: CERTIFICATION_SANITIZE,
  sort: { date: -1 },
  requiredOnCreate: ["name", "issuer"],
});
