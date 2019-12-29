// pages/movies/movies.js
const util = require("../../utils/util.js");
const app = getApp();
let index = -1;
Page({

  data: {
    movies:[],
    showRows: true,
    showGrids: false,
    value:'',
    searchMovies: []
  },

  onLoad: function (options) {
    const BASEURL = app.globalData.BASEURL;
    util.http(`${BASEURL}/v2/movie/in_theaters?start=0&count=3`, this.finalData,"正在热映")
    util.http(`${BASEURL}/v2/movie/coming_soon?start=0&count=3`, this.finalData,"即将上映")
    util.http(`${BASEURL}/v2/movie/top250?start=0&count=3`, this.finalData,"豆瓣Top250")
  },
  finalData(data,type){
    let movies = [];
    movies = data.subjects.map((item)=>({
      postImgUrl:item.images.large,
      name: item.original_title,
      score: item.rating.average,
      stars: util.getStarsArr(item.rating.stars)
      // stars: ["ON","ON","HALF","OFF","OFF"]
    }))
    index++;
    this.setData({
      [`movies[${index}]`]:{
        type,
        movies
      }
    })
  },
  toMore(ev){
    wx.navigateTo({
      url: `/pages/movies/more/more?type=${ev.currentTarget.dataset.type}`,
    })
  },
  handleFocus(){
    this.setData({
      showRows: false,
      showGrids: true
    })
  },
  handleClear(){
    this.setData({
      showRows: true,
      showGrids: false,
      value: '',
      searchMovies: []
    })
  },
  handleConfirm(ev){
    let searchVal = ev.detail.value;
    let url = `http://t.yushu.im/v2/movie/search?q=${searchVal}`;
    util.http(url,this.cb)
  },
  cb(data){
    let searchMovies = [];
    searchMovies = data.subjects.map((item) => ({
      postImgUrl: item.images.large,
      name: item.original_title,
      score: item.rating.average,
      stars: util.getStarsArr(item.rating.stars)
    })),
    this.setData({
      searchMovies
    })
  }
})
