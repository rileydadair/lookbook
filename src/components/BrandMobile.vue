<template>
  <div class="brand">
    <div class="brand__hero">
      <h1 class="brand__title">{{ item.title }}</h1>
      <p class="brand__description brand__description--hero" ref="description">{{ item.description }}</p>
    </div>
    <div class="brand__section">
      <template v-for="(image, index) in item.detail_images">
        <div class="scroll-reveal__img-wrap" :key="`image-${index}`" ref="wrap">
          <div class="scroll-reveal__img" :style="{ backgroundImage: bgImage(image) }" ref="img"></div>
        </div>
      </template>
    </div>
      <!-- v-if for router error when the template is trying to access the data that does not (yet) exist -->
      <template v-if="nextSlug">
        <router-link :to="{ name: 'detail', params: { slug: nextSlug } }" class="brand__link" :aria-label="nextTitle">
          <h2 class="brand__title">{{ nextTitle }}</h2>
          <p class="brand__description">Next lookbook</p>
        </router-link>
      </template>
  </div>
</template>

<script>
import States from '@/services/States'
import imagesLoaded from 'imagesloaded'
import TweenMax from 'gsap'
import CustomEase from '@/services/CustomEase'

export default {
  name: 'BrandMobile',
  props: {
    item: Object,
    nextTitle: String,
    nextSlug: String
  },
  data() {
    return {
      animation: {
        duration: 1.2,
        // ease: CustomEase.create("custom", "M0,0 C0.29,0 0.312,0.111 0.348,0.166 0.381,0.216 0.414,0.34 0.446,0.48 0.466,0.57 0.492,0.756 0.582,0.862 0.66,0.954 0.704,1 1,1")
        // ease: Expo.easeOut,
        ease: CustomEase.create("custom", "M0,0 C0.142,0.6 0.205,0.689 0.258,0.758 0.316,0.834 0.374,1 1,1"),
      }
    }
  },
  mounted() {
    setTimeout(() => {
      function componentEnter(component) { component.enter() }

      const images = document.querySelectorAll('.brand__img')
      imagesLoaded(document.querySelectorAll('.slide__img'), {background: true}, () => componentEnter(this))
    })
  },
  methods: {
    enter() {
      setTimeout(() => {
        this.$root.$emit('toggleOverlay', 'hide');

        setTimeout(() => this.show(), 1000)
      }, 200)
    },

    show() {
      // console.dir(this.$refs.wrap[0]);
      // TweenMax.to(this.$refs.wrap[0], this.animation.duration, {
      //   startAt: { scaleY: 0 },
      //   ease: this.animation.ease,
      //   transformStyle: 'preserve-3d',
      //   transformOrigin: "0%, 50%",
      //   scaleY: 1
      // })
      // TweenMax.to(this.$refs.img[0], this.animation.duration, {
      //   startAt: { scaleY: 2 },
      //   ease: this.animation.ease,
      //   transformStyle: 'preserve-3d',
      //   transformOrigin: "0%, 50%",
      //   scaleY: 1
      // })
    },

    bgImage(image) {
      // Consider using Vuex store to check deviceType
      if (States.deviceType === 'mobile') {
        return `url('${image.image_mobile}')`
      } else {
        return `url('${image.image_desktop}')`
      }
    },
  }
}
</script>