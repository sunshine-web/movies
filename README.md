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
  - 请求代码
    ````
    wx.request({
        url: `http://localhost:8080/wx_users/${uid}/saveUserInfo`,
        method: 'post',
        data: ev.detail.userInfo,
        success:(res) => {
          wx.setStorageSync("token", res.data.token);
        }
      })
    ````
- 测试：在微信开发者工具中清缓存，删除数据库中的数据。编译客户端代码，点击微信登录，弹出的框，如果点击拒绝，数据库不会有头像，用户名等相关信息;点击允许，头像，用户名等相关信息才会写入数据库。
## 17.微信登录功能
- 在用户授权过之后微信登录这个按钮不应该再出现
   - 在index.js中写data hasUserInfo:false//true:代表用户已经授权过，false：用户没有授权
   - 在请求成功拿到token后，修改
   ````
  this.setData({
      hasUserInfo:true
    })
   ````
   - 在index.wxml中的button按钮上wx:if="{{!hasUserInfo}}"
- 点击微信登录授权后应该显示用户头像和昵称
   - 在index.wxml中写结构
   - 在index.js中定义data数据userInfo为对象
   - 在请求成功拿到token后，修改
  ````
   this.setData({
     hasUserInfo:true,
     userInfo: ev.detail.userInfo
   })
  ````
   - 在index.wxml中的view上wx:else，其中的image和text可以直接用{{}}显示userInfo中的数据
   - 在index.wxss中修改样式
- 测试：编译后出现微信登录，点击授权后出现用户头像和用户名
- 出现问题：每次编译后都出现用户登录，应该在用户授权后不出现用户登录，直接显示用户名和头像
  - 解决：点击用户授权之后，可以通过wx.getUserInfo这个api拿到用户信息。
    - 在app.js中的onLaunch这个生命周期中 在用户已经授权过的情况下能得到用户信息。
    - 在globalData中初始化userInfo为null，用户授权过把userInfo赋值过来。
    - 思路：在app.js中onLaunch这个生命周期判断有没有userInfo，如果有代表已经授权过，就不显示微信登录按钮，如果没有就显示微信登录按钮。
      - 要让app.js和index.js做交互，在index.js中拿到globalData中的数据，在onLoad这个生命周期中判断是否有userInfo，如果有修改hasUserInfo和userInfo
      - 问题：app.js中给userInfo赋值的success回调是异步的，是这个回调先执行还是index.js中的onload先执行
        - 确保当前这个回调一定在index.js的onLoad之前执行。解决index.js的onLoad先执行
        - 在index.js中如果没有app.globalData.userInfo，会有两种情况有可能用户没有授权和有可能用户授权了，只是onLoad在app.js中的success前调用了
          - 避免第二种情况，在index.js中给app绑userInfoReadyCallback方法，修改hasUserInfo和userInfo，如果onLoad先执行，就会有userInfoReadyCallback方法，在app.js中判断如果有这个方法，就把res传过去再次调用。
  - 测试：在用户授权之后直接显示用户名和头像，不显示用户登录 
- 实现点击用户头像跳转到硅谷主页
  - 在index.wxml中给image绑定bind:tap="toAtguigu"，在index.js中实现点击头像跳转到tabBar页面
  ````
  toAtguigu(){
      wx.switchTab({
        url: '/pages/atguigu/atguigu',
      })
    }
  ````
- 测试：在微信开发者工具中清缓存，删除数据库中的数据。编译客户端代码，点击微信登录，可看到头像，点击头像跳转到硅谷主页。再次编译，点击头像，跳转到硅谷主页。
## 18.封装公共的store.js
- 在utils下新建store.js
  ````
  {
    user:{
      uid: "123",
        token: "8989"
    }
    uid: "abc"
  }
  ````
  - 实现从小程序的缓存中读取内容(带模块)getItem
  - 思路：如果是带模块的 先拿到这个模块 如果模块存在 去模块中拿uid；如果模块不是带模块的 直接拿uid
  - 实现向小程序的缓存中写入内容(带模块)setItem
  - 思路：如果是带模块的 先拿到这个模块 如果模块存在(本来就有这个模块) 什么也不做，否则初始化为对象 最后向里面写key val；如果模块不是带模块的 直接存key val
  - 实现清除小程序中的指定缓存clear
  - 思路：如果传key了，清除掉这个key，否则是清空。如果要删除user中的uid，要用setItem把它设置为空
- 在app.js index.js中引入store.js使用
- 测试：在微信开发者工具中清缓存，删除数据库中的数据。编译客户端代码，看Storage中有userInfo value中有uid
  - 点击微信登录 允许 看Storage中有userInfo value中有uid token
  - 再次编译 看到用户头像 点击用户头像 跳转到硅谷主页
## 19.封装router.js
- 新建目录routes->index.js写路由
- 在utils下新建router.js定义路由器
  - router.js需求 实现以下几种方式的路由跳转
  ````
  router.push("atguigu")
  router.push("atguigu",{
    query:{
      a:"a",
      b:"b",
      type:"switchTab",
      duration:3000//毫秒值
    }
  })
  router.push({
    path:"atguigu",
    query: {
      a: "a",
      b: "b",
      type: "switchTab",
      duration: 3000//毫秒值
    }
  })
  ````
  - 在utils->router.js中根据需求设计代码
  - 定义push
    - 打平所有调用方式的差异 
      - 思路：先判断第一个参数的类型 如果是string 说明是前两种 把它挂载到option中 按照第三种方式处理；否则是第三种方式传的，path拿到的是对象 把它直接给option。
    - 将option中的配置项一一取出
      - 定义parseQuery，将一个query对象转成一个query字符串，把传的query参数拼接到路由后面，得到真正的路由地址
      - 看是否传了延迟跳转时间，如果传了用定时器延迟后跳转 否则直接跳转
      - 定义跳转路由的方法to 包含switchTab reLaunch navigateTo等
  - 在page中的index下的index.js中引入router.js使用router.push跳转到硅谷主页
  - 测试：点击用户头像 跳转到硅谷主页
