@echo off
echo ============================================
echo   Portfolio Pro - Manual Dev Startup
echo ============================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Install from https://nodejs.org
    pause
    exit /b 1
)

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed
    pause
    exit /b 1
)

echo.
echo [2/5] Pushing database schema to Neon...
call npx prisma db push --schema=prisma/schema.prisma
if %errorlevel% neq 0 (
    echo [ERROR] Prisma db push failed. Check your DATABASE_URL in .env
    pause
    exit /b 1
)

echo.
echo [3/5] Generating Prisma Client...
call npx prisma generate --schema=prisma/schema.prisma

echo.
echo [4/5] Seeding database...
call node prisma/seed.js
if %errorlevel% neq 0 (
    echo [WARNING] Seed failed (data may already exist). Continuing...
)

echo.
echo [5/5] Starting all services...
echo.
echo ============================================
echo   Starting 7 terminals - do NOT close them
echo ============================================
echo.

REM Start Gateway (port 5000)
start "API Gateway - port 5000" cmd /k "cd /d %~dp0\services\api && node --watch src/server.js"

REM Start Auth Service (port 5001)
start "Auth Service - port 5001" cmd /k "cd /d %~dp0\services\auth-service && node --watch src/server.js"

REM Start Portfolio Service (port 5002)
start "Portfolio Service - port 5002" cmd /k "cd /d %~dp0\services\portfolio-service && node --watch src/server.js"

REM Start Media Service (port 5003)
start "Media Service - port 5003" cmd /k "cd /d %~dp0\services\media-service && node --watch src/server.js"

REM Start Dashboard Service (port 5004)
start "Dashboard Service - port 5004" cmd /k "cd /d %~dp0\services\dashboard-service && node --watch src/server.js"

REM Wait for backend services to start
echo Waiting for backend services to start...
timeout /t 3 /nobreak >nul

REM Start Web Frontend (port 5175)
start "Web Frontend - port 5175" cmd /k "cd /d %~dp0\apps\web && npm run dev"

REM Start Admin Dashboard (port 5174)
start "Admin Dashboard - port 5174" cmd /k "cd /d %~dp0\apps\admin && npm run dev"

echo.
echo ============================================
echo   All services started!
echo ============================================
echo.
echo   Portfolio:   http://localhost:5175
echo   Admin:       http://localhost:5174
echo   API Gateway: http://localhost:5000
echo   Health:      http://localhost:5000/health
echo.
echo   Admin Login:
echo     Email:    sisay3575@gmail.com
echo     Password: Sis3575@
echo.
echo   Close this window freely. Services run in their own terminals.
echo ============================================
pause
