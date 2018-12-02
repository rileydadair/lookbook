<template>
  <div id="app">
    <div v-if="deviceType === 'mobile'" class="top-overlay"></div>
    <Header />
    <router-view :key="$route.fullPath" :transitioning="transitioning" />
    <Overlay :active="activeOverlay" />
  </div>
</template>

<script>
import States from './services/States'
import items from './data/items'

import Header from './components/Header'
import Overlay from './components/Overlay'

export default {
  name: 'app',
  components: {
    Header, // eslint-disable-line
    Overlay
  },
  data() {
    return {
      deviceType: States.deviceType,
      initialLoad: false,
      progress: 0,
      transitioning: false,
    }
  },
  beforeCreate() {
    document.body.className = States.deviceType
    if (States.isIE) document.body.classList.add('is-IE')
  },
  mounted() {
    if ('scrollRestoration' in history) {
      // Back off, browser, I got this...
      history.scrollRestoration = 'manual';
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
