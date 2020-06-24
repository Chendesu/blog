<template>
<div>
  <div class="main" v-show="mobile==false">
    <div :class="['nav',{'fixed':scrollTop>115}]" id="nav">
      <List>
        <ListItem
          :class="{'sel':idx==='all'}"
          @click.native="clickFun('all')">
          <a>
            <Icon type="ios-keypad" size="24" />
            <strong>全部</strong>
          </a>
        </ListItem>
        <ListItem v-for="(item,index) in navList"
        :key="item.id"
        :class="{'sel':index===idx}"
        @click.native="clickFun(index)">
          <a>
            <Icon :type="item.icon" size="24" />
            <strong>{{item.label}}</strong>
          </a>
        </ListItem>
      </List>
      <div class="my" @click="$goRoute({name: 'my'})">
        <a>
          <Icon type="ios-bowtie" size="24" />
          <strong>关于我</strong>
        </a>
      </div>
    </div>
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
        <!-- <router-view :key="labelKey" /> -->
        <div slot="extra" style="display:flex;justity-content:flex-end;">
          <Input search enter-button
            v-model="labelKey"
            style="width:220px;"
            @on-search="searchFun"
            placeholder="请输入文章标题" />
        </div>
        <div class="loading" v-if="isShow">
          <Spin>
            <Icon type="ios-loading" size="24" color="#17233d" class="demo-spin-icon-load" />
          </Spin>
        </div>
        <div v-else>
          <List v-show="diaryList.length>0" item-layout="vertical">
            <ListItem v-for="(item) in diaryList" :key="item.id">
              <ListItemMeta
              :title="item.title"
              :description="item.content"
              @click.native="goDetail(item.id)"
              style="cursor:pointer;">
                  <Icon slot="avatar" :type="item.icon" size="30" />
              </ListItemMeta>
              <template slot="action" style="text-align:right;">
                <li>
                    <Icon type="md-eye" />{{item.read}}
                </li>
                <li>
                    <Icon type="md-person" />{{item.username}}
                </li>
                <li><Icon type="md-pricetag" />{{item.label}}</li>
                <li @click="goDetail(item.id)">
                    查看全文
                </li>
              </template>
            </ListItem>
          </List>
          <div class="null" v-show="diaryList.length==0">
            <Icon type="ios-information-circle" size="24" />
            <p>暂无文章</p>
          </div>
          <Page :total="totalCount" :current.sync="curPage" :page-size="pageSize"  show-total @on-change="page" style="margin-top:24px" />
        </div>
      </Card>
    </div>
  </div>
  <div v-show="mobile==true">
    <div class="mobile-hd">
      <div class="mobile-hd-logo">
        <!-- <img src="../assets/logo.png" alt=""> -->
      </div>
      <div class="mobile-hd-nav">
        <ul class="mobile-hd-nav-main">
          <li @touchstart="navTouch('all')"
            :class="{'sel':mobileIdx==='all'}">
            <a>
              <Icon type="ios-keypad" size="20" />
              <strong>全部</strong>
            </a>
          </li>
          <li
            v-for="(item,index) in navList"
            :key="item.id"
            @touchstart="navTouch(index)"
            :class="{'sel':index===mobileIdx}">
            <a>
              <Icon :type="item.icon" size="20" />
              <strong>{{item.label}}</strong>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="mobile-diary">
      <Card>
        <!-- <div slot="title">
          <Icon type="ios-pin" size="24" />
          当前位置：
          <span>日志</span>
          <Icon type="md-arrow-forward" />
          <span v-if="labelKey!=''">{{labelKey}}</span>
          <span v-else>全部</span>
        </div> -->
        <!-- <router-view :key="labelKey" /> -->
        <div style="display:flex;justity-content:flex-end;">
          <Input search enter-button
            v-model="labelKey"
            @on-search="searchFun"
            placeholder="请输入文章标题" />
        </div>
        <div class="loading" v-if="isShow">
          <Spin>
            <Icon type="ios-loading" size="24" color="#17233d" class="demo-spin-icon-load" />
          </Spin>
        </div>
        <div v-else>
          <List v-show="diaryList.length>0" item-layout="vertical">
            <ListItem v-for="(item) in diaryList" :key="item.id">
              <ListItemMeta
              :title="item.title"
              @click.native="goDetail(item.id)"
              style="cursor:pointer;">
                  <Icon slot="avatar" :type="item.icon" size="30" />
                  <div slot="description">
                    {{item.content}}
                    <span style="color: #17233d;display:flex;justify-content:flex-end;"  @click="goDetail(item.id)">
                      查看全文
                      <Icon type="ios-arrow-round-forward" size="18" color="#17233d" />
                    </span>
                  </div>
              </ListItemMeta>
              <template slot="action" style="text-align:right;">
                <li>
                    <Icon type="md-eye" />{{item.read}}
                </li>
                <li>
                    <Icon type="md-person" />{{item.username}}
                </li>
                <li><Icon type="md-pricetag" />{{item.label}}</li>
                <!-- <li @click="goDetail(item.id)">
                    查看全文
                </li> -->
              </template>
            </ListItem>
          </List>
          <div class="null" v-show="diaryList.length==0">
            <Icon type="ios-information-circle" size="24" />
            <p>暂无文章</p>
          </div>
          <Page :total="totalCount" :current.sync="curPage" :page-size="pageSize"  show-total @on-change="page" style="margin-top:24px" />
        </div>
      </Card>
    </div>
  </div>
