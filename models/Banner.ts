import mongoose, { Schema, models } from "mongoose";

const BANNER_POSITION_ENUM = ["home", "promotion", "banner", "popup"];
const BANNER_STATUS_ENUM = ["active", "inactive", "scheduled"];

const BannerSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            default: "",
        },
        
        // ============== VỊ TRÍ ==============
        position: {
            type: String,
            enum: BANNER_POSITION_ENUM,
            default: "home",
        },
        
        // ============== THỨ TỰ ==============
        order: {
            type: Number,
            default: 0,
        },
        
        // ============== THỜI GIAN ==============
        startDate: {
            type: Date,
            default: null,
        },
        endDate: {
            type: Date,
            default: null,
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: BANNER_STATUS_ENUM,
            default: "active",
        },
        
        // ============== MÔ TẢ ==============
        description: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

BannerSchema.index({ position: 1, order: 1 });
BannerSchema.index({ status: 1, startDate: 1, endDate: 1 });

export const Banner = 
    models.Banner || mongoose.model("Banner", BannerSchema);

export { BANNER_POSITION_ENUM, BANNER_STATUS_ENUM };
