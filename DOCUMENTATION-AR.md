# 📚 التوثيق الشامل لتطبيق GameCard Forge

<div dir="rtl">

## 🎯 نظرة عامة

**GameCard Forge** هو تطبيق إلكتروني مطور باستخدام Electron وReact وTypeScript لتصميم بطاقات الألعاب بتنسيق SVG وPNG. يتيح التطبيق إنشاء بطاقات قابلة للتخصيص بالكامل وعالية الجودة للاستخدام في الألعاب والتطبيقات.

### المعلومات الأساسية:
- **الاسم**: GameCard Forge (SVG Game Card Generator)
- **الإصدار الحالي**: 0.2.0
- **المطور**: DevNader
- **المعرف**: com.gamecardforge.app
- **النوع**: تطبيق Electron لسطح المكتب
- **المنصات المدعومة**: Windows (x64)

---

## 🏗️ البنية التقنية

### التقنيات المستخدمة:

#### Frontend Framework:
- **React**: v19.1.1 - إطار العمل الأساسي للواجهة
- **TypeScript**: v5.8.2 - للنوعية الصارمة وتطوير آمن
- **Vite**: v6.2.0 - أداة البناء والتطوير

#### Desktop Application:
- **Electron**: v38.1.2 - لتشغيل التطبيق على سطح المكتب
- **Electron Builder**: v26.0.12 - لإنشاء ملفات التثبيت

#### المكتبات المساعدة:
- **JSZip**: v3.10.1 - لضغط وتصدير الملفات
- **Concurrently**: v9.2.1 - لتشغيل عدة مهام متزامنة
- **Cross-env**: v10.0.0 - لإعداد متغيرات البيئة عبر المنصات
- **Wait-on**: v9.0.0 - لانتظار تشغيل الخادم المحلي

---

## 🗂️ هيكل المشروع

```
C:\ai-Projects\UI Game Card Maker\
├── GameCard-Forge-Dev\              # 🔧 مشروع التطوير (بدون Electron)
│   ├── App.tsx                      # المكون الرئيسي
│   ├── components/                  # مكونات الواجهة
│   │   ├── ControlPanel.tsx         # لوحة التحكم الرئيسية
│   │   ├── CardSvg.tsx             # مكون البطاقة الرأسية
│   │   ├── CardSvgHorizontal.tsx   # مكون البطاقة الأفقية
│   │   ├── ButtonSvg.tsx           # مكون الأزرار
│   │   ├── DownloadDropdown.tsx    # قائمة التحميل
│   │   ├── HeaderToolbar.tsx       # شريط الأدوات العلوي
│   │   └── RightPanel.tsx          # اللوحة الجانبية
│   ├── hooks/                      # React Hooks
│   │   └── useCardConfig.ts        # إدارة إعدادات البطاقة
│   ├── utils/                      # الأدوات المساعدة
│   │   ├── color.ts               # وظائف الألوان
│   │   ├── exportUtils.ts         # وظائف التصدير
│   │   ├── fontUtils.ts           # وظائف الخطوط
│   │   └── validation.ts          # وظائف التحقق
│   ├── types.ts                   # تعريفات TypeScript
│   ├── themes.ts                  # الثيمات المحددة مسبقاً
│   └── package.json              # dependencies عادية فقط
│
└── UI-Card-Maker\                  # 🚀 مشروع Electron (للإصدارات)
    ├── main.js                    # العملية الرئيسية لـ Electron
    ├── package.json               # إعدادات Electron وسكربتات البناء
    ├── vite.config.ts             # إعدادات Vite
    ├── tsconfig.json              # إعدادات TypeScript
    ├── build-release.ps1          # السكربت الرئيسي للبناء
    ├── build-config.json          # إعدادات نظام البناء
    ├── version-info.json          # معلومات الإصدارات
    ├── metadata.json              # البيانات الوصفية
    ├── assets/                    # الأصول (أيقونات، صور)
    │   ├── icon.ico              # أيقونة Windows
    │   ├── icon.png              # أيقونة PNG
    │   └── README.md             # توثيق الأصول
    ├── dist/                     # ملفات البناء النهائية
    └── release/                  # الإصدارات الجاهزة
        ├── win-unpacked/         # التطبيق غير المضغوط
        ├── *.exe                 # ملف التثبيت
        ├── latest.yml            # معلومات التحديث
        └── builder-*.yml         # ملفات إعداد البناء
```

