<template>
  <div class="body">
    <SlideMaster @onSliderEvent="onSliderEvent" @onSliderMount="onSliderMount" ref="slider">
      <template slot="slides" v-for="item in items">
        <Slide :item="item" :key="`slide-${item.id}`" ref="slides" />
      </template>
      <span slot="prevButton" class="controls__plus">+</span>
      <span slot="nextButton" class="controls__plus">+</span>
    </SlideMaster>
    <Progress ref="progress" />
  </div>
</template>

<script>
import SlideMaster from '../components/SlideMaster'
import Slide from '../components/Slide'
import Progress from '../components/Progress'

  export default {
    name: 'Home',
    props: {
      items: Array
    },
    components: {
      SlideMaster,
      Slide,
      Progress
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
        this.$refs.progress.setCurrent(nextIndex + 1, direction);

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