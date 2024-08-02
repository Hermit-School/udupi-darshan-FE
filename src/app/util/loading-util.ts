
export class LoadingUtils {
    public static activeRequests = 0;
    private static loadingElement: HTMLElement | null = null;
    public static readonly MIN_DISPLAY_TIME = 200; 
  
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
        setTimeout(() => {
          if (this.activeRequests === 0) {
            this.loadingElement!.style.display = 'none';
          }
        }, this.MIN_DISPLAY_TIME);
      }
    }
  
    public static incrementActiveRequests(): void {
      this.activeRequests++;
    }
  
    public static decrementActiveRequests(): void {
      this.activeRequests--;
    }
  }
  