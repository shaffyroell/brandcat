#!/usr/bin/env node

const { execSync } = require('child_process');

// Only run migrations if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL not set - skipping migrations');
  console.log('ℹ️  App will run in demo mode');
  process.exit(0);
}

console.log('✅ DATABASE_URL found - running migrations');
try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Migrations completed successfully');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
