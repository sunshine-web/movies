// pages/atguigu/atguigu.js
const data = require('./data/data.js');
Page({

  data: {

  },

  onLoad: function (options) {
    setTimeout(()=>{
      this.setData(data)
    },100)
  },
  handleTap(){
    wx.navigateTo({
      url: '/pages/atguigu/detail/detail',
    })
  }
})