<template>
  <div id="app" :class="deviceType">
    <Header />
      <!-- router -->
        <Home :items="items" />
      <!-- End router -->
  </div>
</template>

<script>
import States from './core/services/States'
import items from './core/collections/items'
import Header from './components/Header'
import Home from './pages/Home'

export default {
  name: 'app',
  components: {
    Header,
    Home
  },
  data() {
    return {
      deviceType: States.deviceType,
      items: items,
    }
  },
}
</script>
