import mongoose, { Schema, model, models } from "mongoose";

const PersonalInfoSchema = new Schema({
  name: { type: String, required: true },
  name_de: { type: String },
  name_ar: { type: String },
  title: { type: String },
  title_de: { type: String },
  title_ar: { type: String },
  bio: { type: [String] }, // English
  bio_de: { type: [String] },
  bio_ar: { type: [String] },
  email: { type: String },
  phone: { type: String },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
  },
  cvUrl: { type: String },
  avatarUrl: { type: String },
}, { timestamps: true });

export const PersonalInfo = models.PersonalInfo || model("PersonalInfo", PersonalInfoSchema);
