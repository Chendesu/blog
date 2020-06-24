<template>
  <div>
    <Card>
      <h2 slot="title" class="title">{{title}}</h2>
      <span slot="extra" class="extra" @click="$goRoute('/')" >
        <Icon type="md-menu" size="24" />
      </span>
      <div class="loading" v-if="isShow">
        <Spin>
          <Icon type="ios-loading" size="24" color="#17233d" class="demo-spin-icon-load" />
        </Spin>
      </div>
      <div v-else>
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
      </div>

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
      content: '',
      isShow: true,
      mobile: false
    }
  },
  created () {
    let w = document.documentElement.offsetWidth || document.body.offsetWidth
    // console.log(w)
    if (w < 1024) {
      this.mobile = true
    }
    this.id = this.$route.query.id
    // console.log(this.id)
    var url = '/web/Diary_Detail.php'
    var param = {
      // id: this.$route.params.id
      id: this.$route.query.id
    }
    axios.post(url, qs.stringify(param)).then(res => {
      // console.log(res.data)
      var response = res.data
      if (response.code === 200 && response.message === 'OK') {
        this.title = response.data.title
        this.username = response.data.username
        this.time = response.data.time
        this.read = response.data.read
        this.label = response.data.label
        this.content = response.data.content
      } else {
        // this.$Message.error(response.message)
        // this.$router.push('/DiaryWeb')
      }
    }).finally(() => {
      setTimeout(() => {
        this.isShow = false
      }, 200)
    })
  },
  mounted () {
    var bg = document.getElementById('bg')
    if (this.mobile === false) {
      bg.addEventListener('scroll', this.handleScroll, true)
    } else {
      bg.addEventListener('touchmove', this.handleScroll, true)
    }
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
  padding-right: 25px;
  line-height: 1.2;
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
