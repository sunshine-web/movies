import config from '../config/index.js';
import util from '../utils/util.js';
import { merge } from 'weapp-utils';
const systemInfo = util.getSystemInfo();
const BaseHeader = {
  "clientType":"mp",
  "app": config.projectName,
  "version":config.version,
  "os": systemInfo.system,
  "brand": systemInfo.brand,
  "model": systemInfo.model,
  "wx_version": systemInfo.version
}
class Http{
  //发送请求的主体方法
  //url:接口地址(不带基地址) data:携带的数据 option:{loading,isMock,header}
  //option.loading:是否出现loading图标
  //option.isMock:弃用环境 使用mock地址
  //option.header:请求头
  request(url, method = "GET",data={},option={}){
    let {loading = true, isMock = false, header = {} ,ThirdBaseUrl=""} = option;
    return new Promise((resolve,reject)=>{
      if(loading){
        wx.showLoading({
          title: 'loading...',
          mask:true
        })
      }

      //调用第三方接口
      if (ThirdBaseUrl){
        url = ThirdBaseUrl + url;
      }else{
        if (isMock) {
          //使用mockUrl
          url = config.env.mockUrl + url;
        } else {
          //使用环境(开发 生产)地址
          url = config.env[config.model].baseUrl + url;
        }
      }

      //使用微信的api发请求，不是ajax请求，只有浏览器才有ajax请求
      wx.request({
        url,
        method,
        data,
        header: merge(BaseHeader,header),//参数header和BaseHeader的合并，上npm，npm install --save weapp-utils用于合并对象
        success(res){
          if(res.statusCode === 200 || res.statusCode === 204 ){
            if(loading){
              wx.hideLoading()
            }
            resolve(res.data)
          }else{
            //showToast这个方法被调用时，会自动隐藏loading
            wx.showToast({
              title: '接口调用失败',
              duration:4000,
              icon:"none"
            })
            reject(res)
          }
        },
        fail(err){
          wx.showToast({
            title: '请求失败',
            duration: 4000,
            icon: "none"
          })
          reject(err)
        }
      })
    })
  }
  get = (url, data, option) => this.request(url, "GET" ,data, option);
  post = (url, data, option) => this.request(url, "POST", data, option);
  put = (url, data, option) => this.request(url, "PUT", data, option);
  patch = (url, data, option) => this.request(url, "PATCH", data, option);
  del = (url, data, option) => this.request(url, "DELETE", data, option);
}

export default new Http()