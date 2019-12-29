// pages/atguigu/detail/detail.js
const data = require("../data/data.js");
Page({

  data: {

  },

  onLoad: function (query) {
    // console.log(query.id)
    setTimeout(()=>{
      const detailData = data.templateDatas.find((item)=>{
        return item.newsid === +query.id;//item.newsid是数字，query.id是字符串，所以用+转换一下
      })
      this.setData(detailData)
    },100)
  }
})