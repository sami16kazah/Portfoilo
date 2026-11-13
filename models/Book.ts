import { Schema, model, models } from "mongoose";

const LibraryLinkSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    title_de: { type: String },
    title_ar: { type: String },
    subtitle: { type: String },
    subtitle_de: { type: String },
    subtitle_ar: { type: String },
    coverUrl: { type: String },
    link: { type: String },
    libraryLinks: { type: [LibraryLinkSchema], default: [] },
    topics: { type: [String], default: [] },
    downloadsLabel: { type: String },
    description: { type: String },
    description_de: { type: String },
    description_ar: { type: String },
  },
  { timestamps: true }
);

export const Book = models.Book || model("Book", BookSchema);
