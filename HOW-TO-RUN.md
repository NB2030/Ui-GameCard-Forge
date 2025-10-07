# 🚀 How to Run GameCard Forge Build System

## ⚠️ **Common Issue: PowerShell Execution Policy**

If you're having trouble running PowerShell scripts from Windows File Explorer, this is normal Windows security behavior.

## ✅ **Solutions (Choose One):**

### **Method 1: Use the Batch File (Recommended)**
1. **Double-click** `build.cmd` 
2. ✅ This automatically handles execution policy issues
3. ✅ Works from anywhere in Windows

### **Method 2: Run from PowerShell Terminal**
1. **Right-click** in the project folder
2. Select **"Open in Terminal"** or **"Open PowerShell window here"**
3. Type: `.\build-menu.ps1`

### **Method 3: Create Desktop Shortcut**
1. **Double-click** `create-shortcut.vbs`
2. ✅ Creates a desktop shortcut that always works
3. Use the shortcut anytime

### **Method 4: Run as Administrator**
1. **Right-click** `build.cmd`
2. Select **"Run as administrator"**
3. ✅ Bypasses all security restrictions

## 🔍 **Troubleshooting**

### **Check Your Environment:**
1. **Double-click** `check-powershell.cmd`
2. This will diagnose any issues
3. Follow the recommendations shown

### **Common Error Messages:**

| Error | Solution |
|-------|----------|
| "Execution policy" | Use `build.cmd` instead |
| "File not found" | Make sure you're in the correct folder |
| "PowerShell not found" | Install PowerShell Core or use Windows PowerShell |

## 📁 **File Overview:**

| File | Purpose |
|------|---------|
| `build.cmd` | **Main launcher** (double-click this) |
| `build-menu.ps1` | Interactive PowerShell menu |
| `build-release.ps1` | Core build script |
| `check-powershell.cmd` | Diagnostic tool |
| `create-shortcut.vbs` | Creates desktop shortcut |

## 🎯 **Recommended Usage:**

```
1. Double-click build.cmd
2. Choose your build option from the menu
3. Wait for completion
4. Find your installer in release/ folder
```

**That's it! No PowerShell knowledge required.** 🎉