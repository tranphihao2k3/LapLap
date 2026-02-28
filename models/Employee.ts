import mongoose, { Schema, models } from "mongoose";

const EMPLOYEE_POSITION_ENUM = ["admin", "manager", "sales", "technician", "accountant", "warehouse", "receptionist"];
const EMPLOYEE_STATUS_ENUM = ["active", "on_leave", "suspended", "terminated"];

const EmployeeSchema = new Schema(
    {
        employeeCode: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
        },
        phone: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            enum: EMPLOYEE_POSITION_ENUM,
            default: "sales",
        },
        department: {
            type: String,
            default: "",
        },
        salary: {
            type: Number,
            default: 0,
        },
        hireDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: EMPLOYEE_STATUS_ENUM,
            default: "active",
        },
        profileImage: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            default: "",
        },
        identityCard: {
            type: String,
            default: "",
        },
        birthday: {
            type: Date,
            default: null,
        },
        notes: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

EmployeeSchema.index({ employeeCode: 1 }, { unique: true });
EmployeeSchema.index({ phone: 1 });
EmployeeSchema.index({ position: 1 });
EmployeeSchema.index({ status: 1 });

// Virtual for full name
EmployeeSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

export const Employee = 
    models.Employee || mongoose.model("Employee", EmployeeSchema);

export { EMPLOYEE_POSITION_ENUM, EMPLOYEE_STATUS_ENUM };
