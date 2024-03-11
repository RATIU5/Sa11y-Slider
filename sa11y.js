class Sa11ySlider {
  /**
   * Create a new Sa11ySlider instance
   * @param {Object} config 
   * @param {string} config.containerClass The class of the container element
   * @param {string} config.prevBtnClass The class of the previous button element
   * @param {string} config.nextBtnClass The class of the next button element
   * @param {string} config.viewClass The class of the view element containing the slides
   * @param {string} config.slideClass The class of the slide elements
   * @param {number} config.gapSize The size of the gap between slides
   * @param {Object} config.slideBreakpoints An object containing breakpoints and their settings
   * @param {Object} config.slideBreakpoints.breakpoint The breakpoint size
   * @param {number} config.slideBreakpoints.breakpoint.gapSize The size of the gap between slides
   * @param {number} config.slideBreakpoints.breakpoint.visibleSlides The number of slides visible at once
   */
  constructor(config) {
    this.container = document.querySelector(config.containerClass);
    if (!this.container) {
      throw new Error('Sa11ySlider: containerClass not found in document');
    }
    this.prevBtn = this.container.querySelector(config.prevBtnClass);
    if (!this.prevBtn) {
      throw new Error('Sa11ySlider: prevBtnClass not found in container element');
    }
    this.nextBtn = this.container.querySelector(config.nextBtnClass);
    if (!this.nextBtn) {
      throw new Error('Sa11ySlider: nextBtnClass not found in container element');
    }
    this.view = this.container.querySelector(config.viewClass);
    if (!this.view) {
      throw new Error('Sa11ySlider: viewClass not found in container element');
    }
    this.slides = this.view.children;
    if (!this.slides.length) {
      throw new Error('Sa11ySlider: no slides found in view element');
    }

    const breakpoints = 

    this._init();
  }

  _init() {

  }
}