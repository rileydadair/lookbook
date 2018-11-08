<template>
  <div id="app" :class="deviceType">
    <div class="body">
      <Header></Header>
      <SlideMaster @onSliderEvent="onSliderEvent" @onSliderMount="onSliderMount" ref="slider">
        
        <template slot="slides" v-for="brand in brands">
          <Slide :item="brand" :key="`slide-${brand.id}`" ref="slides" />
        </template>
      
        <span slot="prevButton">Prev</span>
        <span slot="nextButton">Next</span>
      
      </SlideMaster>
    </div>
  </div>
</template>

<script>
import States from './core/services/States'
import brands from './core/collections/brands'
import Header from './components/Header'
import SlideMaster from './components/SlideMaster'
import Slide from './components/Slide'

export default {
  name: 'app',
  components: {
    Header,
    SlideMaster,
    Slide
  },
  data() {
    return {
      deviceType: States.deviceType,
      brands: brands,
    }
  },
  methods: {
    onSliderMount(slider) {
      slider.toggleEvents(false);
      Promise.all([
        this.$refs.slides[0].show('next'),
        this.$refs.slides[0].setActive()
      ]).then(() => slider.toggleEvents())
    },
    onSliderEvent(e, slider, currentIndex, nextIndex, direction) {
      Promise.all([
        this.$refs.slides[currentIndex].hide(direction),
        this.$refs.slides[nextIndex].show(direction)
      ]).then(() => {
        this.$refs.slides[currentIndex].setActive(false);
        this.$refs.slides[nextIndex].setActive();
        slider.toggleEvents();
      })
    },
  }
}
</script>