## 20.完成http.js
- 在全局新建目录api->index.js存放请求的地址
- 在全局新建目录config->index.js存放小程序的名称 版本 环境 基地址等
- 在utils中新建http.js用来发请求
  - 发送请求的主体方法request
    - request参数
      - url:接口地址(不带基地址) 
      - data:携带的数据 
      - option:{loading,isMock,header}
        - option.loading:是否出现loading图标
        - option.isMock:弃用环境 使用mock地址
        - option.header:请求头
  - 处理url，先看是否是第三方接口(第三方基地址拼上api中的url)，如果不是第三方接口，判断是否使用mock接口，否则使用生产或者开发环境的基地址
  - 处理option.header
    - 在utils->util.js中写获取平台信息的工具类getSystemInfo返回wx.getSystemInfoSync()，在http.js中引入使用
    - 参数header和BaseHeader的合并，上npm，找weapp-utils用于合并对象
      - 在根目录下npm init -y出来sitemap.json文件，下包npm install --save weapp-utils
      - 下载包后在根目录下会有个node_modules，但是在微信开发者工具下看不到node_modules，点击上面的工具 构建npm出现miniprogram_npm，才可以在小程序中使用npm包
      - 在http.js中引入import { merge } from 'weapp-utils'，使用它的merge方法进行合并对象
  - 请求开始显示loading图标
  ````
  wx.showLoading({
    title: 'loading...',
    mask:true
  })
  ````
  - 处理wx.request中请求成功的success，如果statusCode状态码为200或者204关闭loading，返回成功的promise，否则用showToast提示接口调用失败，返回失败的promise
  - 处理wx.request中请求失败的fail，用showToast提示请求失败，返回失败的promise
  - 在app.js中引入utils下的http.js并使用
  - 测试1：在微信开发者工具中清缓存，编译客户端代码，点击微信登录 允许
    - 报错：thirdScriptError regeneratorRuntime is not defined，原因是在app.js中async是给微信内部的success使用的，微信觉得这么做不行
    - 点击微信开发者工具右上角，本地设置中勾选上ES6转ES5 使用npm模块
    - 安装包npm i regenerator@0.13.1，下载完包后点击微信开发者工具上的工具->构建npm
    - 在app.js中引入regenerator-runtime下的index.js
    - 在微信开发者工具中清缓存，编译客户端代码，点击微信登录 允许，出现用户头像，点击用户头像 跳转到硅谷主页
    - 在index->index.js中引入utils下的http.js并使用
  - 测试2：在微信开发者工具中清缓存，删除数据库中的数据。编译客户端代码， 点击微信登录报错regeneratorRuntime is not defined，点击右上角->详情 调式基础库 2.10.1，再次编译，出来用户头像 点击用户头像 跳转到硅谷主页。清缓存后第一次编译报错 暂时归结为开发工具问题
## 21.解决bug
- 编译客户端代码， 点击微信登录报错regeneratorRuntime is not defined。点击微信登录 允许 数据库中也没有拿到微信头像，用户名等相关信息。
  - 原因：api->index.js在app.js中被引入解析，解析时onLaunch还没有执行，setItem没有把uid写进去，也就是说api->index.js在onLaunch之前被解析，此时api->index.js中的uid获取不到，导致saveUserInfo这个请求出错，所以数据库中拿不到微信头像，用户名等相关信息
  - 解决方案：api中如果有动态拼接的接口地址，需要使用函数的形式往外提供
    - 在api->index.js中的saveUserInfo里获取uid，并把地址返回出去
    ````
      saveUserInfo(){
        //这个uid才会有效
        const uid = store.getItem("uid", "userInfo");
        return `/wx_users/${uid}/saveUserInfo`;
      }
    ````
    - 在pages->index->index.js中使用saveUserInfo，api.saveUserInfo()
  - js文件中使用async await都要引用regeneratorRuntime解决报错
  - 在utils->http.js中success请求成功返回的是res.data,所以在index->index.js中await返回的是data，直接拿到token
- 测试：在微信开发者工具中清缓存，删除数据库中的数据。编译客户端代码，看到Storage中有uid，数据库中有openid；点击微信登录 允许，看到Storage中有token，数据库中有用户头像 用户名等相关信息；点击用户头像跳转到硅谷主页
## 22.总结微信自动登录 获取用户信息的方式 实现公共模块
- 微信自动登录
  - openid要入库(在整个微信小程序启动时入库  app.js中onLaunch)
  - 微信的用户信息要入库(在pages->index->index.js界面被渲染的时候入库 onload中)
- 获取用户信息的方式
  - <open-data type="userNickName"></open-data> 只能在.wxml中文件中写，在页面上显示，小程序没有dom操作，显示的数据是拿不到的，没有办法做入库操作
  - <button open-type='getUserInfo' bindgetuserinfo = 'getUserInfo' ></button >;
    - 点击这个按钮时 我们可以在getUserInfo回调中通过ev.detail.userInfo拿到用户信息 
    - 体验缺陷 需要用户点击按钮
  - wx.getUserInfo() 去获取用户信息 不需要任何点击；前提:必须授权过(wx.getSetting来判断)
- 实现了几个公共模块
  - 缓存的公共存储 utils->store.js
  - 路由的搭建 utils->router.js
  - http请求的promise化 utils->http.js
  
    
    
    
    
    
    
    
    
    
    