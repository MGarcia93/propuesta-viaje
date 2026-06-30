/**
 * PresentationController — Vanilla TypeScript controller
 *
 * Enhances the inline slide navigation with:
 * - URL hash syncing (optional)
 * - Animation hooks
 * - Focus management
 * - Escape handling for overlay vs. standalone mode
 *
 * The Astro inline script handles basic navigation (click, keyboard, touch).
 * This controller extends the base behavior for overlay use cases.
 */

export interface PresentationControllerOptions {
  container: HTMLElement;
  slideSelector?: string;
  prevSelector?: string;
  nextSelector?: string;
  progressSelector?: string;
  currentSelector?: string;
  totalSelector?: string;
  closeSelector?: string;
  returnUrl?: string;
  isOverlay?: boolean;
  onSlideChange?: (index: number, total: number) => void;
}

export class PresentationController {
  private container: HTMLElement;
  private slides: NodeListOf<HTMLElement>;
  private prevBtn: HTMLElement | null;
  private nextBtn: HTMLElement | null;
  private progress: HTMLElement | null;
  private currentEl: HTMLElement | null;
  private totalEl: HTMLElement | null;
  private closeBtn: HTMLElement | null;
  private returnUrl: string;
  private isOverlay: boolean;
  private current = 0;
  private total = 0;
  private onSlideChange?: (index: number, total: number) => void;

  constructor(options: PresentationControllerOptions) {
    this.container = options.container;
    this.slides = options.container.querySelectorAll(
      options.slideSelector ?? '[data-slide]',
    );
    this.prevBtn =
      options.container.querySelector(options.prevSelector ?? '[data-prev]') ??
      document.getElementById('slide-prev');
    this.nextBtn =
      options.container.querySelector(options.nextSelector ?? '[data-next]') ??
      document.getElementById('slide-next');
    this.progress =
      options.container.querySelector(
        options.progressSelector ?? '[data-progress]',
      ) ?? document.getElementById('slide-progress');
    this.currentEl =
      options.container.querySelector(
        options.currentSelector ?? '[data-current]',
      ) ?? document.getElementById('slide-current');
    this.totalEl =
      options.container.querySelector(
        options.totalSelector ?? '[data-total]',
      ) ?? document.getElementById('slide-total');
    this.closeBtn =
      options.container.querySelector(
        options.closeSelector ?? '[data-close]',
      );
    this.returnUrl = options.returnUrl ?? '/';
    this.isOverlay = options.isOverlay ?? false;
    this.onSlideChange = options.onSlideChange;

    this.total = this.slides.length;
    if (this.total === 0) return;

    this.init();
  }

  private init(): void {
    // Set total
    if (this.totalEl) {
      this.totalEl.textContent = String(this.total);
    }

    // Attach listeners
    this.prevBtn?.addEventListener('click', () => this.navigate(-1));
    this.nextBtn?.addEventListener('click', () => this.navigate(1));

    document.addEventListener('keydown', this.handleKeydown);

    // Touch support
    let touchStartX = 0;
    document.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );
    document.addEventListener(
      'touchend',
      (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
          this.navigate(diff > 0 ? 1 : -1);
        }
      },
      { passive: true },
    );

    // Escape handling
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isOverlay && this.returnUrl) {
          window.location.href = this.returnUrl;
        } else {
          // Standalone mode: focus the close/back button
          this.closeBtn?.focus();
        }
      }
    });

    // Show first slide
    this.showSlide(0);
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.navigate(1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.navigate(-1);
    }
  };

  public navigate(delta: number): void {
    const next = this.current + delta;
    if (next >= 0 && next < this.total) {
      this.showSlide(next);
    }
  }

  public goTo(index: number): void {
    if (index >= 0 && index < this.total) {
      this.showSlide(index);
    }
  }

  private showSlide(index: number): void {
    this.slides.forEach((slide, i) => {
      (slide as HTMLElement).style.display = i === index ? 'flex' : 'none';
    });

    this.current = index;

    if (this.currentEl) {
      this.currentEl.textContent = String(index + 1);
    }

    if (this.progress) {
      const pct = ((index + 1) / this.total) * 100;
      this.progress.style.width = `${pct}%`;
      this.progress.setAttribute('aria-valuenow', String(index + 1));
    }

    if (this.prevBtn) {
      (this.prevBtn as HTMLButtonElement).disabled = index === 0;
    }
    if (this.nextBtn) {
      (this.nextBtn as HTMLButtonElement).disabled = index === this.total - 1;
    }

    // Focus management: focus the slide container
    const currentSlide = this.slides[index] as HTMLElement;
    if (currentSlide && !currentSlide.contains(document.activeElement)) {
      currentSlide.focus({ preventScroll: true });
    }

    this.onSlideChange?.(index, this.total);
  }

  public destroy(): void {
    document.removeEventListener('keydown', this.handleKeydown);
    this.prevBtn?.removeEventListener('click', () => this.navigate(-1));
    this.nextBtn?.removeEventListener('click', () => this.navigate(1));
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('[data-controller]') as HTMLElement;
  if (container) {
    const isOverlay = container.dataset.overlay === 'true';
    const returnUrl = container.dataset.returnUrl ?? '/';
    new PresentationController({
      container,
      isOverlay,
      returnUrl,
    });
  }
});
