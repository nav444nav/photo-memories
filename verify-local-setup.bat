@echo off
REM Photo Memories - Local Setup Verification Script (Windows)
REM Run this after completing local setup to verify everything works

echo.
echo Photo Memories - Local Setup Verification
echo ==============================================
echo.

setlocal enabledelayedexpansion
set PASSED=0
set FAILED=0

REM Check 1: Node.js version
echo Checking prerequisites...
where node >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo [PASS] Node.js installed: !NODE_VERSION!
    set /a PASSED+=1
) else (
    echo [FAIL] Node.js not found - please install Node.js 18+
    set /a FAILED+=1
)

REM Check 2: npm version
where npm >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo [PASS] npm installed: !NPM_VERSION!
    set /a PASSED+=1
) else (
    echo [FAIL] npm not found
    set /a FAILED+=1
)

echo.
echo Checking project structure...

REM Check 3: Backend directory
if exist "backend\" (
    echo [PASS] Backend directory exists
    set /a PASSED+=1
) else (
    echo [FAIL] Backend directory not found
    set /a FAILED+=1
)

REM Check 4: Frontend directory
if exist "frontend\" (
    echo [PASS] Frontend directory exists
    set /a PASSED+=1
) else (
    echo [FAIL] Frontend directory not found
    set /a FAILED+=1
)

echo.
echo Checking configuration files...

REM Check 5: Backend .env
if exist "backend\.env" (
    echo [PASS] Backend .env exists
    set /a PASSED+=1
) else (
    echo [FAIL] Backend .env not found
    set /a FAILED+=1
)

REM Check 6: Frontend .env
if exist "frontend\.env" (
    echo [PASS] Frontend .env exists
    set /a PASSED+=1

    REM Check if mock API is disabled
    findstr /C:"VITE_USE_MOCK_API=false" frontend\.env >nul
    if %errorlevel% equ 0 (
        echo [PASS] Mock API disabled (using real backend)
        set /a PASSED+=1
    ) else (
        echo [WARN] Mock API still enabled - set VITE_USE_MOCK_API=false
    )
) else (
    echo [FAIL] Frontend .env not found
    set /a FAILED+=1
)

echo.
echo Checking dependencies...

REM Check 7: Backend node_modules
if exist "backend\node_modules\" (
    echo [PASS] Backend dependencies installed
    set /a PASSED+=1
) else (
    echo [WARN] Backend dependencies not installed - run: cd backend ^&^& npm install
)

REM Check 8: Frontend node_modules
if exist "frontend\node_modules\" (
    echo [PASS] Frontend dependencies installed
    set /a PASSED+=1
) else (
    echo [WARN] Frontend dependencies not installed - run: cd frontend ^&^& npm install
)

echo.
echo Checking database...

REM Check 9: Prisma schema
if exist "backend\prisma\schema.prisma" (
    echo [PASS] Prisma schema exists
    set /a PASSED+=1
) else (
    echo [FAIL] Prisma schema not found
    set /a FAILED+=1
)

REM Check 10: Database file
if exist "backend\prisma\dev.db" (
    echo [PASS] SQLite database file exists
    set /a PASSED+=1
) else (
    echo [WARN] Database not initialized - run: cd backend ^&^& npm run db:migrate
)

REM Check 11: Prisma Client
if exist "backend\node_modules\.prisma\client\" (
    echo [PASS] Prisma Client generated
    set /a PASSED+=1
) else (
    echo [WARN] Prisma Client not generated - run: cd backend ^&^& npm run db:generate
)

echo.
echo Checking if servers are running...

REM Check 12: Backend server
curl -s http://localhost:3000/health >nul 2>nul
if %errorlevel% equ 0 (
    echo [PASS] Backend server is running on port 3000
    set /a PASSED+=1
) else (
    echo [WARN] Backend server not running - start with: cd backend ^&^& npm run dev
)

REM Check 13: Frontend server
curl -s http://localhost:5173 >nul 2>nul
if %errorlevel% equ 0 (
    echo [PASS] Frontend server is running on port 5173
    set /a PASSED+=1
) else (
    echo [WARN] Frontend server not running - start with: cd frontend ^&^& npm run dev
)

echo.
echo ==============================================
echo Results: !PASSED! passed, !FAILED! failed
echo.

if !FAILED! equ 0 (
    echo [SUCCESS] Setup looks good! You're ready to go.
    echo.
    echo Next steps:
    echo   1. Open http://localhost:5173 in your browser
    echo   2. Register a new account
    echo   3. Login and test the app
    echo.
) else (
    echo [WARNING] Some checks failed. Please review the errors above.
    echo.
    echo Quick fixes:
    echo   - Install dependencies: cd backend ^&^& npm install ^&^& cd ..\frontend ^&^& npm install
    echo   - Setup database: cd backend ^&^& npm run db:migrate
    echo   - Start servers: Open two terminals:
    echo       Terminal 1: cd backend ^&^& npm run dev
    echo       Terminal 2: cd frontend ^&^& npm run dev
    echo.
)

echo For detailed setup instructions, see: LOCAL_SETUP_GUIDE.md
echo.

pause
