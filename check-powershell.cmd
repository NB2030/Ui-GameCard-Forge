@echo off
title PowerShell Environment Check

echo.
echo 🔍 PowerShell Environment Diagnostic
echo ===================================
echo.

REM Change to script directory
cd /d "%~dp0"
echo Current Directory: %CD%
echo.

REM Check PowerShell Core
echo Checking PowerShell Core (pwsh)...
pwsh -Command "Write-Host '✅ PowerShell Core found:' $PSVersionTable.PSVersion" 2>nul
if errorlevel 1 (
    echo ❌ PowerShell Core not found
) else (
    echo.
)

REM Check Windows PowerShell
echo Checking Windows PowerShell...
powershell -Command "Write-Host '✅ Windows PowerShell found:' $PSVersionTable.PSVersion"
echo.

REM Check execution policy
echo Checking Execution Policy...
powershell -Command "Write-Host 'Current Execution Policy:' (Get-ExecutionPolicy)"
echo.

REM Check if script files exist
echo Checking script files...
if exist "build-menu.ps1" (
    echo ✅ build-menu.ps1 found
) else (
    echo ❌ build-menu.ps1 not found
)

if exist "build-release.ps1" (
    echo ✅ build-release.ps1 found
) else (
    echo ❌ build-release.ps1 not found
)

echo.
echo 💡 Solutions:
echo 1. Use build.cmd to run the script (recommended)
echo 2. Or right-click on build.cmd and "Run as administrator"
echo 3. Or open PowerShell in this folder and run: .\build-menu.ps1
echo.

pause