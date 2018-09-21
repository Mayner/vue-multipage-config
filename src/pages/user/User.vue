<template>
  <div id="app">
    这是用户主页
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'User'
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
