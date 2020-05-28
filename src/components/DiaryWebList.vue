<template>
  <div>
    <!-- <h2>列表页</h2> -->
    <List v-show="diaryList.length>0" item-layout="vertical">
      <ListItem v-for="(item) in diaryList" :key="item.id">
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
          <li @click="goDetail(item.id)">
              查看
          </li>
          <li><Icon type="md-pricetag" />{{item.label}}</li>
        </template>
      </ListItem>
    </List>
    <div class="null" v-show="diaryList.length==0">
      <Icon type="ios-information-circle" size="24" />
      <p>暂无文章</p>
    </div>
    <Page :total="totalCount" :current.sync="curPage" :page-size="pageSize"  show-total @on-change="page" style="margin-top:24px" />
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'DiaryWebList',
  data () {
    return {
      diaryList: [],
      curPage: 1,
      totalCount: 0,
      pageSize: 10,
      labelKey: ''
    }
  },
  watch: {
    $route (to, from) {
      // console.log(to, from)
    }
  },
  created () {
    this.labelKey = this.$route.query.labelKey
    this.queryDiary(this.curPage, this.pageSize, this.labelKey)
  },
  mounted () {
    // console.log(this.$route.query.labelKey)
    this.that = this
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
    page (index) {
      this.queryDiary(this.curPage, this.pageSize, this.labelKey)
    },
    goDetail (id) {
      console.log(id)
      // console.log(this.$router)
      this.$router.push({
        name: 'DiaryWebDetail',
        params: {
          id: id
        }
      })
    }
  }
}
</script>
<style scoped>
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
.ivu-list-vertical .ivu-list-item-action {
  text-align: right;
}
</style>
