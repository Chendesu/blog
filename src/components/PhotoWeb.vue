<template>
<div>
  <div class="photo" v-show="mobile==false">
    <div class="content">
      <Card>
        <div slot="title">
          <h2>照片墙</h2>
        </div>
        <div class="loading" v-if="isShow">
          <Spin>
            <Icon type="ios-loading" size="24" color="#17233d" class="demo-spin-icon-load" />
          </Spin>
        </div>
        <div v-else>
          <div class="list-null" v-if="photoList.length===0">
            <Icon type="ios-information-circle" size="34" />
            <p>暂无图片</p>
          </div>
          <div v-else>
            <div class="list" v-for="(item,index) in photoList" :key="index" v-show="item.list.length>0">
              <div class="list-hd">
                <Icon :type="item.icon" size="16" />
                <h3>{{item.label}}</h3>
              </div>
              <ul class="list-con">
                <li
                  v-for="(it, i) in item.list"
                  :key="i"
                  @click="photoFun(it)">
                  <div class="img">
                    <img :src="'http://'+it.url" alt="">
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <div class="pop" v-show="photoDetail">
      <div class="carousel">
        <div class="close" @click="closePhoto">
          <Icon type="ios-close-circle-outline" size="36" />
        </div>
        <div class="carousel-main">
          <a :class="['img', {'img-scale':isScale===true}]">
            <img :src="'http://'+photo.url" alt="">
          </a>
          <div class="carousel-main-ft">
            <a
              title="放大图片"
              class="carousel-main-ft-btn scale"
              @click="scaleFun">
              <!-- <Icon type="ios-expand" size="24" /> -->
              <Icon type="md-resize" size="24" />
            </a>
            <a title="查看原图" class="carousel-main-ft-btn origin" :href="'http://'+photo.url" target="_blank">
              <Icon type="md-expand" size="24" />
            </a>
          </div>
        </div>
        <!-- <div class="carousel-right"> -->
          <Card class="carousel-right">
            <div slot="title" class="photo-tit">
              <h3>{{photo.title}}</h3>
              <span>上传于{{photo.time}}</span>
            </div>
            <div class="photo-con">{{photo.content}}</div>
            <div class="photo-info">
              <span>
                <Icon type="md-person" />
                {{photo.username}}
              </span>
              <span>
                <Icon type="md-pricetag" />
                {{photo.label}}
              </span>
            </div>
          </Card>
        <!-- </div> -->
      </div>
    </div>
  </div>
  <div class="mobile-photo" v-show="mobile==true">
    <div class="mobile-photo-hd">
      <span class="mobile-photo-hd-back" @click="$goRoute('/DiaryWeb')" >
        <Icon type="ios-home" size="24" />
      </span>
    </div>
    <div class="mobile-photo-content">
      <Card>
        <div slot="title">
          <h2 style="text-align:center;">照片墙</h2>
        </div>
        <div class="loading" v-if="isShow">
          <Spin>
            <Icon type="ios-loading" size="24" color="#17233d" class="demo-spin-icon-load" />
          </Spin>
        </div>
        <div v-else>
          <div class="list-null" v-if="mobileList.length===0">
            <Icon type="ios-information-circle" size="34" />
            <p>暂无图片</p>
          </div>
          <ul v-else class="mobile-photo-list">
            <li v-for="(item,index) in mobileList" :key="index">
              <div class="img-box">
                <div class="img">
                  <img :src="'http://'+item.url" preview :preview-text="item.title" />
                </div>
              </div>
              <div class="img-info">
                <h3>{{item.title}}</h3>
                <p>{{item.content}}</p>
                <div class="img-info-user">
                  <span style="text-align:right;">
                    <Icon type="md-pricetag" />
                    {{item.label}}
                  </span>
                  <span style="text-align:right;">
                    <Icon type="md-person" />
                    {{item.username}}
                  </span>
                </div>
                <span class="time">
                  上传于
                  {{item.time}}
                </span>
              </div>
            </li>
          </ul>
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
  name: 'PhotoWeb',
  data () {
    return {
      navList: [],
      scrollTop: 0,
      photoList: [],
      photoDetail: false,
      photo: '',
      mobile: false,
      mobileList: [],
      isShow: true,
      isScale: false
    }
  },
  created () {
    let w = document.documentElement.offsetWidth || document.body.offsetWidth
    if (w < 1024) {
      this.mobile = true
      this.queryPhoto('')
    }
  },
  mounted () {
    var url = '/admin/Label_Query.php'
    axios.post(url).then(res => {
      // console.log(res.data)
      if (res.data.code === 200 && res.data.message === 'OK') {
        this.navList = res.data.data
        for (let x of this.navList) {
          var p = {'labelKey': x.label}
          axios.post('web/Photo_Query.php', qs.stringify(p)).then(res2 => {
            var obj = {
              'label': x.label,
              'icon': x.icon,
              'list': res2.data.data
            }
            this.photoList.push(obj)
          })
        }
      }
    }).finally(() => {
      setTimeout(() => {
        this.isShow = false
      }, 200)
    })
  },
  methods: {
    scaleFun () {
      this.isScale = !this.isScale
    },
    // 移动端
    queryPhoto (labelKey) {
      var url = 'web/Photo_Query.php'
      var param = {
        'labelKey': labelKey
      }
      axios.post(url, qs.stringify(param)).then(res => {
        console.log(res.data)
        this.mobileList = res.data.data
      }).finally(() => {
        setTimeout(() => {
          this.isShow = false
        }, 200)
      })
    },
    photoFun (params) {
      this.photo = params
      this.photoDetail = true
    },
    closePhoto () {
      this.photoDetail = false
      this.isScale = false
    }
  }
}
</script>
<style scoped>
ul,li {
  margin: 0;
  padding: 0;
  list-style: none;
}
.content {
  margin-left: 10px;
}
.list {
  padding-bottom: 36px;
  margin-bottom: 15px;
  border-bottom: 1px solid #f2f2f5;
}
.list .list-hd {
  display: flex;
  height: 36px;
  align-items: center;
  margin-bottom: 5px;
  /* border-bottom: 1px solid #f2f2f5; */
}
.list .list-hd h3 {
  font-size: 14px;
}
.list .list-con {
    display: flex;
    flex-wrap: wrap;
}
.list .list-con li {
  width: 217px;
  height: 217px;
  margin: 5px 5px 0;
  padding: 5px;
  border: 1px solid #e8eaec;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
}
.list .list-con li .img {
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.list .list-con li img {
  /* position: absolute;
  left: 50%;
  top: 50%;
  min-width: 217px;
  height: 217px;
  transform: translate(-50%,-50%); */
  display: block;
  width: 100%;
}
.list-null {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pop {
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.75);
  z-index: 100;
}
.pop .carousel {
  /* overflow: hidden; */
  position:absolute;
  top: 50%;
  left: 50%;
  width: 1000px;
  height: 500px;
  /* border-radius: 5px; */
  transform:translate(-50%, -50%);
  display: flex;
}
.pop .carousel .carousel-main {
  overflow: hidden;
  width: 760px;
  height: 500px;
  /* padding: 8px; */
  background: #000;
  box-sizing: border-box;
  position: relative;
}
.pop .carousel .carousel-main .carousel-main-ft {
  position: absolute;
  left: 0;
  bottom: -40px;
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.pop .carousel .carousel-main:hover .carousel-main-ft {
  bottom: 0;
}
.pop .carousel .carousel-main .carousel-main-ft .carousel-main-ft-btn {
  display: inline-block;
  margin: 0 10px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
}
.pop .carousel .carousel-main .img {
  overflow: auto;
  display: block;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pop .carousel .carousel-main .img.img-scale {
  display: block;
}
.pop .carousel .carousel-main img {
  display: block;
  max-height: 100%;
}
.pop .carousel .carousel-main .img.img-scale img {
  display: block;
  width: 100%;
  max-height: none;

}
.pop .carousel .carousel-right {
  flex: 1;
  background: #fff;
}
.close {
  position:absolute;
  top: -17px;
  right: -17px;
  width: 34px;
  height: 34px;
  border: 1px solid #000;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.photo-tit h3 {
  font-size: 17px;
  margin-bottom: 10px;
}
.photo-tit span {
  display: block;
  font-size: 12px;
  color: #808695;
  text-align: right;
}
.photo-con {
  overflow: auto;
  max-height: 350px;
  padding: 5px;
  margin-bottom: 15px;
  border-radius: 3px;
  background: #e8eaec;
}
.photo-info {
  display: flex;
  justify-content: space-between;
  color: #808695;
}
.mobile-photo-hd {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 44px;
  padding: 0 10px;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0 2px 5px #17233d;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.mobile-photo-hd  .mobile-photo-hd-back {
  display: inline-block;
}
.mobile-photo-content {
  margin: 0 5px;
  margin-top: 50px;

}
.mobile-photo-list {
  -moz-column-count:2; /* Firefox */
  -webkit-column-count:2; /* Safari 和 Chrome */
  column-count:2;
  -moz-column-gap: 5px;
  -webkit-column-gap: 5px;
  column-gap: 5px;
  margin:5px auto;
}
.mobile-photo-list li {
  padding: 3px;
  overflow: hidden;
  margin-bottom: 5px;
  -moz-page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
  break-inside: avoid;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0,0,0,0.4);
}
.mobile-photo-list li .img-box {
  overflow: hidden;
  max-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mobile-photo-list li .img {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.mobile-photo-list li img {
  display: block;
  width: 100%;
}
.mobile-photo-list li .img-info {
  padding: 4px;
}
.mobile-photo-list li .img-info h3 {
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 1.2;
}
.mobile-photo-list li .img-info p {
  font-size: 12px;
  color: #808695;
  line-height: 1.2;
  text-indent: 2em;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8eaec;
  margin-bottom: 15px;
}
.mobile-photo-list li .img-info .img-info-user {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #808695;
}
.mobile-photo-list li .img-info .time {
  display: block;
  font-size: 12px;
  text-align:right;
  white-space: nowrap;
  transform: scale(0.9);
}
</style>
