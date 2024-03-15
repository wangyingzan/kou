// app.js
var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./utils/user.js');

App({
  onLaunch() {
    wx.getSystemInfo({
      success:(res) => {
        let capsule = wx.getMenuButtonBoundingClientRect();
        // navBarHeight=
        this.globalData.navBarHeight = res.statusBarHeight + 44;
        this.globalData.menuTop =  capsule.top;
        this.globalData.menuHeight =  capsule.height;

        if(res.model.indexOf('iPhone') != -1) {
          this.globalData.isIos = true
        }else{
          this.globalData.isIos = false
        }
      }
    })
    const updateManager = wx.getUpdateManager();
    wx.getUpdateManager().onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    this.login()
  },
  getOpenid:function(){
    return  new Promise((resolve, reject)=>{
      wx.login({
        success:function(res){
          util.request(api.getOpenId, {
            code: res.code
          }).then(data => {
            wx.setStorageSync('openid', data.data.openid);
            wx.setStorageSync('sessionkey', data.data.sessionKey);
            wx.setStorageSync('unionid', data.data.unionid)
            resolve();
          })
        },
        fail: function(){
          reject();
        }
      })
    })
  },
  getCurrentCity(){
    return new Promise((resolve, reject)=>{
      wx.getLocation({
        type: 'wgs84',
        success: ({longitude,latitude})=>{
          util.request(api.getCityInfo, {GpsLng: longitude, GpsLat:latitude}).then(res => {
            const {cityName,gpsLng,gpsLat} = res;
            wx.setStorageSync('dingwei',{
              name: cityName,
              lat: gpsLat,
              lng: gpsLng
            });
            resolve(res);
          });
        },
        fail:(res)=> {
          wx.showToast({
              title: '位置信息获取失败',
              icon: 'none',
              duration: 1000
          })
          console.log("======",res);
          reject(res);
        }
      })
    })
  },
  login:function(){
    return  new Promise((resolve, reject)=>{
      // wx.login({
      //   success:function(res){
      //     util.request(api.getMinAppOpenId, {
      //       code: res.code
      //     }).then(data => {
      //       wx.setStorageSync('openid', data.data.openid);
      //       wx.setStorageSync('sessionkey', data.data.sessionKey);
      //       wx.setStorageSync('unionid', data.data.unionid)
      //       resolve();
      //     })
      //   },
      //   fail: function(){
      //     reject();
      //   }
      // })
    })
  },
  globalData: {
    userInfo: null,
    hasLogin: false,
    menuHeight: '',// 胶囊高度
    menuTop: '',// 胶囊距离顶部高度
    statusBarHeight: '',
    navBarHeight:'',//标题栏高度
    distance:{},
    isIos: false, //是否是ios手机
  }
})
