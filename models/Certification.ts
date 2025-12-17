import mongoose, { Schema, model, models } from "mongoose";
const CertificationSchema = new Schema({
  name: { type: String, required: true },
  name_de: { type: String },
  name_ar: { type: String },
  issuer: { type: String, required: true },
  date: { type: String },
  link: { type: String },
}, { timestamps: true });
export const Certification = models.Certification || model("Certification", CertificationSchema);