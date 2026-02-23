import mongoose from 'mongoose';

const PopupBannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    link: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    displayDelay: { type: Number, default: 2000 }, // Delay in ms before showing
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.PopupBanner || mongoose.model('PopupBanner', PopupBannerSchema);
