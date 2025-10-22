#!/bin/bash
echo "🔍 Testing Supabase connection..."
echo ""

# Load DATABASE_URL from .env.production
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production not found"
    exit 1
fi

DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d= -f2- | tr -d '"')

if [[ $DATABASE_URL == *"YOUR_"* ]] || [[ $DATABASE_URL == *"REPLACE"* ]]; then
    echo "❌ Error: .env.production still has placeholder values"
    echo "Please update DATABASE_URL with your actual Supabase connection string"
    exit 1
fi

echo "📝 Connection string found (showing first 50 chars):"
echo "${DATABASE_URL:0:50}..."
echo ""

# Test with Prisma
echo "🧪 Testing connection with Prisma..."
DATABASE_URL="$DATABASE_URL" npx prisma db pull --force 2>&1 | head -20

