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

export default {
  name: 'app',
  components: {
    Header // eslint-disable-line
  },
  data() {
    return {
      deviceType: States.deviceType
    }
  },
}
</script>  
