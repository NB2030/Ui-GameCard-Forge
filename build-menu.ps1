# GameCard Forge Interactive Build Menu
# Run this script to get an interactive build menu

param([switch]$Auto)

$ErrorActionPreference = "Stop"

# Function to show header
function Show-Header {
    Clear-Host
    Write-Host ""
    Write-Host "🎮 GameCard Forge - Build System" -ForegroundColor Magenta
    Write-Host "═══════════════════════════════════" -ForegroundColor Magenta
    Write-Host ""
}

# Function to show menu
function Show-Menu {
    Write-Host "Choose the operation you want:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1️⃣  Build new patch release (patch: 1.0.3 → 1.0.4)" -ForegroundColor Green
    Write-Host "2️⃣  Build minor release (minor: 1.0.3 → 1.1.0)" -ForegroundColor Green  
    Write-Host "3️⃣  Build major release (major: 1.0.3 → 2.0.0)" -ForegroundColor Green
    Write-Host "4️⃣  Build with custom version number" -ForegroundColor Green
    Write-Host ""
    Write-Host "5️⃣  Sync files only (no build)" -ForegroundColor Cyan
    Write-Host "6️⃣  Test build (no installer)" -ForegroundColor Cyan
    Write-Host "7️⃣  Full build without version update" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "8️⃣  Show current version info" -ForegroundColor White
    Write-Host "9️⃣  Show usage guide" -ForegroundColor White
    Write-Host ""
    Write-Host "0️⃣  Exit" -ForegroundColor Red
    Write-Host ""
}

# Function to read JSON files
function Get-JsonConfig($filePath) {
    if (Test-Path $filePath) {
        return Get-Content $filePath -Raw | ConvertFrom-Json
    }
    return $null
}

# Function to show version information
function Show-VersionInfo {
    $versionInfo = Get-JsonConfig "version-info.json"
    if ($versionInfo) {
        Write-Host ""
        Write-Host "📊 Current Version Information:" -ForegroundColor Yellow
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
        Write-Host "Current Version: $($versionInfo.currentVersion)" -ForegroundColor White
        Write-Host "Build Number: $($versionInfo.buildNumber)" -ForegroundColor White
        Write-Host "Last Updated: $($versionInfo.lastBuildDate)" -ForegroundColor White
        
        if ($versionInfo.versionHistory -and $versionInfo.versionHistory.Count -gt 0) {
            Write-Host ""
            Write-Host "Last 3 versions:" -ForegroundColor Gray
            $recent = $versionInfo.versionHistory | Select-Object -Last 3
            foreach ($version in $recent) {
                Write-Host "  • v$($version.version) - $($version.date)" -ForegroundColor Gray
            }
        }
        Write-Host ""
    } else {
        Write-Host "❌ Version information file not found!" -ForegroundColor Red
    }
}

# Function to show quick usage guide
function Show-Usage {
    Write-Host ""
    Write-Host "📖 Quick Usage Guide:" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Put your development project in:" -ForegroundColor White
    Write-Host "   C:\\ai-Projects\\UI Game Card Maker\\GameCard-Forge-Dev\\" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Run this script and choose an option" -ForegroundColor White
    Write-Host ""
    Write-Host "3. After build, outputs will be in:" -ForegroundColor White
    Write-Host "   release\\GameCard Forge Setup X.X.X.exe" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Tips:" -ForegroundColor Yellow
    Write-Host "• patch: for small fixes" -ForegroundColor Gray
    Write-Host "• minor: for new features" -ForegroundColor Gray  
    Write-Host "• major: for breaking changes" -ForegroundColor Gray
    Write-Host ""
}

# Function to run the build script
function Run-BuildScript($params) {
    Write-Host ""
    Write-Host "🚀 Starting build process..." -ForegroundColor Green
    Write-Host ""
    
    try {
        & ".\build-release.ps1" @params
        Write-Host ""
        Write-Host "✅ Operation completed successfully!" -ForegroundColor Green
    } catch {
        Write-Host ""
        Write-Host "❌ Error occurred: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Press any key to return to menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
}

# Function to confirm actions
function Confirm-Action($message) {
    Write-Host ""
    Write-Host "⚠️  $message" -ForegroundColor Yellow
    $response = Read-Host "Are you sure? (y/N)"
    return $response -eq 'y' -or $response -eq 'Y' -or $response -eq 'yes'
}

# Main loop
do {
    Show-Header
    
    # Check required files
    if (-not (Test-Path "build-release.ps1")) {
        Write-Host "❌ build-release.ps1 not found" -ForegroundColor Red
        Write-Host "Make sure to run the script in the same folder as the project" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    if (-not (Test-Path "..\\GameCard-Forge-Dev")) {
        Write-Host "⚠️  Warning: GameCard-Forge-Dev folder not found!" -ForegroundColor Yellow
        Write-Host "Create it and put your project there before building" -ForegroundColor Gray
        Write-Host ""
    }
    
    Show-Menu
    $choice = Read-Host "Your choice"
    
    switch ($choice) {
        "1" {
            if (Confirm-Action "Will build a new patch release") {
                Run-BuildScript @{}
            }
        }
        "2" {
            if (Confirm-Action "Will build a new minor release") {
                Run-BuildScript @{IncrementType = "minor"}
            }
        }
        "3" {
            if (Confirm-Action "Will build a new major release") {
                Run-BuildScript @{IncrementType = "major"}
            }
        }
        "4" {
            $version = Read-Host "Enter version number (example: 2.1.0)"
            if ($version -match '^\d+\.\d+\.\d+$') {
                if (Confirm-Action "Will build version $version") {
                    Run-BuildScript @{Version = $version}
                }
            } else {
                Write-Host "❌ Invalid version format! Use format: X.Y.Z" -ForegroundColor Red
                Start-Sleep 3
            }
        }
        "5" {
            Run-BuildScript @{SyncOnly = $true}
        }
        "6" {
            Run-BuildScript @{TestBuild = $true}
        }
        "7" {
            if (Confirm-Action "Will build without version update") {
                Run-BuildScript @{SkipVersion = $true}
            }
        }
        "8" {
            Show-VersionInfo
            Write-Host "Press any key to return..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        }
        "9" {
            Show-Usage
            Write-Host "Press any key to return..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        }
        "0" {
            Write-Host ""
            Write-Host "👋 Goodbye!" -ForegroundColor Green
            Write-Host ""
            exit 0
        }
        default {
            Write-Host ""
            Write-Host "❌ Invalid choice! Please choose a number from 0-9" -ForegroundColor Red
            Start-Sleep 2
        }
    }
} while ($true)