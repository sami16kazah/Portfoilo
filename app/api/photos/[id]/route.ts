import { Photo } from "@/models/Photo";
import { createItemHandlers } from "@/lib/apiUtils";
import { PHOTO_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, PUT, DELETE } = createItemHandlers({
  model: Photo,
  entityName: "Photo",
  sanitize: PHOTO_SANITIZE,
});
