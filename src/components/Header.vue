<template>
  <header class="header">
    <span class="header__item header__item--title">
      <router-link to="/" class="header__link">Lookbook</router-link>
    </span>
    <span class="header__item header__item--about">
      <router-link to="/about" class="header__link">About</router-link>
    </span>
    <span class="header__item header__item--all">
      <button class="header__link">All</button>
    </span>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>