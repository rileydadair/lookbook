<template>
  <div class="cursor" ref="cursor" data-fill="false" data-next="false" data-lock="false">
    <div class="cursor__inner"></div>
  </div>
</template>

<script>
export default {
  name: 'CircleCursor',
  data() {
    return {
      hoverEls: [],
      isHovering: false,
      stopPositionEl: false
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
      TweenMax.fromTo(this.$refs.cursor, 0.6, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1 })
    },

    onLeave() {
      TweenMax.to(this.$refs.cursor, 0.4, { scale: 0, onComplete: () => this.$refs.cursor.style.opacity = 0 })
    },

    onReset() {
      console.log('resetCursor')
      this.removeEvents()
      this.hoverEls = document.querySelectorAll('.js-hover')
      this.$refs.cursor.dataset.fill = false
      this.$refs.cursor.dataset.next = false
      this.$refs.cursor.dataset.lock = false
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
      console.log('enter')
      this.isHovering = true
      if (e.target.hasAttribute('data-next')) this.$refs.cursor.dataset.next = true
      else if (e.target.hasAttribute('data-reveal')) this.$refs.cursor.dataset.reveal = true
      else if (e.target.dataset.lock) {
        this.setLockedPos(e.target)
        this.$refs.cursor.dataset.lock = e.target.dataset.lock
      } else {
        this.$refs.cursor.dataset.fill = true
      }
    },

    onMousedown() {
      TweenMax.to(this.$refs.cursor, 0.3, { scale: 0.88, ease: 'Power3.easeOut' })
    },

    offHoverCursor(e) {
      this.isHovering = false
      if (e.target.hasAttribute('data-next')) this.$refs.cursor.dataset.next = false
      else if (e.target.hasAttribute('data-reveal')) this.$refs.cursor.dataset.reveal = false
      else if (e.target.dataset.lock) {
        this.stopPositionEl = false
        this.$refs.cursor.dataset.lock = false

        if (e.target.dataset.lock === 'controls') this.toggleControlsText(e.target, 'hide')
      } else {
        this.$refs.cursor.dataset.fill = false
      }
    },

    onMouseup() {
      TweenMax.to(this.$refs.cursor, 0.3, { scale: 1, ease: 'Power3.easeOut' })
    },

    setLockedPos(el) {
      this.stopPositionEl = true

      const elRect = el.getBoundingClientRect()
      let elX = (elRect.height * 0.5) + elRect.x
      let elY = (elRect.width * 0.5) + elRect.y

      // Switch Statement
      if (el.dataset.lock === 'home') {
        elX = Math.abs(elX + 26.25)
        elY = Math.abs(elY - 26.85)
      }

      else if (el.dataset.lock === 'all') {
        elX = Math.abs(elX + 20.65)
        elY = Math.abs(elY - 20.65)
      }

      else if (el.dataset.lock === 'back') {
        elX = Math.abs(elX + 8)
        elY = Math.abs(elY - 8.35)
      }

      else if (el.dataset.lock === 'controls') {
        elX = Math.abs(elX - 4.1)
        elY = Math.abs(elY + 1.1)

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
      const text = el.querySelector('.js-controls-text')
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