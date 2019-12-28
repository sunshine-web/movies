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
