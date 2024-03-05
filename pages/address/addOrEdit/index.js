const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
import WxValidate from '../../../utils/WxValidate';
Page({
    data: {
        isDefault: 0,
        id: 0,
        cityId: '130424'
    },
    onLoad: function (options) {
        this.initValidate();
    },
    defaultChange: function({detail}){
        console.log("d",detail);
        this.setData({ isDefault: detail });
    },
    formSubmit({detail:{value}}) {
        console.log('form发生了submit事件，携带数据为：', value)
        const { isDefault,id,cityId } = this.data;
            //校验表单
            if (!this.WxValidate.checkForm(value)) {
                const error = this.WxValidate.errorList[0]
                console.log("error",error);
                wx.showToast({
                    icon: 'none',
                    title: error.msg
                })
                return false
            }else{
                utils.request(api.addAddress,{
                    IsDefault: isDefault,
                    AddressId: id,
                    CountyCode:cityId,
                    ...value
                }).then((res)=>{
                    wx.showToast({
                        title: '添加成功',
                        icon: "none",
                        duration: 1000
                    },()=>{
                        wx.navigateBack()
                    })

                })
            }


    },
    //验证函数
    initValidate() {
        const rules = {
            ContactName: {
                required: true,
                maxlength: 30
            },
            ContactPhone: {
                required: true,
                tel: true,
            },
            Detail: {
                required: true,
                maxlength: 128
            },
        }
        const messages = {
            ContactName: {
                required: '请输入收货人姓名',
            },
            ContactPhone: {
                required: '请输入手机号'
            },
            Detail: {
                required: '请输入收货地址'
            },
        }
        this.WxValidate = new WxValidate(rules, messages)
    },
});
