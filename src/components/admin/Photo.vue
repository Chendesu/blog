<template>
<div>
  <Row v-show="status=='query'">
    <Row>
      <i-col span="24" style="text-align: left;display: flex;justify-content: space-between;">
        <Button
          type="primary"
          style="margin-bottom: 12px" @click="addBtn">添加</Button>
          <Input search enter-button
            v-model="keywords"
            @on-search="query(curPage, pageSize)"
            style="width:220px;"
            placeholder="请输入相册标题" />
      </i-col>
    </Row>
    <Row>
      <i-col>
        <Table border :columns="columns" :data="data">
          <template slot-scope="{row,index}" slot="url">
            <Button type="success" @click="previewImg(index)">预览</Button>
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
        <FormItem label="标题" prop="title">
            <i-input v-model="formValidate.title" placeholder="请输入文章标题"></i-input>
        </FormItem>
        <FormItem label="简介" prop="content">
          <i-input v-model="formValidate.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入简介"></i-input>
        </FormItem>
        <FormItem label="标签" prop="label">
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
        <FormItem label="图片" prop="img">
          <div class="upload">
            <input v-show="status==='add'" type="file" name="file" id="file" accept="image/jpg,image/jpeg,image/png,image/gif,image/svg" @change="chooseFile">
            <Icon v-if="cacheImg==''" type="ios-camera" size="20"></Icon>
            <img v-else :src="cacheImg" >
          </div>
          <p v-show="status==='add'" style="color: #aaa">提示：图片大小不超过4M</p>
          <p v-show="status==='edit'" style="color: #aaa">提示：图片不可修改</p>
        </FormItem>
        <FormItem v-show="status=='edit'" label="作者：">
            {{formValidate.username}}
        </FormItem>
        <FormItem v-show="status=='edit'" label="时间：">
            {{formValidate.time}}
        </FormItem>
        <FormItem style="text-align:center">
          <Button type="error" @click="cancelPhoto">取消</Button>
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
  <Modal v-model="modalImg">
      <img class="preview-img" :src="previewUrl" alt="">
  </Modal>

</div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default{
  name: 'Photo',
  data () {
    const validateFile = (rule, value, callback) => {
      if (this.file === '') {
        return callback(new Error('请选择图片'))
      } else {
        callback()
      }
    }
    return {
      username: '',
      power: '',
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
          title: '图片',
          // key: 'url'
          slot: 'url'
        },
        {
          title: '作者',
          key: 'username'
        },
        {
          title: '标签',
          key: 'label'
        },
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data: [],
      curPage: 1,
      totalCount: 0,
      pageSize: 5,
      status: 'query',
      formValidate: {
        title: '',
        content: '',
        label: '',
        newLabel: '',
        username: '',
        time: ''
      },
      ruleValidate: {
        title: [
          { required: true, message: '文章标题不为空', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '请选择一个标签', trigger: 'change' }
        ],
        img: [
          { required: true, validator: validateFile, trigger: 'change' }
        ]
      },
      header: '添加图片',
      labelGroup: [],
      addLabelStatus: false,
      newLabel: '',
      file: '',
      cacheImg: '',
      modal: false,
      idx: '',
      previewUrl: '',
      modalImg: false,
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
    this.queryLabel()
  },
  methods: {
    query (curPage, pageSize) {
      var url = '/admin/Photo_Query.php'
      var param = {
        'page': curPage,
        'pageSize': pageSize,
        'keywords': this.keywords
      }
      axios.post(url, qs.stringify(param))
        .then(res => {
          // console.log(res.data)
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.data = res.data.data
            this.totalCount = Number(res.data.total)
            this.username = res.data.username
            this.power = res.data.power
          }
        })
    },
    insert () {
      var url = '/admin/Photo_Insert.php'
      var formdata = new FormData()
      formdata.append('file', this.file)
      formdata.append('title', this.formValidate.title)
      formdata.append('content', this.formValidate.content)
      formdata.append('label', this.formValidate.label)
      axios.post(url, formdata)
        .then(res => {
          // console.log(res.data)
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.$Message.success('添加成功!')
            this.status = 'query'
            this.formValidate.title = ''
            this.formValidate.content = ''
            this.formValidate.label = ''
            this.cacheImg = ''
            this.file = ''
            this.query(this.curPage, this.pageSize)
          } else {
            this.$Message.error(res.data.message)
          }
        })
    },
    update () {
      var url = '/admin/Photo_Update.php'
      var param = {
        'id': this.data[this.idx].id,
        'title': this.formValidate.title,
        'content': this.formValidate.content,
        'label': this.formValidate.label
      }
      // console.log(param)
      axios.post(url, qs.stringify(param))
        .then(res => {
          // console.log(res.data)
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.$Message.success('更新成功')
            this.status = 'query'
            this.formValidate.title = ''
            this.formValidate.content = ''
            this.formValidate.label = ''
            this.cacheImg = ''
            this.file = ''
            this.query(this.curPage, this.pageSize)
          } else {
            this.$Message.error('更新失败')
          }
        })
    },
    page (index) {
      this.query(index, this.pageSize)
    },
    cancelPhoto () {
      this.status = 'query'
      this.formValidate.title = ''
      this.formValidate.content = ''
      this.formValidate.label = ''
      this.cacheImg = ''
      this.file = ''
    },
    handleSubmit (name) {
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
      this.cacheImg = ''
      this.file = ''
    },
    queryLabel () {
      var url = '/admin/Label_Query.php'
      axios.post(url).then(res => {
        // console.log(res.data)
        if (res.data.code === 200 && res.data.message === 'OK') {
          this.labelGroup = res.data.data
        }
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
    previewImg (index) {
      // 查询页图片预览
      this.modalImg = true
      this.previewUrl = 'http://' + this.data[index].url
      // console.log(this.previewUrl)
    },
    chooseFile (e) {
      var file = e.target.files[0]
      var maxSize = 4 * 1024 * 1024
      if (file.size > maxSize) {
        this.$Message.error('图片大小不超过4M')
      } else {
        this.file = file
        var reader = new FileReader()
        reader.readAsDataURL(file)
        var that = this
        reader.onload = function (evt) {
          that.cacheImg = evt.target.result
        }
      }
    },
    addBtn () {
      this.header = '添加图片'
      this.status = 'add'
      this.queryLabel()
    },
    edit (index) {
      this.header = '修改图片信息'
      this.idx = index
      this.status = 'edit'
      this.formValidate.title = this.data[index].title
      this.formValidate.content = this.data[index].content
      this.formValidate.label = this.data[index].label
      this.formValidate.username = this.data[index].username
      this.formValidate.time = this.data[index].time
      this.cacheImg = 'http://' + this.data[index].url
      this.file = 'http://' + this.data[index].url
    },
    remove (index) {
      this.modal = true
      this.idx = index
    },
    ok () {
      var url = 'admin/Photo_Delete.php'
      var param = {
        'id': this.data[this.idx].id,
        'url': this.data[this.idx].url
      }
      axios.post(url, qs.stringify(param))
        .then(res => {
          console.log(res.data)
          if (res.data.code === 200 && res.data.message === 'OK') {
            this.$Message.success('删除成功')
            this.query(this.curPage, this.pageSize)
          } else {
            this.$Message.error('删除失败')
          }
        })
    }
  }
}
</script>

<style scoped>
.upload {
  display: inline-block;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 160px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload img {
  display: block;
  height: 100%;
}
#file {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.preview-img {
  display: block;
  width: 100%;
}
</style>
