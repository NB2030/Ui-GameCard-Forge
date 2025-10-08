param(
    [string]$Version = "",           # Specific version number (optional)
    [ValidateSet("patch", "minor", "major")]
    [string]$IncrementType = "patch", # Auto-increment type
    [switch]$SyncOnly,               # Sync only without build
    [switch]$TestBuild,              # Test build only
    [switch]$SkipVersion,            # Skip version update
    [switch]$Verbose                 # Show additional details
)

# Console preferences
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Helper output functions
function Write-StepHeader($step, $total, $title) {
    Write-Host ""
    Write-Host "⏳ Step $step/$total`: $title..." -ForegroundColor Cyan
}

function Write-Success($message) {
    Write-Host "   ✅ $message" -ForegroundColor Green
}

function Write-Info($message) {
    Write-Host "   📋 $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "   ❌ $message" -ForegroundColor Red
}

# Read JSON file helper
function Get-JsonConfig($filePath) {
    if (Test-Path $filePath) {
        return Get-Content $filePath -Raw | ConvertFrom-Json
    }
    return $null
}

# Write JSON file helper
function Set-JsonConfig($filePath, $config) {
    $config | ConvertTo-Json -Depth 10 | Set-Content $filePath -Encoding UTF8
}

# Version increment helper
function Get-NextVersion($currentVersion, $incrementType) {
    $versionParts = $currentVersion.Split('.')
    $major = [int]$versionParts[0]
    $minor = [int]$versionParts[1]  
    $patch = [int]$versionParts[2]
    
    switch ($incrementType) {
        "major" { $major++; $minor = 0; $patch = 0 }
        "minor" { $minor++; $patch = 0 }
        "patch" { $patch++ }
    }
    
    return "$major.$minor.$patch"
}

# Entry banner
Write-Host ""
Write-Host "🚀 GameCard Forge Release Builder v2.0" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta

# Load configuration files
$buildConfig = Get-JsonConfig "build-config.json"
$versionInfo = Get-JsonConfig "version-info.json"

if (-not $buildConfig) {
    Write-Error "build-config.json not found!"
    exit 1
}

if (-not $versionInfo) {
    Write-Error "version-info.json not found!"
    exit 1
}

# Step 1: Environment Check
Write-StepHeader 1 6 "Environment Check"

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js $nodeVersion found"
} catch {
    Write-Error "Node.js not found! Please install Node.js"
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Success "npm $npmVersion found"
} catch {
    Write-Error "npm not found!"
    exit 1
}

# Install dependencies if missing
if (-not (Test-Path "node_modules")) {
    Write-Info "node_modules folder not found. Running npm install..."
    try {
        npm install | Out-Null
        Write-Success "npm dependencies installed"
    } catch {
        Write-Error "npm install failed: $_"
        exit 1
    }
} else {
    Write-Info "Dependencies already installed (node_modules found)"
}

# Check source folder (optional for mirrored project)
$sourcePath = $buildConfig.sourcePath
if ($sourcePath -and (Test-Path $sourcePath)) {
    Write-Success "Source project found: $sourcePath"
} else {
    Write-Info "Source project not found or not configured - using current directory"
}

# Step 2: Version Management
Write-StepHeader 2 6 "Version Management"

$currentVersion = $versionInfo.currentVersion
$newVersion = $currentVersion

if (-not $SkipVersion) {
    if ($Version) {
        $newVersion = $Version
        Write-Info "Manual version specified: $newVersion"
    } elseif ($buildConfig.versionSettings.autoIncrement) {
        $newVersion = Get-NextVersion $currentVersion $IncrementType
        Write-Info "Auto-increment ($IncrementType): $currentVersion → $newVersion"
    }
    
    if ($newVersion -ne $currentVersion) {
        # Update version-info.json
        $versionInfo.currentVersion = $newVersion
        $versionInfo.lastBuildDate = Get-Date -Format "yyyy-MM-dd"
        $versionInfo.buildNumber++
        $versionInfo.versionHistory += @{
            version = $newVersion
            date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            notes = "Auto-generated release"
        }
        Set-JsonConfig "version-info.json" $versionInfo
        Write-Success "Version updated: $newVersion"
        
        # Update package.json
        $packageJson = Get-JsonConfig "package.json"
        $packageJson.version = $newVersion
        Set-JsonConfig "package.json" $packageJson
        Write-Success "package.json updated"
        
        # Update metadata.json (add version if missing)
        $metadataJson = Get-JsonConfig "metadata.json"
        if ($metadataJson) {
            $metadataJson | Add-Member -NotePropertyName "version" -NotePropertyValue $newVersion -Force
            Set-JsonConfig "metadata.json" $metadataJson
            Write-Success "metadata.json updated"
        }
        
        # Update main.js About dialog
        if (Test-Path "main.js") {
            $mainJsContent = Get-Content "main.js" -Raw
            $versionPattern = "Version: \d+\.\d+\.\d+"
            $newVersionString = "Version: $newVersion"
            
            if ($mainJsContent -match $versionPattern) {
                $updatedContent = $mainJsContent -replace $versionPattern, $newVersionString
                Set-Content "main.js" $updatedContent -Encoding UTF8
                Write-Success "main.js About dialog updated"
            } else {
                Write-Info "main.js version pattern not found (skipped)"
            }
        }
    }
} else {
    Write-Info "Version update skipped"
}

