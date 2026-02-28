import mongoose, { Schema, models } from "mongoose";

const DEBT_TYPE_ENUM = ["customer", "supplier"];
const DEBT_STATUS_ENUM = ["pending", "partial", "paid", "overdue", "cancelled"];

const DebtSchema = new Schema(
    {
        debtType: {
            type: String,
            enum: DEBT_TYPE_ENUM,
            required: true,
        },
        
        // ============== EXPLICIT FKs (NULLABLE) ==============
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
        
        // ============== THAM CHIẾU ==============
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            default: null,
        },
        purchaseOrderId: {
            type: Schema.Types.ObjectId,
            ref: "PurchaseOrder",
            default: null,
        },
        
        // ============== SỐ TIỀN ==============
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        paidAmount: {
            type: Number,
            default: 0,
        },
        remainingAmount: {
            type: Number,
            default: 0,
        },
        
        // ============== NGÀY ==============
        dueDate: {
            type: Date,
            default: null,
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: DEBT_STATUS_ENUM,
            default: "pending",
        },
        
        // ============== GHI CHÚ ==============
        description: {
            type: String,
            default: "",
        },
        notes: {
            type: String,
            default: "",
        },
        
        // ============== NGƯỜI TẠO ==============
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

DebtSchema.index({ debtType: 1, status: 1 });
DebtSchema.index({ customerId: 1 });
DebtSchema.index({ supplierId: 1 });
DebtSchema.index({ dueDate: 1 });

DebtSchema.pre('save', function(this: any, next: any) {
    this.remainingAmount = this.totalAmount - this.paidAmount;
    
    if (this.remainingAmount <= 0) {
        this.status = "paid";
    } else if (this.dueDate && this.dueDate < new Date()) {
        this.status = "overdue";
    } else if (this.paidAmount > 0) {
        this.status = "partial";
    }
    
    next();
});

export const Debt = 
    models.Debt || mongoose.model("Debt", DebtSchema);

export { DEBT_TYPE_ENUM, DEBT_STATUS_ENUM };
