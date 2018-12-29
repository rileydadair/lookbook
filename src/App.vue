<template>
  <div id="app">
    <div v-if="deviceType === 'mobile'" class="top-overlay"></div>
    <Header :menuActive="menuActive" @toggleMenuState="toggleMenuState" />
    <Menu :menuActive="menuActive" @toggleMenuState="toggleMenuState" :items="items" ref="menu" />
    <router-view :key="$route.fullPath" :transitioning="transitioning" :menuActive="menuActive" @viewHasMounted="viewHasMounted" />
    <CircleCursor v-if="deviceType === 'desktop'" ref="cursor" />
    <OverlayMobile v-if="deviceType === 'mobile'" :active="activeOverlay" />
    <Overlay v-else :active="activeOverlay" />
  </div>
</template>

<script>
import States from './services/States'
import items from './data/items'
import ProgressLoaderService from './services/ProgressLoaderService'

import ProgressLoader from './components/ProgressLoader'
import CircleCursor from './components/CircleCursor'
import Header from './components/Header'
import Menu from './components/Menu'
import OverlayMobile from './components/OverlayMobile'
import Overlay from './components/Overlay'

export default {
  name: 'app',
  components: {
    ProgressLoader, // eslint-disable-line
    CircleCursor,
    Header, // eslint-disable-line
    Menu,
    OverlayMobile,
    Overlay,
  },
  data() {
    return {
      deviceType: States.deviceType,
      items: items,
      initialMount: false,
      initialLoad: false,
      progress: 0,
      transitioning: false,
      menuActive: false,
    }
  },
  beforeCreate() {
    document.body.className = States.deviceType
    if (States.isIE) document.body.classList.add('is-IE')
  },
  mounted() {
    if ('scrollRestoration' in history) {
      // Back off, browser, I got this...
      history.scrollRestoration = 'manual'
    }
    this.$root.$on('toggleOverlay', this.setTransitioning)
    this.$root.$on('hideOverlay', this.setTransitioning)

    this.headerBtn = document.querySelector('.header__btn')
  },
  computed: {
    activeOverlay() {
      return window.location.pathname.length > 1 ? true : false
    }
  },
  methods: {
    viewHasMounted() {
      if (this.initialMount) this.$refs.cursor.onReset()
      this.initialMount = true      
    },
    
    toggleMenuState() {
      this.menuActive = !this.menuActive
    },

    setTransitioning(action) {
      this.transitioning = action === 'show' ? true : false
    },

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
  },
  watch: {
    '$route' (to, from) {
      document.body.classList.remove('enter')
      this.headerBtn.classList.remove('is-active')
     // Possibly animate page transition
      console.log('route change')

      if (document.body.classList.contains('menu-active')) {
        this.$refs.menu.hide();
        this.menuActive = false;
      }
    }
  }
}
</script>  