# Step 3: File Synchronization (optional for mirrored project)
Write-StepHeader 3 6 "File Synchronization"

if ($sourcePath -and (Test-Path $sourcePath)) {
    $fileCount = 0
    $folderCount = 0

    # Copy selected files
    foreach ($file in $buildConfig.syncSettings.filesToCopy) {
        $sourceFilePath = Join-Path $sourcePath $file
        if (Test-Path $sourceFilePath) {
            Copy-Item $sourceFilePath . -Force
            $fileCount++
            if ($Verbose) { Write-Success "Copied: $file" }
        }
    }

    # Sync folders
    foreach ($folder in $buildConfig.syncSettings.foldersToSync) {
        $sourceFolderPath = Join-Path $sourcePath $folder
        if (Test-Path $sourceFolderPath) {
            if (Test-Path $folder) {
                Remove-Item $folder -Recurse -Force
            }
            Copy-Item $sourceFolderPath . -Recurse -Force
            $folderCount++
            if ($Verbose) { Write-Success "Synced folder: $folder" }
        }
    }

    Write-Success "$fileCount files and $folderCount folders synchronized"
} else {
    Write-Info "File synchronization skipped (no source path configured)"
}

# Stop here if SyncOnly is set
if ($SyncOnly) {
    Write-Host ""
    Write-Host "🎉 Synchronization completed!" -ForegroundColor Green
    exit 0
}

# Step 4: Web App Build
Write-StepHeader 4 6 "Web App Build"

$buildStart = Get-Date
try {
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force
        Write-Success "Cleaned previous build"
    }
    
    npm run build | Out-Null
    $buildEnd = Get-Date
    $buildTime = ($buildEnd - $buildStart).TotalSeconds
    Write-Success "Vite build completed ($([math]::Round($buildTime, 1))s)"
} catch {
    Write-Error "Web app build failed: $_"
    exit 1
}

# Step 5: Electron Packaging
Write-StepHeader 5 6 "Electron Packaging"

try {
    if ($TestBuild) {
        npm run electron:pack | Out-Null
        Write-Success "Electron app packaged (test build)"
    } else {
        npm run electron:build-win | Out-Null  
        Write-Success "Electron app packaged with installer"
    }
} catch {
    Write-Error "Electron packaging failed: $_"
    exit 1
}

# Step 6: Build Summary
Write-StepHeader 6 6 "Build Summary"

$outputPath = $buildConfig.buildSettings.outputPath
if (Test-Path $outputPath) {
    $installerFile = Get-ChildItem "$outputPath\*.exe" | Where-Object { $_.Name -like "*Setup*" } | Select-Object -First 1
    
    if ($installerFile) {
        $sizeMB = [math]::Round($installerFile.Length / 1MB, 1)
        Write-Success "Installer created: $($installerFile.Name) ($sizeMB MB)"
    }
    
    $exeFile = Get-ChildItem "$outputPath\win-unpacked\*.exe" | Select-Object -First 1
    if ($exeFile) {
        Write-Success "Executable: $($exeFile.Name)"
    }
}

# Final summary
Write-Host ""
Write-Host "🎉 GameCard Forge v$newVersion Build Completed Successfully!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
if (-not $TestBuild) {
    Write-Host "📁 Output: release\GameCard Forge Setup $newVersion.exe" -ForegroundColor White
}
Write-Host "⏱️  Build #$($versionInfo.buildNumber) completed at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor White
Write-Host "🚀 Ready for distribution!" -ForegroundColor White
Write-Host ""