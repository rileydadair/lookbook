<template>
  <div class="description__wrap">
    <p class="description__text" ref="el">{{ descriptionVal }}</p>
  </div>
</template>

<script>
import TweenMax from 'gsap'

export default {
  name: 'Description',
  props: {
    descriptionVal: String
  },
  data() {
    return {
      animation: {
        duration: 0.6
      }
    }
  },
  mounted() {
    TweenMax.set(this.$refs.el, { transformStyle: 'preserve-3d' })
  },
  methods: {
    hide(direction) {
      return this.toggle('hide', direction)
    },
    show(direction) {
      return this.toggle('show', direction)
    },
    toggle(action, direction) {
      return new Promise(resolve => {
        if (action === 'show') {
          TweenMax.to(this.$refs.el, this.animation.duration, {
            startAt: { y: direction === 'next' ? '20px' : '-20px'},
            opacity: 1,
            y: '0px',
            onComplete: () => {
              resolve()
            }
          })
        } else {
          TweenMax.to(this.$refs.el, this.animation.duration, {
            ease: 'Power3.easeOut',
            opacity: 0,
            y: direction === 'next' ? '-20px' : '20px',
            onComplete: () => {
              resolve()
            }
          })
        }
      })
    }
  }
}
</script>