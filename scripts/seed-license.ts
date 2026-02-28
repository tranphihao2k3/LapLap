import { connectDB } from "../lib/mongodb";
import { License } from "../models/License";
import { Software } from "../models/Software";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seedLicense() {
    try {
        await connectDB();
        console.log("Connected to database...");

        // Try to find a software to link to
        let software = await Software.findOne();

        if (!software) {
            console.log("No software found. Creating a test software...");
            software = await Software.create({
                title: "LapLap Auto Tool",
                slug: "laplap-auto-tool",
                content: "Test software for licensing",
                status: "published"
            });
        }

        const testKey = "LAPLAP-TEST-12345";

        // Check if exists
        const existing = await License.findOne({ key: testKey });
        if (existing) {
            console.log("Test license already exists:", testKey);
        } else {
            const expiry = new Date();
            expiry.setFullYear(expiry.getFullYear() + 1); // 1 year from now

            await License.create({
                key: testKey,
                softwareId: software._id,
                expiryDate: expiry,
                status: "active",
                note: "Seed test license"
            });
            console.log("Test license created successfully:", testKey);
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding license:", error);
        process.exit(1);
    }
}

seedLicense();
