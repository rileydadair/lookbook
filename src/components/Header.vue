<template>
  <header class="header">
    <span class="header__item header__item--title" v-on:click="handleDialogs">
      <router-link to="/" class="header__link">Lookbook</router-link>
    </span>
    <span v-if="$route.name !== 'detail'" class="header__item header__item--about">
      <router-link to="/about" class="header__link">About</router-link>
    </span>
    <span class="header__item header__item--all">
      <button class="header__btn" v-on:click="toggleMenu">All</button>
    </span>
  </header>
</template>
<script>

export default {
  name: 'Header',
  props: {
    menuActive: Boolean
  },
  // data() {
  //   return {
  //     isActive: false
  //   }
  // },
  mounted() {
    console.log(this.menuActive);
  },
  methods: {
    handleDialogs() {
      if (this.$route.name === 'home' && this.menuActive) {
        this.$root.$emit('toggleMenu', 'hide')
        this.$emit('toggleMenuState')
      }
    },
    toggleMenu() {
      if (!this.menuActive) this.$root.$emit('toggleMenu', 'show')
      else this.$root.$emit('toggleMenu', 'hide')

      this.$emit('toggleMenuState')
    }
  }
}
</script>