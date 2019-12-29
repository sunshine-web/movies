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
    util.http(`${this.data.currentUrl}?start=${this.data.start}&count=${this.data.count}`, this.cb)
  },
  onPullDownRefresh(){
    this.setData({
      movies:[],
    }),
    util.http(`${this.data.currentUrl}?start=${this.data.start}&count=${this.data.count}`, this.cb)
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
  cb(data, isFirstReq){
    let movies = [];
    movies = data.subjects.map((item) => ({
      postImgUrl: item.images.large,
      name: item.original_title,
      score: item.rating.average,
      stars: util.getStarsArr(item.rating.stars)
    }))
    movies = this.data.movies.concat(movies)
    if(movies.length === 0){
      this.setData({
        start: 0
      })
      console.log(1);
    }else{
      this.setData({
        start: this.data.start + this.data.count
      })
    }
    
    this.setData({
      movies
    }, () => {
      wx.stopPullDownRefresh()//停止当前页面的下拉刷新
    })
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  }
})