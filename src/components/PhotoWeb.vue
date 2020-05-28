<template>
  <div class="photo">
    <div class="content">
      <Card>
        <div slot="title">
          <h2>照片墙</h2>
        </div>
        <template v-if="photoList.length===0">
          <div class="list-null" >
            <Icon type="ios-information-circle" size="34" />
            <p>暂无图片</p>
          </div>
        </template>
        <template v-else>
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
                <img :src="'http://'+it.url" alt="">
              </li>
            </ul>
          </div>
        </template>
      </Card>
    </div>
    <div class="pop" v-show="photoDetail">
      <div class="carousel">
        <div class="close" @click="closePhoto">
          <Icon type="ios-close-circle-outline" size="36" />
        </div>
        <div class="carousel-main">
          <a :href="'http://'+photo.url" title="查看大图" target="_blank">
            <img :src="'http://'+photo.url" alt="">
          </a>
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
      photo: ''
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
    })
  },
  methods: {
    queryPhoto (labelKey) {
      var url = 'web/Photo_Query.php'
      var param = {
        'labelKey': labelKey
      }
      axios.post(url, qs.stringify(param)).then(res => {
        // console.log(res.data)
        this.cacheList = res.data.data
      })
    },
    photoFun (params) {
      this.photo = params
      this.photoDetail = true
    },
    closePhoto () {
      this.photoDetail = false
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
  overflow: hidden;
  position: relative;
  cursor: pointer;
}
.list .list-con li img {
  position: absolute;
  left: 50%;
  top: 50%;
  min-width: 217px;
  height: 217px;
  transform: translate(-50%,-50%);
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
  background: #000;
}
.pop .carousel .carousel-main a {
  display: block;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pop .carousel .carousel-main img {
  display: block;
  max-height: 100%;
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
</style>
