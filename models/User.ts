import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin", enum: ["admin"] },
    sessionVersion: { type: Number, default: 0 },
    lastPasswordChangeAt: { type: Date },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
