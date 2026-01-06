#!/bin/bash

# Only run migrations if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set - skipping migrations"
  echo "ℹ️  App will run in demo mode"
  exit 0
fi

echo "✅ DATABASE_URL found - running migrations"
npx prisma migrate deploy
