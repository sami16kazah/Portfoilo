import { Schema, model, models } from "mongoose";

const JobMetricSchema = new Schema(
  {
    label: { type: String, required: true },
    label_de: { type: String },
    label_ar: { type: String },
    value: { type: String, required: true },
    detail: { type: String },
    detail_de: { type: String },
    detail_ar: { type: String },
  },
  { _id: false }
);

const JobSchema = new Schema(
  {
    company: { type: String, required: true },
    companyUrl: { type: String },
    logoUrl: { type: String },
    role: { type: String, required: true },
    role_de: { type: String },
    role_ar: { type: String },
    location: { type: String },
    location_de: { type: String },
    location_ar: { type: String },
    employmentType: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    isCurrent: { type: Boolean, default: false },
    summary: { type: String },
    summary_de: { type: String },
    summary_ar: { type: String },
    highlights: { type: [String], default: [] },
    highlights_de: { type: [String], default: [] },
    highlights_ar: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    performanceMetrics: { type: [JobMetricSchema], default: [] },
    featured: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Job = models.Job || model("Job", JobSchema);

