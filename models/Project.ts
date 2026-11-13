import { Schema, model, models } from "mongoose";

const VideoChapterSchema = new Schema(
  {
    title: { type: String, required: true },
    title_de: { type: String },
    title_ar: { type: String },
    url: { type: String, required: true },
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    title_de: { type: String },
    title_ar: { type: String },
    subtitle: { type: String },
    subtitle_de: { type: String },
    subtitle_ar: { type: String },
    description: { type: [String], required: true }, // English by default
    description_de: { type: [String] },
    description_ar: { type: [String] },
    credits: { type: String },
    credits_de: { type: String },
    credits_ar: { type: String },
    highlights: { type: [String], default: [] },
    highlights_de: { type: [String], default: [] },
    highlights_ar: { type: [String], default: [] },
    tags: { type: [String] },
    repoUrl: { type: String },
    demoUrl: { type: String },
    videoUrl: { type: String },
    videoChapters: { type: [VideoChapterSchema], default: [] },
    imageUrl: { type: String },
    logoUrl: { type: String },
    brandColor: { type: String },
    demoStatus: { type: String, default: "ready" },
    featured: { type: Boolean, default: false },
    date: { type: String },
  },
  { timestamps: true }
);

export const Project = models.Project || model("Project", ProjectSchema);