---

## ⚙️ سكربتات البناء المتقدمة

### 🔧 السكربت الرئيسي: `build-release.ps1`

هذا السكربت المطور بـ PowerShell يوفر نظام بناء تلقائي شامل مع الميزات التالية:

#### الميزات الأساسية:
- **إدارة الإصدارات التلقائية**: زيادة تلقائية لأرقام الإصدار (patch, minor, major)
- **مزامنة الملفات**: نقل تلقائي للملفات من مشروع التطوير إلى مشروع Electron
- **بناء متعدد المراحل**: بناء Vite ثم تعبئة Electron
- **إنشاء ملفات التثبيت**: إنتاج ملفات .exe قابلة للتوزيع
- **نسخ احتياطية تلقائية**: حماية من فقدان البيانات
- **تقارير مفصلة**: معلومات شاملة عن عملية البناء

#### أوامر السكربت:

##### الأوامر الأساسية:
```powershell
# بناء كامل مع زيادة patch تلقائية (0.2.0 → 0.2.1)
.\build-release.ps1

# بناء مع رقم إصدار محدد
.\build-release.ps1 -Version "1.3.0"

# بناء مع زيادة minor (0.2.0 → 0.3.0)
.\build-release.ps1 -IncrementType "minor"

# بناء مع زيادة major (0.2.0 → 1.0.0)  
.\build-release.ps1 -IncrementType "major"
```

##### الأوامر المتخصصة:
```powershell
# مزامنة ملفات فقط (بدون بناء)
.\build-release.ps1 -SyncOnly

# بناء للاختبار فقط (بدون installer)
.\build-release.ps1 -TestBuild

# تخطي تحديث الإصدار
.\build-release.ps1 -SkipVersion

# عرض تفاصيل إضافية
.\build-release.ps1 -Verbose

# دمج عدة خيارات
.\build-release.ps1 -Version "2.0.0" -Verbose
```

### 📋 ملفات الإعداد

#### `build-config.json`:
```json
{
  "sourcePath": "..\\GameCard-Forge-Dev",     // مسار مشروع التطوير
  "syncSettings": {
    "filesToCopy": [                          // الملفات للنسخ
      "App.tsx",
      "index.tsx", 
      "types.ts",
      "themes.ts",
      "index.html"
    ],
    "foldersToSync": [                        // المجلدات للنسخ
      "components",
      "hooks", 
      "utils"
    ],
    "filesToPreserve": [                      // ملفات Electron للحفظ
      "main.js",
      "assets\\*",
      "package.json",
      "version-info.json",
      "build-config.json",
      "build-release.ps1"
    ]
  },
  "buildSettings": {
    "cleanBefore": true,                      // تنظيف قبل البناء
    "runTests": false,                        // تشغيل الاختبارات
    "createBackup": true,                     // إنشاء نسخة احتياطية
    "signCode": false,                        // توقيع الكود
    "outputPath": "release"                   // مجلد الإخراج
  },
  "versionSettings": {
    "autoIncrement": true,                    // زيادة تلقائية للإصدار
    "incrementType": "patch",                 // نوع الزيادة الافتراضية
    "updateFiles": [                          // الملفات للتحديث
      "package.json",
      "metadata.json",
      "main.js"
    ]
  }
}
```

