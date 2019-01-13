<template>
  <div class="gallery-title">
    <span class="gallery-title__part" v-for="(part, index) in splitTitle" :key="`gallery-title-part-${index}`" ref="titleParts">{{ part }}</span>
  </div>
</template>

<script>
import TweenMax from 'gsap'

export default {
  name: 'GalleryTitle',
  props: {
    title: String
  },
  data() {
    return {
      splitTitle: this.title.split('')
    }
  },
  methods: {
    reset() {
      TweenMax.set(this.$refs.titleParts, { opacity: 0 })
    },

    hide() {
      return this.toggle('hide')
    },

    show() {
      return this.toggle('show')
    },

    toggle(action) {
      return new Promise(resolve => {
        const random = []
        this.$refs.titleParts.forEach(el => {
          return random.push(el)
        })
        random.sort(() => {
          return .5 - Math.random()
        })
        TweenMax.staggerTo(random, .2, {
          opacity: action === 'hide' ? 0 : 1,
          ease: action === 'hide' ? 'Power2.easeOut' : 'Power2.easeIn',
        }, .04, resolve)
      })
    }
  }
}
</script>