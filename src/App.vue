<template>
  <div id="app" :class="deviceType">
    <Header />
    <router-view/>
  </div>
</template>

<script>
import States from './services/States'
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
