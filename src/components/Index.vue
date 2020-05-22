<template>
  <div class="bg" id="bg">
    <div class="hd">
      <div class="hd-inner">
        <h2>这是一个随意的标题</h2>
      </div>
    </div>
    <div class="wrap clearfix">
      <div class="inner">
        <div class="main clearfix">
          <List :class="['nav',{'fixed':scrollTop>115}]" id="nav">
            <ListItem @click.native="clickFun('all')">
              <a>
                <Icon type="ios-keypad" size="24" />
                <strong>全部</strong>
              </a>
            </ListItem>
            <ListItem v-for="(item,index) in navList"
            :key="item.id"
            @click.native="clickFun(index)">
              <a>
                <Icon :type="item.icon" size="24" />
                <strong>{{item.label}}</strong>
              </a>
            </ListItem>
          </List>
          <div class="content">
            <Card>
              <div slot="title">
                <Icon type="ios-pin" size="24" />
                当前位置：
                <span>日志</span>
                <Icon type="md-arrow-forward" />
                <span v-if="labelKey!=''">{{labelKey}}</span>
                <span v-else>全部</span>
              </div>
              <List v-show="diaryList.length>0" item-layout="vertical">
                <ListItem v-for="item in diaryList" :key="item.id">
                  <ListItemMeta
                  :title="item.title"
                  :description="item.content">
                      <Icon slot="avatar" :type="item.icon" size="30" />
                  </ListItemMeta>
                  <template slot="action" style="text-align:right;">
                    <li>
                        <Icon type="md-eye" />{{item.read}}
                    </li>
                    <li>
                        <Icon type="md-person" />{{item.username}}
                    </li>
                    <li>
                        查看
                    </li>
                  </template>
                </ListItem>
              </List>

              <div class="null" v-show="diaryList.length==0">
                <Icon type="ios-information-circle" size="24" />
                <p>暂无文章</p>
              </div>

              <Page :total="totalCount" :current.sync="curPage" :page-size="pageSize"  show-total @on-change="page" style="margin-top:24px" />
            </Card>

          </div>
        </div>
        <div class="left">
          <Card class="info">
            <div class="info-hd">
              <div class="headpic">
                <img src="../assets/headpic.jpg" alt="">
              </div>
              <a class="admin"  @click="$goRoute('/Login')"></a>
            </div>
            <div class="info-nav">
              <div class="name">呆桃</div>
              <ul class="list">
                <li>
                  <strong>日志</strong>
                  <span>0</span>
                </li>
                <li>
                  <strong>相册</strong>
                  <span>0</span>
                </li>
              </ul>
            </div>
          </Card>
          <Card :bordered="false" style="margin-top:10px;">
            <p slot="title">个人签名</p>
            <p>清醒时做事</p>
            <p>糊涂时读书</p>
            <p>大怒时睡觉</p>
            <p>独处时思考</p>
          </Card>
          <Card :bordered="false" style="margin-top:10px;">
            <h3 slot="title">
              <strong style="font-weight:normal">{{date}}</strong>
              <em style="font-style:normal;font-size:14px;float:right">{{week}}</em>
            </h3>
            <h1 style="text-align:center;">{{time}}</h1>
          </Card>
        </div>
      </div>
    </div>
    <div class="ft">
      <div class="ft-inner">
        Copyright ©2019 ajiuya.cn All Rights Reserved. 闽ICP备19022956号
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'Index',
  data () {
    return {
      navList: [],
      diaryList: [],
      curPage: 1,
      totalCount: 0,
      pageSize: 10,
      labelKey: '',
      scrollTop: 0,
      navHeight: 0,
      dateObj: '',
      date: '',
      week: '',
      time: ''
    }
  },
  mounted () {
    setInterval(() => {
      this.getDate()
      this.getTime()
    }, 10)
    var nav = document.getElementById('nav')
    var url = '/admin/Label_Query.php'
    axios.post(url).then(res => {
      // console.log(res.data)
      if (res.data.code === 200 && res.data.message === 'OK') {
        this.navList = res.data.data
        // console.log(nav.offsetHeight)
      }
    })
    this.queryDiary(this.curPage, this.pageSize, this.labelKey)

    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    queryDiary (curPage, pageSize, labelKey) {
      var url = '/web/Diary_Query.php'
      var param = {
        'page': curPage,
        'pageSize': pageSize,
        'labelKey': labelKey
      }
      axios.post(url, qs.stringify(param)).then(res => {
        // console.log(res.data)
        if (res.data.code === 200 && res.data.message === 'OK') {
          this.diaryList = res.data.data
          this.totalCount = Number(res.data.total)
        } else {
          this.$Message.error('Fail')
        }
      })
    },
    clickFun (index) {
      this.curPage = 1
      if (index === 'all') {
        this.labelKey = ''
      } else {
        this.labelKey = this.navList[index].label
      }
      this.queryDiary(this.curPage, this.pageSize, this.labelKey)
    },
    page (index) {
      this.queryDiary(this.curPage, this.pageSize, this.labelKey)
    },
    // 保存滚动值，这是兼容的写法
    handleScroll () {
      // this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      var bg = document.getElementById('bg')
      this.scrollTop = bg.scrollTop
      // console.log(this.scrollTop)
    },
    // 滚动条回到顶部
    backTop () {
      if (this.scrollTop > 10) {
        document.documentElement.scrollTop = 0
      }
    },
    getDate () {
      this.dateObj = new Date()
      var year = this.dateObj.getFullYear()
      var month = this.dateObj.getMonth() + 1
      var day = this.dateObj.getDate()
      var week = this.dateObj.getDay()
      this.date = year + '年' + month + '月' + day + '日'
      switch (week) {
        case 1: this.week = '周一'
          break
        case 2: this.week = '周二'
          break
        case 3: this.week = '周三'
          break
        case 4: this.week = '周四'
          break
        case 5: this.week = '周五'
          break
        case 6: this.week = '周六'
          break
        default: this.week = '周日'
          break
      }
    },
    getTime () {
      var hours = this.dateObj.getHours()
      if (hours < 10) {
        hours = String('0' + hours)
      }
      var min = this.dateObj.getMinutes()
      if (min < 10) {
        min = String('0' + min)
      }
      var sec = this.dateObj.getSeconds()
      if (sec < 10) {
        sec = String('0' + sec)
      }
      this.time = hours + ':' + min + ':' + sec
    }
  },
  destroyed () {
    // 离开该页面需要移除这个监听的事件，不然会报错
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style scoped>
.bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #17233d;
  overflow: auto;
}
.hd {
  width: 100%;
  height: 100px;
  background-image: linear-gradient(
    left,
    transparent 0%,
    rgba(255,255,255,0.9) 40%,

    rgba(255,255,255,0.9) 60%,
    transparent 100%);
}
.hd .hd-inner {
  width: 1010px;
  margin: 0 auto;
  line-height: 100px;
  font-size: 18px;
  color: #17233d;
  text-align: center;
}
.wrap {
  overflow: hidden;
  width: 1000px;
  padding: 10px;
  padding-left: 0;
  min-height: 500px;
  margin: 5px auto;
  border-radius: 5px;
  /* background: #e8eaec; */
  background: rgba(232, 234, 236, 0.7);
  /* background: rgba(94,118,47,0.25); */
  box-sizing: content-box;
}
.wrap .inner {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.wrap .left {
  float: right;
  /* display: inline-block; */
  width: 230px;
  /* min-height: 230px; */
  /* background: #515a6e; */
}

.wrap .left .info {
  width: 100%;
  /* height: 165px; */
  background: #fff;
}
.ivu-card-body{
  padding: 0!important;
}
.wrap .left .info .info-hd {
  width: 100%;
  height: 75px;
  background: url(../assets/bg.jpg) 0 0 repeat;
  background-size: auto 100%;
  position: relative;
}
.wrap .left .info .info-hd .headpic {
  overflow: hidden;
  position: absolute;
  bottom: -20px;
  left: 50%;
  width: 66px;
  height: 66px;
  border-radius: 50%;
  background: #efefef;
  transform: translate(-50%, 0);
}
.wrap .left .info .info-hd .headpic img {
  display: block;
  width: 100%;
  height: 100%;
}
.wrap .left .info .info-hd .admin {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0px;
  height: 0px;
  border: 5px solid transparent;
  border-bottom: 5px solid rgba(0,0,0,0.5);
  border-right: 0px;
  /* background: rgba(255,255,255,0.9); */
  z-index: 10;
}
.wrap .left .info .info-nav {
  padding: 20px 10px 10px;
}
.wrap .left .info .info-nav .name {
  margin-bottom: 5px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.wrap .left .info .info-nav .list {
  text-align: center;
  position: relative;
}
.wrap .left .info .info-nav .list li {
  display: inline-block;
  width: 65px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  color: #808695;
}
.wrap .left .info .info-nav .list li:hover {
  color: #17233d;
}
.wrap .left .info .info-nav .list li strong,
.wrap .left .info .info-nav .list li span {
  display: block;
}
.wrap .left .info .info-nav .list:after {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 0.5px;
  height: 100%;
  background: #d9d9d9;
  transform: translateX(-50%);
}
.wrap .left .msg {
  margin-top: 10px;
  background: #fff;
}
.wrap .left .msg .msg-hd {
  border-bottom: 1px solid #e8eaec;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #17233d;
  padding: 5px 0;
}
.wrap .left .msg .msg-main {
  padding: 10px 20px;
}
.wrap .main {
  float: left;
  width: 760px;
  margin-right: 10px;
  min-height: 500px;
  /* background: #808695; */
}
.wrap .main .nav {
  float: left;
  width: 150px;
  /* min-height: 200px; */
  /* background: #e8eaec; */
}
.wrap .main .nav.fixed {
  position: fixed;
  top: 0;
}
.wrap .main .nav li {
  border-bottom: 1px solid rgba(255,255,255,0);
}
.wrap .main .nav a {
  display: block;
  font-size: 14px;
  color: #17233d;
  width: 100%;
  height: 100%;
  padding-left: 15px;
  box-sizing: border-box;
}
.wrap .main .nav li:hover {
  /* color: #17233d; */
  background: rgba(255,255,255,0.2);
}
.wrap .main .nav a strong {
  font-weight: normal;
}
.wrap .main .content {
  float: right;
  width: 610px;
  /* min-height: 600px; */
  /* padding: 15px 27px;
  background: #fff; */
}
.null {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrap .main .content .ivu-list-item-action {
  text-align: right!important;
}
.ft {
  width: 100%;
  height: 50px;
  background-image: linear-gradient(
    left,
    transparent 0%,
    rgba(255,255,255,0.9) 40%,

    rgba(255,255,255,0.9) 60%,
    transparent 100%);
}
.ft .ft-inner {
  width: 1010px;
    margin: 0 auto;
    line-height: 50px;
    font-size: 14px;
    color: #17233d;
    text-align: center
}
</style>
