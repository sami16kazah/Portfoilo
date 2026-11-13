import { Book } from "@/models/Book";
import { createCollectionHandlers } from "@/lib/apiUtils";
import { BOOK_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, POST } = createCollectionHandlers({
  model: Book,
  entityName: "Book",
  sanitize: BOOK_SANITIZE,
  sort: { createdAt: -1 },
  requiredOnCreate: ["title"],
});
