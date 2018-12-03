<template>
  <div class="main">
    <div class="vs-section">
      <div class="brand">
          <div class="brand__section">
            <template v-for="(image, index) in item.detail_images">
              <div class="brand__img-wrap" :key="`image-${index}`">
                <div class="brand__img" :style="{ backgroundImage: bgImage(image) }" ref="img"></div>
              </div>
            </template>
          </div>
            <!-- v-if for router error when the template is trying to access the data that does not (yet) exist -->
            <!-- <template v-if="nextSlug">
              <router-link :to="{ name: 'detail', params: { slug: nextSlug } }" class="brand__link" :aria-label="nextTitle">
                <h2 class="brand__title">{{ nextTitle }}</h2>
              </router-link>
            </template> -->
        </div>
    </div>
  </div>
</template>

<script>
import imagesLoaded from 'imagesloaded'

export default {
  name: 'Brand',
  props: {
    item: Object,
    nextTitle: String,
    nextSlug: String
  },
  mounted() {
    setTimeout(() => {
      function componentEnter(component) { component.enter() }

      const images = document.querySelectorAll('.brand__img')
      imagesLoaded(document.querySelectorAll('.slide__img'), {background: true}, () => componentEnter(this))
    })
  },
  methods: {
    enter() {
      setTimeout(() => {
        this.$root.$emit('toggleOverlay', 'hide');
      }, 200)
    },
    bgImage(image) {
      return `url('${image.image_desktop}')`
    },
  }
}
</script>