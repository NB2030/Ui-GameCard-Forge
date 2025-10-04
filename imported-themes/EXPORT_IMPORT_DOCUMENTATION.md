# Documentation for the Card Settings Import/Export Feature

This document explains in detail how the feature for importing and exporting card configurations works in the GameCard Forge application.

---

## 1. Purpose of the Feature

The import/export feature is designed to provide users with flexibility and power in managing their designs. The main objectives are:

-   **Saving Designs:** Enable users to save complex and custom card configurations as a small file on their devices for future reference.
-   **Sharing and Collaboration:** Facilitate the sharing of designs with other team members or friends to ensure a unified visual style.
-   **Creating Base Templates:** Users can design a base template, export it, and then import it multiple times as a starting point for different projects.
-   **Backup:** Provide an easy way to back up your favorite designs.

---

## 2. How to Export Card Settings

### The Process:
1.  Design your card in the main interface until it reaches the desired look.
2.  Click the **"Export as Theme"** button located in the top-right corner of the screen.
3.  A `.json` file (e.g., `game-card-theme.json`) will be automatically generated and downloaded to your device.

### What Does the Export File Contain?
The application exports a JSON object containing two main properties:

-   `layoutId`: Specifies the base layout the card was designed on. The value is either `"vertical"` or `"horizontal"`.
-   `config`: An object containing **all** the design settings you have customized, such as:
    -   Texts (title, price, button text).
    -   Colors (card color, frame, texts, button).
    -   Font settings (font type, size, weight).
    -   Dimensions (width and height of the card and button).
    -   Stroke and gradient settings.
    -   Element offsets.

**Important Note:** The image data (`image`) you uploaded is **not** included in the export file. This is intentional to keep the export file size very small and easy to share. When importing the design, you will need to re-upload the image manually.

### Example of an Exported `.json` File Content:
```json
{
  "layoutId": "vertical",
  "config": {
    "title": "Space Explorer's Pack",
    "price": 4.99,
    "buttonText": "BUY NOW",
    "cardColor": "#FFFFFF",
    "buttonColor": "#6D28D9",
    "textColor": "#2C3E50",
    "titleFontFamily": "'Poppins', sans-serif",
    "titleFontSize": 19,
    // ... and all other properties
  }
}
```

---

## 3. How to Import Card Settings (as a New Template)

### The Process:
1.  Click the **"Import Theme"** button located in the top-right corner.
2.  A file browser will appear; select the `.json` file you previously exported or received from someone else.
3.  Once the file is selected, the application will:
    -   Read the file and validate its structure.
    -   Add the imported design as a new theme under the **"Imported Themes"** category.
    -   Immediately apply the settings of the imported template to the card displayed in the preview area.
    -   Select the "Imported Themes" category and the new template in the dropdown menus.

### Built-in Smart Logic:
-   **Duplicate Prevention:** If you try to import a file with a configuration identical to an existing template in "Imported Themes," the application will display an error message stating that the template is a duplicate and will not be added again.
-   **Automatic Renaming:** If the imported template has a name (based on the `title` field in the settings) that already exists, the application will automatically add a number to the end of the name to ensure there are no conflicts. For example, if a template named "My Design" already exists, the new one will be saved as "My Design (2)".

---

## 4. Best Practices and Uses

-   **Unifying Visual Identity:** Design a card that represents your game's visual identity, then export it. All your team members can import this file to ensure that all created cards follow the same style.
-   **Quick Experimentation:** If you have a new design idea, you can save your current design by exporting it, then freely experiment with changes. If you don't like the result, you can easily import the original file to revert to the previous state.
-   **Creating a Template Library:** Over time, you can build your own library of `.json` files representing different styles (e.g., "sci-fi style," "magic style," "minimalist style") to speed up the design process in future projects.

---

## 5. Security and Validation

To ensure a safe and reliable experience, GameCard Forge performs strict validation and sanitization on any `.json` file that is imported.

### Structure and Data Validation
When a file is imported, it is checked to ensure:
-   It has the correct structure (`layoutId` and `config`).
-   The `config` object contains **all** required fields.
-   Each field has the correct data type (e.g., `title` must be a string, and `titleFontSize` must be a number).

If any of these checks fail, the file will be rejected, and an error message explaining the issue will be displayed. No changes will be made to your templates.

### Protection Against Malicious Code (Sanitization)
The import feature is designed with the consideration that someone might modify a `.json` file to inject malicious code (like Cross-Site Scripting - XSS attacks).

To protect you, the application automatically **sanitizes all text fields** in the imported file. This means that any HTML or XML code that might be embedded in the text is removed. For example, if the title field was modified to contain malicious code like `<script>alert('danger')</script>`, the application would strip it out before saving or displaying the template.

These measures ensure that you can import and share settings files with confidence, knowing that the application is protecting you from invalid configurations and harmful content.