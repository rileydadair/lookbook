<script>
import Hammer from 'hammerjs'
import { Lethargy } from 'lethargy'

export default {
  name: 'SlideMaster',
  props: {
    activeTimeout: {
      type: Number,
      default: 0,
    },
    className: {
      type: String,
      default: '',
    },
    eventTimeout: {
      type: Number,
      default: 0,
    },
    indicators: {
      type: Boolean,
      default: false,
    },
    initialSlide: {
      type: Number,
      default: 0,
    },
    keydown: {
      type: Boolean,
      default: true,
    },
    onSliderEvent: {
      type: Function,
    },
    onSliderMount: {
      type: Function,
    },
    slideWrap: {
      type: Boolean,
      default: false,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    swipe: {
      type: Boolean,
      default: true,
    },
    wheel: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      canEvent: true,
      currentIndex: this.initialSlide,
      scrollEl: null,
      totalSlides: 0,
    }
  },

  mounted() {
    setTimeout(() => {
      // Check for slides
      if (typeof this.$slots.slides === 'undefined') {
        console.log('Must provide "slides" slot with an array of items') // eslint-disable-line
        return
      }
      // Initialize wheel event.
      if (this.wheel) {
        this.initWheel()
      }
      // Initialize swipe event with Hammer.js.
      if (this.swipe) this.initSwipe()
      // Initialize keydown event.
      if (this.keydown) this.initKeydown()

      // Total length of slides.
      this.totalSlides = this.$slots.slides.length

      // Invoke callback function if provided or emit event to expose SlideMaster api.
      // Receives component as argument.
      this.onSliderMount
        ? this.onSliderMount(this)
        : this.$emit('onSliderMount', this)
    }, 0)
  },

  beforeDestroy() {
    // Remove the events.
    if (this.wheel) this.removeWheel()
    if (this.swipe) this.removeSwipe()
    if (this.keydown) this.removeKeydown()
  },

  methods: {
    initWheel() {
      // Create instance of Lethargy to handle wheel event check.
      this.lethargy = new Lethargy(6, 5, 0.03, 50)

      // Quick fix for Chrome update: passive event listener on window or document
      this.scrollEl = this.$parent.$el

      this.scrollEl.addEventListener('mousewheel', this.onWheel)
      this.scrollEl.addEventListener('wheel', this.onWheel)
      this.scrollEl.addEventListener('DOMMouseScroll', this.onWheel)
      this.scrollEl.addEventListener('MozMousePixelScroll', this.onWheel)
    },

    initSwipe() {
      this.managerSlider = new Hammer.Manager(this.$el, {
        recognizers: [[Hammer.Swipe]],
      })

      this.managerSlider.on('swipeleft', this.nextSlide)
      this.managerSlider.on('swipeup', this.nextSlide)
      this.managerSlider.on('swiperight', this.prevSlide)
      this.managerSlider.on('swipedown', this.prevSlide)
    },

    initKeydown() {
      window.addEventListener('keydown', this.onKeydown)
    },

    removeWheel() {
      this.scrollEl.removeEventListener('mousewheel', this.onWheel)
      this.scrollEl.removeEventListener('wheel', this.onWheel)
      this.scrollEl.removeEventListener('DOMMouseScroll', this.onWheel)
      this.scrollEl.removeEventListener('MozMousePixelScroll', this.onWheel)
    },

    removeSwipe() {
      this.managerSlider.off('swipeleft', this.nextSlide)
      this.managerSlider.off('swipeup', this.nextSlide)
      this.managerSlider.off('swiperight', this.prevSlide)
      this.managerSlider.off('swipedown', this.prevSlide)
      this.managerSlider.destroy()
    },

    removeKeydown() {
      window.removeEventListener('keydown', this.onKeydown)
    },

    getDirection(currentIndex, nextIndex) {
      if (currentIndex === 0) {
        if (nextIndex === this.totalSlides - 1) return 'prev'
        else return 'next'
      } else if (nextIndex === 0) {
        if (currentIndex === this.totalSlides - 1) return 'next'
        else return 'prev'
      } else if (currentIndex < nextIndex) return 'next'
      else return 'prev'
    },

    handleIndicatorsBlur() {
      // Precaution for if an indicator button is focused.
      this.$refs.indicators.forEach(btn => btn.blur())
    },

    onClick(e, index, direction = this.getDirection(this.currentIndex, index)) {
      // Navigate to provided slide position with direction from control or returned direction for indicators.
      if (this.canEvent && this.currentIndex !== index)
        this.setCurrentSlide(e, index, direction)
    },

    onKeydown(e) {
      // Navigate to next slide on cursor key "up" or "right".
      if (e.keyCode === 39 || e.keyCode === 40) this.nextSlide(e)
      // Navigate to previous slide on with cursor key "left" or "down".
      else if (e.keyCode === 37 || e.keyCode === 38) this.prevSlide(e)
    },

    onWheel(e) {
      e.preventDefault()
      e.stopPropagation()

      const check = this.lethargy.check(e)

      if (check !== false) {
        // Navigate to next slide on wheel down.
        if (check === -1) this.nextSlide(e)
        // Navigate to next slide on wheel up.
        else this.prevSlide(e)
      }
    },

    nextSlide(e) {
      if (this.canEvent) this.setCurrentSlide(e, this.currentIndex + 1, 'next')
      if (this.indicators) this.handleIndicatorsBlur()
    },

    prevSlide(e) {
      if (this.canEvent) this.setCurrentSlide(e, this.currentIndex - 1, 'prev')
      if (this.indicators) this.handleIndicatorsBlur()
    },

    setCurrentSlide(e, index, direction) {
      // Disable all events.
      this.toggleEvents(false)

      // Handle provided index.
      const remainder = index % this.totalSlides
      const nextIndex = remainder < 0 ? remainder + this.totalSlides : remainder

      // Invoke callback function if provided or emit event for JS animation.
      // Receives event, component, current slide index, and next slide index, and direction as arguments.
      this.onSliderEvent
        ? this.onSliderEvent(e, this, this.currentIndex, nextIndex, direction)
        : this.$emit(
            'onSliderEvent',
            e,
            this,
            this.currentIndex,
            nextIndex,
            direction,
          )

      // Wait to enable all events.
      if (this.eventTimeout)
        setTimeout(() => this.toggleEvents(), this.eventTimeout)

      if (this.activeTimeout) {
        // Immediately remove "is-active" class from current slide for pure CSS animation option.
        this.currentIndex = -1
        // Wait to add "is-active" class to next slide for pure CSS animation option.
        setTimeout(() => (this.currentIndex = nextIndex), this.activeTimeout)
      } else {
        this.currentIndex = nextIndex
      }
    },

    toggleEvents(canEvent = true) {
      this.canEvent = canEvent
    },
  },

  render() {
    const className = this.className ? `slider ${this.className}` : 'slider'

    const slides = this.slideWrap
      ? this.$slots.slides.map((item, index) => (
          <div
            class={`slider__slide${
              this.currentIndex === index ? ' is-active' : ''
            }`}
            key={`slide-master-slide-${index}`}
            ref="slides"
            refInFor
          >
            {item}
          </div>
        ))
      : this.$slots.slides

    const controls =
      this.$slots.prevButton || this.$slots.nextButton ? (
        <div class="controls">
          <button
            class="controls__btn controls__btn--prev js-hover"
            onClick={e => this.onClick(e, this.currentIndex - 1, 'prev')}
            type="button"
            ref="prevButton"
          >
            {this.$slots.prevButton}
          </button>
          <button
            class="controls__btn controls__btn--next js-hover"
            onClick={e => this.onClick(e, this.currentIndex + 1, 'next')}
            type="button"
            ref="nextButton"
          >
            {this.$slots.nextButton}
          </button>
        </div>
      ) : null

    const indicators = this.indicators ? (
      <ul class="indicators">
        {this.$slots.slides.map((item, index) => (
          <li
            class={`indicators__item${
              this.currentIndex === index ? ' is-active' : ''
            }`}
            key={`scroll-slider-control-${index}`}
          >
            <button
              class="indicators__btn"
              onClick={e => this.onClick(e, index)}
              type="button"
              ref="indicators"
              refInFor
            >
              {this.$slots.indicatorsList.length
                ? this.$slots.indicatorsList[index]
                : null}
            </button>
          </li>
        ))}
      </ul>
    ) : null

    return (
      <div class={className} style={this.styles}>
        {slides}
        {controls}
        {indicators}
      </div>
    )
  },
}
</script>
