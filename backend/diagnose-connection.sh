#!/bin/bash

echo "🔍 Supabase Connection Diagnostics"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ .env.production not found${NC}"
    echo "Run this first: cp .env.production.example .env.production"
    exit 1
fi

# Load DATABASE_URL
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d= -f2- | tr -d '"' | tr -d "'")

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL is empty in .env.production${NC}"
    exit 1
fi

# Check for placeholders
if [[ $DATABASE_URL == *"YOUR_"* ]] || [[ $DATABASE_URL == *"REPLACE"* ]] || [[ $DATABASE_URL == *"[YOUR"* ]]; then
    echo -e "${RED}❌ DATABASE_URL still has placeholder values${NC}"
    echo ""
    echo "Your DATABASE_URL contains placeholders like:"
    echo "  - YOUR_SUPABASE_PASSWORD_HERE"
    echo "  - YOUR_PROJECT_REF"
    echo "  - [YOUR-PASSWORD]"
    echo ""
    echo "Please replace these with your actual Supabase credentials."
    exit 1
fi

echo -e "${GREEN}✓${NC} .env.production file found"
echo ""

# Parse connection string
echo "📊 Connection String Analysis:"
echo "─────────────────────────────"

# Extract components
if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
    USER="${BASH_REMATCH[1]}"
    PASS="${BASH_REMATCH[2]}"
    HOST="${BASH_REMATCH[3]}"
    PORT="${BASH_REMATCH[4]}"
    DB="${BASH_REMATCH[5]}"

    echo "User:     $USER"
    echo "Password: ${PASS:0:3}***${PASS: -3} (length: ${#PASS})"
    echo "Host:     $HOST"
    echo "Port:     $PORT"
    echo "Database: $DB"
    echo ""

    # Check connection string format
    if [[ $HOST == *"pooler.supabase.com"* ]]; then
        echo -e "${GREEN}✓${NC} Using connection pooler (recommended)"
        if [ "$PORT" = "6543" ]; then
            echo -e "${GREEN}✓${NC} Using Session mode (port 6543) - GOOD!"
        elif [ "$PORT" = "5432" ]; then
            echo -e "${YELLOW}⚠${NC} Using Transaction mode (port 5432)"
            echo "  Recommendation: Switch to Session mode (port 6543) in Supabase dashboard"
        fi
    elif [[ $HOST == *"db."* ]] && [[ $HOST == *".supabase.co"* ]]; then
        echo -e "${YELLOW}⚠${NC} Using direct connection (not pooler)"
        echo "  Recommendation: Use pooler connection for better performance"
    else
        echo -e "${RED}❌${NC} Unexpected host format: $HOST"
    fi
    echo ""

    # Check for special characters in password
    if [[ $PASS =~ [^a-zA-Z0-9] ]]; then
        echo -e "${YELLOW}⚠${NC} Password contains special characters"
        echo "  Make sure they are URL-encoded:"
        echo "  @ → %40, # → %23, $ → %24, % → %25, ! → %21, & → %26"
        echo ""
        echo "  Use: ./encode-password.sh 'YourPassword' to encode it"
        echo ""
    fi

else
    echo -e "${RED}❌${NC} Could not parse DATABASE_URL format"
    echo "Expected format:"
    echo "postgresql://USER:PASS@HOST:PORT/DATABASE"
    exit 1
fi

# Test DNS resolution
echo "🌐 Testing DNS Resolution:"
echo "─────────────────────────"
if host "$HOST" > /dev/null 2>&1; then
    IP=$(host "$HOST" | grep "has address" | head -1 | awk '{print $4}')
    echo -e "${GREEN}✓${NC} Host resolves to: $IP"
else
    echo -e "${RED}❌${NC} Cannot resolve hostname: $HOST"
    echo "  Check your internet connection"
    exit 1
fi
echo ""

# Test network connectivity
echo "🔌 Testing Network Connectivity:"
echo "────────────────────────────────"
if command -v nc &> /dev/null; then
    if nc -z -w5 "$HOST" "$PORT" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Port $PORT is reachable on $HOST"
    else
        echo -e "${RED}❌${NC} Cannot connect to $HOST:$PORT"
        echo "  Possible causes:"
        echo "  1. Firewall blocking connection"
        echo "  2. Supabase project is paused"
        echo "  3. Network issue"
        echo ""
        echo "  Try opening https://app.supabase.com and check if project is active"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠${NC} 'nc' command not available, skipping port test"
fi
echo ""

# Test with Prisma
echo "🧪 Testing with Prisma:"
echo "───────────────────────"
export DATABASE_URL
if npx prisma db execute --stdin <<< "SELECT 1;" 2>&1 | grep -q "Error"; then
    echo -e "${RED}❌${NC} Prisma connection failed"
    echo ""
    echo "Full error:"
    npx prisma db execute --stdin <<< "SELECT 1;" 2>&1
    exit 1
else
    echo -e "${GREEN}✓${NC} Prisma can connect to database!"
    echo ""
    echo -e "${GREEN}🎉 Connection successful!${NC}"
    echo ""
    echo "You can now run migrations:"
    echo "  DATABASE_URL=\"\$(grep DATABASE_URL .env.production | cut -d= -f2 | tr -d '\"')\" npx prisma migrate deploy"
fi

echo ""
