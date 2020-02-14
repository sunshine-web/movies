//app.js
import store from './utils/store.js';
import http from './utils/http.js';
import api from './api/index.js';
import regeneratorRuntime from 'regenerator-runtime/index.js';
App({
  globalData: {
    BASEURL: "http://t.yushu.im",
    userInfo:null
  },
  onLaunch(){
    //拿到code 向我们自己的服务器发送请求 让自己的服务器去访问微信的服务器 换取openid
    // if(!wx.getStorageSync('uid')){
      if(!store.getItem("uid","userInfo")){
      wx.login({
        async success(res) {
          let code = res.code;

          let data = await http.post(api.getOpenId, {code})
          store.setItem("uid", data.uid, "userInfo")
          // wx.request({
          //   url: 'http://localhost:8080/wx_users/getOpenId',
          //   method: 'POST',
          //   data: {
          //     code
          //   },
          //   success(res) {
          //     //将uid保存到客户端的缓存中
          //     // wx.setStorageSync('uid', res.data.uid)
          //     store.setItem("uid", res.data.uid,"userInfo")
          //   }
          // })

        }
      }) 
    } 
    //wx.getUserInfo只有在用户已经授权过的情况下才能得到用户信息
    wx.getSetting({
      success:res=>{
        if(res.authSetting["scope.userInfo"]){
          //已经授权过
          wx.getUserInfo({
            success: res => {
              //异步的 是index.js中的onLoad先执行，还是当前这个回调函数先执行
              //确保当前这个回调一定在index.js的onLoad之前执行
              this.globalData.userInfo = res.userInfo
              //判断如果index.js中有userInfoReadyCallback就把res传过去，再次修改hasUserInfo和userInfo
              if (this.userInfoReadyCallback){
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })  
  }
})