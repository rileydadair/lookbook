<template>
  <header class="header">
    <span class="header__item header__item--title" v-on:click="handleHomeClick">
      <router-link to="/" class="header__link">Lookbook</router-link>
    </span>
    <!-- <span v-if="$route.name !== 'detail'" class="header__item header__item--about">
      <router-link to="/about" class="header__link">About</router-link>
    </span> -->
    <span class="header__item header__item--all">
      <button class="header__btn" v-on:click="toggleMenu" ref="btn">
      <!-- <button class="header__btn" :class="[menuActive ? 'is-active' : '']" v-on:click="toggleMenu"> -->
        <span class="header__btn-wrap">
          <span class="header__btn-text header__btn-text--close">Close</span>
          <span class="header__btn-text header__btn-text--all">All</span>
        </span>
      </button>
    </span>
  </header>
</template>
<script>

export default {
  name: 'Header',
  props: {
    menuActive: Boolean
  },
  methods: {
    handleHomeClick() {
      if (this.$route.name === 'home' && this.menuActive) {
        this.$root.$emit('toggleMenu', 'hide')
        this.$emit('toggleMenuState')
      }
    },
    toggleMenu() {
      if (!this.menuActive) this.$root.$emit('toggleMenu', 'show')
      else this.$root.$emit('toggleMenu', 'hide')

      this.$emit('toggleMenuState')

      this.$refs.btn.classList.toggle('is-active')
    }
  }
}
</script>