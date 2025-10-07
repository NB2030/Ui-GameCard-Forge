# Build Automation Reference

This guide focuses on the three Windows build entry points that automate GameCard Forge releases:

- `build.cmd`
- `build-menu.ps1`
- `build-release.ps1`

Use it as both documentation for the current project and a blueprint for creating similar tooling in other Electron + Vite applications.

---

## 1. `build.cmd` — Windows Launcher

**Role**

- Bridges double-click workflows with the PowerShell automation.
- Ensures the user is in the correct project directory before invoking PowerShell.
- Falls back to Windows PowerShell if PowerShell Core (`pwsh`) is unavailable.

**Execution flow**

1. Displays a banner so users know the build system started.
2. Changes the working directory to the script location with `cd /d "%~dp0"`.
3. Tries `pwsh -ExecutionPolicy Bypass -NoProfile -File "build-menu.ps1"`.
4. If `pwsh` fails, runs `powershell -ExecutionPolicy Bypass -NoProfile -File "build-menu.ps1"`.
5. Waits for user confirmation (`pause`) before closing the console window.

**Customizing for another project**

- Update the banner text and window title to match the new application.
- Change the PowerShell entry script name if you rename `build-menu.ps1`.
- Keep the execution policy flags so the script can run without installation-wide changes.
- Optionally add argument forwarding (`build-menu.ps1 -Auto`) if you want a non-interactive default path.

---

## 2. `build-menu.ps1` — Interactive Build Console

**Responsibilities**

- Presents numbered options for the most common release scenarios.
- Validates prerequisites (checks the presence of `build-release.ps1`, warns if the development source mirror is missing).
- Calls `build-release.ps1` with parameter sets that correspond to the selected menu item.
- Shows quick-glance data such as current version, last builds, and usage instructions.

**Menu-to-parameter mapping**

| Menu option | Scenario | Parameters passed to `build-release.ps1` |
| --- | --- | --- |
| 1 | Patch release | *(no extra params)* → defaults to `-IncrementType patch` when auto-increment is enabled. |
| 2 | Minor release | `@{ IncrementType = "minor" }` |
| 3 | Major release | `@{ IncrementType = "major" }` |
| 4 | Custom version | Prompts for version string → `@{ Version = <input> }` |
| 5 | Sync only | `@{ SyncOnly = $true }` |
| 6 | Test build (no installer) | `@{ TestBuild = $true }` |
| 7 | Build without version bump | `@{ SkipVersion = $true }` |
| 8 | Show version info | Reads `version-info.json`, no build triggered. |
| 9 | Show usage guide | Prints help text, no build triggered. |
| 0 | Exit | Stops the menu. |

**Extending the menu**

- Add new cases in the main `switch` block that pass additional parameters (e.g., `-Verbose`).
- Inject custom confirmations with `Confirm-Action` before launching sensitive operations (code signing, publishing, etc.).
- Adjust the helper text in `Show-Usage` to reflect new deployment paths.

**Automation tips**

- The script already supports `-Auto` mode when invoked from CI (skips prompts). Extend `Run-BuildScript` to parse environment flags if you need more automated branches.
- Keep console output consistent—`Write-Host` colors provide quick feedback for success/warning/error states.

---

## 3. `build-release.ps1` — Build Pipeline Engine

`build-release.ps1` orchestrates the entire release lifecycle. It is parameter-driven, which makes it easy to reuse from both interactive menus and CI jobs.

**Parameters**

| Parameter | Type | Purpose |
| --- | --- | --- |
| `Version` | `string` | Optional explicit semantic version (overrides auto-increment). |
| `IncrementType` | `patch\|minor\|major` | Chooses which portion of the version to bump when auto-incrementing. Default: `patch`. |
| `SyncOnly` | `switch` | Runs synchronization steps then exits (no build/package). |
| `TestBuild` | `switch` | Produces unpacked Electron output via `electron:pack` instead of the full installer. |
| `SkipVersion` | `switch` | Leaves version files untouched; useful for rebuilding the same release. |
| `Verbose` | `switch` | Prints additional details during file synchronization and packaging. |

**Pipeline stages**

