import mongoose, { Schema, model, models } from "mongoose";

const PhotoSchema = new Schema({
  url: { type: String, required: true },
  title: { type: String },
  category: { type: String }, // e.g., "Event", "Work", "Life"
}, { timestamps: true });

export const Photo = models.Photo || model("Photo", PhotoSchema);
