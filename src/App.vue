<template>
  <div id="app">
    <div v-if="deviceType === 'mobile'" class="top-overlay"></div>
    <Header :menuActive="menuActive" @toggleMenuState="toggleMenuState" ref="header" />
    <Menu :menuActive="menuActive" @toggleMenuState="toggleMenuState" :items="items" ref="menu" />
    <router-view
      :key="$route.fullPath"
      :initialLoad="initialLoad"
      :transitioning="transitioning"
      :menuActive="menuActive"
      :scrolledHome="scrolledHome"
      :scrolledDetail="scrolledDetail"
      @disableScrollEl="disableScrollEl"
      @resetCursor="resetCursor" />
    <CircleCursor v-if="deviceType === 'desktop'" ref="cursor" :menuActive="menuActive" />
    <OverlayMobile v-if="deviceType === 'mobile'" :active="activeOverlay" />
    <Overlay v-else :active="activeOverlay" />
    <Loader v-if="!allAssetsLoaded" ref="loader" :items="items" @setInitialLoad="setInitialLoad" @setAllAssetsLoaded="setAllAssetsLoaded" />
    <template v-if="this.$route.name === 'detail' && deviceType === 'desktop'">
      <div class="message message--mobile">
        <p class="message__text message__text--mobile">Please view on a mobile device.</p>
      </div>
    </template>
    <template v-if="isIE">
      <div class="message">
        <p class="message__text">Please view this site in a modern browser.</p>
      </div>
    </template>
  </div>
</template>

<script>
import States from './services/States'
import items from './data/items'

import Loader from './components/Loader'
import CircleCursor from './components/CircleCursor'
import Header from './components/Header'
import Menu from './components/Menu'
import OverlayMobile from './components/OverlayMobile'
import Overlay from './components/Overlay'

export default {
  name: 'app',
  components: {
    Loader, // eslint-disable-line
    CircleCursor,
    Header, // eslint-disable-line
    Menu,
    OverlayMobile,
    Overlay
  },
  data() {
    return {
      allAssetsLoaded: false,
      deviceType: States.deviceType,
      items: items,
      initialMount: false,
      initialLoad: false,
      isIE: States.isIE,
      menuActive: false,
      progress: 0,
      scrolledHome: false,
      scrolledDetail: false,
      transitioning: false
    }
  },
  beforeCreate() {
    document.body.className = `is-${States.deviceType}`
    if (States.isIE) document.body.classList.add('is-IE')
  },
  mounted() {
    if ('scrollRestoration' in history) {
      // Back off, browser, I got this...
      history.scrollRestoration = 'manual'
    }
    this.$root.$on('toggleOverlay', this.setTransitioning)
    this.$root.$on('hideOverlay', this.setTransitioning)
  },
  computed: {
    activeOverlay() {
      return window.location.pathname.length > 1 ? true : false
    }
  },
  methods: {
    setInitialLoad() {
      this.initialLoad = true
    },

    setAllAssetsLoaded() {
      this.allAssetsLoaded = true
    },

    resetCursor() {
      if (this.initialMount) this.$refs.cursor.onReset()
      this.initialMount = true      
    },

    disableScrollEl(prop) {
      this[prop] = true
    },
    
    toggleMenuState() {
      this.menuActive = !this.menuActive
    },

    setTransitioning(action) {
      this.transitioning = action === 'show' ? true : false
    },
  },
  watch: {
    '$route'(to, from) { // eslint-disable-line
      document.body.classList.remove('enter')
      this.$refs.header.resetAll()

      if (document.body.classList.contains('menu-active')) {
        this.$refs.menu.hide();
        this.menuActive = false;
      }
    }
  }
}
</script>  
