import { API_BASE_URL } from "src/constants/routes";
export interface EditorPhoto {
  id: string;
  source: string;
  preview: string;
  file?: File;
}
export function imagePreview(path: string): string {
  return /^\/v1\/(media|blogs\/photos|events\/photos)\/[0-9a-f-]{36}$/.test(
    path,
  )
    ? API_BASE_URL + path
    : path;
}
export function existingPhoto(path: string): EditorPhoto {
  return { id: crypto.randomUUID(), source: path, preview: imagePreview(path) };
}
/** Only normalize new stored-media fields. Leave external/static URLs and non-JSON responses alone. */
export function withMediaImages(value: any): any {
  if (Array.isArray(value)) return value.map(withMediaImages);
  if (!value || Object.getPrototypeOf(value) !== Object.prototype) return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => {
      if (key === "imageUrl" && typeof entry === "string")
        return [
          key,
          entry.startsWith("/v1/media/") ? imagePreview(entry) : entry,
        ];
      if (key === "images" && Array.isArray(entry))
        return [
          key,
          entry.map((path) =>
            typeof path === "string" && path.startsWith("/v1/media/")
              ? imagePreview(path)
              : path,
          ),
        ];
      return [key, withMediaImages(entry)];
    }),
  );
}
