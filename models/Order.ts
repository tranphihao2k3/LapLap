import mongoose, { Schema, models } from "mongoose";

// Enum definitions
const ORDER_STATUS_ENUM = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_METHOD_ENUM = ["cash", "card", "bank", "qr"];
const CUSTOMER_TYPE_ENUM = ["retail", "wholesale"];

// Order Item Schema (Embedded)
const OrderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    productUnit: {
        type: Schema.Types.ObjectId,
        ref: "ProductUnit",
        default: null
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    costPrice: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    image: {
        type: String,
        default: null
    },
    slug: {
        type: String,
        default: null
    },
    discount: {
        type: Number,
        default: 0
    }
}, { _id: false });

const OrderSchema = new Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            required: true
        },
        customer: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String },
            address: { type: String, required: true },
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer"
        },
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        items: [OrderItemSchema],
        subtotal: {
            type: Number,
            required: true,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        tax: {
            type: Number,
            default: 0
        },
        shippingFee: {
            type: Number,
            default: 0
        },
        depositAmount: {
            type: Number,
            default: 0
        },
        depositDate: {
            type: Date,
            default: null
        },
        depositMethod: {
            type: String,
            enum: PAYMENT_METHOD_ENUM,
            default: null
        },
        totalAmount: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: PAYMENT_METHOD_ENUM,
            default: "cash"
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid"],
            default: "unpaid"
        },
        paymentDate: {
            type: Date,
            default: null
        },
        customerType: {
            type: String,
            enum: CUSTOMER_TYPE_ENUM,
            default: "retail"
        },
        status: {
            type: String,
            enum: ORDER_STATUS_ENUM,
            default: "pending",
        },
        deliveryDate: {
            type: Date,
            default: null
        },
        shippingAddress: {
            type: String,
            default: null
        },
        shippingNote: {
            type: String,
            default: null
        },
        note: {
            type: String,
            default: null
        },
        installmentInfo: {
            isInstallment: { type: Boolean, default: false },
            installmentMonths: { type: Number, default: 0 },
            monthlyPayment: { type: Number, default: 0 },
            interestRate: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ employeeId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });

OrderSchema.pre('save', function(this: any, next: any) {
    this.subtotal = this.items.reduce((sum: number, item: any) => {
        const itemTotal = (item.price - item.discount) * item.quantity;
        return sum + itemTotal;
    }, 0);
    
    this.totalAmount = this.subtotal - this.discount + this.tax + this.shippingFee;
    
    next();
});

export const Order = models.Order || mongoose.model("Order", OrderSchema);

export { ORDER_STATUS_ENUM, PAYMENT_METHOD_ENUM, CUSTOMER_TYPE_ENUM };
