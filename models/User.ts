import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'],
        default: 'admin',
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'locked'],
        default: 'active',
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    lastFailedLogin: {
        type: Date,
    },
    lockUntil: {
        type: Date,
    },
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

// Method to check if account is locked
UserSchema.methods.isLocked = function (): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
};

// Method to increment failed login attempts
UserSchema.methods.incLoginAttempts = async function (): Promise<void> {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < new Date()) {
        await this.updateOne({
            $set: { failedLoginAttempts: 1, lastFailedLogin: new Date() },
            $unset: { lockUntil: 1 },
        });
        return;
    }

    const updates: any = {
        $inc: { failedLoginAttempts: 1 },
        $set: { lastFailedLogin: new Date() },
    };

    // Lock account after 5 failed attempts for 15 minutes
    const maxAttempts = 5;
    const lockTime = 15 * 60 * 1000; // 15 minutes

    if (this.failedLoginAttempts + 1 >= maxAttempts && !this.isLocked()) {
        updates.$set.lockUntil = new Date(Date.now() + lockTime);
    }

    await this.updateOne(updates);
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = async function (): Promise<void> {
    await this.updateOne({
        $set: {
            failedLoginAttempts: 0,
            lastLogin: new Date(),
        },
        $unset: { lockUntil: 1, lastFailedLogin: 1 },
    });
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
