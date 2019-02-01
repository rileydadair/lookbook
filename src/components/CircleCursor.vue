<template>
  <div class="cursor" ref="cursor" data-fill="false" data-lock="false" data-reveal="false" data-clickable="false" data-arrow="false">
    <div class="cursor__inner" ref="inner"></div>
    <span class="cursor__text">View</span>
    <svg class="hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 15.6">
      <symbol id="arrow">
        <line x1="29" y1="7.8" y2="7.8" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px"/><polyline points="21.9 0.7 29 7.8 21.9 14.9" style="fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:2px"/>
      </symbol>
    </svg>
    <div class="cursor__arrows">
      <svg class="arrow arrow--prev"><use xlink:href="#arrow"></use></svg>
      <svg class="arrow arrow--next"><use xlink:href="#arrow"></use></svg>
    </div>
    
    <template v-if="menuActive && this.$route.name === 'home'">
      <div class="cursor__reveal">
        <CursorReveal
          img="/images/look_at_it.gif"
          :totalImages="5"
          ref="reveal"
        />
      </div>
    </template>
  </div>
</template>

<script>
import TweenMax from 'gsap'
import CursorReveal from './CursorReveal'

export default {
  name: 'CircleCursor',
  props: {
    menuActive: Boolean
  },
  components: {
    CursorReveal
  },
  data() {
    return {
      hoverEls: [],
      isHovering: false,
      stopPositionEl: false,
      totalImages: 5
    }
  },
  mounted() {
    this.initEvents()
    this.$root.$on('cursorEnter', this.onEnter)
    this.$root.$on('cursorReset', this.onReset)

    const innerWidth = window.innerWidth
    const innerHeight = window.innerHeight

    TweenMax.set(this.$refs.cursor, {
      x: innerWidth - (innerWidth * 0.096) - 80,
      y: innerHeight - 80
    })
  },
  destroyed() {
    this.removeEvents()
  },
  methods: {
    initEvents() {
      window.addEventListener('mousemove', this.onMousemove)
      window.addEventListener('mousedown', this.onMousedown)
      window.addEventListener('mouseup', this.onMouseup)

      setTimeout(() => {
        this.hoverEls = document.querySelectorAll('.js-hover')
        if (this.hoverEls.length) this.hoverEls.forEach(el => {
          el.addEventListener('mouseenter', this.onHoverCursor)
          el.addEventListener('mouseleave', this.offHoverCursor)
        })
      }, 200)


      this.$root.$on('hideCursor', this.onLeave)
      this.$root.$on('resetCursor', this.onReset)
    },

    removeEvents() {
      window.removeEventListener('mousemove', this.onMousemove)
      window.removeEventListener('mousedown', this.onMousedown)
      window.removeEventListener('mouseup', this.onMouseup)

      this.hoverEls.forEach(el => {
        el.removeEventListener('mouseenter', this.onHoverCursor)
        el.removeEventListener('mouseleave', this.offHoverCursor)
      })
    },

    onEnter() {
      TweenMax.fromTo(this.$refs.inner, 0.6, { scale: 0, x:'-50%', y:'-50%', opacity: 0 }, { scale: 1, opacity: 1 })
    },

    onLeave() {
      TweenMax.to(this.$refs.inner, 0.4, { scale: 0, x:'-50%', y:'-50%', onComplete: () => this.$refs.inner.style.opacity = 0 })
    },

    onReset() {
      this.removeEvents()
      this.hoverEls = document.querySelectorAll('.js-hover')
      this.$refs.cursor.dataset.fill = false
      this.$refs.cursor.dataset.lock = false
      this.$refs.cursor.dataset.reveal = false
      this.$refs.cursor.dataset.clickable = false
      this.initEvents()
    },

    positionElement(e) {
      let { clientX: x, clientY: y } = e

      TweenMax.to(this.$refs.cursor, 0.4, {
        ease: 'Power3.easeOut',
        x: x,
        y: y,
      })
    },

    onMousemove(e) {
      if (!this.stopPositionEl) requestAnimationFrame(() => this.positionElement(e))
    },

    onHoverCursor(e) {
      this.isHovering = true
      if (e.target.hasAttribute('data-reveal')) this.$refs.cursor.dataset.reveal = true
      else if (e.target.hasAttribute('data-gif')) this.$refs.reveal.showImage()
      else if (e.target.dataset.lock) {
        this.setLockedPos(e.target)
        this.$refs.cursor.dataset.lock = e.target.dataset.lock
      }
      else if (e.target.children[0].dataset.lock) {
        this.setLockedPos(e.target)
        this.$refs.cursor.dataset.lock = e.target.children[0].dataset.lock
      }
      else if (e.target.children[0].hasAttribute('data-arrow')) {
        this.$refs.cursor.dataset.arrow = e.target.children[0].dataset.arrow
      } else {
        this.$refs.cursor.dataset.fill = true
      }
    },

    onMousedown() {
      TweenMax.to(this.$refs.inner, 0.3, { scale: 0.88, x:'-50%', y:'-50%', ease: 'Power3.easeOut' })
    },

    offHoverCursor(e) {
      this.isHovering = false
      
      if (e.target.hasAttribute('data-reveal')) this.$refs.cursor.dataset.reveal = false
      else if (e.target.hasAttribute('data-gif')) this.$refs.reveal.hideImage()
      else if (e.target.dataset.lock) {
        this.stopPositionEl = false
        this.$refs.cursor.dataset.lock = false
      }
      else if (e.target.children[0].dataset.lock) {
        this.stopPositionEl = false
        this.$refs.cursor.dataset.lock = false
        this.toggleControlsText(e.target, 'hide')
      } 
      else if (e.target.children[0].hasAttribute('data-arrow')) this.$refs.cursor.dataset.arrow = false
      else {
        this.$refs.cursor.dataset.fill = false
      }
    },

    onMouseup() {
      TweenMax.to(this.$refs.inner, 0.3, { scale: 1, x:'-50%', y:'-50%', ease: 'Power3.easeOut' })
    },

    setLockedPos(el) {
      this.stopPositionEl = true

      const elRect = el.getBoundingClientRect()
      let elX = (elRect.height * 0.5) + elRect.x
      let elY = (elRect.width * 0.5) + elRect.y

      if (el.dataset.lock === 'home') {
        elX = Math.abs(elX + 26.25)
        elY = Math.abs(elY - 26.85)
      }

      else if (el.dataset.lock === 'all' || el.dataset.lock === 'about') {
        elX = Math.abs(elX + 20.55)
        elY = Math.abs(elY - 20.65)
      }

      else if (el.dataset.lock === 'back') {
        elX = Math.abs(elX + 7.85)
        elY = Math.abs(elY - 8.35)
      }

      else if (el.children[0].dataset.lock === 'controls') {
        if (el.children[0].hasAttribute('data-lock-prev')) {
          elX = Math.abs(elX - 9.65)
          elY = Math.abs(elY + 11.1)
        } else {
          elX = Math.abs(elX - 9.65)
          elY = Math.abs(elY + 8)
        }

        this.toggleControlsText(el, 'show')
      }

      setTimeout(() => {
        TweenMax.to(this.$refs.cursor, 0.8, {
          ease: 'Power3.easeOut',
          x: elX,
          y: elY,
        })
      }, 60)
    },

    toggleControlsText(el, action) {
      const parts = el.querySelectorAll('.js-controls-part')
      
      TweenMax.staggerFromTo(parts, 0.5, {
        y: action === 'show' ? '14px' : 0,
        opacity: action === 'show' ? 0 : 1
      }, {
        y: action === 'show' ? 0 : '-14px',
        opacity: action === 'show' ? 1 : 0,
        ease: 'Power2.easeOut'
      }, .02)
    }
  }
}
</script>