<template>
  <div class="login">
    <div class="login-bg"></div>
    <Card style="width:350px">
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="user">
                <i-input type="text" clearable v-model="formInline.user" placeholder="Username">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </i-input>
            </FormItem>
            <FormItem prop="password">
                <i-input type="password" clearable v-model="formInline.password" placeholder="Password">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </i-input>
            </FormItem>
            <FormItem>
                <Button type="success" long @click="handleSubmit('formInline')">登录</Button>
            </FormItem>
        </Form>
        <a @click="$goRoute('/')">返回首页</a>
      </Card>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'Login',
  data () {
    return {
      formInline: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      var url = '/admin/login.php'
      var param = {
        'username': this.formInline.user,
        'password': this.formInline.password
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          axios.post(url, qs.stringify(param))
            .then(res => {
              // console.log(res.data)
              if (res.data.code === 200) {
                if (res.data.message === 'OK') {
                  this.$store.commit('saveusername', res.data.username)
                  this.$store.commit('savepower', res.data.power)
                  sessionStorage.setItem('state', JSON.stringify(this.$store.state))
                  // sessionStorage.setItem('state',)
                  // console.log(this.$store.state.username)
                  // console.log(this.$store.state.power)
                  this.$router.replace({path: '/home'})
                } else {
                  this.$Message.error('用户名或密码错误')
                }
              } else {
                this.$Message.error(res.data.message)
              }
            })
            .catch(error => {
              this.$Message.error('网络连接失败')
            })

          // this.$Message.success('Success!')
        } else {
          this.$Message.error('用户名或密码不为空')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: #17233d; */
  background: url(../../assets/bg.jpg) 0 0;
  background-size: auto 100%;
}
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.7;
}
</style>
