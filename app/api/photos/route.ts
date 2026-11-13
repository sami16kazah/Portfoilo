import { Photo } from "@/models/Photo";
import { createCollectionHandlers } from "@/lib/apiUtils";
import { PHOTO_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, POST } = createCollectionHandlers({
  model: Photo,
  entityName: "Photo",
  sanitize: PHOTO_SANITIZE,
  sort: { createdAt: -1 },
  requiredOnCreate: ["url"],
});
