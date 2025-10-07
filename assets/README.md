# App Assets

## Icons

To add a custom icon to your Electron app:

1. **For Windows (.ico format):**
   - Create or convert your icon to `.ico` format
   - Name it `icon.ico` and place it in this folder
   - The icon should be at least 256x256 pixels for best quality

2. **For development (.png format):**
   - Create a PNG version of your icon 
   - Name it `icon.png` and place it in this folder
   - This will be used during development

## Icon Requirements

- **Windows**: 256x256 pixels, .ico format
- **Recommended**: Create multiple sizes (16x16, 32x32, 48x48, 64x64, 128x128, 256x256) in the .ico file
- **Format**: Use transparent background for best results

## Default Icon

If no custom icon is provided, Electron will use its default icon. The app will still work perfectly without a custom icon.