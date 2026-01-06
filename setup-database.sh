#!/bin/bash

# BrandCat Database Setup Script
# Run this once to initialize your Supabase database

echo "🚀 BrandCat Database Setup"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << 'EOF'
DATABASE_URL="postgres://postgres.wcavhekfalttzxdqkien:qsDQ3yTR9tHFhJ5T@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
EOF
  echo "✅ .env file created"
else
  echo "✅ .env file already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Creating database tables..."
npx prisma db push --accept-data-loss

echo ""
echo "🌱 Seeding database with dummy data..."
npx prisma db seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Your database now has:"
echo "  • Acme Design Co. brand"
echo "  • 3 demo users (demo@brandcat.app, sarah@acme.com, marcus@acme.com)"
echo "  • 4 sample posts"
echo "  • 5 inspiration articles"
echo ""
echo "All users password: demo123"
echo ""
echo "🎉 You can now save data in your deployed app!"
