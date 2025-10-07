# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**GameCard Forge** is an application for designing UI game cards in SVG and PNG formats, allowing you to create fully customizable, high-quality cards for use in games and apps quickly and easily. Built with React, TypeScript, Vite, and Electron for cross-platform desktop distribution.

## Development Commands

### Core Development
- `npm install` - Install dependencies
- `npm run dev` - Start development server (runs on localhost with hot reload)
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally

### Electron Desktop App
- `npm run electron:dev` - Run app in Electron with hot reload (development)
- `npm run electron:pack` - Build Electron app (unpacked folder only)
- `npm run electron:build-win` - Build Windows installer (.exe file)

### Environment Setup
- Create `.env.local` file and set `GEMINI_API_KEY` (referenced in vite.config.ts but may not be actively used)
- No linting or formatting commands are configured

## Architecture Overview

### Component Hierarchy
- **App.tsx**: Main orchestrator component managing global state and layout
- **ControlPanel**: Tabbed interface for customization (Content, Card Style, Button Style)
- **Card Components**: CardSvg (vertical) and CardSvgHorizontal render the actual cards
- **ButtonSvg**: Standalone button component used for exports
- **DownloadDropdown**: Handles all export functionality (SVG, PNG, ZIP)

### Electron Desktop Integration
- **main.js**: Electron main process handling window creation and native menus
- **Dual Mode**: Works as web app (localhost) or desktop app (file protocol)
- **Native Features**: File downloads, native menus, system integration

### State Management Pattern
- **useCardConfig hook**: Centralized state management for card configuration
- **themes.ts**: Defines layout and theme presets with complete CardConfig objects
- **types.ts**: Single source of truth for all TypeScript interfaces

### Key Data Structures
- `CardConfig`: Complete card configuration (colors, text, dimensions, offsets)
- `Layout`: Contains themes for vertical vs horizontal orientations  
- `Theme`: Preset configurations users can select
- `CustomFont`: User-uploaded font files with data URLs

### Export System Architecture
The export system uses off-screen rendering:
1. **On-screen**: User sees live preview in main container
2. **Off-screen**: Hidden containers render standalone SVGs for export
3. **Export Utils**: Handle SVG→PNG conversion via Canvas API and ZIP creation via JSZip

### File Organization
```
components/
├── controls/          # Reusable form inputs (ColorInput, NumberInput, etc.)
├── panel-tabs/        # Tab content components for ControlPanel
└── [card-components]  # Main card and button renderers
hooks/                 # useCardConfig custom hook
utils/                 # exportUtils, color utilities, font utilities
```

## Development Patterns

### Adding New Themes
1. Add theme object to appropriate layout in `themes.ts`
2. Theme automatically appears in UI via `layouts` prop
3. All CardConfig properties must be specified (no partial configs)

### Modifying Card Configuration
- Always update `CardConfig` interface in `types.ts` first
- Add corresponding UI controls in appropriate panel-tab component
- Update default values in theme presets as needed

### Working with SVG Components
- Card components render SVG directly (no external libraries)
- Use `customFonts` prop to inject user-uploaded fonts via `<defs>`
- Off-screen rendering containers are positioned at `left: -9999px` for export

### Font Handling
- Custom fonts loaded as data URLs and injected into SVG `<defs>`
- Font validation accepts: TTF, OTF, WOFF, WOFF2
- Font names derived from filenames (minus extension)

## Key Technical Details

### Export Functionality
- **SVG Export**: Direct DOM extraction from rendered components
- **PNG Export**: SVG→Canvas→PNG pipeline with 2x scaling and padding
- **ZIP Export**: JSZip library bundles multiple assets

### Layout System
- **Vertical Layout**: Traditional card format (300x400px default)
- **Horizontal Layout**: Banner format (500x120px default)
- Button corner radius calculation differs between layouts

### State Persistence
- Image uploads preserved when switching themes/layouts
- No localStorage persistence - state resets on page reload

## Common Development Tasks

### Adding New Export Format
1. Create conversion function in `utils/exportUtils.ts`
2. Add option to DownloadDropdown component
3. Update export handlers in App.tsx if needed

### Creating New Control Components
- Follow pattern in `components/controls/` 
- Accept `value`, `onChange`, `label` props
- Use consistent styling classes

### Adding Layout Variants
1. Create new layout object in `themes.ts`
2. Add corresponding Card component (e.g., CardSvgSquare)
3. Update layout switching logic in App.tsx and useCardConfig