<template>
  <div class="menu">
    <ul class="menu__list">
      <li class="menu__item" v-for="(item, index) in itemsList" :key="`menu-list-${index}`">
        <router-link :to="`/${item.slug}`" class="menu__link" >{{ item.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    items: Array
  },
  data() {
    return {
      itemsList: this.items
    }
  }
}
</script>
