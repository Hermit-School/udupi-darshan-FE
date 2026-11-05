/** One indicator shared by concurrent requests and lazy route downloads. */
export class LoadingUtils {
  public static activeRequests = 0;
  private static timer: ReturnType<typeof setTimeout> | undefined;
  public static showLoader(): void {
    if (this.timer !== undefined) return;
    this.timer = setTimeout(() => {
      this.timer = undefined;
      if (this.activeRequests === 0) return;
      const element = document.getElementById("loading-animation");
      if (element) {
        element.classList.toggle(
          "initial-load",
          !document.querySelector("main h1"),
        );
        element.style.display = "block";
      }
    }, 180);
  }
  public static hideLoader(): void {
    if (this.activeRequests !== 0) return;
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    const element = document.getElementById("loading-animation");
    if (element) {
      element.classList.remove("initial-load");
      element.style.display = "none";
    }
  }
  public static incrementActiveRequests(): void {
    this.activeRequests++;
  }
  public static decrementActiveRequests(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
  }
}
