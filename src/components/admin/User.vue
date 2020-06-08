<template>
  <Row>
    <Row>
        <i-col span="24" style="text-align: left;display: flex;justify-content: space-between;" v-if="power==0">
          <Button type="primary" @click="addUser" style="margin-bottom: 12px">添加</Button>
          <Input search enter-button
            v-model="keywords"
            @on-search="query(curPage, pageSize)"
            style="width:220px;"
            placeholder="请输入用户名" />
        </i-col>
    </Row>
    <div class="loading" v-if="isShow">
      <Spin>
        <Icon type="ios-loading" size="24" color="#17233d" class="demo-spin-icon-load" />
      </Spin>
    </div>
    <div v-else>
      <Row>
        <i-col span="24">
          <Table border :columns="columns" :data="data">
            <template slot-scope="{ row, index }" slot="power">
              <span v-if="data[index].power==0">默认管理员</span>
              <span v-else>普通管理员</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button
                  type="primary"
                  size="small"
                  style="margin-right: 5px"
                  v-if="power==0||data[index].username==username"
                  @click="edit(index)">
                  <Icon type="ios-create-outline" size="18" />
                </Button>
                <Button size="small" disabled v-else>
                  <Icon type="ios-create-outline" size="18" />
                </Button>
                <Button
                  type="error"
                  size="small"
                  v-if="power==0"
                  @click="remove(index)">
                  <Icon type="ios-trash-outline" size="18" />
                </Button>
                <Button size="small" disabled v-else>
                  <Icon type="ios-trash-outline" size="18" />
                </Button>
            </template>
          </Table>
        </i-col>
      </Row>
      <Row>
        <i-col span="24">
          <Page :total="totalCount" :current.sync="curPage" :page-size="pageSize"  show-total @on-change="page"/>
        </i-col>
      </Row>
    </div>

    <Modal
        v-model="modal"
        @on-ok="ok"
        @on-cancel="cancel">
        <p>是否确定删除？</p>
    </Modal>
    <Modal
        v-model="modal1"
        :title="ModalTitle"
        @on-ok="asyncOK"
        @on-cancel="asyncCancel"
        :loading="loading"
        :mask-closable="false">
      <Form ref="formInline">
        <FormItem prop="username" v-show="formStatus=='add'">
            <i-input type="text" clearable v-model="formInline.username" placeholder="请输入用户名">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
        </FormItem>
        <FormItem prop="username" v-show="formStatus=='edit'">
            <i-input type="text" clearable v-model="formInline.username" placeholder="请输入用户名" disabled>
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
        </FormItem>
        <FormItem prop="password">
            <i-input type="password" clearable v-model="formInline.password" placeholder="请输入密码">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </i-input>
        </FormItem>
        <FormItem prop="repassword">
            <i-input type="password" clearable v-model="formInline.repassword" placeholder="请再次输入密码">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </i-input>
        </FormItem>
      </Form>
    </Modal>
  </Row>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default{
  name: 'User',
  data () {
    return {
      show: false,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '权限',
          slot: 'power'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data: [],
      idx: '',
      modal: false,
      modalMsg: '',
      modal1: false,
      formInline: {
        username: '',
        password: '',
        repassword: ''
      },
      loading: true,
      ModalTitle: '',
      formStatus: '',
      curPage: 1,
      totalCount: 0,
      // totalPages: 10,
      pageSize: 5,
      username: '',
      power: '',
      keywords: '',
      isShow: true
    }
  },
  watch: {
    keywords () {
      this.query(this.curPage, this.pageSize)
    }
  },
  mounted () {
    this.query(this.curPage, this.pageSize)
  },
  methods: {
    query (curPage, pageSize) {
      var url = '/admin/User_Query.php'
      var param = {
        'page': curPage,
        'pageSize': pageSize,
        'keywords': this.keywords
      }
      axios.post(url, qs.stringify(param)).then(res => {
        // console.log(res.data)
        this.data = res.data.data
        this.totalCount = Number(res.data.total)
        this.username = res.data.username
        this.power = res.data.power
      }).finally(() => {
        setTimeout(() => {
          this.isShow = false
        }, 200)
      })
    },
    // 添加新用户
    addUser () {
      this.ModalTitle = '添加用户'
      this.formStatus = 'add'
      this.modal1 = true
    },
    // 点击编辑
    edit (index) {
      this.formInline.username = this.data[index].username
      this.idx = index
      this.ModalTitle = '修改密码'
      this.modal1 = true
      this.formStatus = 'edit'
    },
    // 点击删除
    remove (index) {
      this.modal = true
      this.idx = index
    },
    // 提示框确定
    ok () {
      var url = '/admin/User_Delete.php'
      var param = {
        'id': this.data[this.idx].id
      }
      axios.post(url, qs.stringify(param)).then(res => {
        // console.log(res.data)
        if (res.data.code === 200 && res.data.message === 'OK') {
          this.$Message.success('删除用户成功')
          this.query(this.curPage, this.pageSize)
        } else {
          this.$Message.success(res.data.message)
        }
      })
    },
    // 提示框取消
    cancel () {
      // this.$Message.info('Clicked cancel')
    },
    // 确定
    asyncOK () {
      if (this.formStatus === 'edit') {
        this.editFun()
      }
      if (this.formStatus === 'add') {
        this.addFun()
      }
    },
    // 修改密码框取消
    asyncCancel () {
      this.formInline.password = ''
      this.formInline.repassword = ''
      this.loading = true
    },
    // 修改密码
    editFun () {
      if (this.formInline.password === '' || this.formInline.repassword === '') {
        setTimeout(() => {
          this.$Message.warning('密码不为空！')
          this.loading = false
        }, 500)
        setTimeout(() => {
          this.loading = true
        }, 1000)
      } else if (this.formInline.password !== this.formInline.repassword) {
        this.$Message.warning('密码不一致！')
        setTimeout(() => {
          this.loading = false
        }, 500)
        setTimeout(() => {
          this.loading = true
        }, 1000)
      } else {
        var url = '/admin/User_Update.php'
        var param = {
          'id': this.data[this.idx].id,
          'password': this.formInline.password
        }
        axios.post(url, qs.stringify(param)).then(res => {
          // console.log(res.data)
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.$Message.success('修改密码成功')
          } else {
            this.$Message.success('修改密码失败')
          }
        })
        this.modal1 = false
        this.formInline.password = ''
        this.formInline.repassword = ''
      }
    },
    addFun () {
      if (this.formInline.username === '' || this.formInline.password === '' || this.formInline.repassword === '') {
        setTimeout(() => {
          this.$Message.warning('用户名或密码不为空！')
          this.loading = false
        }, 500)
        setTimeout(() => {
          this.loading = true
        }, 1000)
      } else if (this.formInline.password !== this.formInline.repassword) {
        this.$Message.warning('密码不一致！')
        setTimeout(() => {
          this.loading = false
        }, 500)
        setTimeout(() => {
          this.loading = true
        }, 1000)
      } else {
        var url = '/admin/User_Insert.php'
        var param = {
          'username': this.formInline.username,
          'password': this.formInline.password
        }
        axios.post(url, qs.stringify(param)).then(res => {
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.$Message.success('添加用户成功')
          } else {
            this.$Message.success(res.data.message)
          }
          this.modal1 = false
          this.formInline.username = ''
          this.formInline.password = ''
          this.formInline.repassword = ''
          this.query(this.curPage, this.pageSize)
        })
      }
    },
    page (index) {
      // console.log(index)
      this.query(index, this.pageSize)
    }
  }
}
</script>

<style scoped>

</style>
