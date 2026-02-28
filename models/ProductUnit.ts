import mongoose, { Schema, models } from "mongoose";

const PRODUCT_UNIT_STATUS_ENUM = ["available", "reserved", "sold", "service", "returned", "scrapped"];
const PRODUCT_UNIT_SOURCE_ENUM = ["import", "trade_sell", "repair"];
const CONDITION_ENUM = ["new", "like_in", "customer_new", "good", "fair", "poor"];

const ProductUnitSchema = new Schema(
    {
        // ============== LIÊN KẾT PRODUCT ==============
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        
        // ============== SERIAL & BARCODE ==============
        serialNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        barcode: {
            type: String,
            default: null,
            unique: true,
        },
        
        // ============== GIÁ ==============
        purchasePrice: {
            type: Number,
            required: true,
            default: 0,
        },
        sellingPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        
        // ============== TÌNH TRẠNG ==============
        condition: {
            type: String,
            enum: CONDITION_ENUM,
            default: "new",
        },
        conditionNote: {
            type: String,
            default: "",
        },
        
        // ============== PIN ==============
        batteryHealth: {
            type: Number,
            default: null,
            min: 0,
            max: 100,
        },
        batteryCycleCount: {
            type: Number,
            default: null,
        },
        
        // ============== NGUỒN GỐC ==============
        source: {
            type: String,
            enum: PRODUCT_UNIT_SOURCE_ENUM,
            default: "import",
        },
        
        // ============== NHÀ CUNG CẤP ==============
        supplierId: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
            default: null,
        },
        
        // ============== KHO ==============
        warehouseId: {
            type: Schema.Types.ObjectId,
            ref: "Warehouse",
            default: null,
        },
        
        // ============== NGÀY THÁNG ==============
        purchaseDate: {
            type: Date,
            default: null,
        },
        warrantyStartDate: {
            type: Date,
            default: null,
        },
        warrantyEndDate: {
            type: Date,
            default: null,
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: PRODUCT_UNIT_STATUS_ENUM,
            default: "available",
        },
        
        // ============== GHI CHÚ ==============
        notes: {
            type: String,
            default: "",
        },
        
        // ============== HÌNH ẢNH ==============
        images: {
            type: [String],
            default: [],
        },
        
        // ============== BẢO HÀNH ==============
        warrantyProvider: {
            type: String,
            enum: ["manufacturer", "store"],
            default: "store",
        },
        warrantyMonths: {
            type: Number,
            default: 12,
        },
        
        // ============== CHECKSUM ==============
        checksum: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Indexes
ProductUnitSchema.index({ serialNumber: 1 }, { unique: true });
ProductUnitSchema.index({ barcode: 1 }, { unique: true });
ProductUnitSchema.index({ productId: 1, status: 1 });
ProductUnitSchema.index({ status: 1, warehouseId: 1 });
ProductUnitSchema.index({ condition: 1, status: 1 });

// Virtual for warranty status
ProductUnitSchema.virtual('warrantyStatus').get(function() {
    if (!this.warrantyEndDate) return 'unknown';
    const now = new Date();
    if (this.warrantyEndDate < now) return 'expired';
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    if (this.warrantyEndDate < thirtyDaysFromNow) return 'expiring_soon';
    return 'active';
});

// Calculate warranty end date before save
ProductUnitSchema.pre('save', function(this: any, next: any) {
    if (this.purchaseDate && this.warrantyMonths && !this.warrantyStartDate) {
        this.warrantyStartDate = this.purchaseDate;
        const endDate = new Date(this.purchaseDate);
        endDate.setMonth(endDate.getMonth() + this.warrantyMonths);
        this.warrantyEndDate = endDate;
    }
    next();
});

export const ProductUnit = 
    models.ProductUnit || mongoose.model("ProductUnit", ProductUnitSchema);

export { 
    PRODUCT_UNIT_STATUS_ENUM, 
    PRODUCT_UNIT_SOURCE_ENUM,
    CONDITION_ENUM 
};
