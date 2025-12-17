import mongoose, { Schema, model, models } from "mongoose";

const EducationSchema = new Schema({
  degree: { type: String, required: true },
  degree_de: { type: String },
  degree_ar: { type: String },
  institution: { type: String, required: true },
  institution_de: { type: String },
  institution_ar: { type: String },
  year: { type: String },
  description: { type: String }, // default en
  description_de: { type: String },
  description_ar: { type: String },
}, { timestamps: true });

export const Education = models.Education || model("Education", EducationSchema);
