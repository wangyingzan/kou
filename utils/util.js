
var api = require('../config/api.js');
var app = getApp();
import md5 from 'md5';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 封封微信的的request
 */
function request(Method, data = {},) {

  return new Promise(function (resolve, reject) {
    const params = {
      "Method": Method,
      "Timestamp":  formatTime(new Date()),
      "Version": "1.0",
      "Body": {
        ...data
      },
    }
    const Sign = getSign(data)
    wx.request({
      url: api.apiUrl,
      data: {
        ...params,
        Sign:'9527',
      },
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'AuthToken': wx.getStorageSync('token'),
      },
      success: function (res) {
        // wx.hideLoading();
        if (res.statusCode === 200) {
          const expireTime = wx.getStorageSync("canNavigate");
          const nowTime = new Date().getTime();
          switch (res.data.errCode){
            case "Success" :
              resolve(res.data.body);
              break;
            case "UserNotLogin" : //未登录
              if(!expireTime || nowTime - parseInt(expireTime) > 5000){
                wx.setStorageSync("canNavigate",nowTime);
                wx.removeStorageSync('userInfo');
                wx.removeStorageSync('token');
                wx.removeStorageSync('isLogin');
                // 切换到登录页面
                wx.switchTab({
                  url: '/pages/my/index',
                });
              }
              break;
            case 10021 : //token过期
              if(!expireTime || nowTime - parseInt(expireTime) > 5000){
                wx.setStorageSync("canNavigate",nowTime);
                // 切换到登录页面
                const pages=getCurrentPages();
                if(pages[pages.length-1].route !== 'pages/auth/login/login'){
                  // 切换到登录页面
                  wx.navigateTo({
                    url: '/pages/auth/login/login'
                  });
                }
              }
              break;
            default :
              wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
              });
              reject(res.data);
              break;
          }
        } else {
          reject('系统繁忙');
        }

      },
      fail: function (err) {
        console.log("err=====",err);
        reject('系统繁忙')
      }
    })
  });
}

/**
 * 封装Sign 算法
 */
function getSign(obj){

  const list = []
  for(const key in obj){
    list.push(key)
  }
  let str = '';
  const dataList = list.sort();
  console.log("dataList",dataList)
  dataList.forEach((key,index,)=>{
    if(key === 'Body'){
      str += `${key}=${JSON.stringify(obj[key])}`
    }else{
      str += `${key}=${obj[key]}`
    }
    str += '&'
  })
  return md5(str + 'key=com.koufuxia.wwww').toLocaleUpperCase()
};
/** 格式化富文本 */
function replaceSpecialChar(content) {

  content = content.replace(/&quot;/g,'"');

  content = content.replace(/&amp;/g, '&');

  content = content.replace(/&lt;/g, '<');

  content = content.replace(/&gt;/g, '>');

  content = content.replace(/&nbsp;/g, ' ');

  content = content.replace(/<p/gi, '<p class="p_class" ');

  content = content.replace(/<span/gi, '<span class="span_class" ');

  content = content.replace(/<img/gi, '<img class="img_class" ');

  return content;

}

module.exports = {
  formatTime,
  request,
  md5,
  replaceSpecialChar,
  getSign
}
