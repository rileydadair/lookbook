<template>
  <div class="loader" ref="loader">
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
      isHome: false
    }
  },
  mounted() {
    console.log('loader mounted')
    setTimeout(() => this.show(), 600)
  },

  methods: {
    loadAssets(slug) {
      const assets = [];
      // else push mains
      console.dir(this.$route)

      if (this.$route.name === 'home') {
        this.isHome = true
        this.items.forEach((item) => {
          assets.push(this.deviceType === 'mobile' ? item.main_image_mobile : item.main_image_desktop)
        })
      } else {
        const filtered = this.items.filter(item => item.slug === this.$route.params.slug)
        console.dir(filtered)
        filtered[0].detail_images.forEach(detail => {
          assets.push(this.deviceType === 'mobile' ? detail.image_mobile : detail.image_desktop)
        })
      }

      console.dir(assets)

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
            this.loadRemainingAssets()
          })
      })
    },

    loadRemainingAssets() {
      const assets = [];

      this.items.forEach((item) => {
        if (!this.isHome) {
          assets.push(this.deviceType === 'mobile' ? item.main_image_mobile : item.main_image_desktop)
        }
        item.detail_images.forEach((detail) => {
          assets.push(this.deviceType === 'mobile' ? detail.image_mobile : detail.image_desktop)
        })
      })

      const progressLoaderService = new ProgressLoaderService(assets)
      progressLoaderService.on('complete', () => {
        this.hide()
          .then(() => {
            this.$emit('setAllAssetsLoaded')
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
        }, .02, () => {
          this.$refs.loader.style.zIndex = -1
          resolve()
        })
      })
    }
  },
}
</script>