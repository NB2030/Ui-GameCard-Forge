/**
 * @file DownloadDropdown.tsx
 * This component renders the download button and its associated dropdown menu,
 * handling all asset export logic.
 */
import React, { useState, useRef, useEffect } from 'react';
import type { CardConfig } from '../types';
import { 
  downloadSvg,
  downloadSvgAsPng,
  downloadAllSvgAsZip,
  downloadAllPngAsZip
} from '../utils/exportUtils';

/**
 * @interface DownloadDropdownProps
 * @description Props for the DownloadDropdown component.
 */
interface DownloadDropdownProps {
  /** @type {CardConfig} The current configuration of the card, used for filenames and dimensions. */
  config: CardConfig;
  /** @type {React.RefObject<HTMLDivElement>} A ref pointing to the container of the main, visible SVG card. */
  svgContainerRef: React.RefObject<HTMLDivElement>;
  /** @type {React.RefObject<HTMLDivElement>} A ref pointing to the container of the off-screen, standalone button SVG. */
  buttonSvgContainerRef: React.RefObject<HTMLDivElement>;
  /** @type {React.RefObject<HTMLDivElement>} A ref pointing to the container of the off-screen button SVG styled for its hover state. */
  buttonWithHoverSvgContainerRef: React.RefObject<HTMLDivElement>;
  /** @type {(message: string) => void} A callback function to report errors back to the main application component. */
  onError: (message: string) => void;
  /** @type {boolean} [isDark=false] Whether dark mode is enabled. */
  isDark?: boolean;
}

/**
 * @description A helper function to safely find an SVG element within a referenced container and return its serialized string representation.
 * @param {React.RefObject<HTMLDivElement>} ref - The React ref to the container div.
 * @returns {string | null} The serialized SVG string, or null if the SVG element cannot be found.
 */
const getSvgString = (ref: React.RefObject<HTMLDivElement>): string | null => {
    const svgElement = ref.current?.querySelector('svg');
    if (svgElement) {
        return new XMLSerializer().serializeToString(svgElement);
    }
    return null;
};

// --- UI Icons ---
const DownloadIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.293V3a1 1 0 112 0v8.293l1.293-1.586a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
</svg>
);

const ZipIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2h2v2H6V7zm0 4h2v2H6v-2zm4-4h2v2h-2V7zm0 4h2v2h-2v-2z" />
</svg>
);


/**
 * @description A component that renders the main "Download" button and its associated dropdown menu. It orchestrates all asset export logic, including generating different variations of the card (full, no button) and exporting them as SVG, PNG, or a ZIP archive.
 * @param {DownloadDropdownProps} props The props for the component.
 * @returns {React.ReactElement} The rendered dropdown button and menu.
 */
