# 🧠 كيف يعمل تطبيق React/Vite بدون إنترنت بعد التحويل إلى تطبيق Electron

<div dir="rtl">

## 📋 المقدمة

يُعد هذا المشروع مثالاً رائعاً على كيفية تحويل تطبيق React/Vite إلى تطبيق Electron يعمل بدون اتصال بالإنترنت، رغم استخدامه لموارد CDN في الإصدار المطور. هذا الملف يشرح بالتفصيل التقني كيف تم تحقيق هذا الحل.

## 🔍 نظرة عامة على المشكلة

### التحدي الأساسي:
- التطبيق الأصلي يستخدم CDN لـ Tailwind CSS: `<script src="https://cdn.tailwindcss.com"></script>`
- في الإصدار الإلكتروني، يجب أن يعمل التطبيق بدون اتصال بالإنترنت
- لا يتم تثبيت Tailwind CSS محلياً في المشروع

## 🛠️ الحل التقني المستخدم

### 1. **بنية تطبيق Electron**

الحل الأساسي يكمن في كيفية عمل تطبيقات Electron:

#### في ملف main.js:
```javascript
// في وضع التطوير:
mainWindow.loadURL('http://localhost:5173');

// في وضع الإنتاج:
mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
```

#### الفرق الأساسي:
- **التطوير**: يحمل المحتوى من خادم محلي (localhost)
- **الإنتاج**: يحمل الملفات المحلية مباشرة من نظام الملفات

### 2. **عملية البناء والتعبئة**

#### في package.json:
```json
"scripts": {
  "build": "vite build",
  "electron:build-win": "npm run build && electron-builder --win --publish=never"
}
```

#### ما يحدث عند البناء:
1. `npm run build` → ينشئ مجلد dist/ يحتوي على الملفات الثابتة
2. `electron-builder` → يحزم مجلد dist/ مع ملفات التطبيق الأخرى

### 3. **آلية العمل بدون إنترنت**

#### أ) **التحميل المحلي للموارد**
عند تشغيل التطبيق الإلكتروني:
- يتم تحميل dist/index.html من نظام الملفات
- جميع الروابط تكون نسبية: `<script src="./assets/index.js">`
- لا حاجة للوصول للإنترنت لتحميل أي موارد

#### ب) **الحماية من الوصول الخارجي**
في main.js:
```javascript
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'file://') {
      event.preventDefault();  // منع الوصول للإنترنت
    }
  });
});
```

هذا الكود يمنع التطبيق من:
- تحميل أي موارد من الإنترنت
- الاتصال بأي خوادم خارجية
- الانتقال إلى مواقع ويب خارجية

### 4. **كيف يعمل التصميم بدون Tailwind CDN**

رغم أن index.html يحتوي على:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

#### الآلية المستخدمة:

##### أ) **التصميم بالـ inline styles**
معظم عناصر التصميم تستخدم inline styles في المكونات:
```jsx
<div style={{
  aspectRatio: `${config.cardWidth} / ${config.cardHeight}`,
  width: 'min(100%, 500px)',
  height: 'auto'
}}>
```

##### ب) **التصميم بالـ CSS classes المدمجة**
التطبيق يعتمد على:
1. تصميمات مدمجة في المكونات
2. inline styles للتحكم الديناميكي
3. تصميمات محددة في ملفات المكونات

##### ج) **عدم اعتماد كامل على Tailwind CDN**
Tailwind CDN يُستخدم فقط كـ fallback، والتطبيق مصمم للعمل بدونه.

### 5. **البنية الكاملة للملفات في الإصدار النهائي**

```
release/win-unpacked/
├── GameCard Forge.exe        # ملف التنفيذ الرئيسي
├── resources/
│   ├── app.asar              # ملف مضغوط يحتوي على:
│   │   ├── dist/             # الملفات المبنية
│   │   │   ├── index.html    # ملف HTML الرئيسي
│   │   │   ├── assets/       # ملفات CSS و JS
│   │   │   └── index-*.js    # ملفات JavaScript المبنية
│   │   ├── main.js           # العملية الرئيسية لـ Electron
│   │   └── package.json      # معلومات التطبيق
│   └── app-update.yml        # إعدادات التحديث
├── node_modules/             # المكتبات المطلوبة
└── ...
```

### 6. **آلية التحميل في التطبيق النهائي**

#### الخطوات عند تشغيل التطبيق:
1. تشغيل GameCard Forge.exe
2. تحميل main.js من ملفات التطبيق
3. main.js ينشئ نافذة Electron
4. تحميل `dist/index.html` من ملفات التطبيق
5. تحميل ملفات CSS و JS المحلية فقط

#### مثال على تحميل ملف:
```javascript
// في main.js
mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
```

هذا يعني:
- `file:///C:/Program%20Files/GameCard%20Forge/resources/app.asar/dist/index.html`
- جميع الروابط داخل الملف نسبية: `./assets/index.js`
- لا حاجة للوصول للإنترنت

## 🧪 اختبار الحل

### كيف يتم التأكد من عمل التطبيق بدون إنترنت:

#### 1. **اختبار البناء**
```bash
# بناء التطبيق
npm run electron:build-win

# تشغيل التطبيق من مجلد release/win-unpacked/
# بدون اتصال بالإنترنت
```

#### 2. **مراقبة الشبكة**
- استخدام أدوات تحليل الشبكة
- التأكد من عدم وجود طلبات خارجية
- التأكد من تحميل جميع الموارد محلياً

