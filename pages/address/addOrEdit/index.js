const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
import WxValidate from '../../../utils/WxValidate';
const app = getApp();
Page({
    data: {
        isDefault: 0,
        id: 0,
        region: [],
        data: {},
        customItem: '全部'
    },
    onLoad: function (options) {
        const { id }=options;
        if(id){
            this.setData({
                id
            })
            wx.setNavigationBarTitle({
                title: '编辑收获地址'
            })
            this.getData()
        }else{
            wx.setNavigationBarTitle({
                title: '新增收获地址'
            })
        }

        this.initValidate();
    },
    getData: function(){
        const { id } = this.data;
        utils.request(api.getAddressDetail,{AddressId:id}).then((res)=>{
            this.setData({
                data: res,
                isDefault: res.isDefault,
                region: res.areaInfo.split(' ')
            })
        })
    },
    defaultChange: function({detail}){
        this.setData({ isDefault: detail });
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
                        wx.setStorageSync('currentAddressId',res.list[0].addressId)
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
    bindRegionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
    },
    openMap: function(){
       app.getCurrentCity().then(res=>{
           const { provinceName,cityName,zoneName } = res;
           this.setData({
               region: [provinceName,cityName,zoneName]
           })
       })
    }
});
