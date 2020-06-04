<template>

  <div class="error">
    <img src="../assets/error.jpg" alt="">
     <!-- <h2>哎呀！找不到页面了!</h2> -->
    <a @click="$goRoute('/')">
      <Icon type="ios-home" size="20" />
      返回首页
    </a>
  </div>
</template>
<script>
export default {
  name: 'error',
  data () {
    return {

    }
  }
}
</script>
<style scoped>
.error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.error img {
  max-width: 90%;
}
</style>
