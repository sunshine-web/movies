// {
//   user:{
//     uid: "123",
//       token: "8989"
//   }
//   uid: "abc"
// }

class Store{
  //思路：如果是带模块的 先拿到这个模块 如果模块存在 去模块中拿uid；如果模块不是带模块的 直接拿uid
  //实现从小程序的缓存中带模块形式的读取内容
  //getItem("uid","user")
  getItem(key,moduleName) {
    //带模块 
    if(moduleName){
      let moduleObj = this.getItem(moduleName)
      if(moduleObj){
        return moduleObj[key]
      }else{
        return "";
      }
    }else{
      //直接拿到数据 返回出去
      return wx.getStorageSync(key)
    }
  };

  //向小程序的缓存中写入内容(带模块)
  //思路：如果是带模块的 先拿到这个模块 如果模块存在(本来就有这个模块) 什么也不做，否则初始化为对象 最后向里面写key val；如果模块不是带模块的 直接存key val
  //setItem("name","aaa","user")
  setItem(key,val,moduleName){
    if(moduleName){
      let moduleObj = this.getItem(moduleName);
      moduleObj?"":moduleObj={};
      moduleObj[key] = val;
      wx.setStorageSync(moduleName, moduleObj)
    }else{
      wx.setStorageSync(key, val)
    }
  };
  
  //清除小程序中的指定缓存
  clear(key){
    key?wx.removeStorageSync(key):wx.clearStorageSync()
  }
}
export default new Store()