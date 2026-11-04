import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  Renderer2,
} from '@angular/core';

/** Progressive enhancement: content is visible even if observers or animation APIs are unavailable. */
@Directive({ selector: '[udMotion]', standalone: true })
export class VisitorMotionDirective implements AfterViewInit, OnDestroy {
  private readonly selector =
    '[data-reveal], .ud-section-head, .ud-card, .card, .story-banner, .home-local, .destination-copy > section, .visit-panel, .story-content';
  private observer?: IntersectionObserver;
  private mutations?: MutationObserver;
  private resize?: ResizeObserver;
  private preference?: MediaQueryList;
  private finePointer?: MediaQueryList;
  private seen = new WeakSet<Element>();
  private pending = new Set<Element>();
  private active = new Map<Element, Animation>();
  private progress?: HTMLElement;
  private frame = 0;
  private pointerFrame = 0;
  private spotlight?: HTMLElement;
  private pointer?: { x: number; y: number; target: HTMLElement };
  private destroyed = false;
  constructor(
    private element: ElementRef<HTMLElement>,
    private zone: NgZone,
    private renderer: Renderer2,
  ) {}
  ngAfterViewInit(): void {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return;
    this.preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    this.zone.runOutsideAngular(() => {
      this.preference?.addEventListener('change', this.configure);
      this.configure();
    });
  }
  private configure = (): void => {
    this.stop();
    if (
      this.destroyed ||
      this.preference?.matches ||
      typeof IntersectionObserver === 'undefined'
    )
      return;
    const root = this.element.nativeElement;
    this.progress = this.renderer.createElement('div');
    this.renderer.addClass(this.progress, 'ud-reading-progress');
    this.renderer.setAttribute(this.progress, 'aria-hidden', 'true');
    this.renderer.appendChild(root, this.progress);
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target as HTMLElement;
          this.observer?.unobserve(node);
          this.pending.delete(node);
          if (!node.isConnected || node.contains(document.activeElement))
            continue;
          if (typeof node.animate === 'function') {
            const animation = node.animate(
              [
                { opacity: 0.12, transform: 'translate3d(0,24px,0)' },
                { opacity: 1, transform: 'translate3d(0,0,0)' },
              ],
              {
                duration: 620,
                delay: Number(node.dataset['motionDelay'] || 0),
                easing: 'cubic-bezier(.2,.8,.2,1)',
              },
            );
            this.active.set(node, animation);
            void animation.finished
              .then(() => {
                if (this.active.get(node) === animation)
                  this.active.delete(node);
              })
              .catch(() => {});
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -24px 0px' },
    );
    this.mutations = new MutationObserver(() => {
      this.collect();
      this.scheduleProgress();
    });
    this.mutations.observe(root, { childList: true, subtree: true });
    if (typeof ResizeObserver !== 'undefined') {
      this.resize = new ResizeObserver(this.scheduleProgress);
      this.resize.observe(root);
    }
    window.addEventListener('scroll', this.scheduleProgress, { passive: true });
    window.addEventListener('resize', this.scheduleProgress, { passive: true });
    root.addEventListener('pointermove', this.movePointer, { passive: true });
    root.addEventListener('pointerleave', this.clearPointer);
    root.addEventListener('focusin', this.focused);
    this.collect();
    this.scheduleProgress();
  };
  private collect(): void {
    if (!this.observer || this.preference?.matches || this.destroyed) return;
    const root = this.element.nativeElement;
    for (const node of this.pending)
      if (!root.contains(node)) {
        this.observer?.unobserve(node);
        this.pending.delete(node);
      }
    for (const node of Array.from(
      root.querySelectorAll<HTMLElement>(this.selector),
    )) {
      if (this.seen.has(node)) continue;
      this.seen.add(node);
      const position =
        node.matches('.ud-card, .card') && node.parentElement
          ? Array.from(node.parentElement.children).indexOf(node) % 3
          : 0;
      node.dataset['motionDelay'] = String(position * 70);
      this.pending.add(node);
      this.observer?.observe(node);
    }
  }
  private scheduleProgress = (): void => {
    if (this.frame || this.destroyed || !this.progress) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      if (!this.progress) return;
      const root = this.element.nativeElement,
        range = root.offsetHeight - window.innerHeight;
      const fraction =
        range > 0
          ? Math.min(1, Math.max(0, -root.getBoundingClientRect().top / range))
          : 0;
      root.style.setProperty('--ud-scroll', fraction.toFixed(4));
    });
  };
  private movePointer = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse' || !this.finePointer?.matches) return;
    const target = (event.target as Element).closest<HTMLElement>(
      '[data-spotlight]',
    );
    if (!target || !this.element.nativeElement.contains(target)) {
      this.clearPointer();
      return;
    }
    this.pointer = { x: event.clientX, y: event.clientY, target };
    if (this.pointerFrame) return;
    this.pointerFrame = requestAnimationFrame(() => {
      this.pointerFrame = 0;
      if (!this.pointer) return;
      const { target, x, y } = this.pointer,
        rect = target.getBoundingClientRect();
      if (this.spotlight !== target)
        this.spotlight?.classList.remove('ud-spotlight-active');
      this.spotlight = target;
      target.style.setProperty('--ud-pointer-x', `${x - rect.left}px`);
      target.style.setProperty('--ud-pointer-y', `${y - rect.top}px`);
      target.classList.add('ud-spotlight-active');
    });
  };
  private clearPointer = (): void => {
    this.pointer = undefined;
    if (this.pointerFrame) cancelAnimationFrame(this.pointerFrame);
    this.pointerFrame = 0;
    this.spotlight?.classList.remove('ud-spotlight-active');
    this.spotlight = undefined;
  };
  private focused = (event: FocusEvent): void => {
    const node = (event.target as Element).closest<HTMLElement>(this.selector);
    if (node) {
      this.observer?.unobserve(node);
      this.pending.delete(node);
      this.active.get(node)?.cancel();
      this.active.delete(node);
    }
  };
  private stop(): void {
    this.observer?.disconnect();
    this.mutations?.disconnect();
    this.resize?.disconnect();
    this.observer = undefined;
    this.mutations = undefined;
    this.resize = undefined;
    this.pending.clear();
    for (const animation of this.active.values()) animation.cancel();
    this.active.clear();
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.clearPointer();
    window.removeEventListener('scroll', this.scheduleProgress);
    window.removeEventListener('resize', this.scheduleProgress);
    const root = this.element.nativeElement;
    root.removeEventListener('pointermove', this.movePointer);
    root.removeEventListener('pointerleave', this.clearPointer);
    root.removeEventListener('focusin', this.focused);
    if (this.progress) {
      this.renderer.removeChild(root, this.progress);
      this.progress = undefined;
    }
    root.style.removeProperty('--ud-scroll');
  }
  ngOnDestroy(): void {
    this.destroyed = true;
    this.preference?.removeEventListener('change', this.configure);
    this.stop();
  }
}
