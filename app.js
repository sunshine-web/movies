//app.js
App({
  globalData: {
    BASEURL: "http://t.yushu.im"
  },
  onLaunch(){
    //拿到code 向我们自己的服务器发送请求 让自己的服务器去访问微信的服务器 换取openid
    if(!wx.getStorageSync('uid')){
      wx.login({
        success(res) {
          let code = res.code;
          wx.request({
            url: 'http://localhost:8080/wx_users/getOpenId',
            method: 'POST',
            data: {
              code
            },
            success(res) {
              //将uid保存到客户端的缓存中
              wx.setStorageSync('uid', res.data.uid)
            }
          })
        }
      }) 
    } 
  }
})