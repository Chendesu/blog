<template>
  <div>
    <Row v-show="status=='query'">
      <Row>
        <i-col span="24" style="text-align: left;display: flex;justify-content: space-between;">
          <Button type="primary" @click="addDiaryBtn" style="margin-bottom: 12px">添加</Button>
          <Input search enter-button
            v-model="keywords"
            @on-search="query(curPage, pageSize)"
            style="width:220px;"
            placeholder="请输入文章标题" />
        </i-col>
      </Row>
      <Row>
        <i-col span="24">
          <Table border :columns="columns" :data="data">
            <template slot-scope="{ row, index }" slot="action">
              <Button
                type="primary"
                size="small"
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
                v-if="power==0||data[index].username==username"
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
          <Page :total="totalCount" :current.sync="curPage" :page-size="pageSize"  show-total @on-change="page" style="margin-top:24px" />
        </i-col>
      </Row>
    </Row>
    <Row v-show="status=='add'||status=='edit'">
      <Card>
        <h2 slot="title">
           <Icon type="ios-add-circle" />
            {{header}}
        </h2>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="标题：" prop="title">
                <!-- <i-input v-model="formValidate.title" placeholder="请输入文章标题"></i-input> -->
                <i-input v-model="formValidate.title" placeholder="请输入文章标题,最多30个字"  />
            </FormItem>
            <FormItem label="标签：" prop="label">
                <RadioGroup v-model="formValidate.label" @on-change="labelFun">
                    <Radio v-for="item in labelGroup" :label="item.label" :key="item.id">{{item.label}}</Radio>
                    <Radio label="other">other</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem v-show="addLabelStatus">
              <i-col span="6">
                    <i-input type="text" v-model="newLabel" placeholder="请输入标签名"></i-input>
                </i-col>
                <i-col span="4" offset="1">
                    <Button type="primary" @click="addLabel">添加</Button>
                </i-col>
            </FormItem>
            <FormItem label="内容：" prop="content">
                <div id="editor">
                </div>
            </FormItem>
            <FormItem v-show="status=='edit'" label="作者：">
                {{formValidate.username}}
            </FormItem>
            <FormItem v-show="status=='edit'" label="时间：">
                {{formValidate.time}}
            </FormItem>
            <FormItem style="text-align:center">
                <Button type="error" @click="cancelDiary">取消</Button>
                <Button type="success" @click="handleSubmit('formValidate')">提交</Button>
                <Button v-show="status=='add'" @click="handleReset('formValidate')">重置</Button>
            </FormItem>
        </Form>

      </Card>
    </Row>
    <Modal
        v-model="modal"
        @on-ok="ok">
        <p>是否确定删除？</p>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import E from 'wangeditor'
