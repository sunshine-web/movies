import routes from "../routes/index.js";//代表拿到所有的路由信息

// router.push("atguigu")
// router.push("atguigu",{
//   query:{
//     a:"a",
//     b:"b",
//     type:"switchTab",
//     duration:3000//毫秒值
//   }
// })
// router.push({
//   path:"atguigu",
//   query: {
//     a: "a",
//     b: "b",
//     type: "switchTab",
//     duration: 3000//毫秒值
//   }
// })

class Router{
  //打平所有调用方式的差异 思路：先判断第一个参数的类型 如果是string 说明是前两种 把它挂载到option中 按照第三种方式处理；否则是第三种方式传的，path拿到的是对象 把它直接给option。
  push(pathKey,option){
    if(typeof pathKey === "string"){
      option.path = pathKey;
    }else{
      option = pathKey;
    }

    //将配置项一一取出
    const { path, query = {},type ="navigateTo",duration=0} = option;
    const queryStr = this.parseQuery(query)
    const url = routes[path] + "?" + queryStr;//真正的路由地址
    //进行跳转
    duration > 0 ? setTimeout(()=>{
      this.to(type, url)
    }): this.to(type, url)
  }

  //将一个query对象转成一个query字符串
  //{a:"a",b:"b"} --> a=a&b=b
  parseQuery(query){
    let arr = [];
    for(let key in query){
      arr.push(`${key}=${query[key]}`)
    }
    //["a=a","b=b"]
    return arr.join("&")
    //"a=a&b=b"
  }

  //路由跳转的方法
  to(type,url){
    let obj = { url };
    switch(type){
      case "switchTab":
        wx.switchTab(obj)
       break;
      case "reLaunch":
        wx.reLaunch(obj)
        break;
      case "redirectTo":
        wx.redirectTo(obj)
        break;
      case "navigateTo":
        wx.navigateTo(obj)
        break;
      case "navigateBack":
        wx.navigateBack({
          delta: 1
        })
        break;
    }
  }
}
export default new Router()