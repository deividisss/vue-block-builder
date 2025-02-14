/**
 * Downloads a Blob as an image file.
 * @param blob - The Blob object representing the image.
 * @param fileName - The name of the file to be downloaded (default: 'captured-image.png').
 */
export function downloadImageFromBlob(blob: Blob, fileName: string = 'captured-image.png'): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}