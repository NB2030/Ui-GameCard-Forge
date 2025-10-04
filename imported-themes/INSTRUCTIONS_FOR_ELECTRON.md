# Instructions for Migrating to Electron (Saving Themes to a Real File)

When you convert your application into a desktop app using Electron, you will gain full access to the Node.js file system. This allows us to replace `localStorage` (which is browser-specific) with actual file reading and writing.

The steps are very simple and will be focused in just one file: `hooks/useCardConfig.ts`.

---

### Step 1: Import File System (fs) and Path Modules

At the top of `hooks/useCardConfig.ts`, you'll need to access Node.js libraries. In an Electron environment, you can do this directly.

```javascript
// At the top of the file
import { promises as fs } from 'fs'; // We use the Promise-based version for easier handling
import path from 'path';

// ... other imports like useState, useEffect
```

---

### Step 2: Define the Save File Path

Instead of just a string key for `localStorage`, we will define a full path to the file where we'll save the themes. The best practice is to use the application's user data folder, which ensures the files will be in the correct location on any operating system.

```javascript
// At the top, under the imports
// (Note: In a real Electron app, use `app.getPath('userData')` instead of `process.cwd()`)
const THEMES_FOLDER_PATH = path.join(process.cwd(), 'imported-themes');
const THEMES_FILE_PATH = path.join(THEMES_FOLDER_PATH, 'themes.json');
```

---

### Step 3: Modify the `useEffect` for Loading Themes on App Startup

We will replace `localStorage.getItem` with `fs.readFile`.

#### Current Code (for comparison):
```javascript
useEffect(() => {
    try {
      const savedThemesJson = localStorage.getItem(IMPORTED_THEMES_STORAGE_KEY);
      if (savedThemesJson) {
        // ... loading logic
      }
    } catch (error) {
        console.error("Failed to load imported themes from localStorage:", error);
    }
}, []);
```

#### New Code in the Electron Version:
```javascript
// --- EFFECT FOR LOADING THEMES ON STARTUP (ELECTRON VERSION) ---
useEffect(() => {
  const loadThemes = async () => {
    try {
      // Try to read the file
      const savedThemesJson = await fs.readFile(THEMES_FILE_PATH, 'utf-8');
      const savedThemes: Theme[] = JSON.parse(savedThemesJson);
      
      if (Array.isArray(savedThemes)) {
        setAllLayouts(prevLayouts => {
          const layoutsCopy = JSON.parse(JSON.stringify(prevLayouts));
          const importedLayout = layoutsCopy.find((l: Layout) => l.id === 'imported');
          if (importedLayout) {
            importedLayout.themes = savedThemes;
          }
          return layoutsCopy;
        });
      }
    } catch (error: any) {
      // If the error is that the file doesn't exist, that's normal on first run. Ignore it.
      if (error.code !== 'ENOENT') {
        console.error("Failed to load imported themes from file:", error);
      }
    }
  };

  loadThemes();
}, []); // This remains empty to run once on startup
```

---

### Step 4: Modify the `useEffect` for Saving Themes on Change

We will replace `localStorage.setItem` with `fs.writeFile`. We will also add a step to ensure the directory exists before writing to it.

#### Current Code (for comparison):
```javascript
useEffect(() => {
    const importedLayout = allLayouts.find(l => l.id === 'imported');
    if (importedLayout && importedLayout.themes.length > 0) {
        // ... logic for saving to localStorage
    } else {
        localStorage.removeItem(IMPORTED_THEMES_STORAGE_KEY);
    }
}, [allLayouts]);
```

#### New Code in the Electron Version:
```javascript
// --- EFFECT FOR SAVING THEMES ON CHANGE (ELECTRON VERSION) ---
useEffect(() => {
  const saveThemes = async () => {
    const importedLayout = allLayouts.find(l => l.id === 'imported');
    const initialImportedLayout = initialLayouts.find(l => l.id === 'imported');

    // Do not save on the initial render to avoid unnecessary writes
    if (!importedLayout || JSON.stringify(importedLayout.themes) === JSON.stringify(initialImportedLayout?.themes)) {
        return;
    }

    try {
      // First, ensure the directory exists; if not, create it
      await fs.mkdir(THEMES_FOLDER_PATH, { recursive: true });

      if (importedLayout.themes.length > 0) {
        const themesToSave = JSON.stringify(importedLayout.themes, null, 2); // null, 2 for pretty printing
        await fs.writeFile(THEMES_FILE_PATH, themesToSave, 'utf-8');
      } else {
        // If the user deletes all themes, delete the file
        await fs.unlink(THEMES_FILE_PATH);
      }
    } catch (error: any) {
      // Ignore the error if the file doesn't exist when trying to delete it
      if (error.code !== 'ENOENT') {
        console.error("Failed to save imported themes to file:", error);
      }
    }
  };

  saveThemes();
}, [allLayouts]); // This runs on every change to allLayouts
```

With these modifications, your Electron application will save themes to a real `imported-themes/themes.json` file instead of relying on browser storage.