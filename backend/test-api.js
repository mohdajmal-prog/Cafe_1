// Test API endpoints
// Run: node test-api.js

const BASE_URL = 'http://localhost:3006';

async function testAPI() {
  console.log('Testing Supabase Backend API...\n');

  // Test 1: Health check
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    console.log('✅ Health Check:', data);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }

  // Test 2: Get menu items
  try {
    const res = await fetch(`${BASE_URL}/menu`);
    const data = await res.json();
    console.log('✅ Menu Items:', data.length || 0, 'items');
  } catch (error) {
    console.log('❌ Menu Failed:', error.message);
  }
}

testAPI();
