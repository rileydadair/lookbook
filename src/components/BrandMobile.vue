<template>
  <div class="brand">
    <div class="brand__hero">
      <h1 class="brand__title">{{ item.title }}</h1>
      <p class="brand__description">{{ item.description }}</p>
    </div>
    <div class="brand__section">
      <template v-for="(image, index) in item.detail_images">
        <div class="brand__img-wrap" :key="`image-${index}`">
          <div class="brand__img" :style="{ backgroundImage: bgImage(image) }"></div>
        </div>
      </template>
    </div>
      <!-- v-if for router error when the template is trying to access
        the data that does not (yet) exist -->
      <template v-if="nextSlug">
        <router-link :to="{ name: 'detail', params: { slug: nextSlug } }" class="brand__link" :aria-label="nextTitle">
          <h2 class="brand__title">{{ nextTitle }}</h2>
          <p class="brand__description">Next lookbook</p>
        </router-link>
      </template>
  </div>
</template>

<script>
import States from '@/services/States'

export default {
  name: 'BrandMobile',
  props: {
    item: Object,
    nextTitle: String,
    nextSlug: String
  },
  methods: {
    bgImage(image) {
      // Consider using Vuex store to check deviceType
      if (States.deviceType === 'mobile') {
        return `url('${image.image_mobile}')`
      } else {
        return `url('${image.image_desktop}')`
      }
    },
  }
}
</script>