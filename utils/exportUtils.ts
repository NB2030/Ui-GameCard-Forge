/**
 * @file exportUtils.ts
 * This file contains utility functions for handling file exports, including
 * SVG downloads, SVG to PNG conversion, and creating ZIP archives.
 */
import JSZip from 'jszip';

/**
 * @description Triggers a browser download for a given Blob object by creating a temporary anchor element.
 * @param {Blob} blob - The Blob data to be downloaded.
 * @param {string} fileName - The desired name for the downloaded file.
 */
const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * @description Creates a Blob from an SVG string and triggers a browser download.
 * @param {string} svgString - The SVG content as a string.
 * @param {string} fileName - The name for the downloaded file (e.g., 'my-card.svg').
 */
export const downloadSvg = (svgString: string, fileName:string) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    downloadBlob(blob, fileName);
};

/**
 * @description Converts a JavaScript object to a JSON string, creates a Blob, and triggers a browser download.
 * @param {object} jsonObject - The JavaScript object to be serialized and downloaded.
 * @param {string} fileName - The name for the downloaded file (e.g., 'config.json').
 */
export const downloadJson = (jsonObject: object, fileName: string) => {
    const jsonString = JSON.stringify(jsonObject, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    downloadBlob(blob, fileName);
};


/**
 * @description Converts an SVG string to a high-quality PNG Blob. It renders the SVG onto a scaled-up canvas with padding to ensure effects like drop shadows are not clipped, then resolves with the resulting Blob.
 * @param {string} svgString - The SVG content as a string.
 * @param {{ width: number, height: number }} dimensions - The original width and height of the SVG. This is used to calculate the canvas size accurately.
 * @returns {Promise<Blob>} A promise that resolves with the generated PNG Blob.
 * @throws {Error} Throws an error if the SVG is malformed, the canvas context cannot be created, or the conversion fails.
 */
const svgToPngBlob = (svgString: string, dimensions: { width: number, height: number }): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        const padding = 20;
        const scale = 2; // Render at 2x for higher quality

        // To ensure transparent background, we can't just wrap the string. We need to create a new SVG
        // that contains the original content, which preserves styles and definitions.
        const svgContentMatch = svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
        if (!svgContentMatch) {
          return reject(new Error("Could not extract content from SVG string. The SVG may be malformed."));
        }
        const svgContent = svgContentMatch[1];
        
        const newWidth = dimensions.width + padding * 2;
        const newHeight = dimensions.height + padding * 2;

        const wrappedSvgString = `
            <svg
                width="${newWidth}"
                height="${newHeight}"
                viewBox="0 0 ${newWidth} ${newHeight}"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g transform="translate(${padding}, ${padding})">
                    ${svgContent}
                </g>
            </svg>
        `;

        const canvas = document.createElement('canvas');
        canvas.width = newWidth * scale;
        canvas.height = newHeight * scale;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error("Canvas context not available. Your browser may not support this feature."));
        }
        
        const img = new Image();
        const svgBlob = new Blob([wrappedSvgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas. The image may be too large or corrupted."));
            }
          }, 'image/png');
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Error loading SVG image for PNG conversion. The SVG may contain invalid data or external resources that cannot be loaded."));
        }
        
        img.src = url;
      } catch (e) {
        reject(new Error(`An unexpected error occurred during PNG conversion: ${e instanceof Error ? e.message : String(e)}`));
      }
    });
};

// ... (rest of the file remains the same)
/**
 * @description Converts an SVG string to a PNG Blob using `svgToPngBlob` and then triggers a browser download for the resulting file.
 * @param {string} svgString - The SVG content as a string.
 * @param {string} fileName - The name for the downloaded PNG file.
 * @param {{ width: number, height: number }} dimensions - The original width and height of the SVG, passed to the converter.
 */
export const downloadSvgAsPng = async (svgString: string, fileName: string, dimensions: { width: number, height: number }) => {
    const blob = await svgToPngBlob(svgString, dimensions);
    downloadBlob(blob, fileName);
};

/**
 * @description Compiles multiple SVG assets into a single ZIP file and initiates the download.
 * @param {{[fileName: string]: string | null}} svgData - An object where keys are the desired filenames within the ZIP, and values are the corresponding SVG content as strings. Null values are skipped.
 */
export const downloadAllSvgAsZip = async (svgData: { [fileName: string]: string | null }) => {
    const zip = new JSZip();
    
    for (const fileName in svgData) {
        const data = svgData[fileName];
        if (data) {
            zip.file(fileName, data);
        }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zipBlob, "game-card-assets-svg.zip");
};

/**
 * @description Converts multiple SVG assets to PNG format, compiles them into a single ZIP file, and initiates the download.
 * @param {{[fileName: string]: { svg: string | null; dimensions: { width: number, height: number} }}} pngData - An object where keys are desired PNG filenames, and values are objects containing the SVG string and its original dimensions.
 */
export const downloadAllPngAsZip = async (pngData: { [fileName: string]: { svg: string | null; dimensions: { width: number, height: number} }}) => {
    const zip = new JSZip();

    const blobPromises = Object.entries(pngData).map(async ([fileName, data]) => {
        if (data.svg) {
            const blob = await svgToPngBlob(data.svg, data.dimensions);
            zip.file(fileName, blob);
        }
    });
    
    await Promise.all(blobPromises);

    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zipBlob, "game-card-assets-png.zip");
};
