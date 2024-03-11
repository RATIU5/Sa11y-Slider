/**
 * @class Sa11y
 * @description This class is a slider for accessibility.
 * Errors will be thrown when instaciated and only then. 
 * Ensure that all elements stay present within the lifetime of the slider.
 * 
 * @example
 * try {
 *   new Sa11y({
 *     containerClass: ".sa11y-slider",
 *     slideClass: ".sa11y-slide",
 *     prevBtnClass: ".sa11y-prev",
 *     nextBtnClass: ".sa11y-next",
 *     activeClass: "sa11y-active",
 *     gapSize: 20,
 *     duration: 500
 *   });
 * } catch (error) {
 *  console.error(error);
 * }
 */
class Sa11y {
  /**
   * @param {Object} options
   * @param {string} options.containerClass
   * @param {string} options.slideClass
   * @param {string} options.prevBtnClass
   * @param {string} options.nextBtnClass
   * @param {string} options.activeClass
   * @param {number} options.gapSize
   * @param {number} options.duration
   * @param {number} options.showCount
   * @param {function} options.slideIntoView
   * @param {function} options.slideOutOfView
   */
  constructor(options) {
      this.options = options;
      this.currentIndex = 0;
      this.lastIndex = 0;
      this.startX = 0;
      this.isTransitioning = false;
      this.gapSize = this.gapSize || 20;
      this.showCount = this.showCount || 1;

      this.container = document.querySelector(this.options.containerClass);
      if (!this.container) {
          throw new Error("Sa11y error: container not found. Please check the class name.");
      }
      this.slides = this.container.querySelectorAll(this.options.slideClass);
      if (!this.slides || !this.slides.length) {
          throw new Error("Sa11y error: no slides found. Please check the class name.");
      }
      this.prevBtn = this.container.querySelector(this.options.prevBtnClass);
      this.nextBtn = this.container.querySelector(this.options.nextBtnClass);
      if (!this.prevBtn || !this.nextBtn) {
          throw new Error("Sa11y error: one or more buttons not found. Please check the class name.");
      }

      this.init();
      this.setupEvents();
  }

  init() {
      for (let i = 0; i < this.slides.length; i++) {
          const slide = this.slides[i];
          slide.setAttribute("data-index", i);
          const currentSlide = i + 1;
          const message = `Slide ${currentSlide} of ${this.slides.length}`;
          this.container.setAttribute("aria-label", message);
          // Show slides up to the showCount
          if (i <= this.showCount) {
              slide.style.display = "block";
              slide.style.transform = `translateX(${this.gapSize}px)`;
              slide.style.zIndex = 1;
              slide.setAttribute("aria-hidden", "false");
              slide.classList.add(this.options.activeClass || "sa11y-active");
          } else {
              slide.style.display = "none";
              slide.style.transform = `translateX(calc(100% + ${this.gapSize * 2}px + ${this.gapSize}px))`;
              slide.style.zIndex = 0;
              slide.setAttribute("aria-hidden", "true");
          }
      }
  }
  
  setupEvents() {
      this.prevBtn.addEventListener("click", () => this.changeSlide(true));
      this.nextBtn.addEventListener("click", () => this.changeSlide(false));
      this.container.addEventListener("touchstart", (e) => {
          this.startX = e.touches[0].clientX;
      });
      this.container.addEventListener("touchend", (e) => {
          const endX = e.changedTouches[0].clientX;
          const diffX = this.startX - endX;
          if (diffX > 50) {
              this.changeSlide(false);
          } else if (diffX < -50) {
              this.changeSlide(true);
          }
      });
  }

  changeSlide(previous = false) {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      this.lastIndex = this.currentIndex;
      if (!previous) {
          this.currentIndex = this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;
      } else {
          this.currentIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
      }
      this.slideIntoView(this.currentIndex, previous);
      this.slideOutOfView(this.lastIndex, previous);
  }

  slideIntoView(index, slideRight = false) {
      const currentSlide = this.container.querySelector(
          `${this.options.slideClass}[data-index='${index}']`
      );
      if (slideRight) {
          currentSlide.style.transform = `translateX(calc(-100% - ${this.gapSize}px))`;
      }
      currentSlide.style.display = "block";
      setTimeout(() => {
          currentSlide.classList.add(this.options.activeClass || "sa11y-active");
          currentSlide.style.transform = `translateX(${this.gapSize}px)`;
          currentSlide.style.zIndex = 1;
          currentSlide.setAttribute("aria-hidden", "false");
          this.options.slideIntoView && this.options.slideIntoView(index, slideRight);
      }, 20);
  }

  slideOutOfView(index, slideRight = false) {
      const currentSlide = this.container.querySelector(
          `${this.options.slideClass}[data-index='${index}']`
      );
      if (slideRight) {
          currentSlide.style.transform = `translateX(calc(100% + ${this.gapSize * 2}px + ${this.gapSize}px))`;
      } else {
          currentSlide.style.transform = `translateX(calc(-100% - ${this.gapSize}px))`;
      }
      currentSlide.style.zIndex = 0;
      setTimeout(() => {
          currentSlide.classList.remove(this.options.activeClass || "sa11y-active");
          if (!slideRight) {
              currentSlide.style.transform = `translateX(calc(100% + ${this.gapSize * 2}px + ${this.gapSize}px))`;
          }
          this.isTransitioning = false;
          currentSlide.setAttribute("aria-hidden", "true");
          currentSlide.style.display = "none";
          this.options.slideOutOfView && this.options.slideOutOfView(index, slideRight);
      }, this.options.duration || 500);
  }
}