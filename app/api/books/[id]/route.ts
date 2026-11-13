import { Book } from "@/models/Book";
import { createItemHandlers } from "@/lib/apiUtils";
import { BOOK_SANITIZE } from "@/lib/portfolioSchemas";

export const { GET, PUT, DELETE } = createItemHandlers({
  model: Book,
  entityName: "Book",
  sanitize: BOOK_SANITIZE,
});