const DownloadDropdown: React.FC<DownloadDropdownProps> = ({
    config,
    svgContainerRef,
    buttonSvgContainerRef,
    buttonWithHoverSvgContainerRef,
    onError,
    isDark = false,
}) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    /**
     * @description Effect hook to handle clicks outside of the dropdown menu. If a click is detected outside the component's ref, the dropdown is closed. This improves user experience by not requiring an explicit close action.
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    /**
     * @description A generic async wrapper for all download functions. It closes the dropdown, clears any previous errors, executes the provided download function, and catches any potential errors, reporting them to the parent component via the `onError` callback.
     * @param {() => Promise<void>} downloadFn The async download function to execute.
     */
    const handleDownload = async (downloadFn: () => Promise<void>) => {
        setDropdownOpen(false);
        onError(''); // Clear previous errors
        try {
            await downloadFn();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            console.error("Download failed:", errorMessage);
            onError(`Export Failed: ${errorMessage}`);
        }
    };
    
    // --- Download Handlers ---

    /**
     * @description Clones the main card SVG and removes the button group element (`#card-button-group`) to create a version of the card without the button. This is used for the "Card Only" export option.
     * @returns {string | null} The serialized SVG string of the card without the button, or null if the SVG cannot be found.
     */
    const getClonedCardSvgWithoutButton = (): string | null => {
        const svgElement = svgContainerRef.current?.querySelector('svg');
        if (svgElement) {
            const clonedSvg = svgElement.cloneNode(true) as SVGElement;
            clonedSvg.querySelector('#card-button-group')?.remove();
            return new XMLSerializer().serializeToString(clonedSvg);
        }
        return null;
    }

    /** @description Initiates the download of the complete card (with button) as a single SVG file. */
    const downloadFullCardSvg = () => handleDownload(async () => {
        const svg = getSvgString(svgContainerRef);
        if(svg) downloadSvg(svg, 'game-card-full.svg');
    });

    /** @description Initiates the download of the card without the button as a single SVG file. */
    const downloadCardOnlySvg = () => handleDownload(async () => {
        const svg = getClonedCardSvgWithoutButton();
        if(svg) downloadSvg(svg, 'game-card-no-button.svg');
    });
    
    /** @description Initiates the download of the standalone button as a single SVG file. */
    const downloadButtonOnlySvg = () => handleDownload(async () => {
        const svg = getSvgString(buttonSvgContainerRef);
        if(svg) downloadSvg(svg, 'game-card-button.svg');
    });

    /** @description Initiates the download of the standalone button's hover state as a single SVG file. */
    const downloadButtonWithHoverSvg = () => handleDownload(async () => {
        const svg = getSvgString(buttonWithHoverSvgContainerRef);
        if(svg) downloadSvg(svg, 'game-card-button-hover.svg');
    });

    /** @description Initiates the download of the complete card (with button) as a single PNG file. */
    const downloadFullCardPng = () => handleDownload(async () => {
        const svg = getSvgString(svgContainerRef);
        if (svg) await downloadSvgAsPng(svg, 'game-card-full.png', { width: config.cardWidth, height: config.cardHeight });
    });

    /** @description Initiates the download of the card without the button as a single PNG file. */
    const downloadCardOnlyPng = () => handleDownload(async () => {
        const svg = getClonedCardSvgWithoutButton();
        if(svg) await downloadSvgAsPng(svg, 'game-card-no-button.png', { width: config.cardWidth, height: config.cardHeight });
    });

    /** @description Initiates the download of the standalone button as a single PNG file. */
    const downloadButtonOnlyPng = () => handleDownload(async () => {
        const svg = getSvgString(buttonSvgContainerRef);
        if(svg) await downloadSvgAsPng(svg, 'game-card-button.png', { width: config.buttonWidth, height: config.buttonHeight });
    });

    /** @description Initiates the download of the standalone button's hover state as a single PNG file. */
    const downloadButtonHoverPng = () => handleDownload(async () => {
        const svg = getSvgString(buttonWithHoverSvgContainerRef);
        if(svg) await downloadSvgAsPng(svg, 'game-card-button-hover.png', { width: config.buttonWidth, height: config.buttonHeight });
    });

    /** @description Compiles all SVG assets into a single ZIP file and initiates the download. */
    const downloadZipSvg = () => handleDownload(async () => {
        await downloadAllSvgAsZip({
            'game-card-full.svg': getSvgString(svgContainerRef),
            'game-card-no-button.svg': getClonedCardSvgWithoutButton(),
            'game-card-button.svg': getSvgString(buttonSvgContainerRef),
            'game-card-button-hover.svg': getSvgString(buttonWithHoverSvgContainerRef),
        });
    });

    /** @description Compiles all PNG assets into a single ZIP file and initiates the download. */
    const downloadZipPng = () => handleDownload(async () => {
        await downloadAllPngAsZip({
            'game-card-full.png': { svg: getSvgString(svgContainerRef), dimensions: { width: config.cardWidth, height: config.cardHeight } },
            'game-card-no-button.png': { svg: getClonedCardSvgWithoutButton(), dimensions: { width: config.cardWidth, height: config.cardHeight } },
            'game-card-button.png': { svg: getSvgString(buttonSvgContainerRef), dimensions: { width: config.buttonWidth, height: config.buttonHeight } },
            'game-card-button-hover.png': { svg: getSvgString(buttonWithHoverSvgContainerRef), dimensions: { width: config.buttonWidth, height: config.buttonHeight } },
        });
    });

    const menuItemClasses = isDark
      ? 'block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white'
      : 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100';

    const zipMenuItemClasses = `${menuItemClasses} flex items-center`;

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
        <div>
          <button
            type="button"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-center px-4 py-2 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out text-sm ${
              isDark
                ? 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-offset-[#1a232e]'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
            }`}
            id="options-menu"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <DownloadIcon />
            Download
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {isDropdownOpen && (
          <div
            className={`origin-top-right absolute z-10 right-0 mt-2 w-64 rounded-lg shadow-lg focus:outline-none border ${
              isDark
                ? 'bg-[#1a232e] border-gray-700 text-gray-300'
                : 'bg-white border-gray-200 text-gray-700 ring-1 ring-black ring-opacity-5'
            }`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1" role="none">
              <a href="#" onClick={(e) => { e.preventDefault(); downloadFullCardSvg(); }} className={menuItemClasses} role="menuitem">Full Card (.svg)</a>
              <a href="#" onClick={(e) => { e.preventDefault(); downloadCardOnlySvg(); }} className={menuItemClasses} role="menuitem">Card Only (.svg)</a>
              <a href="#" onClick={(e) => { e.preventDefault(); downloadButtonOnlySvg(); }} className={menuItemClasses} role="menuitem">Button Only (.svg)</a>
              <a href="#" onClick={(e) => { e.preventDefault(); downloadButtonWithHoverSvg(); }} className={menuItemClasses} role="menuitem">Button (Hover State) (.svg)</a>
              <div className={`border-t my-1 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></div>
              <a href="#" onClick={(e) => { e.preventDefault(); downloadFullCardPng(); }} className={menuItemClasses} role="menuitem">Full Card (.png)</a>
              <a href="#" onClick={(e) => { e.preventDefault(); downloadCardOnlyPng(); }} className={menuItemClasses} role="menuitem">Card Only (.png)</a>
              <a href="#" onClick={(e) => { e.preventDefault(); downloadButtonOnlyPng(); }} className={menuItemClasses} role="menuitem">Button Only (.png)</a>
              <a href="#" onClick={(e) => { e.preventDefault(); downloadButtonHoverPng(); }} className={menuItemClasses} role="menuitem">Button (Hover State) (.png)</a>
              <div className={`border-t my-1 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></div>
              <a href="#" onClick={(e) => { e.preventDefault(); downloadZipSvg(); }} className={zipMenuItemClasses} role="menuitem">
                <ZipIcon /> Download All (.svg) (.zip)
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); downloadZipPng(); }} className={zipMenuItemClasses} role="menuitem">
                <ZipIcon /> Download All (.png) (.zip)
              </a>
            </div>
          </div>
        )}
      </div>
    );
};

export default DownloadDropdown;