
export class LoadingUtils {
    public static activeRequests = 0;
    private static loadingElement: HTMLElement | null = null;


    public static showLoader(): void {
      if (!this.loadingElement) {
        this.loadingElement = document.getElementById('loading-animation');
      }
      if (this.loadingElement) {
        this.loadingElement.style.display = 'block';
      }
    }

    public static hideLoader(): void {
      if (this.loadingElement && this.activeRequests === 0) {
        this.loadingElement.style.display = 'none';
      }
    }

    public static incrementActiveRequests(): void {
      this.activeRequests++;
    }

    public static decrementActiveRequests(): void {
      this.activeRequests--;
    }
  }

