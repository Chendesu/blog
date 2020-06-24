<template>
    <div class="layout">
        <Layout>
            <Header :style="{position: 'fixed', width: '100%',boxShadow: '0 2px 2px #363e4f',zIndex: '10'}">
                <div class="layout-logo">
                  <img src="../../assets/logo.png" alt="">
                </div>
                <div class="demo-avatar">
                    <Avatar icon="ios-person" size="large" />
                    <div class="name">欢迎您，{{username}}</div>
                    <div class="name loginout" @click="loginOut">退出</div>
                </div>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{position: 'fixed', height: '100vh', left: 0, top: '64px', overflow: 'auto'}">
                    <Menu :active-name="path" :theme="theme" width="auto">
                      <MenuItem name="1" @click.native="$goRoute({name: 'User'})">
                          <Icon type="md-contact" />
                          用户管理
                      </MenuItem>
                      <MenuItem name="2" @click.native="$goRoute({name: 'Diary'})">
                          <Icon type="md-document" />
                          文章管理
                      </MenuItem>
                      <MenuItem name="3" @click.native="$goRoute({name: 'Photo'})">
                          <Icon type="md-image" />
                          相册管理
                      </MenuItem>
                      <MenuItem name="4" @click.native="$goRoute({name: 'Label'})">
                          <Icon type="md-pricetags" />
                          标签管理
                      </MenuItem>
                    </Menu>
                </Sider>
                <Layout :style="{marginLeft: '200px',marginTop: '90px', padding: '0 24px 24px'}">
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                        <router-view />
                    </Content>
                    <Footer class="layout-footer-center">Copyright ©2019 ajiuya.cn All Rights Reserved. 闽ICP备19022956号</Footer>
                </Layout>
            </Layout>
        </Layout>

        <Modal
        v-model="modal"
        @on-ok="ok"
        @on-cancel="cancel">
        <p>是否确定退出登录？</p>
    </Modal>
    </div>

</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      theme: 'dark',
      path: '1',
      modal: false,
      username: ''
    }
  },
  mounted: function () {
    // this.$router.push({path: '/User'})
    this.username = this.$store.state.username
    // console.log(this.$store.state.username)
    // console.log(this.$store.state.power)
  },
  methods: {
    loginOut () {
      this.modal = true
    },
    ok () {
      this.$router.push({path: '/'})
    },
    cancel () {

    }
  }
}
</script>

<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    float: left;
    position: relative;
    top: 50%;
    left: 20px;
    width: 150px;
    height: 50px;
    text-align: center;
    background: #fff;
    border-radius: 3px;
    transform: translateY(-50%);
}
.layout-logo img {
  display: inline-block;
  height: 100%;
}
.demo-avatar {
  float: right;
  display: flex;
  align-items: center;
  color: rgba(255,255,255,.7);
}
.demo-avatar .name {
  margin: 0 10px;
  cursor: pointer;
}
.demo-avatar .name.loginout:hover {
    color: rgba(255,255,255,1);
}
</style>
