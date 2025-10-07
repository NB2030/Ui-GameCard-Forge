# 🚀 دليل نظام البناء التلقائي - UI Inventory Forge

## 📋 نظرة عامة

تم إنشاء نظام بناء تلقائي شامل لتسهيل إنشاء إصدارات جديدة من UI Inventory Forge بدون الحاجة لإعادة إعداد Electron في كل مرة.

## 📁 هيكل المشروع

```
C:\ai-Projects\UI-Inventory-Maker\
├── Inventory-UI-Maker-Dev\              # 👈 مشروع التطوير (بدون Electron)
│   ├── 
│   ├── 
│   ├── 
│   ├── 
│   └── 
│
└── Inventory-UI-Maker\                   # 👈 مشروع Electron (للإصدارات)
    ├── 
    ├── 
    ├──
    ├── 
    ├──  
    └──                     
```

## 🔄 سير العمل

### 1. التطوير اليومي
```bash
# في أي مشروع React عادي
cd "C:\your-dev-project"
npm run dev
# طور واختبر كالعادة
```

### 2. إنشاء إصدار جديد
```bash
# انسخ مشروعك إلى Inventory-UI-Maker-Dev
# ثم:
cd "C:\ai-Projects\UI-Inventory-Maker\Inventory-UI-Maker"
.\build-release.ps1
```

## 🎯 أوامر السكريپت

### الأوامر الأساسية:
```powershell
# بناء كامل مع زيادة patch تلقائية (1.0.0 → 1.0.1)
.\build-release.ps1

# بناء مع رقم إصدار محدد
.\build-release.ps1 -Version "1.2.0"

# بناء مع زيادة minor (1.0.0 → 1.1.0)
.\build-release.ps1 -IncrementType "minor"

# بناء مع زيادة major (1.0.0 → 2.0.0)  
.\build-release.ps1 -IncrementType "major"
```

### الأوامر المتقدمة:
```powershell
# مزامنة ملفات فقط (بدون بناء)
.\build-release.ps1 -SyncOnly

# بناء للاختبار فقط (بدون installer)
.\build-release.ps1 -TestBuild

# تخطي تحديث الإصدار
.\build-release.ps1 -SkipVersion

# عرض تفاصيل إضافية
.\build-release.ps1 -Verbose
```

## ⚙️ إعدادات النظام

### build-config.json
```json
{
  "sourcePath": "..\\Inventory-UI-Maker-Dev",     # مسار مشروع التطوير
  "syncSettings": {
    "filesToCopy": [...],                     # الملفات للنسخ
    "foldersToSync": [...],                   # المجلدات للنسخ
    "filesToPreserve": [...]                  # ملفات Electron للحفظ
  },
  "versionSettings": {
    "autoIncrement": true,                    # زيادة تلقائية للإصدار
    "incrementType": "patch"                  # نوع الزيادة الافتراضية
  }
}
```

### version-info.json
```json
{
  "currentVersion": "1.0.1",                 # الإصدار الحالي
  "buildNumber": 2,                          # رقم البناء
  "versionHistory": [...],                   # تاريخ الإصدارات
  "autoIncrement": {
    "type": "patch",
    "enabled": true
  }
}
```

## 📊 مخرجات السكريپت

```
🚀 UI Inventory Forge Release Builder v1.0
═══════════════════════════════════════

⏳ Step 1/6: Environment Check...
   ✅ Node.js v20.10.0 found
   ✅ npm 10.2.3 found
   ✅ Source project found: ..\Inventory-UI-Maker-Dev

⏳ Step 2/6: Version Management...
   📋 Auto-increment (patch): 1.0.0 → 1.0.1
   ✅ Version updated: 1.0.1
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
   ✅ Installer created: UI Inventory Forge Setup 1.0.1.exe (85.7 MB)
   ✅ Executable: UI Inventory Forge.exe

🎉 UI Inventory Forge v1.0.1 Build Completed Successfully!
═══════════════════════════════════════════════════════════
📁 Output: release\UI Inventory Forge Setup 1.0.1.exe
⏱️  Build #2 completed at 20:45:30
🚀 Ready for distribution!
```

## 🔧 استكشاف الأخطاء

### المشاكل الشائعة:

1. **"Source path not found"**
   - تأكد من وجود مجلد `Inventory-UI-Maker-Dev`
   - تأكد من وضع مشروعك فيه

2. **"Node.js not found"**  
   - تأكد من تثبيت Node.js
   - أعد تشغيل PowerShell

3. **"Build failed"**
   - تحقق من صحة ملفات المشروع
   - تأكد من عدم وجود أخطاء syntax

## 💡 نصائح مفيدة

1. **النسخ الاحتياطية**: السكريپت ينشئ نسخة احتياطية تلقائياً
2. **الاختبار**: استخدم `-TestBuild` للاختبار السريع
3. **المراقبة**: استخدم `-Verbose` لمتابعة التفاصيل
4. **التحكم**: يمكن تخصيص الإعدادات في ملفات JSON

## 🎯 الخطوات التالية

1. ضع مشروعك في `Inventory-UI-Maker-Dev`
2. شغل `.\build-release.ps1`
3. اختبر التطبيق من `release\win-unpacked\`
4. وزع `release\UI Inventory Forge Setup X.X.X.exe`

**🎉 نظام البناء جاهز للاستخدام!**