/**
 * Compresses an image file client-side using HTML5 Canvas.
 * Falls back to returning the original file if compression fails or file is not an image.
 */
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.75
): Promise<File> {
  // Return early if not an image
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Proportional resizing if dimensions exceed threshold
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw to canvas with resizing
        ctx.drawImage(img, 0, 0, width, height);

        // Convert PNGs to WebP for maximum space saving, or use original format
        const outputType = file.type === "image/png" ? "image/webp" : file.type;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const nameParts = file.name.split(".");
            const nameWithoutExt = nameParts.slice(0, -1).join(".");
            const ext = outputType.split("/")[1] || "jpg";
            
            const compressedFile = new File([blob], `${nameWithoutExt}.${ext}`, {
              type: outputType,
              lastModified: Date.now(),
            });

            // Log performance details to developer console
            console.log(
              `[Image Compression] ${file.name} (${(file.size / 1024).toFixed(1)} KB) -> ` +
              `${compressedFile.name} (${(compressedFile.size / 1024).toFixed(1)} KB). ` +
              `Saved: ${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%`
            );

            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };

      img.onerror = () => {
        resolve(file);
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}
