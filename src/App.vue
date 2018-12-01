<template>
  <div id="app">
    <div v-if="deviceType === 'mobile'" class="top-overlay"></div>
    <Header />
    <router-view :key="$route.fullPath" :initialLoad="initialLoad" :transitioning="transitioning" />
    <Overlay />
    <ProgressLoader v-if="!initialLoad" ref="progressLoader" :progress="progress" />
  </div>
</template>

<script>
import States from './services/States'
import items from './data/items'
import ProgressLoaderService from './services/ProgressLoaderService'

import ProgressLoader from './components/ProgressLoader'
import Header from './components/Header'
import Overlay from './components/Overlay'

export default {
  name: 'app',
  components: {
    ProgressLoader, // eslint-disable-line
    Header, // eslint-disable-line
    Overlay
  },
  data() {
    return {
      deviceType: States.deviceType,
      initialLoad: false,
      progress: 0,
      transitioning: false
    }
  },
  beforeCreate() {
    document.body.className = States.deviceType
    if (States.isIE) document.body.classList.add('is-IE')
  },
  mounted() {
    this.$root.$on('toggleOverlay', this.setTransitioning)
    this.$root.$on('hideOverlay', this.setTransitioning)
    this.$root.$on('updateProgress', this.updateProgress)
    this.loadAssets()
  },
  methods: {
    loadAssets(slug) {
      const assets = [];

      // if slug find slug then forEach

      // else push mains
      items.forEach((item) => {
        assets.push(this.deviceType === 'mobile' ? item.main_image_mobile : item.main_image_desktop)
      })

      // items.forEach((item) => {
      //   assets.push(this.deviceType === 'mobile' ? item.main_image_mobile : item.main_image_desktop)
      //   item.detail_images.forEach((detail) => {
      //     assets.push(this.deviceType === 'mobile' ? detail.image_mobile : detail.image_desktop)
      //   })
      // })

      setTimeout(() => {
        const progressLoaderService = new ProgressLoaderService(assets)

        progressLoaderService.on('progress', progress => {
          this.progress = progress
        });
        progressLoaderService.on('complete', () => {
          setTimeout(() => {
            this.$refs.progressLoader.hide()
              .then(() => {
                this.$root.$emit('assetsLoaded')
                this.initialLoad = true
              })
          }, 500)
        })
      }, 200)
    },
    setTransitioning(action) {
      this.transitioning = action === 'show' ? true : false
    }
  },
  watch: {
    '$route' (to, from) {
     // Possibly animate page transition
      console.log('route change')

    }
  }
}
</script>  
