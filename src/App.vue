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
.clearfix:after {
  content:"\200B";
  display:block;
  height:0;
  clear:both;
}
.clearfix { *zoom:1; }
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  color: #2c3e50;
  width: 100%;
  min-height: 100%;
}
.ivu-page {
  margin-top: 24px;
  text-align: center;
}
.ivu-modal-mask,
.ivu-modal-wrap {
  z-index: 100000!important;
}
.ivu-list-vertical .ivu-list-item-action {
  text-align: right!important;
}
</style>
