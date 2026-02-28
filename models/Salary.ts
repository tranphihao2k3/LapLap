import mongoose, { Schema, models } from "mongoose";

const SALARY_STATUS_ENUM = ["draft", "pending", "paid", "cancelled"];

const SalarySchema = new Schema(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        
        // ============== KỲ LƯƠNG ==============
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        
        // ============== LƯƠNG ==============
        baseSalary: {
            type: Number,
            required: true,
        },
        allowances: {
            type: Number,
            default: 0,
        },
        bonuses: {
            type: Number,
            default: 0,
        },
        deductions: {
            type: Number,
            default: 0,
        },
        
        // ============== NGÀY CÔNG ==============
        workingDays: {
            type: Number,
            default: 0,
        },
        actualWorkingDays: {
            type: Number,
            default: 0,
        },
        overtimeHours: {
            type: Number,
            default: 0,
        },
        
        // ============== TỔNG CỘNG ==============
        grossSalary: {
            type: Number,
            default: 0,
        },
        netSalary: {
            type: Number,
            default: 0,
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: SALARY_STATUS_ENUM,
            default: "draft",
        },
        paidDate: {
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

SalarySchema.index({ employeeId: 1, year: 1, month: 1 }, { unique: true });
SalarySchema.index({ status: 1 });

export const Salary = 
    models.Salary || mongoose.model("Salary", SalarySchema);

export { SALARY_STATUS_ENUM };
