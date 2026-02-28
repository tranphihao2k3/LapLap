import mongoose, { Schema, models } from "mongoose";

const LicenseSchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        hwid: {
            type: String,
            default: "",
            trim: true,
        },
        softwareId: {
            type: Schema.Types.ObjectId,
            ref: "Software",
            required: true,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "blocked", "expired"],
            default: "active",
        },
        note: {
            type: String,
            default: "",
        },
        lastUsed: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Indexes
LicenseSchema.index({ key: 1 });
LicenseSchema.index({ hwid: 1 });
LicenseSchema.index({ status: 1 });

if (models.License) {
    delete models.License;
}

export const License = models.License || mongoose.model("License", LicenseSchema);
