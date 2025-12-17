import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  title_de: { type: String },
  title_ar: { type: String },
  description: { type: [String], required: true }, // English by default
  description_de: { type: [String] },
  description_ar: { type: [String] },
  tags: { type: [String] },
  repoUrl: { type: String },
  demoUrl: { type: String },
  videoUrl: { type: String },
  imageUrl: { type: String }, 
  featured: { type: Boolean, default: false },
  date: { type: String }, 
}, { timestamps: true });

export const Project = models.Project || model("Project", ProjectSchema);
