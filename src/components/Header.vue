<template>
  <header class="header">
    <span class="header__item header__item--title">
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
  data() {
    return {
      isActive: false
    }
  },
  methods: {
    toggleActive() {
      this.isActive = !this.isActive
      console.log(this.isActive);
    },
    toggleMenu() {
      this.toggleActive()
      if (this.isActive) document.body.classList.add('menu-active')

      this.$refs.menu.toggle(this.isActive ? 'show' : 'hide')

      .then(() => {
        if (!this.isActive) document.body.classList.remove('menu-active')
      })
    }
  }
}
</script>