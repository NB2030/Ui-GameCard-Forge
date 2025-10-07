# 🚀 الدليل الشامل لتحويل مشروع React/Vite إلى تطبيق Electron

<div dir="rtl">

## 📋 المقدمة

هذا الدليل يشرح خطوة بخطوة كيفية تحويل أي مشروع React/Vite موجود إلى تطبيق Electron مع نظام بناء متقدم مماثل لـ GameCard Forge.

### ما ستحصل عليه:
- ✅ تطبيق Electron كامل لسطح المكتب
- ✅ نظام بناء تلقائي متطور
- ✅ إدارة إصدارات تلقائية
- ✅ سكربت PowerShell متقدم للبناء
- ✅ ملفات تثبيت جاهزة للتوزيع

---

## 🎯 المتطلبات الأساسية

قبل البدء، تأكد من وجود:

### البرمجيات المطلوبة:
- **Node.js** (الإصدار 18 أو أحدث) - [تحميل من هنا](https://nodejs.org/)
- **npm** أو **yarn** (يأتي مع Node.js)
- **PowerShell** (متوفر في Windows بشكل افتراضي)
- **Git** (اختياري للتحكم في الإصدارات)

### التحقق من التثبيت:
```bash
# فحص Node.js
node --version
# يجب أن يظهر: v18.x.x أو أحدث

# فحص npm
npm --version
# يجب أن يظهر: 8.x.x أو أحدث

# فحص PowerShell
pwsh --version
# أو
powershell -command '$PSVersionTable.PSVersion'
```

---

## 📁 إعداد هيكل المشروع

### الخطوة 1: إعداد المجلدات

أولاً، ننشئ هيكل مشروع منفصل للتطوير والإنتاج:

```bash
# إنشاء مجلد رئيسي للمشروع
mkdir "C:\MyProjects\MyApp"
cd "C:\MyProjects\MyApp"

# إنشاء مجلدين منفصلين
mkdir "MyApp-Dev"          # مشروع التطوير (React/Vite فقط)
mkdir "MyApp-Electron"     # مشروع Electron (للإصدارات)
```

### الخطوة 2: نسخ مشروعك الحالي

```bash
# نسخ مشروع React/Vite الموجود إلى مجلد التطوير
cp -r "path\to\your\existing\project\*" "MyApp-Dev\"

# أو إذا كان مشروعك في Git
cd MyApp-Dev
git clone https://github.com/username/your-react-project.git .
```

---

## 🔧 إعداد مشروع Electron

### الخطوة 3: إعداد مجلد Electron

```bash
cd "C:\MyProjects\MyApp\MyApp-Electron"

# إنشاء package.json للمشروع
npm init -y
```

### الخطوة 4: تثبيت dependencies الأساسية

```bash
# تثبيت React و Vite (نفس إصدارات مشروعك الأصلي)
npm install react react-dom

# تثبيت Vite وأدوات التطوير
npm install --save-dev vite @vitejs/plugin-react typescript

# تثبيت Electron وأدوات البناء
npm install --save-dev electron electron-builder

# تثبيت أدوات مساعدة للتطوير
npm install --save-dev concurrently cross-env wait-on
```

### الخطوة 5: إنشاء ملف main.js

إنشاء ملف `main.js` في جذر مجلد Electron:

```javascript
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,              // 🔧 غير الأبعاد حسب احتياجاتك
    height: 900,
    minWidth: 1200,           // 🔧 أقل عرض مسموح
    minHeight: 800,           // 🔧 أقل ارتفاع مسموح
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    show: false
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');  // 🔧 غير المنفذ إذا لزم الأمر
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',                    // 🔧 خصص حسب تطبيقك
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.reload();
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About My App',           // 🔧 غير اسم التطبيق
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About',
              message: 'My App Name',      // 🔧 اسم تطبيقك
              detail: 'Description of your app.\\n\\nVersion: 1.0.0\\nDeveloped by: Your Name'
            });
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// الأمان
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'file://') {
      event.preventDefault();
    }
  });
});
```

### الخطوة 6: إعداد Vite Configuration

إنشاء ملف `vite.config.ts`:

```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // 🔧 إضافة متغيرات البيئة التي يحتاجها تطبيقك
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    base: './', // مهم جداً لـ Electron
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    },
    server: {
      port: 5173,        // 🔧 غير المنفذ إذا كان مستخدماً
      strictPort: true
    }
  };
});
```

### الخطوة 7: تحديث package.json

```json
{
  "name": "my-app-name",                    // 🔧 اسم تطبيقك
  "private": true,
  "version": "1.0.0",
  "description": "Description of your app", // 🔧 وصف تطبيقك
  "author": "Your Name",                    // 🔧 اسمك
  "main": "main.js",
  "homepage": "./",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .\"",
    "electron:pack": "npm run build && electron-builder --dir",
    "electron:build": "npm run build && electron-builder --publish=never",
    "electron:build-win": "npm run build && electron-builder --win --publish=never"
  },
  "build": {
    "appId": "com.yourcompany.yourapp",     // 🔧 معرف تطبيقك
    "productName": "Your App Name",         // 🔧 اسم المنتج
    "directories": {
      "output": "release",
      "buildResources": "build"
    },
    "files": [
      "main.js",
      "dist/**/*",
      "node_modules/**/*",
      "package.json"
    ],
    "win": {
      "target": {
        "target": "nsis",
        "arch": ["x64"]
      },
      "icon": "assets/icon.ico"             // 🔧 مسار الأيقونة
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    },
    "extraMetadata": {
      "main": "main.js"
    }
  }
}
```

---

## 🎨 إضافة الأصول (Assets)

### الخطوة 8: إعداد الأيقونات

إنشاء مجلد `assets` وإضافة أيقونات التطبيق:

```bash
mkdir assets
```

تحتاج إلى:
- **icon.ico** (للـ Windows) - 256x256 بكسل
- **icon.png** (للعرض العام) - 512x512 بكسل
- **icon.icns** (للـ Mac إذا أردت دعمه لاحقاً)

### نصائح للأيقونات:
- استخدم أدوات مثل [ICO Convert](https://icoconvert.com/) لتحويل الصور
- تأكد من جودة عالية للأيقونات
- احفظ نسخة PNG كبيرة كمصدر أساسي

---

## 🛠️ إنشاء نظام البناء المتقدم

### الخطوة 9: إنشاء ملفات الإعداد

#### أ) ملف `build-config.json`:

```json
{
  "sourcePath": "..\\MyApp-Dev",
  "syncSettings": {
    "filesToCopy": [
      "App.tsx",
      "main.tsx",
      "index.tsx",
      "index.html"
    ],
    "foldersToSync": [
      "src",
      "components",
      "hooks",
      "utils",
      "styles",
      "assets"
    ],
    "filesToPreserve": [
      "main.js",
      "assets\\*",
      "package.json",
      "version-info.json",
      "build-config.json",
      "build-release.ps1",
      "vite.config.ts",
      "tsconfig.json"
    ]
  },
  "buildSettings": {
    "cleanBefore": true,
    "runTests": false,
    "createBackup": true,
    "signCode": false,
    "outputPath": "release"
  },
  "versionSettings": {
    "autoIncrement": true,
    "incrementType": "patch",
    "updateFiles": [
      "package.json",
      "metadata.json",
      "main.js"
    ],
    "mainJsVersionPattern": "Version: \\d+\\.\\d+\\.\\d+"
  }
}
```

#### ب) ملف `version-info.json`:

```json
{
  "currentVersion": "1.0.0",
  "lastBuildDate": "2025-01-01",
  "buildNumber": 1,
  "versionHistory": [
    {
      "version": "1.0.0",
      "date": "2025-01-01",
      "notes": "Initial release"
    }
  ],
  "autoIncrement": {
    "type": "patch",
    "enabled": true
  }
}
```

#### ج) ملف `metadata.json`:

```json
{
  "name": "My App Name",
  "description": "Description of your app",
  "requestFramePermissions": [],
  "version": "1.0.0"
}
```

### الخطوة 10: إنشاء سكربت البناء المتقدم

إنشاء ملف `build-release.ps1`:

```powershell
param(
    [string]$Version = "",
    [ValidateSet("patch", "minor", "major")]
    [string]$IncrementType = "patch",
    [switch]$SyncOnly,
    [switch]$TestBuild,
    [switch]$SkipVersion,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# دوال مساعدة
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

function Get-JsonConfig($filePath) {
    if (Test-Path $filePath) {
        return Get-Content $filePath -Raw | ConvertFrom-Json
    }
    return $null
}

function Set-JsonConfig($filePath, $config) {
    $config | ConvertTo-Json -Depth 10 | Set-Content $filePath -Encoding UTF8
}

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

# بداية السكربت
Write-Host ""
Write-Host "🚀 My App Release Builder v1.0" -ForegroundColor Magenta    # 🔧 غير اسم التطبيق
Write-Host "═══════════════════════════════════" -ForegroundColor Magenta

# قراءة الإعدادات
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

# Step 1: فحص البيئة
Write-StepHeader 1 6 "Environment Check"

try {
    $nodeVersion = node --version
    Write-Success "Node.js $nodeVersion found"
} catch {
    Write-Error "Node.js not found! Please install Node.js"
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Success "npm $npmVersion found"
} catch {
    Write-Error "npm not found!"
    exit 1
}

$sourcePath = $buildConfig.sourcePath
if (-not (Test-Path $sourcePath)) {
    Write-Error "Source path not found: $sourcePath"
    exit 1
}
Write-Success "Source project found: $sourcePath"

# Step 2: إدارة الإصدارات
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
        # تحديث version-info.json
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
        
        # تحديث package.json
        $packageJson = Get-JsonConfig "package.json"
        $packageJson.version = $newVersion
        Set-JsonConfig "package.json" $packageJson
        Write-Success "package.json updated"
        
        # تحديث metadata.json
        $metadataJson = Get-JsonConfig "metadata.json"
        if ($metadataJson) {
            $metadataJson | Add-Member -NotePropertyName "version" -NotePropertyValue $newVersion -Force
            Set-JsonConfig "metadata.json" $metadataJson
            Write-Success "metadata.json updated"
        }
        
        # تحديث main.js
        if (Test-Path "main.js") {
            $mainJsContent = Get-Content "main.js" -Raw
            $versionPattern = "Version: \\d+\\.\\d+\\.\\d+"
            $newVersionString = "Version: $newVersion"
            
            if ($mainJsContent -match $versionPattern) {
                $updatedContent = $mainJsContent -replace $versionPattern, $newVersionString
                Set-Content "main.js" $updatedContent -Encoding UTF8
                Write-Success "main.js version updated"
            }
        }
    }
}

# Step 3: مزامنة الملفات
Write-StepHeader 3 6 "File Synchronization"

$fileCount = 0
$folderCount = 0

# نسخ الملفات المحددة
foreach ($file in $buildConfig.syncSettings.filesToCopy) {
    $sourcePath = Join-Path $buildConfig.sourcePath $file
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath . -Force
        $fileCount++
        if ($Verbose) { Write-Success "Copied: $file" }
    }
}

# نسخ المجلدات
foreach ($folder in $buildConfig.syncSettings.foldersToSync) {
    $sourcePath = Join-Path $buildConfig.sourcePath $folder
    if (Test-Path $sourcePath) {
        if (Test-Path $folder) {
            Remove-Item $folder -Recurse -Force
        }
        Copy-Item $sourcePath . -Recurse -Force
        $folderCount++
        if ($Verbose) { Write-Success "Synced folder: $folder" }
    }
}

Write-Success "$fileCount files and $folderCount folders synchronized"

if ($SyncOnly) {
    Write-Host ""
    Write-Host "🎉 Synchronization completed!" -ForegroundColor Green
    exit 0
}

# Step 4: بناء تطبيق الويب  
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

# Step 5: تعبئة Electron
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

# Step 6: ملخص نهائي
Write-StepHeader 6 6 "Build Summary"

$outputPath = $buildConfig.buildSettings.outputPath
if (Test-Path $outputPath) {
    $installerFile = Get-ChildItem "$outputPath\\*.exe" | Where-Object { $_.Name -like "*Setup*" } | Select-Object -First 1
    
    if ($installerFile) {
        $sizeMB = [math]::Round($installerFile.Length / 1MB, 1)
        Write-Success "Installer created: $($installerFile.Name) ($sizeMB MB)"
    }
    
    $exeFile = Get-ChildItem "$outputPath\\win-unpacked\\*.exe" | Select-Object -First 1
    if ($exeFile) {
        Write-Success "Executable: $($exeFile.Name)"
    }
}

Write-Host ""
Write-Host "🎉 My App v$newVersion Build Completed Successfully!" -ForegroundColor Green    # 🔧 غير اسم التطبيق
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Green
if (-not $TestBuild) {
    Write-Host "📁 Output: release\\My App Setup $newVersion.exe" -ForegroundColor White    # 🔧 غير اسم التطبيق
}
Write-Host "⏱️  Build #$($versionInfo.buildNumber) completed at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor White
Write-Host "🚀 Ready for distribution!" -ForegroundColor White
Write-Host ""
```

---

## 🔄 نسخ ملفات مشروعك

### الخطوة 11: نقل ملفات React

```bash
# الانتقال إلى مجلد Electron
cd "C:\MyProjects\MyApp\MyApp-Electron"

# نسخ ملفات React من مشروع التطوير (تغيير المسار حسب بنية مشروعك)
Copy-Item "..\MyApp-Dev\src" . -Recurse -Force
Copy-Item "..\MyApp-Dev\public" . -Recurse -Force
Copy-Item "..\MyApp-Dev\index.html" . -Force

# نسخ ملفات إضافية حسب الحاجة
Copy-Item "..\MyApp-Dev\*.json" . -Force  # package.json, tsconfig.json, etc.
Copy-Item "..\MyApp-Dev\*.ts" . -Force    # ملفات TypeScript
Copy-Item "..\MyApp-Dev\*.tsx" . -Force   # ملفات React
```

### تخصيص `build-config.json` حسب مشروعك:

قم بتحديث `filesToCopy` و `foldersToSync` حسب بنية مشروعك:

```json
{
  "syncSettings": {
    "filesToCopy": [
      "App.tsx",           // 🔧 الملف الرئيسي لتطبيقك
      "main.tsx",          // 🔧 نقطة الدخول
      "index.html",        // 🔧 ملف HTML الرئيسي
      "vite-env.d.ts"      // 🔧 تعريفات Vite
    ],
    "foldersToSync": [
      "src",               // 🔧 مجلد الكود المصدري
      "public",            // 🔧 الملفات العامة
      "assets",            // 🔧 الأصول
      "components",        // 🔧 المكونات (إذا كانت منفصلة)
      "hooks",             // 🔧 الـ hooks المخصصة
      "utils",             // 🔧 المرافق
      "styles",            // 🔧 ملفات CSS
      "types"              // 🔧 تعريفات TypeScript
    ]
  }
}
```

---

## ✅ اختبار التحويل

### الخطوة 12: اختبار التطوير

```bash
# في مجلد Electron
cd "C:\MyProjects\MyApp\MyApp-Electron"

# تثبيت Dependencies
npm install

# اختبار في وضع التطوير
npm run electron:dev
```

إذا ظهر التطبيق وعمل بشكل صحيح، فالتحويل نجح!

### الخطوة 13: اختبار البناء

```bash
# بناء سريع للاختبار
.\build-release.ps1 -TestBuild

# إذا نجح، بناء كامل مع installer
.\build-release.ps1
```

---

## 🎯 التخصيصات المهمة

### تخصيص main.js:

#### إعدادات النافذة:
```javascript
// في createWindow()
mainWindow = new BrowserWindow({
  width: 1200,              // 🔧 العرض المناسب لتطبيقك
  height: 800,              // 🔧 الارتفاع المناسب
  minWidth: 800,            // 🔧 أقل عرض
  minHeight: 600,           // 🔧 أقل ارتفاع
  // ... باقي الإعدادات
});
```

#### تخصيص القائمة:
```javascript
// في createMenu()
{
  label: 'File',
  submenu: [
    {
      label: 'New Project',        // 🔧 حسب وظائف تطبيقك
      accelerator: 'CmdOrCtrl+N',
      click: () => {
        // 🔧 إضافة الوظيفة المناسبة
      }
    },
    {
      label: 'Open File',          // 🔧 إضافة المزيد من الخيارات
      accelerator: 'CmdOrCtrl+O',
      click: () => {
        // 🔧 إضافة وظيفة فتح الملف
      }
    }
  ]
}
```

### تخصيص package.json:

```json
{
  "name": "my-awesome-app",              // 🔧 اسم تطبيقك
  "productName": "My Awesome App",       // 🔧 الاسم الظاهر
  "description": "An amazing desktop app", // 🔧 الوصف
  "author": "Your Name <email@example.com>", // 🔧 معلوماتك
  "build": {
    "appId": "com.yourcompany.myapp",    // 🔧 معرف فريد
    "productName": "My Awesome App",     // 🔧 اسم المنتج
    "win": {
      "icon": "assets/icon.ico",         // 🔧 مسار الأيقونة
      "target": "nsis"                   // أو "portable" للنسخة المحمولة
    }
  }
}
```

---

## 🔧 استكشاف الأخطاء الشائعة

### مشكلة: التطبيق لا يبدأ

**السبب الشائع**: مسارات خاطئة في vite.config.ts

**الحل**:
```typescript
// تأكد من وجود base: './' في vite.config.ts
export default defineConfig({
  base: './',  // مهم جداً لـ Electron
  // ... باقي الإعدادات
});
```

### مشكلة: الصور/CSS لا تظهر

**السبب**: مسارات الأصول غير صحيحة

**الحل**:
```typescript
// في vite.config.ts
build: {
  assetsDir: 'assets',  // تأكد من هذا الإعداد
  // ...
}
```

### مشكلة: أخطاء TypeScript

**الحل**: إنشاء/تحديث `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "*.ts", "*.tsx"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### مشكلة: السكربت لا يعمل

**تأكد من**:
```bash
# تشغيل PowerShell كمدير
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# أو تشغيل السكربت بشكل مباشر
powershell -ExecutionPolicy Bypass -File .\build-release.ps1
```

---

## 🚀 التحسينات المتقدمة

### 1. إضافة Hot Reload محسن:

في `main.js`:
```javascript
if (isDev) {
  // إضافة إعادة تحميل تلقائي عند تغيير الملفات
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}
```

### 2. إضافة دعم للثيمات:

```javascript
// في main.js
const { nativeTheme } = require('electron');

// تطبيق ثيم النظام
mainWindow = new BrowserWindow({
  // ... إعدادات أخرى
  titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  backgroundColor: nativeTheme.shouldUseDarkColors ? '#1e1e1e' : '#ffffff'
});
```

### 3. إضافة Auto-updater:

```bash
npm install electron-updater
```

في `main.js`:
```javascript
const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
  createWindow();
  
  // فحص التحديثات
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});
```

### 4. إضافة Splash Screen:

```javascript
let splashWindow;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: false
    }
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
}

