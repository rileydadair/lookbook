<template>
  <div class="brand__cta">
    <router-link :to="{ name: 'detail', params: { slug: nextSlug } }" class="link" ref="link">
      <span class="link__wrap link__wrap--title">
        <span class="link__part link__part--title" v-for="(part, index) in splitTitle" :key="`part-title-${index}`" ref="titleParts">{{ part }}</span>
      </span>
      <span class="link__wrap link__wrap--next">
        <span class="link__part link__part--next" v-for="(part, index) in splitNext" :key="`part-next-${index}`" ref="nextParts">{{ part }}</span>
      </span>
    </router-link>
    <p class="brand__text" ref="text" :class="[hoverActive ? 'is-active' : '']" >
      <span class="brand__next">
        <span class="brand__next-part" v-for="(part, index) in splitNext" :key="`text-part-${index}`" ref="textParts">{{ part }}</span>
      </span>
      <span class="brand__lookbook"> lookbook</span>
    </p>
  </div>
</template>

<script>
import TweenMax from 'gsap'

export default {
  name: 'BrandLink',
  props: {
    nextTitle: String,
    nextSlug: String
  },
  data() {
    return {
      hoverActive: false,
      oncePlay: !1,
      hasLeft: !1,
      splitNext: 'Next'.split(''),
      splitTitle: this.nextTitle.split('')
    }
  },

  mounted() {
    this.$refs.link.$el.addEventListener('mouseenter', this.onHoverNext)
    this.$refs.link.$el.addEventListener('mouseleave', this.offHoverNext)
  },

  beforeDestroy() {
    this.$refs.link.$el.removeEventListener('mouseenter', this.onHoverNext)
    this.$refs.link.$el.removeEventListener('mouseleave', this.offHoverNext)
  },

  methods: {
    onHoverNext(e) {
      const random = []

      !1 === this.oncePlay && (this.oncePlay = !0,
      this.$refs.nextParts.forEach(function(e) {
          return random.push(e)
      }),
      random.sort(function() {
          return .5 - Math.random()
      }),
      TweenMax.staggerTo(random, .3, {
        opacity: 0,
        ease: 'Power2.easeIn'
      }, .05, this.allDoneNext))
    },

    allDoneNext() {
      // Failsafe for fast mouseenter + mouseleave
      if (!0 === this.hasLeft) {
        this.allDoneNext2()
        return
      }

      this.hoverActive = true
      const random = []

      TweenMax.set(this.$refs.titleParts, { opacity: 0 }),
      TweenMax.set(this.$refs.nextParts, { opacity: 0 }),

      this.$refs.titleParts.forEach(function(e) {
          return random.push(e)
      }),
      random.sort(function() {
          return .5 - Math.random()
      }),
      TweenMax.staggerTo(random, .3, {
        opacity: 1,
        ease: 'Power2.easeOut'
      }, .05)
      // show
      // TweenMax.to(this.$refs.text, .5, {
      //   x: '-50%',
      //   ease: 'Power2.easeOut'
      // })
      // TweenMax.staggerTo(this.$refs.textParts, .5, {
      //   opacity: 1,
      //   ease: 'Power2.easeOut'
      // }, -.04)
    },

    offHoverNext() {
      this.hasLeft = !0
      const random = []

      !0 === this.oncePlay && (this.oncePlay = !1,
      this.$refs.titleParts.forEach(function(e) {
          return random.push(e)
      }),
      random.sort(function() {
          return .5 - Math.random()
      }),
      TweenMax.staggerTo(random, .3, {
        opacity: 0,
        ease: 'Power2.easeIn'
      }, .05, this.allDoneNext2))
    },

    allDoneNext2() {
      this.hasLeft = !1
      this.hoverActive = false
      const random = []

      TweenMax.set(this.$refs.titleParts, { opacity: 0 }),
      TweenMax.set(this.$refs.nextParts, { opacity: 0 }),

      this.$refs.nextParts.forEach(function(e) {
          return random.push(e)
      }),
      random.sort(function() {
          return .5 - Math.random()
      }),
      TweenMax.staggerTo(random, .3, {
        opacity: 1,
        ease: 'Power2.easeOut'
      }, .05)
      // hide
      // TweenMax.to(this.$refs.text, 0.5, {
      //   x: '-65%',
      //   ease: 'Power2.easeOut'
      // })
      // TweenMax.staggerTo(this.$refs.textParts, .4, {
      //   opacity: 0,
      //   ease: 'Power2.easeOut'
      // }, .04)
    }
  }
}
</script>