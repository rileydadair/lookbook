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
import items from '@/data/items'
import CircleCursor from './components/CircleCursor'
import Header from './components/Header'
import Menu from './components/Menu'
import OverlayMobile from './components/OverlayMobile'
import Overlay from './components/Overlay'

export default {
  name: 'app',
  components: {
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
    }
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
