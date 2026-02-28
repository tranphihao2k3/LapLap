/**
 * Test Script for API Endpoints
 * Run: npx ts-node scripts/test-api.ts
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface TestResult {
    endpoint: string;
    method: string;
    status: number;
    success: boolean;
    error?: string;
}

const results: TestResult[] = [];

async function testEndpoint(endpoint: string, method: string, body?: any): Promise<TestResult> {
    const result: TestResult = { endpoint, method, status: 0, success: false };
    
    try {
        const options: RequestInit = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        result.status = response.status;
        result.success = response.ok;
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            result.error = errorData.error || `HTTP ${response.status}`;
        }
    } catch (error: any) {
        result.error = error.message;
    }
    
    return result;
}

async function runTests() {
    console.log('🧪 Starting API Tests...\n');
    console.log(`API Base: ${API_BASE}\n`);
    
    // Test 1: Purchase Orders
    console.log('📦 Testing Purchase Orders...');
    results.push(await testEndpoint('/admin/purchase-orders', 'GET'));
    
    // Test 2: Inventory Logs  
    console.log('📊 Testing Inventory Logs...');
    results.push(await testEndpoint('/admin/inventory-logs', 'GET'));
    
    // Test 3: Orders (requires existing data)
    console.log('🛒 Testing Orders...');
    results.push(await testEndpoint('/admin/orders', 'GET'));
    
    // Test 4: Suppliers
    console.log('🏭 Testing Suppliers...');
    results.push(await testEndpoint('/admin/suppliers', 'GET'));
    
    // Test 5: Buyback Orders
    console.log('🔄 Testing Buyback Orders...');
    results.push(await testEndpoint('/admin/buyback-orders', 'GET'));
    
    // Print Results
    console.log('\n========== TEST RESULTS ==========\n');
    
    let passed = 0;
    let failed = 0;
    
    for (const result of results) {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${result.method} ${result.endpoint}`);
        console.log(`   Status: ${result.status}`);
        if (result.error) {
            console.log(`   Error: ${result.error}`);
        }
        
        if (result.success) passed++;
        else failed++;
    }
    
    console.log(`\n========== SUMMARY ==========`);
    console.log(`Passed: ${passed}/${results.length}`);
    console.log(`Failed: ${failed}/${results.length}`);
    
    if (failed > 0) {
        console.log('\n⚠️ Some tests failed. Check the errors above.');
        process.exit(1);
    } else {
        console.log('\n✅ All tests passed!');
        process.exit(0);
    }
}

// Run tests
runTests().catch(console.error);
