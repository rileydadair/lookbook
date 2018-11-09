<template>
  <div id="app" :class="deviceType">
    <Nav />
      <!-- router -->
        <Home :items="brands" />
      <!-- End router -->
  </div>
</template>

<script>
import States from './core/services/States'
import brands from './core/collections/brands'
import Nav from './components/Nav'
import Home from './layout/Home'

export default {
  name: 'app',
  components: {
    Nav,
    Home
  },
  data() {
    return {
      deviceType: States.deviceType,
      brands: brands,
    }
  }
}
</script>
