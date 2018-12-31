<template>
  <div class="loader">
    <div class="loader__progress" ref="progress">
      <template v-for="(part, index) in loadingSplit">
        <span class="loader__part" ref="parts" :key="`loader-part-${index}`">{{ part }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import ProgressLoaderService from '@/services/ProgressLoaderService'
import TweenMax from 'gsap'

export default {
  name: 'Loader',
  props: {
    items: Array
  },
  data() {
    return {
      loadingSplit: 'Loading'.split(''),
    }
  },
  mounted() {
    setTimeout(() => this.show(), 600)
  },

  methods: {
    loadAssets(slug) {
      const assets = [];
      // else push mains
      this.items.forEach((item) => {
        assets.push(this.deviceType === 'mobile' ? item.main_image_mobile : item.main_image_desktop)
      })

      // this.items.forEach((item) => {
      //   assets.push(this.deviceType === 'mobile' ? item.main_image_mobile : item.main_image_desktop)
      //   item.detail_images.forEach((detail) => {
      //     assets.push(this.deviceType === 'mobile' ? detail.image_mobile : detail.image_desktop)
      //   })
      // })

      const progressLoaderService = new ProgressLoaderService(assets)
      progressLoaderService.on('complete', () => {
        this.hide()
          .then(() => {
            this.$root.$emit('assetsLoaded')
            this.$emit('setInitialLoad')
          })
      })
    },

    show() {
      TweenMax.staggerFromTo(this.$refs.parts, 0.5, {
        y: '14px',
        opacity: 0
      }, {
        y: '0px',
        opacity: 1,
        ease: 'Power2.easeOut',
      }, .02, this.loadAssets)
    },

    hide() {
      return new Promise((resolve) => {
        TweenMax.staggerFromTo(this.$refs.parts, 0.5, {
          y: '0',
          opacity: 1
        }, {
          y: '-14px',
          opacity: 0,
          ease: 'Power2.easeOut',
          delay: 0.6
        }, .02, resolve)
      })
    }
  },
}
</script>