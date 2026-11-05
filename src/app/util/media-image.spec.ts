import { describe, it, expect } from "vitest";
import { withMediaImages } from "./media-image";
import { API_BASE_URL } from "src/constants/routes";
describe("Stored media URLs", () => {
  const path = "/v1/media/12345678-1234-1234-1234-123456789012";
  it("normalizes gallery, ad, related-place and event images without mutating cached data", () => {
    const original = {
      images: [path, "assets/legacy.jpg"],
      imageUrl: path,
      dontMissThese: [{ imageUrl: path }],
      details: { article: { images: [path] } },
    };
    const mapped = withMediaImages(original);
    expect(mapped.images).toEqual([API_BASE_URL + path, "assets/legacy.jpg"]);
    expect(mapped.imageUrl).toBe(API_BASE_URL + path);
    expect(mapped.dontMissThese[0].imageUrl).toBe(API_BASE_URL + path);
    expect(mapped.details.article.images[0]).toBe(API_BASE_URL + path);
    expect(original.images[0]).toBe(path);
  });
  it("leaves binary responses, external links and ordinary text alone", () => {
    const blob = new Blob(["image"]);
    expect(withMediaImages(blob)).toBe(blob);
    expect(
      withMediaImages({
        link: path,
        images: ["https://example.invalid/photo.jpg"],
      }),
    ).toEqual({ link: path, images: ["https://example.invalid/photo.jpg"] });
  });
});