</div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'DiaryWeb',
  data () {
    return {
      navList: [],
      diaryList: [],
      curPage: 1,
      totalCount: 0,
      pageSize: 10,
      labelKey: '',
      scrollTop: 0,
      keywords: '',
      idx: 'all',
      mobile: false,
      mobileIdx: 'all',
      isShow: true
    }
  },
  created () {
    let w = document.documentElement.offsetWidth || document.body.offsetWidth
    // console.log(w)
    if (w < 1024) {
      this.mobile = true
    }
  },
  mounted () {
    var url = '/admin/Label_Query.php'
    axios.post(url).then(res => {
      // console.log(res.data)
      if (res.data.code === 200 && res.data.message === 'OK') {
        this.navList = res.data.data
      }
    })
    this.queryDiary(this.curPage, this.pageSize, this.labelKey)
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    clickFun (index) {
      this.isShow = true
      this.curPage = 1
      this.idx = index

      if (index === 'all') {
        this.labelKey = ''
      }
      // else if (index === 'my') {
      //   this.$router.push({path: '/my'})
      // }
      else {
        this.labelKey = this.navList[index].label
      }
      this.queryDiary(this.curPage, this.pageSize, this.labelKey)
    },
    searchFun () {
      var url = '/web/Diary_Query_Search.php'
      var param = {
        'keywords': this.labelKey
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
      }).finally(() => {
        setTimeout(() => {
          this.isShow = false
        }, 200)
      })
    },
    page (index) {
      this.queryDiary(this.curPage, this.pageSize, this.labelKey)
    },
    goDetail (id) {
      this.$router.push({
        path: 'DiaryWebDetail',
        query: {
          id: id
        }
      })
      // this.$router.push({
      //   path: `DiaryWebDetail?id=${id}`
      // })
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
    // 移动端事件
    navTouch (index) {
      this.isShow = true
      this.mobileIdx = index
      this.curPage = 1
      if (index === 'all') {
        this.labelKey = ''
      } else {
        this.labelKey = this.navList[index].label
      }
      this.queryDiary(this.curPage, this.pageSize, this.labelKey)
    }
  },
  destroyed () {
    // 离开该页面需要移除这个监听的事件，不然会报错
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style scoped>
.wrap .main .nav {
  float: left;
  width: 150px;
  /* min-height: 200px; */
  background: #e8eaec;
  border-radius: 5px;
  box-shadow: 1px 1px 2px #999;
  position: relative;
  z-index: 2;
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
  color: #808695;
  width: 100%;
  height: 100%;
  padding-left: 15px;
  box-sizing: border-box;
}
.wrap .main .nav li:hover,
.wrap .main .nav li.sel {
  /* background: rgba(255,255,255,0.2); */
  background: rgba(232, 234, 236, 0.7);
}
.wrap .main .nav li:hover a,
.wrap .main .nav li.sel a {
  color: #17233d;
}
.wrap .main .nav a strong {
  font-weight: normal;
}
.wrap .main .nav .my {
  padding: 12px 0;
  border-top: 1px solid rgba(23, 35, 61, 0.1);
}
.wrap .main .content {
  float: right;
  width: 606px;
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
/* 移动端 */
.mobile-hd {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 44px;
  padding: 0 10px;
  background: #fff;
  box-sizing: border-box;
  z-index: 10000;
  display: flex;
  box-shadow: 0 2px 5px #17233d;
}
.mobile-hd .mobile-hd-logo {
  width: 44px;
  height: 44px;
}
/* .mobile-hd .mobile-hd-logo img {
  display: block;
  width: 100%;
  height: 100%;
} */
.mobile-hd .mobile-hd-nav {
  flex: 1;
  overflow: auto;
}
.mobile-hd .mobile-hd-nav .mobile-hd-nav-main {
  white-space: nowrap;
  line-height: 44px;
  margin-left: 5px;
}
.mobile-hd .mobile-hd-nav .mobile-hd-nav-main li {
  display: inline-block;
  padding: 0 10px;
}
.mobile-hd .mobile-hd-nav .mobile-hd-nav-main li.sel {
  background: #dcdee2;
}
.mobile-hd .mobile-hd-nav .mobile-hd-nav-main li a {
  display: block;
  font-size: 14px;
  color:#515a6e;
}
.mobile-diary {
  margin: 0 5px;
  margin-top: 50px;
}
.ivu-list-item-action {
  display: flex;
  align-items: center;
}
.ivu-list-item-action>li {
  /* font-size: 12px; */
  white-space: nowrap;
}
</style>
