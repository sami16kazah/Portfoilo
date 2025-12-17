import mongoose, { Schema, model, models } from "mongoose";

const BookSchema = new Schema({
  title: { type: String, required: true },
  title_de: { type: String },
  title_ar: { type: String },
  coverUrl: { type: String },
  link: { type: String },
  description: { type: String }, // default en
  description_de: { type: String },
  description_ar: { type: String },
}, { timestamps: true });

export const Book = models.Book || model("Book", BookSchema);
