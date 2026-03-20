/**
 * Compresses and resizes an image File using the Canvas API.
 * Returns a base64 JPEG string suitable for localStorage storage.
 * Max width: 900px, quality: 0.82 — buen balance tamaño/calidad.
 */
export async function compressImage(
  file: File,
  maxWidth = 900,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Error leyendo el archivo'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Error cargando la imagen'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas no disponible'));

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/** Devuelve el tamaño legible de una cadena base64 */
export function base64Size(b64: string): string {
  const bytes = Math.round((b64.length * 3) / 4);
  return bytes > 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}
