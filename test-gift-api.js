// Test script to verify gift field is saved
// Run with: node test-gift-api.js

const testData = {
    name: "Test Laptop with Gift",
    model: "TEST-001",
    categoryId: "YOUR_CATEGORY_ID", // Replace with real category ID
    brandId: "YOUR_BRAND_ID",       // Replace with real brand ID
    price: 15000000,
    images: ["https://placehold.co/600x400"],
    gift: "Tặng chuột + balo + phần mềm Office",
    specs: {
        cpu: "Intel Core i5",
        gpu: "Intel UHD",
        ram: "8GB",
        ssd: "256GB",
        screen: "15.6 inch",
        battery: "3 cell"
    },
    status: "active"
};

async function testGiftAPI() {
    try {
        console.log("Testing POST /api/admin/laptops with gift field...");
        console.log("Data to send:", JSON.stringify(testData, null, 2));

        const response = await fetch("http://localhost:3000/api/admin/laptops", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        console.log("\n=== API Response ===");
        console.log("Success:", result.success);

        if (result.success) {
            console.log("\n✅ Product created successfully!");
            console.log("Product ID:", result.data._id);
            console.log("Gift field:", result.data.gift);
            console.log("\nFull response:", JSON.stringify(result.data, null, 2));
        } else {
            console.log("\n❌ Error:", result.error);
        }
    } catch (error) {
        console.error("\n❌ Request failed:", error.message);
    }
}

testGiftAPI();
