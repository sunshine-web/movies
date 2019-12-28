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
## 3.数据传递
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