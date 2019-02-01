<template>
  <BrandMobile v-if="deviceType !== 'desktop'"
    :initialLoad="initialLoad"
    :item="item"
    :nextTitle="nextTitle"
    :nextSlug="nextSlug"
    ref="brandMobile"/>
  <Brand v-else
    :initialLoad="initialLoad"
    :item="item"
    :nextTitle="nextTitle"
    :nextSlug="nextSlug"
    :scrolledDetail="scrolledDetail"
    @disableScrollEl="disableScrollEl"
    ref="brand" />
</template>

<script>
import States from '@/services/States'
import items from '@/data/items'

import BrandMobile from '@/components/BrandMobile'
import Brand from '@/components/Brand'

export default {
  name: 'Detail',
  props: ['initialLoad', 'transitioning', 'scrolledDetail'],
  components: {
    Brand,
    BrandMobile
  },
  data() {
    return {
      deviceType: States.deviceType,
      item: {},
      nextTitle: '',
      nextSlug: ''
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$root.$emit('hideCursor')
    this.$root.$emit('toggleOverlay', 'show', next)
  },
  beforeRouteLeave(to, from, next) {
    this.$root.$emit('hideCursor')
    this.$root.$emit('toggleOverlay', 'show', next)
  },
  beforeCreate() {
    document.body.classList.add('detail')
  },
  updated() {
    document.body.classList.add('detail')
    window.scrollTo(0, 0)
  },
  mounted() {
    this.$root.$on('assetsLoaded', () => {
      this.deviceType === 'mobile' ? this.$refs.brandMobile.init() : this.$refs.brand.init()
    })
    // Get item object
    items.forEach((item, index, array) => {
      if (item.slug === this.$route.params.slug) {
        this.item = item

        let nextIndex = index + 1
        if (nextIndex === array.length) nextIndex = 0

        this.nextTitle = array[nextIndex].title
        this.nextSlug = array[nextIndex].slug
        return
      }
    })

    if (this.deviceType === 'desktop') this.$emit('resetCursor')
    document.body.classList.remove('is-loading')
  },
  destroyed() {
    document.body.classList.remove('detail')
  },
  methods: {
    disableScrollEl(prop) {
      this.$emit('disableScrollEl', prop)
    }
  }
}
</script>