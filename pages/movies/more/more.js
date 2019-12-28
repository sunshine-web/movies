// pages/movies/more/more.js
const util = require("../../../utils/util.js");
const app = getApp();
const BASEURL = app.globalData.BASEURL;
Page({

  data: {
    title:'',
    movies:[],
    currentUrl:'',
    start:0,
    count:20
  },
  onReachBottom(){
    util.http(`${this.data.currentUrl}?start=${this.data.start}&count=${this.data.count}`,this.cb)
  },
  onLoad: function (query) {
    this.setData({
      title:query.type
    })
    switch(query.type){
      case "正在热映":
        this.setData({
          currentUrl: `${BASEURL}/v2/movie/in_theaters`
        }),
        util.http(`${BASEURL}/v2/movie/in_theaters`,this.cb)
        break;
      case "即将上映":
        this.setData({
          currentUrl: `${BASEURL}/v2/movie/coming_soon`
        }),
        util.http(`${BASEURL}/v2/movie/coming_soon`, this.cb)
        break;
      case "豆瓣Top250":
        this.setData({
          currentUrl: `${BASEURL}/v2/movie/top250`
        }),
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
    movies = this.data.movies.concat(movies)
    this.setData({
      movies,
      start:this.data.start+this.data.count
    })
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  }
})