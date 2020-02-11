// pages/index/index.js
Page({
  getUserInfo(ev){
    //点击拒绝 ev.detail.userInfo undefined
    if (ev.detail.userInfo){
      const uid = wx.getStorageSync("uid");
      wx.request({
        url: `http://localhost:8080/wx_users/${uid}/saveUserInfo`,
        method: 'post',
        data: ev.detail.userInfo,
        success(res) {
          wx.setStorageSync("token", res.data.token)
        }
      })
    }
  }
})