let editor = new E('#editor')
editor.customConfig.uploadImgShowBase64 = true
editor.customConfig.showLinkImg = false
export default{
  name: 'Dairy',
  data () {
    const validateEditor = (rule, value, callback) => {
      if (editor.txt.text() === '') {
        return callback(new Error('文章内容不为空'))
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
          title: '标题',
          key: 'title'
        },
        {
          title: '作者',
          key: 'username'
        },
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '浏览量',
          key: 'read'
        },
        {
          title: '标签',
          key: 'label'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data: [],
      formValidate: {
        title: '',
        content: '',
        label: '',
        newLabel: '',
        username: '',
        time: ''
      },
      labelGroup: [],
      addLabelStatus: false,
      newLabel: '',
      ruleValidate: {
        title: [
          { required: true, message: '文章标题不为空', trigger: 'blur' }
        ],
        content: [
          { required: true, validator: validateEditor, trigger: 'blur' }
        ],
        label: [
          { required: true, message: '请选择一个标签', trigger: 'change' }
        ]
      },
      modal: false,
      idx: '',
      curPage: 1,
      totalCount: 0,
      pageSize: 5,
      status: 'query',
      username: '',
      power: '',
      keywords: ''
    }
  },
  watch: {
    keywords () {
      this.query(this.curPage, this.pageSize)
    }
  },
  mounted () {
    this.query(this.curPage, this.pageSize)
    editor.create()
    this.queryLabel()
  },
  methods: {
    query (curPage, pageSize) {
      var url = '/admin/Diary_Query.php'
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
      })
    },
    insert () {
      var url = '/admin/Diary_Insert.php'
      var param = {
        'title': this.formValidate.title,
        'label': this.formValidate.label,
        'content': editor.txt.html()
      }
      console.log(editor.txt.html())

      axios.post(url, qs.stringify(param))
        .then(res => {
          console.log(res.data)
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.$Message.success('添加成功')
            this.query(this.curPage, this.pageSize)
            this.status = 'query'
            this.formValidate.title = ''
            this.formValidate.label = ''
            editor.txt.html('')
          } else {
            this.$Message.error('为什么失败')
          }
        })
    },
    update () {
      var url = '/admin/Diary_Update.php'
      var param = {
        'id': this.data[this.idx].id,
        'title': this.formValidate.title,
        'label': this.formValidate.label,
        'content': editor.txt.html()
      }
      axios.post(url, qs.stringify(param))
        .then(res => {
          // console.log(res.data)
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.$Message.success('修改成功')
            this.query(this.curPage, this.pageSize)
            this.status = 'query'
            this.formValidate.title = ''
            this.formValidate.label = ''
            editor.txt.html('')
          } else {
            this.$Message.error(res.data.message)
          }
        })
    },
    page (index) {
      this.query(index, this.pageSize)
    },
    addDiaryBtn () {
      this.status = 'add'
      this.header = '添加日志'
    },
    cancelDiary () {
      this.status = 'query'
      this.formValidate.title = ''
      this.formValidate.label = ''
      editor.txt.html('')
    },
    handleSubmit (name) {
      if (this.formValidate.label === 'other') {
        this.$Message.error('请输入标签名并点击添加!')
        return
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.status === 'add') {
            this.insert()
          }
          if (this.status === 'edit') {
            this.update()
          }
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    queryLabel () {
      var url = '/admin/Label_Query.php'
      axios.post(url).then(res => {
        // console.log(res.data)
        this.labelGroup = res.data.data
      })
    },
    labelFun (val) {
      this.formValidate.label = val
      if (val === 'other') {
        this.addLabelStatus = true
      } else {
        this.addLabelStatus = false
      }
    },
    addLabel () {
      if (this.newLabel === '') {
        this.$Message.error('请输入标签名!')
      } else if (this.newLabel === 'other') {
        this.$Message.error('标签名已存在，请重新输入!')
      } else {
        var url = '/admin/Label_Insert.php'
        var param = {
          'label': this.newLabel,
          'username': this.username
        }
        axios.post(url, qs.stringify(param))
          .then(res => {
            // console.log(res.data)
            if (res.data.code === 200 && res.data.message === 'OK') {
              this.$Message.success('添加成功')
              this.formValidate.label = this.newLabel
              this.addLabelStatus = false
              this.queryLabel()
            } else {
              this.$Message.error(res.data.message)
            }
          })
      }
    },
    edit (index) {
      this.header = '修改日志'
      this.idx = index
      this.formValidate.title = this.data[index].title
      this.formValidate.label = this.data[index].label
      this.formValidate.content = this.data[index].content
      this.formValidate.username = this.data[index].username
      this.formValidate.time = this.data[index].time
      editor.txt.html(this.formValidate.content)
      this.status = 'edit'
    },
    remove (index) {
      this.modal = true
      this.idx = index
    },
    ok () {
      var url = '/admin/Diary_Delete.php'
      var param = {'id': this.data[this.idx].id}
      axios.post(url, qs.stringify(param))
        .then(res => {
          // console.log(res.data)
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.$Message.success('删除成功')
            this.query(this.curPage, this.pageSize)
          } else {
            this.$Message.error(res.data.message)
          }
        })
    }

  }
}
</script>

<style scoped>

</style>
