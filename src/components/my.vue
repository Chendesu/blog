<template>
  <div>
    <Card>
      <h2 slot="title">关于我</h2>
      <span slot="extra" class="extra" @click="$goRoute('/')" >
        <Icon type="md-menu" size="24" />
      </span>
      <div class="content">
        <p></p>
      </div>
    </Card>
  </div>
</template>
<script>
export default {
  name: 'my',
  data () {

  },
  mounted () {

  },
  methods: {

  }
}
</script>
<style>
.extra {
  display:flex;
  align-items:center;
  cursor:pointer;
  color: #808695;
}
.extra:hover {
  color: #17233d;
}
.content {
  min-height: 500px;
}
</style>