1. `Environment Check`
   - Confirms Node.js and npm are installed; stops otherwise.
   - Reads optional `sourcePath` from `build-config.json` to inform the user which project will be synchronized.

2. `Version Management`
   - Reads `version-info.json` for `currentVersion` and history.
   - Applies manual version (`-Version`), auto-increment (`-IncrementType`), or leaves untouched (`-SkipVersion`).
   - Writes the new version back to:
     - `version-info.json` (also increments `buildNumber` and timestamps the history entry).
     - `package.json` (`version` field).
     - `metadata.json` (adds/updates `version` property when the file exists).
     - `main.js` (updates the About dialog string `Version: x.y.z`).

3. `File Synchronization`
   - Uses `build-config.json.syncSettings` to copy files/folders from `sourcePath` to the release repo.
   - Skips the step if `sourcePath` is missing or not configured.
   - Honors `Verbose` output for per-file logging.

4. `Web App Build`
   - Removes any leftover `dist/` folder.
  - Runs `npm run build` (Vite). Relies on `vite.config.ts` to emit relative assets (`base: './'` for production).

5. `Electron Packaging`
   - Default path: `npm run electron:build-win` to emit an NSIS installer into `release/`.
   - Test mode: `npm run electron:pack` to create `release/win-unpacked/` without an installer.

6. `Summary`
   - Scans the output directory configured in `build-config.json.buildSettings.outputPath` (defaults to `release/`).
   - Prints installer file name, size, and the unpacked executable when present.

**Supporting configuration files**

- `build-config.json`
  - `sourcePath`: Source project to mirror.
  - `syncSettings.filesToCopy / foldersToSync`: Items copied before building.
  - `buildSettings.outputPath`: Directory scanned in the summary step.
- `version-info.json`
  - Stores version metadata, release history, and sequential build numbers.
- `metadata.json`
  - Optional file enriched with the current version (useful for embedding metadata in the packaged app).

**Common customizations**

- Replace `electron:build-win` with a multi-platform command (e.g., `electron-builder --mac --linux`).
- Add signing steps after packaging by inserting commands before the summary stage.
- Integrate artifact uploads by extending the summary section to copy installers to a shared folder or cloud storage.

---

## 4. Porting the Workflow to Another Project

1. **Duplicate the scripts** (`build.cmd`, `build-menu.ps1`, `build-release.ps1`) into the new repository.
2. **Adjust configuration files** (`build-config.json`, `version-info.json`, optional `metadata.json`) to fit the new directory layout and release naming.
3. **Update project metadata** in `package.json` (name, version, electron-builder targets) and align `main.js` text strings.
4. **Verify Vite settings**—the production build must output relative paths (`base: './'`), especially when loading via `file://` inside Electron.
5. **Run `pwsh ./build-release.ps1 -TestBuild`** to produce an unpacked build and confirm assets load correctly.
6. **Iterate** on the menu options if the new project requires additional scenarios (e.g., publishing, code signing, uploading).
7. **Document project-specific prerequisites** (API keys, certificates) so the scripts remain portable and team-friendly.

---

## 5. Troubleshooting & Best Practices

- **Missing PowerShell Core?** `build.cmd` automatically tries Windows PowerShell; keep both commands for maximum compatibility.
- **Execution policy errors?** The scripts use `-ExecutionPolicy Bypass`. If corporate policies block this, place the scripts on an allow list or sign them.
- **White screen in packaged Electron build?** Ensure `vite.config.ts` sets `base: './'` for production so `file://` URLs resolve correctly.
- **Repeated builds of the same version?** Invoke `build-release.ps1 -SkipVersion` to avoid incrementing metadata.
- **CI usage:** Call `pwsh ./build-release.ps1` directly with explicit parameters. Combine with artifact upload logic after the summary step.
- **Version control strategy:** Decide whether to commit `version-info.json` and `metadata.json` changes; either track them for history or add them to `.gitignore`.

---

Concentrating on these three scripts keeps the build process transparent: `build.cmd` launches the experience, `build-menu.ps1` guides the human operator, and `build-release.ps1` performs the heavy lifting. Reusing the trio in another Electron + Vite project requires only minor path and metadata adjustments.
