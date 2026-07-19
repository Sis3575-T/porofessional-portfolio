@echo off
echo === Portfolio Pro Setup ===
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo npm install failed. Check your network connection.
    exit /b %errorlevel%
)

echo.
echo Step 2: Setting environment variable...
set DATABASE_URL=postgresql://neondb_owner:npg_o1mGAvbFN0gQ@ep-misty-shape-avslqmqr-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

echo.
echo Step 3: Pushing database schema...
npx prisma db push --schema=prisma/schema.prisma
if %errorlevel% neq 0 (
    echo Database push failed. Check your DATABASE_URL in .env
    exit /b %errorlevel%
)

echo.
echo Step 4: Seeding database...
node prisma/seed.js

echo.
echo === Setup Complete! ===
echo.
echo Run these in separate terminals:
echo   Terminal 1: npm run dev:api
echo   Terminal 2: npm run dev:web
echo   Terminal 3: npm run dev:admin
echo.
echo Admin login: sisay3575@gmail.com / Sis3575@
pause
