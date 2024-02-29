/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');

/**
 * Promise封装wx.checkSession
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
    wx.checkSession({
      success: ()=> {
          resolve(true);
      },
      fail: ()=> {
          getApp().getOpenid().then(()=>{
              resolve(true);
          });
      }
    })
  });
}

/**
 * Promise封装wx.login
 */
function login() {
  return new Promise(function(resolve, reject) {

    wx.login({
      success: function(res) {
          console.log("code",res);
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信登录
 */
function loginByWeixin(detail) {
    const referer =  wx.getStorageSync('shareid')?wx.getStorageSync('shareid')=='undefined'?'':wx.getStorageSync('shareid'):''
  return new Promise(function(resolve, reject) {
    return new Promise(function() {
        util.request(api.oneClickLoginForMinApp, {
            sessionKey: wx.getStorageSync('sessionkey'),
            iv: detail.iv,
            encryptedData: detail.encryptedData,
            regionName:wx.getStorageSync('dingwei').name,
            referer,
        }, 'GET').then(res => {
            if (res.code === 0) {
                const {user,token} = res.data;
                  wx.setStorageSync('userInfo', user);
                  wx.setStorageSync('token', token);
                resolve(res);
            } else {
                reject(res);
            }
        }).catch((err) => {
            reject(err);
        });
    }).catch((err) => {
        reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function(resolve, reject) {
      checkSession().then(() => {
          resolve(true);
      }).catch(() => {
          reject(false);
      });
  });
}

module.exports = {
  loginByWeixin,
  checkLogin,
    login,
};
