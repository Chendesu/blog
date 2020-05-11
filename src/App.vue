<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <router-view v-wechat-title="$route.meta.title"/> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  font-size: 14px;
  color: #2c3e50;
  /* margin-top: 60px; */
  width: 100%;
  min-height: 100%;
}
.ivu-page {
  margin-top: 24px;
  text-align: center;
}
</style>