#### `version-info.json`:
```json
{
  "currentVersion": "0.2.0",                 // الإصدار الحالي
  "lastBuildDate": "2025-09-26",            // تاريخ آخر بناء
  "buildNumber": 11,                         // رقم البناء
  "versionHistory": [                        // تاريخ الإصدارات
    {
      "version": "1.0.0",
      "date": "2025-09-18",
      "notes": "Initial release with Electron support"
    }
  ],
  "autoIncrement": {
    "type": "patch",                         // نوع الزيادة
    "enabled": true                          // تفعيل الزيادة التلقائية
  }
}
```

---

## 📦 سكربتات package.json

### سكربتات التطوير:
```json
{
  "scripts": {
    "dev": "vite",                           // تشغيل خادم التطوير
    "build": "vite build",                   // بناء تطبيق الويب
    "preview": "vite preview",               // معاينة البناء
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .\"",
    "electron:pack": "npm run build && electron-builder --dir",
    "electron:build": "npm run build && electron-builder --publish=never",
    "electron:build-win": "npm run build && electron-builder --win --publish=never"
  }
}
```

### شرح السكربتات:
- **`dev`**: يشغل خادم Vite للتطوير على المنفذ 5173
- **`electron:dev`**: يشغل التطبيق في وضع التطوير مع إعادة التحميل التلقائي
- **`electron:pack`**: ينشئ تطبيق Electron بدون ملف تثبيت
- **`electron:build`**: ينشئ ملف التثبيت الكامل
- **`electron:build-win`**: ينشئ ملف التثبيت لـ Windows فقط

---

## 🔧 إعدادات Electron

### `main.js` - العملية الرئيسية:

#### إعدادات النافذة:
```javascript
const mainWindow = new BrowserWindow({
  width: 1400,                               // العرض الافتراضي
  height: 900,                              // الارتفاع الافتراضي
  minWidth: 1200,                           // أقل عرض مسموح
  minHeight: 800,                           // أقل ارتفاع مسموح
  icon: path.join(__dirname, 'assets', 'icon.png'),
  webPreferences: {
    nodeIntegration: false,                  // أمان: عدم دمج Node.js
    contextIsolation: true,                  // أمان: عزل السياق
    enableRemoteModule: false,               // أمان: عدم تفعيل الوحدة البعيدة
    webSecurity: true                        // أمان: تفعيل أمان الويب
  }
});
```

#### قائمة التطبيق:
- **File**: إنشاء بطاقة جديدة، خروج
- **Edit**: تراجع، إعادة، قص، نسخ، لصق
- **View**: إعادة تحميل، أدوات المطور، تكبير/تصغير، ملء الشاشة
- **Window**: تصغير، إغلاق
- **Help**: معلومات التطبيق

#### الأمان:
- منع التنقل إلى مواقع خارجية
- فتح الروابط الخارجية في المتصفح الافتراضي
- حماية من هجمات XSS

---

## 🎨 بنية التطبيق

### المكونات الرئيسية:

#### `App.tsx` - المكون الرئيسي:
- **إدارة الحالة**: useState وhooks مخصصة
- **رفع الملفات**: الصور والخطوط المخصصة
- **التصدير**: JSON، SVG، PNG، ZIP
- **التحقق**: صحة البيانات والحماية من XSS

#### `useCardConfig.ts` - Hook إدارة الإعدادات:
- **الثيمات**: إدارة الثيمات المحددة مسبقاً
- **التخطيطات**: أفقية ورأسية
- **الإعدادات**: الألوان، الخطوط، الأحجام

#### مكونات الواجهة:
- **`ControlPanel`**: لوحة التحكم الرئيسية
- **`CardSvg`**: عرض البطاقة الرأسية
- **`CardSvgHorizontal`**: عرض البطاقة الأفقية
- **`HeaderToolbar`**: شريط الأدوات
- **`RightPanel`**: اللوحة الجانبية

