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
## 2.搭建硅谷影院静态页面
- pages->movies->row->item->stars 评星模板
- pages->movies->row->item 一个电影的显示形式
- pages->movies->row 一行电影的显示形式+头部
- pages->movies 三行
- 主要用flex+rpx
## 3.硅谷影院主页数据传递
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
## 4.硅谷影院主页评星展示
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
## 7.下拉刷新
- 在more.json中配置 "enablePullDownRefresh": true可以下拉。
- 上官网看API，下拉刷新用onPullDownRefresh。
  - 在more.js中写onPullDownRefresh函数。先把movies置为空，一次性请求20条数据。
  - 在cb中判断如果movies.length为0，start就从0开始显示数据，否则就加上count。
  - 测试：每次上拉可以刷新出来数据没有闪屏。
    - 每次下拉也会出来新数据，当数据加载完的时候，给用户提示(未完成提示)。
    - 上拉加载完数据就没有了，下拉加载完会从第一条开始显示。
    - 原因：上拉的时候movies不会为空，因为一直在加数据。下拉的时候要把movies先置为0，才能显示新数据，就会存在movies为空的情况，解决是从第0条开始显示。
## 8.搜索功能
- 在movies.wxml把grid引入进来，用block包住，showRows和showGrids只有一个能显示。
- 写上面的search 输入框 clear结构和样式。
- 在movies.js的data中定义showRows和showGrids，clear图标和grid显示同步。
- 测试：结构样式已经出来，默认grid和clear图标不显示。
- 实现获取焦点row不显示，grid和clear图标显示。
  - 给input绑定获取焦点的事件bindfocus="handleFocus" 
  - 在searchMovies.js中写函数，改变仓库中的状态。
- 实现点击clear图标row显示，grid和clear图标不显示。
  - 给clear图标绑定点击事件bind:tap="handleClear"
  - 在movies.js中写函数，改变仓库中的状态。
- 实现按回车键根据输入框中的内容搜索数据。
  - 给输入框绑定事件bindconfirm="handleConfirm"
  - 在仓库中初始化数据value，点击clear图标在handleClear把value清空，在movies.wxml中value="{{value}}"。
  - 在movies.js中写handleConfirm函数，根据输入的数据发请求，修改仓库中的searchMovies。在movies.wxml中把数据传给grid。在handleClear把searchMovies清空。
  - 测试：在输入框中输入要搜索的电影或者演员，会出现相应的作品，点击clear图标回到movies页面。
## 9.tabBar
- 在app.json中写"tabBar":{}进行配置底部的tabBar。
- 测试：点击硅谷影院跳到硅谷影院，点击硅谷主页跳到硅谷主页。
## 10.搭建硅谷主页静态页面
- 最上面的导航栏文字在atguigu.json中设置。
- 在atguigu.wxml中写结构。
- 在atguigu.wxss中写样式。
- 注意：.atguigu .course-list .title text:nth-child(1)是选中第一个text。
## 11.硅谷主页数据动态化
- 用mock的数据。
- 数据在atguigu->data->data.js。
- 在atguigu.js中引入data.js，在onLoad中把数据请求回来。请求回来的数据可以在微信开发者工具AppData中看到。
    ````
    onLoad: function (options) {
        setTimeout(()=>{
          this.setData(data)
        },100)
      }
    ````
- 动态化企业级实战化课程体系中的数据。遍历用wx:for  只能用item和index。注意图片展示的思路。
    ````
    <view class="item" wx:for="{{listData.courses}}" wx:key="index">
      <image src="{{listData.courseUrls[index]}}"></image>
      <text>{{item}}</text>
    </view>
    ````
- 动态化7大优势傲视群雄及下面的数据。wx:for wx:key item
## 12.把7大优势及下面的写成模板goodness
- 在atguigu->goodness->goodness.wxml goodness.wxss
- 把结构和样式都拆过去。
- 数据传递，在atguigu.wxml中data="{{...item}}，在goodness.wxml可以直接使用title title2 src
## 13.优势详情页静态页面搭建
- 在atguigu下新建detail页，实现点击下面的优势跳到指定的详情页面。
  - 在atguigu.wxml中view上绑定点击事件bind:tap="handleTap"。
  - 在atguigu.js中写handleTap函数，跳到detail页。
- 在detail.wxml中写结构。
  - 在detail.wxss中写样式。
  - 测试：跳转和静态页搭正常
