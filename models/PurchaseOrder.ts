import mongoose, { Schema, models } from "mongoose";

const PURCHASE_ORDER_STATUS_ENUM = ["draft", "ordered", "partial", "received", "cancelled"];
const PURCHASE_ORDER_PAYMENT_STATUS_ENUM = ["unpaid", "partial", "paid"];

// Purchase Order Item Schema
const PurchaseOrderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    receivedQuantity: {
        type: Number,
        default: 0
    },
}, { _id: false });

const PurchaseOrderSchema = new Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        
        // ============== NHÀ CUNG CẤP ==============
        supplierId: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },
        supplierName: {
            type: String,
            required: true,
        },
        
        // ============== KHO ==============
        warehouseId: {
            type: Schema.Types.ObjectId,
            ref: "Warehouse",
            required: true,
        },
        
        // ============== SẢN PHẨM ==============
        items: [PurchaseOrderItemSchema],
        
        // ============== TIỀN ==============
        subtotal: {
            type: Number,
            default: 0,
        },
        tax: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        
        // ============== THANH TOÁN ==============
        paidAmount: {
            type: Number,
            default: 0,
        },
        paymentStatus: {
            type: String,
            enum: PURCHASE_ORDER_PAYMENT_STATUS_ENUM,
            default: "unpaid",
        },
        paymentMethod: {
            type: String,
            default: "",
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: PURCHASE_ORDER_STATUS_ENUM,
            default: "draft",
        },
        
        // ============== NGÀY ==============
        orderDate: {
            type: Date,
            default: null,
        },
        expectedDeliveryDate: {
            type: Date,
            default: null,
        },
        receivedDate: {
            type: Date,
            default: null,
        },
        
        // ============== GHI CHÚ ==============
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

// Auto calculate totals
PurchaseOrderItemSchema.pre('save', function() {
    this.totalPrice = this.quantity * this.unitPrice;
});

PurchaseOrderSchema.pre('save', function() {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    this.totalAmount = this.subtotal - this.discount + this.tax;
    
    if (this.paidAmount >= this.totalAmount) {
        this.paymentStatus = "paid";
    } else if (this.paidAmount > 0) {
        this.paymentStatus = "partial";
    }
});

// Indexes
PurchaseOrderSchema.index({ orderNumber: 1 }, { unique: true });
PurchaseOrderSchema.index({ supplierId: 1, status: 1 });
PurchaseOrderSchema.index({ warehouseId: 1, status: 1 });
PurchaseOrderSchema.index({ status: 1, createdAt: -1 });

export const PurchaseOrder = 
    models.PurchaseOrder || mongoose.model("PurchaseOrder", PurchaseOrderSchema);

export { PURCHASE_ORDER_STATUS_ENUM, PURCHASE_ORDER_PAYMENT_STATUS_ENUM };
