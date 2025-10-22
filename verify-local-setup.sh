#!/bin/bash

# Photo Memories - Local Setup Verification Script
# Run this after completing local setup to verify everything works

echo "🔍 Photo Memories - Local Setup Verification"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Helper functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check 1: Node.js version
echo "📦 Checking prerequisites..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    check_pass "Node.js installed: $NODE_VERSION"
else
    check_fail "Node.js not found - please install Node.js 18+"
fi

# Check 2: npm version
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_pass "npm installed: $NPM_VERSION"
else
    check_fail "npm not found"
fi

echo ""
echo "🗂️  Checking project structure..."

# Check 3: Backend directory
if [ -d "backend" ]; then
    check_pass "Backend directory exists"
else
    check_fail "Backend directory not found"
fi

# Check 4: Frontend directory
if [ -d "frontend" ]; then
    check_pass "Frontend directory exists"
else
    check_fail "Frontend directory not found"
fi

echo ""
echo "📄 Checking configuration files..."

# Check 5: Backend .env
if [ -f "backend/.env" ]; then
    check_pass "Backend .env exists"
else
    check_fail "Backend .env not found"
fi

# Check 6: Frontend .env
if [ -f "frontend/.env" ]; then
    check_pass "Frontend .env exists"

    # Check if mock API is disabled
    if grep -q "VITE_USE_MOCK_API=false" frontend/.env; then
        check_pass "Mock API disabled (using real backend)"
    else
        check_warn "Mock API still enabled - set VITE_USE_MOCK_API=false to use real backend"
    fi
else
    check_fail "Frontend .env not found"
fi

echo ""
echo "📚 Checking dependencies..."

# Check 7: Backend node_modules
if [ -d "backend/node_modules" ]; then
    check_pass "Backend dependencies installed"
else
    check_warn "Backend dependencies not installed - run: cd backend && npm install"
fi

# Check 8: Frontend node_modules
if [ -d "frontend/node_modules" ]; then
    check_pass "Frontend dependencies installed"
else
    check_warn "Frontend dependencies not installed - run: cd frontend && npm install"
fi

echo ""
echo "🗄️  Checking database..."

# Check 9: Prisma schema
if [ -f "backend/prisma/schema.prisma" ]; then
    check_pass "Prisma schema exists"
else
    check_fail "Prisma schema not found"
fi

# Check 10: Database file
if [ -f "backend/prisma/dev.db" ]; then
    check_pass "SQLite database file exists"
else
    check_warn "Database not initialized - run: cd backend && npm run db:migrate"
fi

# Check 11: Prisma Client
if [ -d "backend/node_modules/.prisma/client" ]; then
    check_pass "Prisma Client generated"
else
    check_warn "Prisma Client not generated - run: cd backend && npm run db:generate"
fi

echo ""
echo "🌐 Checking if servers are running..."

# Check 12: Backend server
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    check_pass "Backend server is running on port 3000"
elif nc -z localhost 3000 2>/dev/null; then
    check_warn "Port 3000 is in use but health check failed"
else
    check_warn "Backend server not running - start with: cd backend && npm run dev"
fi

# Check 13: Frontend server
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    check_pass "Frontend server is running on port 5173"
elif nc -z localhost 5173 2>/dev/null; then
    check_warn "Port 5173 is in use but server check failed"
else
    check_warn "Frontend server not running - start with: cd frontend && npm run dev"
fi

echo ""
echo "=============================================="
echo "📊 Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Setup looks good! You're ready to go.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Open http://localhost:5173 in your browser"
    echo "  2. Register a new account"
    echo "  3. Login and test the app"
    echo ""
else
    echo -e "${RED}⚠️  Some checks failed. Please review the errors above.${NC}"
    echo ""
    echo "Quick fixes:"
    echo "  • Install dependencies: cd backend && npm install && cd ../frontend && npm install"
    echo "  • Setup database: cd backend && npm run db:migrate"
    echo "  • Start servers: cd backend && npm run dev (in one terminal)"
    echo "                   cd frontend && npm run dev (in another terminal)"
    echo ""
fi

echo "📖 For detailed setup instructions, see: LOCAL_SETUP_GUIDE.md"
echo ""
