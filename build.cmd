@echo off
REM GameCard Forge Build System Launcher
REM Double-click this file to start the interactive build menu

title GameCard Forge - Build System

REM Change to script directory
cd /d "%~dp0"

echo.
echo 🎮 GameCard Forge Build System
echo ═══════════════════════════════════
echo.
echo Starting PowerShell build menu...
echo.

REM Try PowerShell Core first, then Windows PowerShell
pwsh -ExecutionPolicy Bypass -NoProfile -File "build-menu.ps1" 2>nul
if errorlevel 1 (
    echo PowerShell Core not found, trying Windows PowerShell...
    powershell -ExecutionPolicy Bypass -NoProfile -File "build-menu.ps1"
)

echo.
echo Script finished.
pause
