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
  handleTap(event){
    // console.log(event);
    wx.navigateTo({
      url: `/pages/atguigu/detail/detail?id=${event.currentTarget.dataset.listId}`,
    })
  }
})