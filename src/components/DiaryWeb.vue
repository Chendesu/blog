<template>
  <div class="main">
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
        <!-- <router-view :key="labelKey" /> -->
        <div slot="extra" style="display:flex;justity-content:flex-end;">
          <Input search enter-button
            v-model="labelKey"
            style="width:220px;"
            @on-search="searchFun"
            placeholder="请输入文章标题" />
        </div>
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
      </Card>
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
      keywords: ''
    }
  },
  // watch: {
  //   labelKey () {
  //     this.searchFun()
  //   }
  // },
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
      this.curPage = 1
      if (index === 'all') {
        this.labelKey = ''
      } else {
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
      })
    },
    page (index) {
      this.queryDiary(this.curPage, this.pageSize, this.labelKey)
    },
    goDetail (id) {
      this.$router.push({
        name: 'DiaryWebDetail',
        params: {
          id: id
        }
      })
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

</style>
