import mongoose, { Schema, models } from "mongoose";

const OrderSchema = new Schema(
    {
        customer: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String },
            address: { type: String, required: true },
        },
        customerId: { type: Schema.Types.ObjectId, ref: "Customer" }, // Link to Customer profile
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true, default: 1 },
                image: { type: String },
                slug: { type: String },
            }
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        deliveryDate: { type: Date },
        paymentMethod: { type: String, default: "cod" }, // cod, banking
        note: { type: String },
        isPaid: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Order = models.Order || mongoose.model("Order", OrderSchema);
