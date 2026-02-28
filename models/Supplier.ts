import mongoose, { Schema, models } from "mongoose";

const SUPPLIER_STATUS_ENUM = ["active", "inactive"];

const SupplierSchema = new Schema(
    {
        supplierCode: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            default: "",
        },
        phone: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            default: "",
        },
        contactPerson: {
            type: String,
            default: "",
        },
        taxCode: {
            type: String,
            default: "",
        },
        bankAccount: {
            type: String,
            default: "",
        },
        bankName: {
            type: String,
            default: "",
        },
        paymentTerm: {
            type: Number,
            default: 0,
        },
        totalDebt: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 5,
            min: 1,
            max: 5,
        },
        status: {
            type: String,
            enum: SUPPLIER_STATUS_ENUM,
            default: "active",
        },
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

SupplierSchema.index({ supplierCode: 1 }, { unique: true });
SupplierSchema.index({ name: 1 });
SupplierSchema.index({ status: 1 });

export const Supplier = 
    models.Supplier || mongoose.model("Supplier", SupplierSchema);

export { SUPPLIER_STATUS_ENUM };
