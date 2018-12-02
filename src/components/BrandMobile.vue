<template>
  <div class="brand">
    <div class="brand__hero">
      <h1 class="brand__title">{{ item.title }}</h1>
      <p class="brand__description brand__description--hero" ref="description">{{ item.description }}</p>
    </div>
    <div class="brand__section">
      <template v-for="(image, index) in item.detail_images">
        <Reveal :bgImage="bgImage(image)" :key="`reveal-${index}`" ref="reveal" />
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
import Reveal from './Reveal'

export default {
  name: 'BrandMobile',
  props: {
    item: Object,
    nextTitle: String,
    nextSlug: String
  },
  components: {
    Reveal
  },
  data() {
    return {
      deviceType: States.deviceType,
      scrollEls: []
    }
  },
  mounted() {
    setTimeout(() => {
      function componentInit(component) { component.init() }

      const images = document.querySelectorAll('.brand__img')
      imagesLoaded(document.querySelectorAll('.slide__img'), {background: true}, () => componentInit(this))
    })
  },
  methods: {
    init() {
      setTimeout(() => {
        this.$root.$emit('toggleOverlay', 'hide');
        this.initScroll()
      }, 200)

      this.scrollEls = this.$refs.reveal.splice(1, (this.$refs.reveal.length - 1))
    },

    initScroll() {
      this.scrollEvent = this.handleScroll
      window.addEventListener('scroll', this.scrollEvent)
    },

    removeScroll() {
      window.removeEventListener('scroll', this.scrollEvent)
    },

    handleScroll() {
      this.scrollEls.forEach((el, index) => {
        if (this.isInView(el.$el)) {
          setTimeout(() => el.showMobile(), 0)
          this.scrollEls.splice(index, 1)
        }
      })

      if (this.scrollEls.length === 0) this.removeScroll()
    },

    isInView(el) {
      const viewTop = 0;
      const viewBottom = viewTop + window.innerHeight;
      const elTop = el.getBoundingClientRect().top;
      const elBottom = elTop + el.clientHeight * 0.5;

      return elBottom <= viewBottom
    },

    bgImage(image) {
      // Consider using Vuex store to check deviceType
      if (this.deviceType === 'mobile') {
        return `url('${image.image_mobile}')`
      } else {
        return `url('${image.image_desktop}')`
      }
    },
  }
}
</script>