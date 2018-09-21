<template>
  <div id="app">
    这是商品主页
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Goods'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
