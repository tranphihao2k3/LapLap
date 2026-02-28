import mongoose, { Schema, models } from "mongoose";

const ATTENDANCE_STATUS_ENUM = ["present", "absent", "late", "leave", "holiday"];

const AttendanceSchema = new Schema(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        
        // ============== NGÀY ==============
        date: {
            type: Date,
            required: true,
        },
        
        // ============== CHECK IN/OUT ==============
        checkIn: {
            type: Date,
            default: null,
        },
        checkOut: {
            type: Date,
            default: null,
        },
        
        // ============== TRẠNG THÁI ==============
        status: {
            type: String,
            enum: ATTENDANCE_STATUS_ENUM,
            default: "present",
        },
        
        // ============== LÝ DO ==============
        reason: {
            type: String,
            default: "",
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

AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ date: 1 });
AttendanceSchema.index({ status: 1 });

export const Attendance = 
    models.Attendance || mongoose.model("Attendance", AttendanceSchema);

export { ATTENDANCE_STATUS_ENUM };
