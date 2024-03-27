const utils = require("../../../../utils/util.js")
const api = require("../../../../config/api.js")
import WxValidate from '../../../../utils/WxValidate';

Page({
    data: {

    },
    onLoad: function (options) {
        this.initValidate();
    },
    formSubmit({detail:{value}}) {
        const { isDefault,id,cityId,region } = this.data;
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
            if( region.length < 3 ){
                wx.showToast({
                    icon: 'none',
                    title: '请选择省市区'
                })
                return
            }
            utils.request(api.addAddress,{
                IsDefault: isDefault,
                AddressId: id,
                CountyCode:cityId,
                ProvinceName: region[0],
                CityName: region[1],
                CountyName: region[2],
                ...value
            }).then((res)=>{
                wx.showToast({
                    title: '添加成功',
                    icon: "none",
                    duration: 1000
                })
                setTimeout(()=>{
                    wx.navigateBack()
                },1000)

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
