import type { SanitizeModelOptions } from "@/lib/apiUtils";

export const PROFILE_SANITIZE: SanitizeModelOptions = {
  allowedFields: [
    "name",
    "name_de",
    "name_ar",
    "title",
    "title_de",
    "title_ar",
    "bio",
    "bio_de",
    "bio_ar",
    "email",
    "phone",
    "socialLinks",
    "cvUrl",
    "avatarUrl",
    "languages",
  ],
  urlFields: ["cvUrl", "avatarUrl"],
};

export const PROJECT_SANITIZE: SanitizeModelOptions = {
  allowedFields: [
    "title",
    "title_de",
    "title_ar",
    "subtitle",
    "subtitle_de",
    "subtitle_ar",
    "description",
    "description_de",
    "description_ar",
    "credits",
    "credits_de",
    "credits_ar",
    "highlights",
    "highlights_de",
    "highlights_ar",
    "tags",
    "repoUrl",
    "demoUrl",
    "videoUrl",
    "videoChapters",
    "imageUrl",
    "logoUrl",
    "brandColor",
    "demoStatus",
    "featured",
    "date",
  ],
  urlFields: ["repoUrl", "demoUrl", "videoUrl", "imageUrl", "logoUrl"],
  arrayObjectUrlFields: [{ arrayField: "videoChapters", urlKey: "url" }],
};

export const JOB_SANITIZE: SanitizeModelOptions = {
  allowedFields: [
    "company",
    "companyUrl",
    "logoUrl",
    "role",
    "role_de",
    "role_ar",
    "location",
    "location_de",
    "location_ar",
    "employmentType",
    "startDate",
    "endDate",
    "isCurrent",
    "summary",
    "summary_de",
    "summary_ar",
    "highlights",
    "highlights_de",
    "highlights_ar",
    "techStack",
    "performanceMetrics",
    "featured",
    "order",
  ],
  urlFields: ["companyUrl", "logoUrl"],
};

export const SKILL_SANITIZE: SanitizeModelOptions = {
  allowedFields: ["name", "name_de", "name_ar", "category", "icon", "proficiency"],
  safeIconFields: ["icon"],
};

export const BOOK_SANITIZE: SanitizeModelOptions = {
  allowedFields: [
    "title",
    "title_de",
    "title_ar",
    "subtitle",
    "subtitle_de",
    "subtitle_ar",
    "coverUrl",
    "link",
    "libraryLinks",
    "topics",
    "downloadsLabel",
    "description",
    "description_de",
    "description_ar",
  ],
  urlFields: ["coverUrl", "link"],
  arrayObjectUrlFields: [{ arrayField: "libraryLinks", urlKey: "url" }],
};

export const EDUCATION_SANITIZE: SanitizeModelOptions = {
  allowedFields: [
    "degree",
    "degree_de",
    "degree_ar",
    "institution",
    "institution_de",
    "institution_ar",
    "year",
    "description",
    "description_de",
    "description_ar",
  ],
};

export const CERTIFICATION_SANITIZE: SanitizeModelOptions = {
  allowedFields: ["name", "name_de", "name_ar", "issuer", "date", "link"],
  urlFields: ["link"],
};

export const PHOTO_SANITIZE: SanitizeModelOptions = {
  allowedFields: ["url", "title", "category"],
  urlFields: ["url"],
};
