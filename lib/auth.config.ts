import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                // Check if account is locked
                if (user.isLocked()) {
                    const lockTime = Math.ceil((user.lockUntil - new Date()) / 1000 / 60);
                    throw new Error(`Account is locked. Try again in ${lockTime} minutes`);
                }

                // Check if account is active
                if (user.status !== 'active') {
                    throw new Error('Account is inactive. Contact administrator');
                }

                // Verify password
                const isValid = await user.comparePassword(credentials.password);

                if (!isValid) {
                    await user.incLoginAttempts();
                    throw new Error('Invalid email or password');
                }

                // Reset failed attempts on successful login
                await user.resetLoginAttempts();

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: '/admin/login',
        error: '/admin/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this-in-production',
};