## 14.硅谷主页到详情页数据传递
- 实现点击哪个跳转到哪个详情页面
  - 在atguigu.wxml中view上传个自定义属性data-list-id="{{item.newsid}}"
  - 在atguigu.js中handleTap函数中形参event，打印event，可以在currentTarget->dataset看到listId:1。把id拼到url上。
  - 在url上传的id可以在detail.js中的onLoad函数中用query.id拿到。
  - 在detail.js拿到id,根据id去发请求。引入data.js,在onLoad中找数据中的id和query.id相同的数据，放到仓库中。
  ````
  setTimeout(()=>{
    const detailData = data.templateDatas.find((item)=>{
      return item.newsid === +query.id;//item.newsid是数字，query.id是字符串，所以用+转换一下
    })
    this.setData(detailData)
  },100)
  ````
  - detail.wxml页面中可以直接使用setData中的数据。
  - 测试：点击之后成功跳转到详情页。
## 15.微信openid入库
- 在server的基础上写后台代码
- 在models中建立模型wx_users.js，实现openid入库，先约束openid
- 看小程序官方文档 服务端 登录。获取openid的流程：小程序端要带一个code到我们自己的服务端，自己的服务端拿到code对一个地址进行请求，是向微信的服务器发起请求，它会把openid返回给我们的服务端，在我们的服务端可以拿到openid，然后返回给客户端。
- 看小程序官方文档 框架 框架接口。有生命周期onLaunch监听小程序初始化
  - 在客户端代码中的app.js中写onLaunch，在这个生命周期函数中进行登录 拿到code 向我们自己的服务器发送请求 让自己的服务器去访问微信的服务器 换取openid。
    - 在客户端中的app.js中,先调用wx.login拿到code
    - 向我们自己的服务器发送请求。去写服务器代码。routes中写路由wx_users.js去微信服务器换取openid的getOpenId。在controllers中写控制层wx_users.js，getOpenId，拿到code，微信服务器提供的url，用axios发请求，npm i axios，还需要APPID，SECRET，在app下的config中index.js中配置appId和appSecret。在controllers中引入并用axios发请求拿到openid，让openid写入数据库，把数据库中openid对应的uid(_id)返回给客户端。
    - npm eun dev启动服务器。
    - 在客户端中的app.js中向自己的服务器用wx.request发请求，得到uid。
- 出现问题：客户端每保存一次，就会往数据库中写入一次openid。解决：在客户端中app.js中把拿到的uid保存到缓存中，如果缓存中有uid，就不执行wx.login。
- 测试：在微信开发者工具中清缓存，删除数据库中的数据。编译客户端代码，在Storage中可看到uid，看数据中保存了openid，再次编译，数据库中还是只保存了一次openid。
## 16.微信userinfo入库
- 出现问题：如果把客户端缓存中的uid清除掉，再次编译，还是会向数据库中写入数据，但是现在数据库中已经有openid了。解决：在服务端代码的controllers中，在写入数据库之前先查一下数据库中有没有openid，如果没有，在进行写入数据库。
- 不但要把openid入库，还有把userInfo(用户名，头像等)入库
- userInfo入库的流程：客户端通过api拿到微信服务器给我们的用户信息userInfo，把信息给自己的服务器，自己的服务器把userInfo入库。
- 写客户端代码，在pages下新建目录index，新建Page index。打开app.json把新建的index写到最上面，保存出现这个页面。
  - 在index.wxml中写按钮button组件
  - 实现点击当前按钮时 获取到微信用户的相关信息 存入到我们自己的数据库
    - 拿到用户信息 发给我们的服务器 服务器负责保存
  - button中open-type属性是微信的开放能力，bindgetuserinfo会返回获取到的用户信息，open-type="getUserInfo"时有效。在index.js中写bindgetuserinfo的回调函数getUserInfo，打印ev，会在detail中看到userInfo，里面包含用户头像，昵称等。
- 需要将userInfo写入数据库，在服务端中的模型中写中相关信息的校验。
  - 在routes中写路由saveUserInfo
  - 在controllers中定义saveUserInfo，校验相关信息，拿到请求地址中的uid，更新相关信息并进行签名，返回token
- 在客户端的index.js中写请求，在userInfo存在的时候，拿到服务器返回的token，并写入到缓存中。
- 测试：在微信开发者工具中清缓存，删除数据库中的数据。编译客户端代码，点击微信登录，弹出的框，如果点击拒绝，数据库不会有头像，用户名等相关信息;点击允许，头像，用户名等相关信息才会写入数据库。



