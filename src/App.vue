<template>
  <div id="app" :class="deviceType">
    <Header />
    <router-view/>
      <!-- router -->
        <!-- <Home :items="items" /> -->
      <!-- End router -->
  </div>
</template>

<script>
import States from './core/services/States'
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
      deviceType: States.deviceType
    }
  },
}
</script>  
