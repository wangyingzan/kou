const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
Page({
    data: {
        code: '获取验证码',
        count: 60,
        phone: undefined,
    },
    onLoad: function (options) {

    },
    onSubmit: function({detail:{value:{phone,code}}}){
        if(!phone || phone.toString().length !== 11){
            wx.showToast({
                title: '请输入正确得手机号码',
                icon: 'none',
            });
            return;
        }else if(!code || code.toString().length !== 6){
            wx.showToast({
                title: '请输入正确得验证码',
                icon: 'none',
            });
            return;
        }
        utils.request(api.verifyPhoneCode,{
            PhoneNumber: phone,    //手机号
            VerifyCode: code,
            SmsType: 5                      //1-登陆注册；2-修改登陆密码；3-修改支付密码；4-绑定手机号；5-修改手机号
        }).then((res)=>{
            wx.redirectTo({
                url: '/pages/my/newPhone/index'
            })
        })
    },
    phoneChange: function({detail:{value}}){
        this.data.phone = value;
    },
    getCode: function () {
        let { count,phone } = this.data;
        // 当count不为0开始倒计时，当count为0就关闭倒计时
        // 设置定时器
        if (this.data.code !== '获取验证码') {
            return;
        }else if(!phone || phone.toString().length !== 11){
            wx.showToast({
                title: '请输入正确得手机号码',
                icon: 'none',
            });
            return;
        }
        utils.request(api.getPhoneCode, {
            PhoneNumber: phone,    //手机号
            SmsType: 5                      //1-登陆注册；2-修改登陆密码；3-修改支付密码；4-绑定手机号；5-修改手机号
        }, 'POST').then((res) => {
            wx.showToast({
                title: '验证码已发送',
                icon: 'none',
            });
        });
        const countdown = setInterval(() => {
            if (count <= 0) {
                this.setData({
                    code: '获取验证码',
                });
                // 取消定时器
                clearInterval(countdown);
            } else {
                this.setData({
                    code: count-- + "s",
                });
            }
        }, 1000);
    },
});
