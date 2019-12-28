// pages/movies/more/more.js
const util = require("../../../utils/util.js");
const app = getApp();
const BASEURL = app.globalData.BASEURL;
Page({

  data: {
    title:'',
    movies:[]
  },

  onLoad: function (query) {
    this.setData({
      title:query.type
    })
    switch(query.type){
      case "正在热映":
        util.http(`${BASEURL}/v2/movie/in_theaters`,this.cb)
        break;
      case "即将上映":
        util.http(`${BASEURL}/v2/movie/coming_soon`, this.cb)
        break;
      case "豆瓣Top250":
        util.http(`${BASEURL}/v2/movie/top250`, this.cb)
        break;
    }
  },
  cb(data){
    let movies = [];
    movies = data.subjects.map((item) => ({
      postImgUrl: item.images.large,
      name: item.original_title,
      score: item.rating.average,
      stars: util.getStarsArr(item.rating.stars)
    }))
    this.setData({
      movies
    })
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  }
})