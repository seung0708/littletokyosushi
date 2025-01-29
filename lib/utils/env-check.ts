const requiredEnvVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: 'Supabase project URL',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase anonymous key',
  SUPABASE_SERVICE_ROLE_KEY: 'Supabase service role key',
  
  // Email
  GMAIL_APP_PASSWORD: 'Gmail app password for email notifications',
  
  // Stripe
  STRIPE_SECRET_KEY: 'Stripe secret key for payments',
  STRIPE_WEBHOOK_SECRET: 'Stripe webhook secret',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'Stripe publishable key',
  
  // Site
  NEXT_PUBLIC_SITE_URL: 'Production site URL',
  NEXT_PUBLIC_ADMIN_URL: 'Admin panel URL'
};

export function checkEnvVars() {
  const missing = Object.entries(requiredEnvVars)
    .filter(([key]) => !process.env[key])
    .map(([key, desc]) => `${key} (${desc})`);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }
}

export function validateEnvVars() {
  // Validate Supabase URL format
  if (!/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(process.env.NEXT_PUBLIC_SUPABASE_URL || '')) {
    throw new Error('Invalid NEXT_PUBLIC_SUPABASE_URL format');
  }

  // Validate Stripe keys format
  if (!/^sk_(?:test|live)_[A-Za-z0-9]+$/.test(process.env.STRIPE_SECRET_KEY || '')) {
    throw new Error('Invalid STRIPE_SECRET_KEY format');
  }

  if (!/^pk_(?:test|live)_[A-Za-z0-9]+$/.test(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')) {
    throw new Error('Invalid NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY format');
  }

  // Validate URLs
  try {
    new URL(process.env.NEXT_PUBLIC_SITE_URL || '');
    new URL(process.env.NEXT_PUBLIC_ADMIN_URL || '');
  } catch {
    throw new Error('Invalid site or admin URL format');
  }
}
