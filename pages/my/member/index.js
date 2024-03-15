const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
Page({
    data: {
    },
    onLoad: function (options) {

    },
    onSubmit: function({detail:{value:{cardno,cardsecret}}}){
        if(!cardno){
            wx.showToast({
                title: '请输入卡号',
                icon: 'none',
            });
            return;
        }else if(!cardsecret){
            wx.showToast({
                title: '请输入卡密',
                icon: 'none',
            });
            return;
        }
        utils.request(api.activateMember,{
            CardNo: cardno,
            CardSecret: cardsecret,
        }).then((res)=>{
            wx.showToast({
                title: '激活成功',
                icon: "none",
                duration: 1000
            })
            // let userInfo = wx.getStorageSync("userInfo")
            // userInfo.memberLevel = 1;
            // wx.setStorageSync('userInfo',userInfo)
            setTimeout(()=>{
                wx.switchTab({
                    url: '/pages/my/index'
                })
            },1000)
        })
    },
});
