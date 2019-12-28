## 1.项目初始化
- pages->atguigu硅谷主页
- pages->movies硅谷电影
  - 模板
     - pages->movies->row行
     - pages->movies->row->item个
     - pages->movies->row->item->stars星星
- 测试：模板和硅谷电影之间关系起来
````
row.wxml
<template name="row">
<text class="row">row</text>
</template>
movies.wxml
<import src="./row/row" />
<template is="row"></template>

row.wxss
.row{
color: pink;
}
movies.wxss
@import './row/row';
````
## 2.搭建静态页面
- pages->movies->row->item->stars 评星模板
- pages->movies->row->item 一个电影的显示形式
- pages->movies->row 一行电影的显示形式+头部
- pages->movies 三行
- 主要用flex+rpx
## 3.电影主页数据传递
- 在movies.js中onLoad进行发送ajax请求。
- 使用的http地址，要去小程序官网->基本设置->前往填写->配置服务器(开发设置)->服务器域名(request合法域名)。微信开发者工具->详情->不校验合法域名，业务域名打上对号。
- 发送请求拿到数之后，构建数据结构。
````
movies:[
  {
    type
    movies:{
      postImgUrl,
      name,
      score
    }
  },
  {
    type
    movies:{
      postImgUrl,
      name,
      score
    }
  },
  {
    type
    movies:{
      postImgUrl,
      name,
      score
    }
  }
]
````
- 在movies.js中构建好数据结构之后，在movies.wxml中进行数据传递。wx:for="{{movies}}" data="{{...item}}"。这个movies是最外层的movies，传递下去的是每个对象。
- 在row.wxml中可以进行展示type，wx:for="{{movies}}" data="{{...item}}" wx:key="index"。这个movies是里面的movies。
- 在item.wxml中可以进行展示海报和电影名字。data="{{score}}"把评分继续传递下去。
- 在stars.wxml中可以进行展示评分。{{score}}
## 4.电影主页评星展示
- 在movies.js中构建数据结构时加个stars。先写成stars: ["ON","ON","HALF","OFF","OFF"]进行测试。
- 在item.wxml中data="{{score,stars}}"传递下去。
- 在stars.wxml中对stars这个数据进行遍历。image星星是否显示用wx:if来控制。
````
<block wx:for="{{stars}}" wx:key="index">
    <image wx:if="{{item==='ON'}}" class="star" src='./img/stars/star24_on@2x.png'></image>
    <image wx:if="{{item==='HALF'}}" class="star" src='./img/stars/star24_half@2x.png'></image>
    <image wx:if="{{item==='OFF'}}" class="star" src='./img/stars/star24_off@2x.png'></image>
</block>
````
- 在util.js根据数据结构中stars传过来的数字进行决定数组中是ON HALF OFF。写函数getStarsArr暴露出去。
- 在movies.js中引入const util = require("../../utils/util.js");使用stars: util.getStarsArr(item.rating.stars)
- 测试：星星根据分数进行展示。

- 在app.js中定义BASEURL。
- 在movies.js中引入const app = getApp();
- 在发请求那使用公共的BASEURL。
## 5.点击更多跳转电影详情页请求数据
- 在movies下新建more，实现点击更多跳转到more。
  - 在row.wxml中给更多绑定点击事件bind:tap="toMore"
  - 在movies.js中写函数toMore
  ````
  toMore(){
    wx.navigateTo({
      url: '/pages/movies/more/more',
    })
  }
  ````
  - 测试：点击更多跳转到more
  - 上面的导航栏名称可以在.json文件中用"navigationBarTitleText": "硅谷电影"进行设置。
- 实现点击正在热映时上面的导航显示正在热映。
  - 在row.wxml中用data-type="{{type}}把type从更多上传出去。
  - 在点击事件toMore中用query带着url: `/pages/movies/more/more?type=${ev.currentTarget.dataset.type}`
  - 在more.js中的onLoad上可以用query接，其它生命周期不可以。
  - 设置导航栏名称
  ````
   wx.setNavigationBarTitle({
     title: query.type,
   })
  ````
  - 测试：可以设置好导航栏名称，但是点进去设置的过早，会出现导航栏和内容区看似分离的效果。
  - 解决方案：在data中定义title，在onLoad中用setData改title，在onReady中设置。
- 在more.js中发送请求，把整个数据拿过来。
  - movies.js中getMovies是发请求的，把它写在工具类utils中，改名http，暴露出去，在movie.js中先使用，效果还是和以前一样。
  - 在more.js中的onLoad根据type发送请求，传个回调，把请求回来的数据做整理然后改仓库中的movies，注意构建的数据结构只有一层。
  - 此时点击更多可以出现请求回来的电影数据。但是星星没有显示，在stars.wxml中把路径改成/pages...从pages下去找星星的图片，在模板中都可以显示。
  - 测试：点击更多效果正常。
## 6.上拉加载更多
- 在more下新建模板grid，便于复用。把more.wxml中的代码都放在grid中，测试：效果正确。
- 点击更多出来的电影详情居中，用display控制主侧轴居中并且换行。
  - 在grid.wxml中判断movies.length对3求余，如果为1，补两个template。如果为2补一个template。
- 上官网看API，上拉加载更多用onReachBottom。
  - 在more.js中写onReachBottom函数。根据currentUrl和start count发请求。
  - 在data中定义currentUrl，在onLoad中发请求时修改仓库中的currentUrl。
  - 在onReachBottom中发请求也调用了cb，把以前的movies和重新请求回来的20个moives用concat连接起来。在setData中也要修改start的值。
  - 测试：每次触动底部的时候都会新加载数据展示。
- 在util.js中的http中在发请求之前导航栏显示loading图标，wx.showNavigationBarLoading();
  - 在成功拿到数据的success中隐藏图标，wx.hideNavigationBarLoading();
  - 测试：每次发请求拿数据时导航栏会显示loading图标。