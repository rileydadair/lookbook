<template>
  <router-link v-if="item" :to="{ name: 'detail', params: { slug: item.slug } }" class="nav__link" event="" ref="link">
    <div class="nav__title-wrap">
      <span class="nav__title">{{ item.title }}</span>
      <span class="nav__title nav__title--stroke">{{ item.title }}</span>
    </div>
    <span class="nav__num">00{{ index + 1 }}</span>
  </router-link>
</template>

<script>
import HoverImg from './HoverImg'

export default {
  name: 'NavLink',
  props: {
    index: Number,
    item: Object
  },
  components: {
    HoverImg
  },
  mounted() {
    this.toggleEvents(true)
  },
  methods: {
    toggleEvents(boolean) {
      if (boolean) {
        this.$refs.link.$el.addEventListener('mouseenter', this.mouseenter)
        this.$refs.link.$el.addEventListener('mouseleave', this.mouseleave)
      } else {
        this.$refs.link.$el.removeEventListener('mouseenter', this.mouseenter)
        this.$refs.link.$el.removeEventListener('mouseleave', this.mouseleave)
      }
    },

    mouseenter() {
      this.$emit('showHoverImg', this.index)
    },

    mouseleave() {
      this.$emit('hideHoverImg', this.index)
    }
  }
}
</script>