<template>
  <div id="app">
    <Header />
    <router-view :key="$route.fullPath"/>
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
  // created() {
  //   console.dir(States.isIE)
  // },
  beforeCreate() {
    document.body.className = States.deviceType
    document.body.classList.add('is-loading')
    if (States.isIE) document.body.classList.add('is-IE')
  },
  // watch: {
  //   '$route' (to, from) {
  //    // Possibly animate page transition
  //     console.log('route change')

  //   }
  // }
}
</script>  