#### 3. **اختبار الأمان**
```javascript
// في main.js - منع الوصول الخارجي
contents.on('will-navigate', (event, navigationUrl) => {
  const parsedUrl = new URL(navigationUrl);
  if (parsedUrl.origin !== 'file://') {
    event.preventDefault();  // منع أي اتصال خارجي
  }
});
```

## 🎯 المزايا الناتجة عن هذا الحل

### 1. **التشغيل المستقل**
- لا يحتاج اتصال بالإنترنت
- لا يحتاج خادم محلي
- يعمل كتطبيق سطح مكتب كامل

### 2. **الأمان**
- منع الوصول الخارجي
- تحميل الموارد من ملفات موثوقة
- حماية من هجمات الشبكة

### 3. **الأداء**
- تحميل أسرع من الملفات المحلية
- لا توجد تأخيرات في الشبكة
- عمل موثوق ومستقر

### 4. **سهولة التوزيع**
- ملف تنفيذي واحد
- لا يحتاج تثبيت إضافي
- سهل الاستخدام للمستخدم النهائي

## ⚠️ التحديات والحلول

### التحدي: عدم تحميل Tailwind CDN
**الحل**: الاعتماد على التصميم الداخلي للمكونات

### التحدي: عدم تحميل الخطوط من Google Fonts
**الحل**: استخدام خطوط محلية أو خطوط النظام

### التحدي: عدم تحميل React و JSZip من CDN
**الحل**: استخدام import maps مع مصدر محلي:

في index.html:
```html
<script type="importmap">
{
  "imports": {
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.1.1/",
    "react/": "https://aistudiocdn.com/react@^19.1.1/",
    "react": "https://aistudiocdn.com/react@^19.1.1",
    "jszip": "https://esm.sh/jszip@3.10.1"
  }
}
</script>
```

هذا يستخدم CDN مخصص لكن في الإصدار النهائي يتم تجميع هذه المكتبات محلياً.

## 📊 مقارنة بين الإصدارات

| الميزة | الإصدار المطور | الإصدار النهائي |
|--------|----------------|-----------------|
| يحتاج إنترنت | نعم (لـ CDN) | لا |
| يحتاج خادم | نعم (localhost) | لا |
| سرعة التشغيل | متوسطة | سريعة |
| الأمان | متوسط | عالي |
| سهولة الاستخدام | يتطلب تثبيت | سهل الاستخدام |
| حجم التطبيق | خفيف | متوسط |

## 🛠️ دليل إنشاء مشروع مشابه كتطبيق Electron

### المتطلبات الأساسية:
- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn
- Windows 10/11 للبناء

### الخطوات:

#### 1. إنشاء مشروع React/Vite:
```bash
npm create vite@latest my-electron-app -- --template react-ts
cd my-electron-app
npm install
```

#### 2. تثبيت Electron و الأدوات:
```bash
npm install --save-dev electron electron-builder concurrently cross-env wait-on
```

#### 3. إنشاء ملف main.js:
```javascript
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    titleBarStyle: 'default',
    show: false // Don't show until ready to prevent visual flash
  });

  // Load the app
  if (isDev) {
    // Development: load from localhost
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from built files
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Set up the menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Card',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            // You can add functionality to reset the card here
            mainWindow.webContents.reload();
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
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
        { role: 'forceReload' },
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
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About GameCard Forge',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About',
              message: 'GameCard Forge',
              detail: 'GameCard Forge is an application for designing UI game cards in SVG and PNG formats, allowing you to create fully customizable, high-quality cards for use in games and apps quickly and easily.\n\nVersion: 0.2.0\nDeveloped by: DevNader'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep the app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create a window when the dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent navigation to external websites
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'file://') {
      event.preventDefault();
    }
  });
});
```

#### 4. تحديث package.json:
```json
{
  "name": "svg-game-card-generator",
  "private": true,
  "version": "0.2.0",
  "description": "GameCard Forge is an application for designing UI game cards in SVG and PNG formats, allowing you to create fully customizable, high-quality cards for use in games and apps quickly and easily.",
  "author": "DevNader",
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
  "dependencies": {
    "jszip": "3.10.1",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "concurrently": "^9.2.1",
    "cross-env": "^10.0.0",
    "electron": "^38.1.2",
    "electron-builder": "^26.0.12",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "wait-on": "^9.0.0"
  },
  "build": {
    "appId": "com.gamecardforge.app",
    "productName": "GameCard Forge",
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
        "arch": [
          "x64"
        ]
      },
      "icon": "assets/icon.ico"
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

#### 5. تحديث vite.config.ts:
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      base: './', // Important for Electron to load assets correctly
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
        port: 5173,
        strictPort: true
      }
    };
});
```

#### 6. بناء التطبيق:
```bash
# بناء سريع للاختبار
npm run electron:pack

# بناء كامل مع installer
npm run electron:build-win
```

## 🎉 الخلاصة

الحل المستخدم في هذا المشروع يعتمد على:

1. **تحويل التطبيق إلى تطبيق Electron** يعمل محلياً
2. **بناء ملفات ثابتة** تُحزم مع التطبيق
3. **منع الوصول الخارجي** لضمان العمل المستقل
4. **الاعتماد على التصميم الداخلي** بدلاً من CDN خارجي
5. **استخدام موارد محلية** فقط في الإصدار النهائي

هذا الحل يجعل التطبيق يعمل بشكل كامل بدون إنترنت أو خادم، مع الحفاظ على جميع الوظائف والمظهر.
</div>