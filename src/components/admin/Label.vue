<template>
<div>
  <Row v-show="formStatus=='query'">
    <Row>
      <i-col span="24" style="text-align: left">
        <Button type="primary" @click="addBtn" style="margin-bottom: 12px">添加</Button>
      </i-col>
    </Row>
    <div class="loading" v-if="isShow">
      <Spin>
        <Icon type="ios-loading" size="24" color="#17233d" class="demo-spin-icon-load" />
      </Spin>
    </div>
    <Row v-else>
      <i-col span="24">
        <Table border :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="icon">
            <Icon :type="data[index].icon" size="24" />
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
              size="small"
              type="primary"
              v-if="power==0"
              @click="edit(index)">
              <Icon type="ios-create-outline" size="18" />
            </Button>
            <Button size="small" disabled v-else>
              <Icon type="ios-create-outline" size="18" />
            </Button>
            <Button
              size="small"
              type="error"
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
    <!-- <Row>
      <i-col span="24">
        <Page :total="totalCount" :current.sync="curPage" :page-size="pageSize"  show-total style="margin-top:24px" />
      </i-col>
    </Row> -->
    <!-- <p>清醒时做事</p>
    <p>糊涂时读书</p>
    <p>大怒时睡觉</p>
    <p>独处时思考</p> -->
  </Row>
  <Row v-show="formStatus=='add'||formStatus=='edit'">
    <Card>
      <h2 slot="title">
          <Icon type="ios-add-circle" />
          {{header}}
      </h2>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="添加者" prop="username">
            <i-input v-model="username" disabled></i-input>
        </FormItem>
        <FormItem label="标签名" prop="label">
            <i-input clearable v-model="formValidate.label" placeholder="请输入标签名"></i-input>
        </FormItem>
        <FormItem label="图标" prop="icon">
            <div class="icon-div" v-show="formValidate.icon!=''">
              <Icon :type="formValidate.icon" size="24" />
            </div>
            <Button type="primary" size="small" shape="circle" @click="addIconBtn">选择</Button>
        </FormItem>
        <FormItem style="text-align:center">
          <Button type="error" @click="cancelLabel">取消</Button>
          <Button type="success"  @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')">重置</Button>
        </FormItem>
      </Form>
    </Card>
  </Row>
  <Modal
      v-model="modal"
      @on-ok="ok">
      <p>是否确定删除？</p>
  </Modal>
  <Modal
      width="790"
      v-model="modal1"
      :title="ModalTitle"
      :closable="false">
      <!-- <div class="icon-search">
        <Input search placeholder="输入英文关键词搜索，如success" />
      </div> -->
      <div class="icons">
        <div class="icons-item" v-for="(item,index) in icons" :key="index" @click="chooseIcon(index)">
          <Icon :type="item.name" size="24" />
          <p>{{item.text}}</p>
        </div>
      </div>
  </Modal>
</div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default{
  name: 'Label',
  data () {
    const validateIcon = (rule, value, callback) => {
      if (this.formValidate.icon === '') {
        return callback(new Error('请选择图标'))
      } else {
        callback()
      }
    }
    return {
      header: '',
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '标签名',
          key: 'label'
        },
        {
          title: '图标',
          slot: 'icon'
        },
        {
          title: '作者',
          key: 'username'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data: [],
      // curPage: 1,
      // totalCount: 0,
      // pageSize: 5,
      username: '',
      power: '',
      modal: false,
      modal1: false,
      ModalTitle: '选择图标',
      formValidate: {
        label: '',
        icon: ''
      },
      ruleValidate: {
        label: [
          {required: true, message: '请输入标签名', trigger: 'blur'}
        ],
        icon: [
          {required: true, validator: validateIcon, trigger: 'change'}
        ]
      },
      loading: true,
      formStatus: 'query',
      idx: '',
      icons: [],
      isShow: true
    }
  },
  mounted () {
    this.queryLabel()
    axios.get('../../../static/icons.json').then(res => {
      // console.log(res.data)
      this.icons = res.data
    })
  },
  methods: {
    queryLabel () {
      var url = '/admin/Label_Query.php'
      axios.post(url).then(res => {
        // console.log(res.data)
        this.data = res.data.data
        this.username = res.data.username
        this.power = res.data.power
      }).finally(() => {
        setTimeout(() => {
          this.isShow = false
        }, 200)
      })
    },
    insertLabel () {
      let url = '/admin/Label_Insert.php'
      let param = {
        'label': this.formValidate.label,
        'username': this.formValidate.username,
        'icon': this.formValidate.icon
      }
      axios.post(url, qs.stringify(param))
        .then(res => {
          // console.log(res.data)
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.$Message.success('添加成功')
          } else {
            this.$Message.error(res.data.message)
          }
          this.formStatus = 'query'
          this.formValidate.label = ''
          this.queryLabel()
        })
    },
    updateLabel () {
      let url = '/admin/Label_Update.php'
      let param = {
        'id': this.data[this.idx].id,
        'label': this.formValidate.label,
        'icon': this.formValidate.icon
      }
      axios.post(url, qs.stringify(param))
        .then(res => {
          // console.log(res.data)
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.$Message.success('修改成功')
          } else {
            this.$Message.error(res.data.message)
          }
          this.formStatus = 'query'
          this.formValidate.label = ''
          this.queryLabel()
        })
    },
    addBtn () {
      this.header = '添加标签'
      this.formStatus = 'add'
      this.formValidate.username = this.username
      this.formValidate.label = ''
    },
    edit (index) {
      this.header = '修改标签'
      this.idx = index
      this.formStatus = 'edit'
      this.formValidate.username = this.data[index].username
      this.formValidate.label = this.data[index].label
      this.formValidate.icon = this.data[index].icon
    },
    remove (index) {
      this.modal = true
      this.idx = index
    },
    ok () {
      var url = '/admin/Label_Delete.php'
      var param = {'id': this.data[this.idx].id}
      axios.post(url, qs.stringify(param))
        .then(res => {
          // console.log(res.data)
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.$Message.success('删除标签成功')
            this.queryLabel()
          } else {
            this.$Message.error(res.data.message)
          }
        })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formStatus === 'add') {
            this.insertLabel()
          }
          if (this.formStatus === 'edit') {
            this.updateLabel()
          }
        } else {
          this.$Message.error('fail')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.formValidate.icon = ''
    },
    cancelLabel () {
      this.formStatus = 'query'
      this.formValidate.label = ''
      this.formValidate.icon = ''
    },
    addIconBtn () {
      this.modal1 = true
    },
    chooseIcon (index) {
      // console.log()
      this.formValidate.icon = this.icons[index].name
      this.modal1 = false
    }
  }
}
</script>

<style scoped>
.icon-div {
  width: 45px;
  height: 45px;
  border: 1px solid #e8eaec;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icons {
  overflow: hidden;
  zoom: 1;
}
.icons .icons-item {
  float: left;
  margin: 6px 6px 6px 0;
  width: 145px;
  text-align: center;
  list-style: none;
  cursor: pointer;
  /* height: 100px; */
  color: #5c6b77;
  transition: all .2s ease;
  position: relative;
  padding-top: 10px;
}
.icons .icons-item:hover {
  background: #e8eaec;
}
</style>
