import { Schema, model, models } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    heroBadge: { type: String, default: "Software Engineer at cloudvibe GmbH" },
    heroBadge_de: { type: String, default: "Softwareentwickler bei cloudvibe GmbH" },
    heroBadge_ar: { type: String, default: "مهندس برمجيات لدى cloudvibe GmbH" },
    availabilityLabel: { type: String, default: "Available for Web & Cloud Engineering" },
    availabilityLabel_de: { type: String, default: "Verfügbar für Web- & Cloud-Engineering" },
    availabilityLabel_ar: { type: String, default: "متاح لمشاريع الويب والأنظمة السحابية" },
    locationLabel: { type: String, default: "Based in Germany" },
    locationLabel_de: { type: String, default: "Standort Deutschland" },
    locationLabel_ar: { type: String, default: "مقيم في ألمانيا" },
    featuredCompanyLabel: { type: String, default: "Company" },
    featuredProjectLabel: { type: String, default: "Flagship ERP" },
    serviceOptions: {
      type: [String],
      default: ["Full-Stack Web", "Cloud / ERP", "UI/UX & Frontend", "API & Backend"],
    },
    budgetOptions: {
      type: [String],
      default: ["< €1,000", "€1,000 – €5,000", "€5,000+", "Full-Time / Role"],
    },
    showExperienceSection: { type: Boolean, default: true },
    showPerformanceTelemetry: { type: Boolean, default: true },
    showProjectsSection: { type: Boolean, default: true },
    showSkillsSection: { type: Boolean, default: true },
    showBooksSection: { type: Boolean, default: true },
    showEducationSection: { type: Boolean, default: true },
    showGallerySection: { type: Boolean, default: true },
    showContactSection: { type: Boolean, default: true },
    defaultsSyncVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SiteSettings =
  models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

