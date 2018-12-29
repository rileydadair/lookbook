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
      stopRaf: false
    }
  },
  mounted() {
    this.initEvents()
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
        console.dir(this.hoverEls)
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
        el.removeEventListener('mouseenter', this.offHoverCursor)
      })
    },

    onEnter() {

    },

    onLeave() {
      TweenMax.to(this.$refs.cursor, 0.4, { scale: 0 })
    },

    onReset() {
      this.removeEvents()
      this.hoverEls = document.querySelectorAll('.js-hover')
      this.$refs.cursor.dataset.fill = false
      this.$refs.cursor.dataset.next = false
      this.$refs.cursor.dataset.lock = false
      TweenMax.set(this.$refs.cursor, { scale: 1 })
      this.initEvents()

      console.dir(this.hoverEls)
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
      if (!this.stopRaf) requestAnimationFrame(() => this.positionElement(e))
    },

    onHoverCursor(e) {
      console.log(e.target.dataset);
      this.isHovering = true
      if (e.target.hasAttribute('data-next')) this.$refs.cursor.dataset.next = true
      else if (e.target.dataset.lock) {
        this.setLockedPos(e.target)
        this.$refs.cursor.dataset.lock = e.target.dataset.lock
      } else {
        this.$refs.cursor.dataset.fill = true
      }
    },

    onMousedown() {
      if (this.isHovering) TweenMax.to(this.$refs.cursor, 0.3, { scale: 0.9, ease: 'Power3.easeOut' })
    },

    offHoverCursor(e) {
      this.isHovering = false
      if (e.target.hasAttribute('data-next')) this.$refs.cursor.dataset.next = false
      else if (e.target.dataset.lock) {
        this.stopRaf = false
        this.$refs.cursor.dataset.lock = false
      } else {
        this.$refs.cursor.dataset.fill = false
      }
    },

    onMouseup() {
      if (this.isHovering) TweenMax.to(this.$refs.cursor, 0.3, { scale: 1, ease: 'Power3.easeOut' })
    },

    setLockedPos(el) {
      this.stopRaf = true

      const elRect = el.getBoundingClientRect()
      let elX = (elRect.height * 0.5) + elRect.x
      let elY = (elRect.width * 0.5) + elRect.y

      if (el.dataset.lock === 'home') {
        elX = Math.abs(elX + 26.25)
        elY = Math.abs(elY - 26.85)
      }

      if (el.dataset.lock === 'all') {
        elX = Math.abs(elX + 11)
        elY = Math.abs(elY - 10.85)
      }

      if (el.dataset.lock === 'controls') {
        elX = Math.abs(elX - 3.85)
        elY = Math.abs(elY + 1.35)
      }

      TweenMax.to(this.$refs.cursor, 0.8, {
        ease: 'Power3.easeOut',
        x: elX,
        y: elY,
      })
    }
  }
}
</script>