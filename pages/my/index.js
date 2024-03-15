import Dialog from '@vant/weapp/dialog/dialog';

const app = getApp()
const user = require('../../utils/user');
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuHeight: app.globalData.menuHeight,
        menuTop: app.globalData.menuTop,
        userInfo: {},
        dataInfo: {},
        data: {},
        isLogin: false,
    },
    onLoad: function (options) {
        // wx.setStorageSync("isLogin", true)
    },
    onShow: function () {
        const isLogin = wx.getStorageSync("isLogin");
        const userInfo = wx.getStorageSync("userInfo");
        this.setData({
            isLogin,
            userInfo
        })
        if (isLogin) {
            this.getData()
            this.getHomeInfo()
        }
    },
    login: function () {

    },
    goInfo: function ({currentTarget: {dataset: {type}}}) {
        const {isLogin} = this.data;
        if (isLogin) {
            switch (type) {
                case 'store_member': //共享会员店
                    break;
                case 'store_history': //到店记录
                    wx.navigateTo({
                        url: '/pages/store/log/index'
                    })
                    break;
                case 'member_activate': //会员激活
                    break;
                case 'modify_phone': //更换手机号
                    this.onChangePhone()
                    break;
                case 'sign_out': //退出登录
                   this.unLogin();
                    break;
                default:
                    return
            }

        } else {
            wx.showToast({
                title: '请先登录',
                icon: 'none'
            })
        }

    },
    navigatorTo: function ({currentTarget: {dataset: {url}}}) {
        const {isLogin} = this.data;
        if (isLogin) {
            wx.navigateTo({
                url: url
            })
        } else {
            wx.showToast({
                title: '请先登录',
                icon: 'none'
            })
        }

    },
    wxLogin: function (e) {
        const InviteCode = wx.getStorageSync('inviteCode')
        user.login().then(({code}) => {
            util.request(api.getOpenId, {
                WechatCode: code,
                InviteCode,
                Terminal: 4,
            }).then(res => {
                const {token, openId, WechatSessionKey, ...userInfo} = res;
                this.setData({
                    userInfo,
                    isLogin: true,
                });
                this.getData()
                wx.setStorageSync('token', token);
                wx.setStorageSync("isLogin", true);
                wx.setStorageSync('userInfo', userInfo);
                this.getHomeInfo();
                // wx.setStorageSync('unionid', data.data.unionid)
            })
        }).catch((res) => {
            wx.showToast({
                title: "微信登录失败!" + res.errMsg,
                icon: 'none',
            })
        })
    },
    getData: function () {
        util.request(api.getHomeData).then(res => {
            this.setData({
                data: res
            })
        })
    },
    getHomeInfo: function () {
        util.request(api.getHomeInfo).then(res => {
            this.setData({
                dataInfo: res
            })
        })
    },
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        console.log("eeeeee", e);
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log("res", res);
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },
    unLogin: function () {
        Dialog.confirm({
            title: '退出登录',
            message: '您当前确认要退出吗？',
        }).then(() => {
            // on confirm
            util.request(api.unLogin).then(res => {
                wx.removeStorageSync('userInfo');
                wx.removeStorageSync('token');
                wx.removeStorageSync('isLogin');
                this.setData({
                    userInfo: {},
                    isLogin: false,
                })
            })

        })
            .catch(() => {
                // on cancel
            });

    },
    onChangePhone: function () {
        const {phoneNumber} = this.data.userInfo;
        if (phoneNumber) {
            wx.navigateTo({
                url: '/pages/my/phone/index'
            })
        } else {
            wx.navigateTo({
                url: '/pages/my/newPhone/index'
            })
        }

    },
});
