/** Shared visitor/admin photo checks; the backend independently validates every upload. */
export async function validateStoryPhotos(
  files: readonly File[],
  existingCount: number,
): Promise<void> {
  if (existingCount + files.length > 3)
    throw new Error(
      'Choose up to 3 photos in total, including photos already attached.',
    );
  if (
    files.some(
      (file) =>
        !['image/jpeg', 'image/png'].includes(file.type) ||
        file.size === 0 ||
        file.size > 5 * 1024 * 1024,
    )
  )
    throw new Error('Choose JPEG or PNG photos, at most 5 MB each.');
  try {
    for (const file of files) {
      const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
      const png = [137, 80, 78, 71, 13, 10, 26, 10].every(
        (value, index) => header[index] === value,
      );
      const jpeg = header[0] === 255 && header[1] === 216 && header[2] === 255;
      if (!(file.type === 'image/png' ? png : jpeg)) throw new Error('format');
      const image = await createImageBitmap(file);
      try {
        if (
          !image.width ||
          !image.height ||
          image.width * image.height > 20_000_000
        )
          throw new Error('dimensions');
      } finally {
        image.close();
      }
    }
  } catch {
    throw new Error(
      'Choose readable JPEG or PNG photos, up to 20 megapixels each. No new photos were added.',
    );
  }
}
