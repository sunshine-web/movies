// pages/movies/movies.js
let index = -1;
Page({

  data: {
    movies:[]
  },

  onLoad: function (options) {
    this.getMovies('http://t.yushu.im/v2/movie/in_theaters?start=0&count=3',"正在热映")
    this.getMovies('http://t.yushu.im/v2/movie/coming_soon?start=0&count=3',"即将上映")
    this.getMovies('http://t.yushu.im/v2/movie/top250?start=0&count=3',"豆瓣Top250")
  },
  getMovies(url,type){
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        this.finalData(res.data,type)
      }
    })
  },
  finalData(data,type){
    let movies = [];
    movies = data.subjects.map((item)=>({
      postImgUrl:item.images.large,
      name: item.original_title,
      score: item.rating.average
    }))
    index++;
    this.setData({
      [`movies[${index}]`]:{
        type,
        movies
      }
    })
  }
})