### المرافق (Utils):
- **`color.ts`**: وظائف معالجة الألوان
- **`exportUtils.ts`**: وظائف التصدير
- **`fontUtils.ts`**: وظائف الخطوط
- **`validation.ts`**: التحقق والحماية

---

## 🚀 سير العمل للتطوير والإصدار

### 1. التطوير اليومي:
```bash
# في مشروع التطوير العادي
cd "C:\ai-Projects\UI Game Card Maker\GameCard-Forge-Dev"
npm install
npm run dev
# طور واختبر كالعادة على http://localhost:5173
```

### 2. إنشاء إصدار جديد:
```bash
# انسخ مشروعك إلى GameCard-Forge-Dev أو تأكد من وجوده
# ثم انتقل إلى مجلد Electron
cd "C:\ai-Projects\UI Game Card Maker\UI-Card-Maker"

# تشغيل البناء التلقائي
.\build-release.ps1

# أو مع خيارات محددة
.\build-release.ps1 -Version "1.0.0" -Verbose
```

### 3. الاختبار:
```bash
# اختبار البناء بدون إنشاء installer
.\build-release.ps1 -TestBuild

# تشغيل التطبيق من المجلد المفكوك
cd release\win-unpacked
.\GameCard Forge.exe
```

### 4. التوزيع:
```bash
# الملف الجاهز للتوزيع يكون في:
release\GameCard Forge Setup X.X.X.exe
```

---

## 📊 مثال على مخرجات السكربت

```
🚀 GameCard Forge Release Builder v2.0
═══════════════════════════════════════

⏳ Step 1/6: Environment Check...
   ✅ Node.js v20.10.0 found
   ✅ npm 10.2.3 found
   ✅ Source project found: ..\GameCard-Forge-Dev

⏳ Step 2/6: Version Management...
   📋 Auto-increment (patch): 0.2.0 → 0.2.1
   ✅ Version updated: 0.2.1
   ✅ package.json updated
   ✅ metadata.json updated

⏳ Step 3/6: File Synchronization...
   ✅ 5 files and 3 folders synchronized

⏳ Step 4/6: Web App Build...
   ✅ Cleaned previous build
   ✅ Vite build completed (2.1s)

⏳ Step 5/6: Electron Packaging...
   ✅ Electron app packaged with installer

⏳ Step 6/6: Build Summary...
   ✅ Installer created: GameCard Forge Setup 0.2.1.exe (85.7 MB)
   ✅ Executable: GameCard Forge.exe

🎉 GameCard Forge v0.2.1 Build Completed Successfully!
═══════════════════════════════════════════════════════════
📁 Output: release\GameCard Forge Setup 0.2.1.exe
⏱️  Build #12 completed at 20:45:30
🚀 Ready for distribution!
```

---

## 🛠️ كيفية إنشاء مشروع مماثل

### المتطلبات الأساسية:
1. **Node.js** (v18 أو أحدث)
2. **npm** أو **yarn**
3. **PowerShell** (للسكربت على Windows)
4. **Git** (اختياري للتحكم في الإصدارات)

### خطوات الإنشاء:

#### 1. إعداد مشروع React/Vite:
```bash
npm create vite@latest my-electron-app -- --template react-ts
cd my-electron-app
npm install
```

#### 2. إضافة Electron:
```bash
npm install --save-dev electron electron-builder concurrently cross-env wait-on
```

