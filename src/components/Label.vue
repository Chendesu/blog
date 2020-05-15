<template>
<div>
  <Row>
    <Row>
      <i-col span="24" style="text-align: left">
        <Button type="primary" @click="addBtn" style="margin-bottom: 12px">添加</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="24">
        <Table border :columns="columns" :data="data">
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
  <Modal
      v-model="modal"
      @on-ok="ok">
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
        <FormItem label="添加者" prop="username">
            <i-input type="text" disabled clearable v-model="formInline.username" placeholder="添加者">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
        </FormItem>
        <FormItem prop="label">
            <i-input type="text" clearable v-model="formInline.label" placeholder="请输入标签名">
                <Icon type="ios-pricetag-outline" slot="prepend" />
            </i-input>
        </FormItem>
      </Form>
    </Modal>
</div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default{
  name: 'Label',
  data () {
    return {
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
      ModalTitle: '',
      formInline: {
        username: '',
        label: ''
      },
      loading: true,
      formStatus: '',
      idx: ''
    }
  },
  mounted () {
    this.queryLabel()
  },
  methods: {
    queryLabel () {
      var url = '/admin/Label_Query.php'
      axios.post(url).then(res => {
        // console.log(res.data)
        this.data = res.data.data
        this.username = res.data.username
        this.power = res.data.power
      })
    },
    insertLabel () {
      if (this.formInline.label === '') {
        setTimeout(() => {
          this.$Message.error('请输入标签名')
          this.loading = true
        }, 500)
        setTimeout(() => {
          this.loading = true
        }, 1000)
      } else {
        let url = '/admin/Label_Insert.php'
        let param = {
          'label': this.formInline.label,
          'username': this.formInline.username
        }
        axios.post(url, qs.stringify(param))
          .then(res => {
            // console.log(res.data)
            if (res.data.code === 200 && res.data.message === 'OK') {
              this.$Message.success('添加成功')
            } else {
              this.$Message.error(res.data.message)
            }
            this.modal1 = false
            this.formInline.label = ''
            this.queryLabel()
          })
      }
    },
    updateLabel () {
      if (this.formInline.label === '') {
        setTimeout(() => {
          this.$Message.error('请输入标签名')
          this.loading = true
        }, 500)
        setTimeout(() => {
          this.loading = true
        }, 1000)
      } else {
        let url = '/admin/Label_Update.php'
        let param = {
          'id': this.data[this.idx].id,
          'label': this.formInline.label
        }
        axios.post(url, qs.stringify(param))
          .then(res => {
            // console.log(res.data)
            if (res.data.code === 200 && res.data.message === 'OK') {
              this.$Message.success('修改成功')
              // this.queryLabel()
            } else {
              this.$Message.error(res.data.message)
            }
            this.modal1 = false
            this.formInline.label = ''
            this.queryLabel()
          })
      }
    },
    addBtn () {
      this.modal1 = true
      this.formStatus = 'add'
      this.formInline.username = this.username
      this.formInline.label = ''
    },
    edit (index) {
      this.idx = index
      this.modal1 = true
      this.formStatus = 'edit'
      this.formInline.username = this.data[index].username
      this.formInline.label = this.data[index].label
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
    asyncOK () {
      if (this.formStatus === 'add') {
        this.insertLabel()
      }
      if (this.formStatus === 'edit') {
        this.updateLabel()
      }
    },
    asyncCancel () {
      this.formInline.label = ''
    }
  }
}
</script>

<style scoped>

</style>
