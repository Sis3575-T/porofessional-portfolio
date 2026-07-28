@echo off
echo Portfolio Restructure Script
echo ============================
echo.

echo [1/8] Creating backend/ and frontend/ directories...
if not exist backend mkdir backend
if not exist frontend mkdir frontend

echo [2/8] Moving services into backend...
move /y services\api backend\api
move /y services\auth-service backend\auth-service
move /y services\dashboard-service backend\dashboard-service
move /y services\media-service backend\media-service
move /y services\portfolio-service backend\portfolio-service
move /y services\shared backend\shared

echo [3/8] Moving main backend server to backend/ root (flatten)...
if exist services\backend\node_modules rmdir /s /q services\backend\node_modules
move /y services\backend\src backend\src
move /y services\backend\package.json backend\package.json
move /y services\backend\Dockerfile backend\Dockerfile
move /y services\backend\.env backend\.env
if exist services\backend rmdir /s /q services\backend

echo [4/8] Moving apps into frontend...
if exist apps\admin\node_modules rmdir /s /q apps\admin\node_modules
move /y apps\admin frontend\admin
if exist apps\web\node_modules rmdir /s /q apps\web\node_modules
if exist apps\web\dist rmdir /s /q apps\web\dist
move /y apps\web frontend\web

echo [5/8] Moving prisma into backend...
move /y prisma backend\prisma

echo [6/8] Deleting unwanted files/folders...
if exist portfolio-app rmdir /s /q portfolio-app
if exist portfolio-50-task-prompt.md del /q portfolio-50-task-prompt.md
if exist QUICKSTART.md del /q QUICKSTART.md

echo [7/8] Cleaning up empty folders...
if exist apps rmdir /s /q apps
if exist services rmdir /s /q services

echo [8/8] Done! Removing this script...
del "%~f0"

echo.
echo ============================
echo  Restructure complete!
echo ============================
echo.
echo Run these commands:
echo   npm install
echo   npm run dev:all
echo.
pause
