#!/bin/bash

# Script to fix failed Prisma migration in Neon database

echo "=== Fixing Failed Migration in Neon Database ==="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set it first:"
    echo "  export DATABASE_URL='your-neon-connection-string'"
    exit 1
fi

echo "Step 1: Marking failed migration as rolled back..."
npx prisma migrate resolve --rolled-back "20251022005512_init"

echo ""
echo "Step 2: Using db push to sync schema directly (bypasses migrations)..."
npx prisma db push

echo ""
echo "Step 3: Verifying connection with Prisma Studio..."
echo "Opening Prisma Studio - press Ctrl+C when done checking"
npx prisma studio

echo ""
echo "✅ Done! Database should now be synced with your schema."
