import mongoose, { Schema, model, models } from "mongoose";

const SkillSchema = new Schema({
  name: { type: String, required: true },
  name_de: { type: String },
  name_ar: { type: String },
  category: { type: String, required: true }, // e.g., "Cloud", "Frontend", "Backend", "Tools"
  icon: { type: String }, // React Icon name or URL
  proficiency: { type: Number }, // 1-100
}, { timestamps: true });

export const Skill = models.Skill || model("Skill", SkillSchema);
