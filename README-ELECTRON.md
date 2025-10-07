# GameCard Forge - Electron Desktop App

تطبيق GameCard Forge كتطبيق سطح مكتب مستقل يعمل بـ Electron على Windows - مولد بطاقات الألعاب SVG.

## ميزات التطبيق الالكتروني

- 🖥️ تطبيق سطح مكتب مستقل (لا يحتاج متصفح أو خادم)
- 📁 قوائم أصلية للنظام (File, Edit, View, Help)
- 🔗 فتح الروابط الخارجية في المتصفح الافتراضي
- 💾 تصدير ملفات SVG و PNG مباشرة إلى النظام
- ⌨️ اختصارات لوحة المفاتيح (Ctrl+N للبطاقة الجديدة، Ctrl+Q للخروج)

## متطلبات التطوير

- Node.js (الإصدار 16 أو أحدث)
- npm أو yarn
- Windows 10/11 للبناء على Windows

## تشغيل التطبيق في وضع التطوير

```bash
# تثبيت التبعيات
npm install

# تشغيل التطبيق في وضع التطوير (Electron + Hot Reload)
npm run electron:dev
```

## بناء التطبيق للإنتاج

### بناء سريع للاختبار (مجلد فقط)
```bash
npm run electron:pack
```
سيتم إنشاء التطبيق في: `release/win-unpacked/`

### بناء كامل مع installer
```bash
npm run electron:build-win
```
سيتم إنشاء:
- `release/GameCard Forge Setup 1.0.0.exe` - ملف التثبيت
- `release/win-unpacked/` - مجلد التطبيق المستخرج

## الأوامر المتاحة

| الأمر | الوصف |
|-------|--------|
| `npm run dev` | تشغيل خادم التطوير العادي (متصفح) |
| `npm run build` | بناء الملفات للإنتاج |
| `npm run electron:dev` | تشغيل التطبيق في Electron مع Hot Reload |
| `npm run electron:pack` | بناء التطبيق (مجلد فقط) |
| `npm run electron:build` | بناء التطبيق مع installer لجميع المنصات |
| `npm run electron:build-win` | بناء التطبيق مع installer لـ Windows فقط |

## الأيقونة المخصصة ✅

تم إضافة الأيقونة المخصصة بنجاح:
- **الملف**: `ui_card_maker.ico`
- **المكان**: `assets/icon.ico` و `assets/icon.png`
- **الحالة**: مطبقة على التطبيق

### لتغيير الأيقونة:
1. استبدل الملفات في `assets/`:
   - `icon.ico` (للإنتاج على Windows)
   - `icon.png` (للتطوير)
2. أعد البناء باستخدام `npm run electron:build-win`

## هيكل الملفات

```
├── main.js                 # العملية الرئيسية لـ Electron
├── dist/                   # ملفات البناء للويب
├── assets/                 # أيقونات التطبيق
├── release/                # ملفات التطبيق المبني
│   ├── win-unpacked/       # التطبيق المستخرج
│   └── *.exe               # ملف التثبيت
└── src/                    # كود المصدر
```

## الإعدادات المتقدمة

يمكن تعديل إعدادات electron-builder في `package.json` تحت قسم `"build"`:

- تغيير اسم التطبيق: `productName`
- تغيير معرف التطبيق: `appId`  
- إعدادات الـ installer: `nsis`
- إعدادات Windows: `win`

## استكشاف الأخطاء

### مشكلة في تحميل الملفات
تأكد من أن `base: './'` موجود في `vite.config.ts`

### مشكلة في الخطوط المخصصة
الخطوط المحملة كـ data URLs تعمل بشكل طبيعي في Electron

### مشكلة في التصدير
جميع وظائف التصدير (SVG, PNG, ZIP) تعمل في التطبيق الالكتروني

## التوزيع

بعد بناء التطبيق، يمكنك توزيع:
1. **ملف التثبيت**: `GameCard Forge Setup 1.0.0.exe`
2. **المجلد المستخرج**: ضغط مجلد `win-unpacked` وتوزيعه

## الأمان

- تم تعطيل `nodeIntegration` و `enableRemoteModule`
- تم تفعيل `contextIsolation`
- الروابط الخارجية تفتح في المتصفح الافتراضي
- منع التنقل إلى مواقع خارجية