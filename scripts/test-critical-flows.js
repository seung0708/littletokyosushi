const fetch = require('node-fetch');
require('dotenv').config();

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

async function testCriticalFlows() {
  const tests = {
    // Menu Operations
    async testMenuFetch() {
      const res = await fetch(`${BASE_URL}/api/store/items`);
      if (!res.ok) throw new Error('Menu fetch failed');
      const data = await res.json();
      if (!Array.isArray(data.items)) throw new Error('Invalid menu data');
    },

    // Cart Operations
    async testCartOperations() {
      // Create cart
      const cart = await fetch(`${BASE_URL}/api/store/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            menu_item_id: 1,
            quantity: 1,
            base_price: 10.99,
            total_price: 10.99
          }]
        })
      });
      if (!cart.ok) throw new Error('Cart creation failed');
    },

    // Order Operations
    async testOrderCreation() {
      const order = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: 'Test User',
          customer_email: 'test@example.com',
          cart_id: 1,
          total_amount: 10.99
        })
      });
      if (!order.ok) throw new Error('Order creation failed');
    },

    // Admin Operations
    async testAdminOperations() {
      const res = await fetch(`${ADMIN_URL}/api/admin/orders`);
      if (!res.ok) throw new Error('Admin orders fetch failed');
    },

    // Email Test
    async testEmailService() {
      const res = await fetch(`${BASE_URL}/api/email/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'test@example.com',
          subject: 'Test Email',
          text: 'This is a test email'
        })
      });
      if (!res.ok) throw new Error('Email service test failed');
    }
  };

  // Run all tests
  for (const [name, test] of Object.entries(tests)) {
    try {
      console.log(`Running ${name}...`);
      await test();
      console.log(`✅ ${name} passed`);
    } catch (error) {
      console.error(`❌ ${name} failed:`, error);
      process.exit(1);
    }
  }
}

testCriticalFlows();
