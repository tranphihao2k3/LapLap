import dotenv from 'dotenv';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function createAdminUser() {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@laplap.com' });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email: admin@laplap.com');
            return;
        }

        // Create admin user
        const admin = await User.create({
            email: 'admin@laplap.com',
            password: 'Admin123456',
            name: 'Admin User',
            role: 'superadmin',
            status: 'active',
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@laplap.com');
        console.log('Password: Admin123456');
        console.log('Role: superadmin');
        console.log('\nYou can now login at: http://localhost:3000/admin/login');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