function createWindow() {
  // إنشاء splash أولاً
  createSplashWindow();
  
  // ثم النافذة الرئيسية
  mainWindow = new BrowserWindow({
    // ... إعدادات
    show: false  // لا تعرض حتى تكون جاهزة
  });

  mainWindow.once('ready-to-show', () => {
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow.show();
  });
}
```

---

## 📋 قائمة تحقق نهائية

قبل إصدار تطبيقك، تأكد من:

### الإعدادات الأساسية:
- ✅ تم تخصيص اسم التطبيق في جميع الملفات
- ✅ تم إضافة أيقونة مناسبة (ico, png)
- ✅ تم تحديث معلومات المطور والوصف
- ✅ تم اختبار التطبيق في وضع التطوير
- ✅ تم اختبار البناء والتثبيت

### الأمان:
- ✅ nodeIntegration: false
- ✅ contextIsolation: true
- ✅ webSecurity: true
- ✅ منع التنقل للمواقع الخارجية

### الوظائف:
- ✅ جميع مكونات React تعمل بشكل صحيح
- ✅ الصور والأصول تظهر بشكل صحيح
- ✅ القوائم والاختصارات تعمل
- ✅ التطبيق يحفظ ويقرأ البيانات إذا لزم الأمر

### التوزيع:
- ✅ ملف installer يعمل بشكل صحيح
- ✅ التطبيق يبدأ من قائمة ابدأ
- ✅ الأيقونة تظهر في سطح المكتب وقائمة ابدأ
- ✅ التطبيق يمكن إلغاء تثبيته بشكل صحيح

---

## 🎊 الخلاصة

الآن لديك نظام كامل لتحويل أي مشروع React/Vite إلى تطبيق Electron احترافي مع:

- 🔧 **نظام بناء متطور** مع PowerShell
- 📦 **إدارة إصدارات تلقائية**
- 🔄 **مزامنة ملفات ذكية**
- 🛡️ **إعدادات أمان محكمة**
- 📱 **ملفات تثبيت احترافية**

### الخطوات التالية:
1. **اختبر** النظام مع مشروع صغير أولاً
2. **خصص** الإعدادات حسب احتياجاتك
3. **طور** المزيد من الميزات تدريجياً
4. **شارك** تطبيقك مع العالم!

### موارد إضافية:
- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder Guide](https://www.electron.build/)
- [Vite Electron Examples](https://github.com/electron-vite/vite-plugin-electron)

**نصيحة**: احتفظ بهذا الدليل واستخدمه كمرجع عند تحويل مشاريع أخرى. كل مشروع قد يحتاج تخصيصات بسيطة حسب طبيعته.

---

*تم إنشاء هذا الدليل بناءً على نظام GameCard Forge المتقدم*  
*آخر تحديث: سبتمبر 2025*

</div>