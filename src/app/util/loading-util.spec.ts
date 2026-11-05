import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoadingUtils } from "./loading-util";
describe("Loading indicator lifecycle", () => {
  let host: HTMLElement;
  beforeEach(() => {
    vi.useFakeTimers();
    LoadingUtils.activeRequests = 0;
    LoadingUtils.hideLoader();
    host = document.createElement("div");
    host.innerHTML = '<div id="loading-animation" style="display:none"></div>';
    document.body.append(host);
  });
  afterEach(() => {
    LoadingUtils.activeRequests = 0;
    LoadingUtils.hideLoader();
    host.remove();
    vi.useRealTimers();
  });
  const begin = () => {
    LoadingUtils.showLoader();
    LoadingUtils.incrementActiveRequests();
  };
  it("does not flash for a fast completed request", () => {
    begin();
    LoadingUtils.decrementActiveRequests();
    LoadingUtils.hideLoader();
    vi.advanceTimersByTime(500);
    expect(document.getElementById("loading-animation")!.style.display).toBe(
      "none",
    );
  });
  it("stays visible until all overlapping requests finish", () => {
    begin();
    LoadingUtils.incrementActiveRequests();
    vi.advanceTimersByTime(180);
    LoadingUtils.decrementActiveRequests();
    LoadingUtils.hideLoader();
    expect(document.getElementById("loading-animation")!.style.display).toBe(
      "block",
    );
    LoadingUtils.decrementActiveRequests();
    LoadingUtils.hideLoader();
    expect(document.getElementById("loading-animation")!.style.display).toBe(
      "none",
    );
  });
  it("uses the loading page before content is available", () => {
    begin();
    vi.advanceTimersByTime(180);
    expect(
      document
        .getElementById("loading-animation")!
        .classList.contains("initial-load"),
    ).toBe(true);
  });
  it("uses a compact indicator when content is already available", () => {
    const main = document.createElement("main");
    main.innerHTML = "<h1>Nature</h1>";
    host.append(main);
    begin();
    vi.advanceTimersByTime(180);
    expect(
      document
        .getElementById("loading-animation")!
        .classList.contains("initial-load"),
    ).toBe(false);
  });
  it("resolves the current element after the app remounts", () => {
    begin();
    vi.advanceTimersByTime(180);
    LoadingUtils.decrementActiveRequests();
    LoadingUtils.hideLoader();
    host.innerHTML = '<div id="loading-animation" style="display:none"></div>';
    begin();
    vi.advanceTimersByTime(180);
    expect(document.getElementById("loading-animation")!.style.display).toBe(
      "block",
    );
  });
  it("never lets the pending request count become negative", () => {
    LoadingUtils.decrementActiveRequests();
    expect(LoadingUtils.activeRequests).toBe(0);
  });
});
