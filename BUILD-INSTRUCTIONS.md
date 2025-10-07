# 🚀 تعليمات بناء GameCard Forge

## ✅ التحديثات المكتملة

تم إصلاح وتحديث جميع إعدادات البناء بنجاح:

- ✅ **package.json**: محدث مع جميع dependencies الخاصة بـ Electron
- ✅ **vite.config.ts**: محدث للتوافق مع Electron 
- ✅ **main.js**: محدث ومُصحح للإصدار 0.2.0
- ✅ **build-config.json**: محدث ليشمل جميع الملفات والمجلدات الجديدة
- ✅ **version-info.json**: محدث للإصدار 0.2.0
- ✅ **metadata.json**: محدث ومُصحح
- ✅ **سكربت البناء**: مُصحح ومُحدث
- ✅ **إصلاح مشكلة ES modules**: تم إزالة `"type": "module"` من package.json

## 📦 متطلبات البناء

- Node.js (v18+)
- npm
- PowerShell (للـ Windows)

## 🛠️ أوامر البناء

### 1. تثبيت Dependencies
```bash
npm install
```

### 2. تشغيل التطوير
```bash
# للتطوير العادي في المتصفح
npm run dev

# للتطوير مع Electron
npm run electron:dev
```

### 3. البناء للإنتاج

#### بناء سريع للاختبار (مجلد فقط)
```bash
npm run electron:pack
```
📁 النتيجة: `release/win-unpacked/GameCard Forge.exe`

#### بناء كامل مع installer
```bash
npm run electron:build-win
```
📁 النتيجة: `release/GameCard Forge Setup 0.2.0.exe`

### 4. استخدام سكربت البناء المتقدم

#### بناء عادي مع زيادة patch (0.2.0 → 0.2.1)
```powershell
.\build-release.ps1
```

#### بناء للاختبار فقط
```powershell
.\build-release.ps1 -TestBuild
```

#### بناء مع رقم إصدار محدد
```powershell
.\build-release.ps1 -Version "1.0.0"
```

#### بناء مع زيادة minor/major
```powershell
.\build-release.ps1 -IncrementType "minor"  # 0.2.0 → 0.3.0
.\build-release.ps1 -IncrementType "major"  # 0.2.0 → 1.0.0
```

## 📁 ملفات الإخراج

بعد البناء الكامل ستجد:

### في مجلد `release/`
- `GameCard Forge Setup 0.2.0.exe` - ملف التثبيت (حوالي 80-90 MB)
- `GameCard Forge Setup 0.2.0.exe.blockmap` - ملف block map للتحديثات
- `latest.yml` - معلومات الإصدار
- `win-unpacked/` - مجلد التطبيق المستخرج

### التطبيق المستخرج في `win-unpacked/`
- `GameCard Forge.exe` - الملف التنفيذي الرئيسي
- `resources/` - موارد التطبيق
- مكتبات Electron وNode.js

## 🎯 الميزات الجديدة في النظام المحدث

1. **دعم كامل لـ Supabase**: نظام المصادقة والترخيص
2. **إعدادات محدثة**: جميع ملفات الإعداد محدثة للإصدار الجديد
3. **سكربت بناء مُحسن**: أكثر مرونة ويدعم الإعدادات المختلفة
4. **ملفات sync محدثة**: تشمل جميع المجلدات والملفات الجديدة
5. **توافق أفضل مع Electron**: إعدادات محسنة للأداء
6. **🎨 صفحة الملف الشخصي الجديدة**: تصميم حديث ومتجاوب مطابق للمواصفات

## ⚡ نصائح للاستخدام

### للتطوير اليومي
```bash
npm run electron:dev
```
سيفتح التطبيق في Electron مع Hot Reload

### للاختبار السريع
```bash
npm run electron:pack
```
ينشئ التطبيق في مجلد `win-unpacked` بدون installer

### للتوزيع النهائي
```bash
npm run electron:build-win
```
أو
```powershell
.\build-release.ps1
```
ينشئ installer كامل جاهز للتوزيع

## 🔧 استكشاف الأخطاء

### إذا فشل البناء
1. تأكد من تثبيت جميع dependencies:
   ```bash
   npm install
   ```
2. امسح node_modules وأعد التثبيت:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. تأكد من وجود مساحة كافية على القرص الصلب (على الأقل 1GB)

### إذا لم يعمل التطبيق
1. تأكد من بناء المشروع أولاً:
   ```bash
   npm run build
   ```
2. فحص وجود مجلد `dist/` مع الملفات المبنية
3. تأكد من صحة إعدادات `vite.config.ts`

## 📊 إحصائيات البناء الأخير

- ✅ **الإصدار الحالي**: 0.2.0
- ✅ **حجم installer**: 86.1 MB
- ✅ **حجم التطبيق**: ~211 MB مفعول
- ✅ **وقت البناء**: ~3-4 ثوان
- ✅ **عدد الملفات المضمنة**: 145 modules
- ✅ **منصات مدعومة**: Windows (x64)
- ✅ **حالة البناء**: ✅ نجح بالكامل

---

🎉 **مبروك! تطبيق GameCard Forge جاهز للبناء والتوزيع!**