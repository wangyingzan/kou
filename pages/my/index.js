const app = getApp()
const user = require('../../utils/user');
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuHeight: app.globalData.menuHeight,
        menuTop: app.globalData.menuTop,
    },
    onLoad: function (options) {

    },
    login: function(){

    },
    navigatorTo: function(){
        const {} = this.data;
        console.log();
        if(isLogin){

        }

    },
    wxLogin: function(e) {
        const InviteCode = wx.getStorageSync('inviteCode')
        user.login().then(({code})=>{
            console.log("code",code);
            util.request(api.getOpenId, {
                WechatCode: code,
                InviteCode,
                Terminal: 4,
            }).then(res => {
                console.log("res====",res)
                const {token,openId,WechatSessionKey} = res;
                // wx.setStorageSync('openid', data.data.openid);
                // wx.setStorageSync('sessionkey', data.data.sessionKey);
                // wx.setStorageSync('unionid', data.data.unionid)

                util.request(api.oneClickLoginForMinApp, {
                    sessionKey: wx.getStorageSync('sessionkey'),
                    iv: detail.iv,
                    encryptedData: detail.encryptedData,
                    regionName:wx.getStorageSync('dingwei').name,
                    referer,
                }).then((res)=>{
                    const {user,token} = res.data;
                    wx.setStorageSync('userInfo', user);
                    wx.setStorageSync('token', token);
                })
            })
        }).catch((res)=>{
            wx.showToast({
                title: "微信登录失败!"+ res.errMsg ,
                icon: 'none',
            })
        })
        return;
        wx.login({
            success: function(res) {
                if (res.code) {

                } else {
                    reject(res);
                }
            },
            fail: function(err) {
                reject(err);
            }
        });
        user.loginByWeixin(e.detail).then(res => {
            wx.setStorageSync('isFrame', res.data.isFrame);
            const { mobile } = res.data.user;
            if(mobile){
                if(res.data.user.unionId){
                    app.globalData.hasLogin = true;
                    wx.navigateBack({
                        delta: 1,
                        fail:function(){
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        }
                    })
                }else{
                    app.globalData.hasLogin = true;
                    wx.redirectTo({
                        url: '/active/pages/login/login',
                    })
                }
            }else{
                wx.navigateTo({
                    url: '/pages/auth/bindMobile/bindMobile',
                })
            }
        }).catch((err) => {
            app.globalData.hasLogin = false;
            wx.showToast({
                title: "微信登录失败",
                icon: 'none',
            })
        });
    },
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        console.log("eeeeee",e);
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log("res",res);
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },

});