<template>
  <div>
    <Card>
      <h2 slot="title" class="title">{{title}}</h2>
      <span slot="extra" class="extra" @click="$goRoute('/DiaryWeb')" >
        返回日志列表
        <Icon type="md-menu" size="24" />
      </span>
      <div class="hd">
        <span>
          <Icon type="md-person" />
          {{username}}
        </span>
        <span>
          <Icon type="md-eye" />
          {{read}}
        </span>
        <span>
          <Icon type="md-pricetag" />
          {{label}}
        </span>
        <span>
          <Icon type="ios-alarm" />
          {{time}}
        </span>
      </div>
      <div class="content" v-html="content"></div>
    </Card>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'DiaryWebDetail',
  data () {
    return {
      // id: ''
      title: '',
      username: '',
      time: '',
      read: '',
      label: '',
      content: ''
    }
  },
  created () {
    // this.id = this.$route.params.id
    // console.log(this.id)
    var url = '/web/Diary_Detail.php'
    var param = {
      id: this.$route.params.id
    }
    axios.post(url, qs.stringify(param)).then(res => {
      console.log(res.data)
      var response = res.data
      if (response.code === 200 && response.message === 'OK') {
        this.title = response.data.title
        this.username = response.data.username
        this.time = response.data.time
        this.read = response.data.read
        this.label = response.data.label
        this.content = response.data.content
      } else {
        this.$Message.error(response.message)
        this.$route.push('/DiaryWeb')
      }
    })
  },
  methods: {

  }
}
</script>
<style scoped>
.main {
  width: 750px;
  margin-left: 10px;
}
.hd {
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
  color: #808695;
}
.hd span {
  display: inline-block;
  padding: 0 6px;
  border-right: 1px solid #f2f2f5;
}
.hd span:last-child {
  border-right: 0;
}
.title {
  text-align: center;
}
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
