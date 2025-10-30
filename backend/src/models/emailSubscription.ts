import mongoose, { Schema, Document } from "mongoose";
import { EmailSubscription } from "../types/enrollment";

const EmailSubscriptionSchema = new Schema<EmailSubscription & Document>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    institucion_slug: { type: String, required: true },
    subscribed_at: { type: Date, required: true, default: Date.now },
    converted_to_enrollment: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Compound index for efficient queries
EmailSubscriptionSchema.index({ institucion_slug: 1, email: 1 });
EmailSubscriptionSchema.index({ converted_to_enrollment: 1 });

export const EmailSubscriptionModel = mongoose.model<EmailSubscription & Document>(
  "EmailSubscription",
  EmailSubscriptionSchema
);
