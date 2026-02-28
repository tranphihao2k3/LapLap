import mongoose, { Schema, models } from "mongoose";

const TRANSACTION_TYPE_ENUM = ["income", "expense"];
const TRANSACTION_CATEGORY_ENUM = [
    "sale", "refund", "deposit", "withdrawal",
    "purchase", "salary", "rent", "utility", 
    "marketing", "repair", "other"
];
const TRANSACTION_PAYMENT_METHOD_ENUM = ["cash", "bank", "qr", "card"];

const TransactionSchema = new Schema(
    {
        transactionType: {
            type: String,
            enum: TRANSACTION_TYPE_ENUM,
            required: true,
        },
        category: {
            type: String,
            enum: TRANSACTION_CATEGORY_ENUM,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: TRANSACTION_PAYMENT_METHOD_ENUM,
            default: "cash",
        },
        
        // ============== THAM CHIẾU ==============
        referenceType: {
            type: String,
            default: null,
        },
        referenceId: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        
        // ============== LIÊN KẾT ==============
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            default: null,
        },
        supplierId: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
            default: null,
        },
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        
        // ============== MÔ TẢ ==============
        description: {
            type: String,
            default: "",
        },
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

TransactionSchema.index({ transactionType: 1, createdAt: -1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ referenceType: 1, referenceId: 1 });
TransactionSchema.index({ customerId: 1 });
TransactionSchema.index({ supplierId: 1 });

export const Transaction = 
    models.Transaction || mongoose.model("Transaction", TransactionSchema);

export { 
    TRANSACTION_TYPE_ENUM, 
    TRANSACTION_CATEGORY_ENUM,
    TRANSACTION_PAYMENT_METHOD_ENUM 
};
