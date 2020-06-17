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
* {
  /* word-break: break-all; */
  word-break: break-word;
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
.content img {
  max-width: 100%;
  border-radius: 3px;
  box-shadow: 0 0 2px #999;
}
.content pre {
  width: 100%;
  padding: 15px;
  border-radius: 5px;
  background: #eee;
  overflow: auto;
}
.content table {
  border: 2px solid #333;
  border-right: 1px solid #333;
  border-bottom: 1px solid #333;
  border-radius: 5px;
  box-shadow: 2px 2px 2px #999;
  overflow: hidden;
}
.content table th,.content table td {
  border-bottom: 1px solid #333;
  border-right: 1px solid #333;
}
.content table tr th:last-child,
.content table tr td:last-child {
  border-right: 0;
}
.loading {
  width: 100%;
  height: 300px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
</style>
