<template>
  <div>
    <div class="bg" id="bg" v-show="mobile==false">
      <div class="hd">
        <div class="hd-inner">
          <div class="logo">
            <img src="../assets/logo.png" alt="">
          </div>
          <h2>阿久的个人空间</h2>
        </div>
      </div>
      <div class="wrap clearfix">
        <div class="inner">
          <div class="main clearfix">
            <router-view />
          </div>
          <div class="left">
            <Card class="info">
              <div class="info-hd">
                <div class="headpic">
                  <img src="../assets/headpic.jpg" alt="">
                </div>
                <a class="admin" @click="$goRoute('/Login')"></a>
              </div>
              <div class="info-nav">
                <div class="name">阿久</div>
                <ul class="list">
                  <li @click="$goRoute('/')">
                    <strong>日志</strong>
                    <span>{{diaryTotal}}</span>
                  </li>
                  <li @click="$goRoute('/PhotoWeb')">
                    <strong>相册</strong>
                    <span>{{photoTotal}}</span>
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
      <div class="backup" v-if="this.scrollTop > 180" @click="backTop">
        <Icon type="md-arrow-round-up" size="24" />
      </div>
    </div>
    <div class="mobile-bg" v-show="mobile==true">
      <!-- <div class="mobile-bg-hd"> -->
        <div class="mobile-bg-btn" @touchstart="openInfo(1)" @click="openInfo(1)">
          <img src="../assets/logo.png" alt="">
        </div>
      <!-- </div> -->

      <div class="mobile-bg-info" v-show="mobileInfo==true">
        <div class="mobile-bg-info-close"  @touchstart="openInfo(0)" @click="openInfo(0)">
          <Icon type="md-close" size="24" />
        </div>
        <Card class="info">
          <div class="info-hd">
            <div class="headpic">
              <img src="../assets/headpic.jpg" alt="">
            </div>
            <a class="admin"  @click="$goRoute('/Login')"></a>
          </div>
          <div class="info-nav">
            <div class="name">阿久</div>
            <ul class="list">
              <li @touchstart="go('/DiaryWeb')">
                <strong>日志</strong>
                <span>{{diaryTotal}}</span>
              </li>
              <li @touchstart="go('/PhotoWeb')">
                <strong>相册</strong>
                <span>{{photoTotal}}</span>
              </li>
            </ul>
          </div>
        </Card>
        <Card :bordered="false" style="margin-top:1px;">
          <p slot="title">个人签名</p>
          <p>清醒时做事</p>
          <p>糊涂时读书</p>
          <p>大怒时睡觉</p>
          <p>独处时思考</p>
        </Card>
        <Card :bordered="false" style="margin-top:1px;">
          <h3 slot="title">
            <strong style="font-weight:normal">{{date}}</strong>
            <em style="font-style:normal;font-size:14px;float:right">{{week}}</em>
          </h3>
          <h1 style="text-align:center;">{{time}}</h1>
        </Card>
      </div>
      <router-view />
      <div class="ft">
        <div class="ft-inner">
          <p>Copyright ©2019 ajiuya.cn All Rights Reserved. </p>
          <p>闽ICP备19022956号</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Index',
  data () {
    return {
      dateObj: '',
      date: '',
      week: '',
      time: '',
      diaryTotal: 0,
      photoTotal: 0,
      mobile: false,
      mobileInfo: false,
      window: 0,
      scrollTop: 0,
      bg: ''
    }
  },
  created () {
    this.window = document.documentElement.offsetWidth || document.body.offsetWidth
    if (this.window < 1024) {
      this.mobile = true
    }

    var url = '/web/Diary_Query.php'
    axios.post(url).then(res => {
      // console.log(res.data)
      this.diaryTotal = res.data.total
    })
    var urlphoto = 'web/Photo_Query.php'
    axios.post(urlphoto).then(res => {
      // console.log(res.data)
      this.photoTotal = res.data.total
    })
  },
  mounted () {
    // this.$router.push({path: '/DiaryWeb'})
    setInterval(() => {
      this.getDate()
      this.getTime()
    }, 10)
    this.bg = document.getElementById('bg')
    if (this.mobile === false) {
      this.bg.addEventListener('scroll', this.handleScroll, true)
    } else {
      this.bg.addEventListener('touchmove', this.handleScroll, true)
    }
  },
  methods: {
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
    },
    openInfo (p) {
      if (p === 1) {
        this.mobileInfo = true
      }
      if (p === 0) {
        this.mobileInfo = false
      }
    },
    go (url) {
      this.mobileInfo = false
      this.$router.push({path: url})
    },
    handleScroll () {
      // var bg = document.getElementById('bg')
      this.scrollTop = this.bg.scrollTop
      // console.log(this.scrollTop)
    },
    backTop () {
      var timer = setInterval(() => {
        if (this.scrollTop > 180) {
          // var bg = document.getElementById('bg')
          this.bg.scrollTop -= 100
        } else {
          // bg.scrollTop = 0
          this.scrollTop = 0
          clearInterval(timer)
          this.bg.removeEventListener('scroll', this.handleScroll)
        }
      }, 10)
    }
  },
  destroyed () {
    // 离开该页面需要移除这个监听的事件，不然会报错
    this.bg.removeEventListener('scroll', this.handleScroll)
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
  /* background: url(../assets/bg.jpg) 0 0;
  background-size:auto 100%; */
  /* background: rgb(218,178,115); */
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
  position: relative;
  width: 1010px;
  height: 100px;
  margin: 0 auto;
  line-height: 100px;
  font-size: 18px;
  color: #17233d;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  text-align: center;
}
.hd .hd-inner h2 {
  font-size: 40px;
  font-weight: bold;
  /* background: linear-gradient(to left, #FFFF4D, #111); */
  background: linear-gradient(to left, #17233d, #fff);
  -webkit-background-clip: text;
  color: transparent;
  /* -webkit-text-stroke: 1px #111; */
  /* text-shadow: 1px 1px 2px #eee; */
}
.hd .hd-inner .logo {
  position: absolute;
  left: 50%;
  /* width: 150px; */
  height: 100px;
  border: 1px solid #000;
  border-radius: 50%;
  /* background-color: #fff; */
  text-align: center;
  transform: translateX(-50%);
}
.hd .hd-inner .logo img {
  display: inline-block;
  height: 100%;
}
.wrap {
  overflow: hidden;
  width: 1000px;
  padding: 10px;
  padding-left: 0;
  min-height: 500px;
  margin: 5px auto;
  border-radius: 5px;
  background: rgba(255,255,255,0.9);
  /* background: rgba(232, 234, 236, 0.7); */
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

.info {
  width: 100%;
  /* height: 165px; */
  background: #fff;
}
.ivu-card-body{
  padding: 0!important;
}
.info .info-hd {
  width: 100%;
  height: 75px;
  background: url(../assets/bg.jpg) 0 0 repeat;
  background-size: auto 100%;
  position: relative;
}
.info .info-hd .headpic {
  overflow: hidden;
  position: absolute;
  bottom: -20px;
  left: 50%;
  width: 66px;
  height: 66px;
  border-radius: 50%;
  background: #efefef;
  transform: translate(-50%, 0);
  display: flex;
    align-items: center;
    justify-content: center;
}
.info .info-hd .headpic img {
  display: block;
  /* width: 100%; */
  height: 100%;
}
.info .info-hd .admin {
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
.info .info-nav {
  padding: 20px 10px 10px;
}
.info .info-nav .name {
  margin-bottom: 5px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.info .info-nav .list {
  text-align: center;
  position: relative;
}
.info .info-nav .list li {
  display: inline-block;
  width: 65px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  color: #808695;
}
.info .info-nav .list li:hover {
  color: #17233d;
}
.info .info-nav .list li strong,
.info .info-nav .list li span {
  display: block;
}
.info .info-nav .list:after {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 1px;
  height: 100%;
  background: #d9d9d9;
  transform: translateX(-50%);
}
.msg {
  margin-top: 10px;
  background: #fff;
}
.msg .msg-hd {
  border-bottom: 1px solid #e8eaec;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #17233d;
  padding: 5px 0;
}
.msg .msg-main {
  padding: 10px 20px;
}
.wrap .main {
  float: left;
  width: 760px;
  margin-right: 10px;
  min-height: 500px;
  /* background: #808695; */
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
/* 移动端 */
.mobile-bg {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #17233d;
  overflow: auto;
}
.mobile-bg .mobile-bg-hd {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 44px;
  padding: 0 10px;
  background: #fff;
  box-sizing: border-box;
  /* z-index: 10000; */
}
.mobile-bg .mobile-bg-btn {
  position: fixed;
  top: 0;
  left: 10px;
  width: 44px;
  height: 44px;
  border: 1px solid #444;
  border-radius: 50%;
  background: #fff;
  z-index: 10001;
}
.mobile-bg .mobile-bg-btn img {
  display: block;
  width: 100%;
  height: 100%;
}
.mobile-bg .mobile-bg-info {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 5px;
  background: #17233d;
  z-index: 10002;
  box-sizing: border-box;
  overflow: auto;
}
.mobile-bg .mobile-bg-info .mobile-bg-info-close {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  /* border: 1px solid #d9d9d9; */
  border-radius: 50%;
  background: #fff;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mobile-bg .ft {
  height: auto;
}
.mobile-bg .ft .ft-inner {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.3;
  background: #fff;
  box-sizing: border-box;
}
.backup {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 40px;
  height: 40px;
  border: 1px solid #dcdee2;
  border-radius: 3px;
  color: #17233d;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  cursor: pointer;
}
</style>