#### 3. إنشاء `main.js`:
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);
```

#### 4. تحديث `package.json`:
```json
{
  "main": "main.js",
  "scripts": {
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.yourapp.id",
    "productName": "Your App Name",
    "directories": {
      "output": "release"
    },
    "files": ["main.js", "dist/**/*", "package.json"]
  }
}
```

#### 5. إنشاء سكربت البناء:
```powershell
# إنشاء build-release.ps1 مشابه للموجود في المشروع
# يتضمن إدارة الإصدارات، المزامنة، والبناء
```

#### 6. ملفات الإعداد:
- إنشاء `build-config.json`
- إنشاء `version-info.json`
- إضافة الأيقونات في مجلد `assets/`

### الميزات المتقدمة:

#### إدارة الإصدارات التلقائية:
```javascript
// في السكربت
function Get-NextVersion($currentVersion, $incrementType) {
    $versionParts = $currentVersion.Split('.')
    // منطق زيادة الإصدار
}
```

#### نظام الأمان:
```javascript
// في main.js
webPreferences: {
  nodeIntegration: false,
  contextIsolation: true,
  enableRemoteModule: false,
  webSecurity: true
}
```

#### التوزيع المتعدد المنصات:
```json
{
  "build": {
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "assets/icon.png"
    }
  }
}
```

---

## 🔍 استكشاف الأخطاء الشائعة

### مشاكل البناء:

#### 1. "Source path not found":
```bash
# التأكد من وجود مجلد المصدر
ls ..\GameCard-Forge-Dev
# تحديث المسار في build-config.json
```

#### 2. "Node.js not found":
```bash
# التأكد من تثبيت Node.js
node --version
npm --version
# إعادة تشغيل PowerShell
```

#### 3. "Build failed":
```bash
# فحص الأخطاء في الكود
npm run build
# فحص ملفات TypeScript
npx tsc --noEmit
```

#### 4. أخطاء Electron:
```bash
# تنظيف node_modules
rm -rf node_modules package-lock.json
npm install
```

### مشاكل التشغيل:

#### 1. التطبيق لا يفتح:
- فحص وجود ملفات `dist/`
- التأكد من صحة `main.js`
- فحص أذونات الملفات

#### 2. الواجهة فارغة:
- التأكد من البناء الصحيح
- فحص المسارات في `vite.config.ts`
- فحص وحدة تحكم المطور

---

## 📈 التحسينات والتطوير المستقبلي

### إضافات مقترحة:

#### 1. التحديث التلقائي:
```bash
npm install electron-updater
```

#### 2. التوقيع الرقمي:
```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/certificate.p12",
      "certificatePassword": "password"
    }
  }
}
```

#### 3. إعدادات متقدمة:
- دعم متعدد اللغات
- ثيمات قابلة للتخصيص
- إضافات ومكونات إضافية

#### 4. التكامل مع CI/CD:
```yaml
# .github/workflows/build.yml
name: Build and Release
on:
  push:
    tags: ['v*']
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run electron:build
```

---

## 📚 مصادر إضافية

### الوثائق الرسمية:
- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### أدوات مفيدة:
- [Electron Builder](https://www.electron.build/)
- [Electron Forge](https://www.electronforge.io/)
- [Spectron](https://www.electronjs.org/spectron) - للاختبار
- [Electron DevTools](https://github.com/MarshallOfSound/electron-devtools-installer)

### مجتمعات ودعم:
- [Electron Discord](https://discord.com/invite/electron)
- [React Community](https://reactjs.org/community/support.html)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/electron)

---

## 🎯 الخلاصة

هذا النظام يوفر حلاً شاملاً لتطوير وبناء تطبيقات Electron بكفاءة عالية، يتضمن:

✅ **تطوير منفصل**: مشروع React منفصل للتطوير السريع
✅ **بناء تلقائي**: سكربت PowerShell متطور للبناء
✅ **إدارة الإصدارات**: نظام تلقائي لترقيم الإصدارات  
✅ **أمان عالي**: إعدادات أمان محكمة للتطبيق
✅ **سهولة التوزيع**: ملفات تثبيت جاهزة
✅ **قابلية التوسع**: بنية قابلة للتطوير والتحسين

يمكن استخدام هذا النموذج كأساس لتطوير أي تطبيق Electron متقدم مع ضمان الجودة والأمان.

---

*آخر تحديث: سبتمبر 2025*
*الإصدار: 0.2.0*
*المطور: DevNader*

</div>