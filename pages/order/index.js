const app = getApp()
const utils = require("../../utils/util.js")
const api = require("../../config/api.js")

Page({
    data: {
        goodsIds: [],
        goodsNum: undefined,
        remark: undefined,
        orderData: {
            goodsData: []
        },
        address: {
            "contactName": undefined,             //联系人姓名
            "contactPhone": undefined,       //联系人电话
            "provinceCode": undefined,              //省code
            "cityCode": undefined,                  //市code
            "zoneCode": undefined,                  //区县code
            "detail": undefined,             //详细地址
            "areaInfo": undefined, //省市区信息
            "isDefault": undefined,                      //是否默认收货地址
            "addressId": undefined                       //收货地址ID
        },
    },
    onLoad: function (options) {
        const { goodsIds ,goodsNum} = options
        this.data.goodsIds = goodsIds.split(',');
        this.data.goodsNum = goodsNum;
        this.createOrder();
        this.getAddress();
    },
    onShow() {
        const address = wx.getStorageSync("selectAddress");
        if(address){
           this.setData({
               address
           })
        }
    },
    getWxAddress: function(){
        wx.chooseAddress({
            success: (res)=> {
                const {cityName,countyName,provinceName,userName,telNumber,detailInfo } = res;
                utils.request(api.addAddress,{
                    IsDefault: 0,
                    AddressId: 0,
                    ProvinceName: provinceName,
                    CityName: cityName,
                    CountyName: countyName,
                    ContactName: userName,
                    ContactPhone: telNumber,
                    Detail: detailInfo,
                }).then((res)=>{
                    this.setData({
                        address: res.list[0]
                    })

                })
            }
        })
    },
    createOrder: function(){
        const { goodsIds,goodsNum } = this.data;
        if(goodsNum){ //直接购买商品
            utils.request(api.confirmOrder,{
                GoodsId: goodsIds.join(','),
                Count: goodsNum
            }).then((res)=>{
                this.setData({
                    orderData: res
                })
                console.log("order",res);
            })

        }else{ //从购物车购买商品
            utils.request(api.confirmCartOrder,{
                GoodsIds: goodsIds,
            }).then((res)=>{
                this.setData({
                    orderData: res
                })
            })
        }
    },
    getAddress: function (){
        utils.request(api.getDefaultAddress).then((res)=>{
            this.setData({
                address: res
            })
        })
    },
    editAddress: function (){
        const {address} = this.data
        wx.setStorageSync('selectAddress',address);
        wx.navigateTo({
            url: `/pages/address/index?id=${address.addressId}`
        })
    },
    onUnload() {
        wx.removeStorageSync("selectAddress")
    },
    onPay: function(){
        const { remark,address,orderData } = this.data;
        const goodsData = orderData.goodsData.map((item)=>{
            return {
                GoodsId: item.goodsId,
                Count: item.count
            }
        })
        utils.request(api.submitOrder,{
            "Remark": remark,      //订单备注信息
            "AddressId":address.addressId,        //收货地址ID
            "GoodsData": goodsData
        }).then((res)=>{
            const {orderNo,isPay} = res;
            if(isPay === 1){ //去支付
                this.pay(orderNo)
            }
        })
    },
    pay: function(orderNo){
        utils.request(api.payOrder,{
            OrderNo: orderNo
        }).then((res)=>{
            const { wePaySign } = res;
            if(wePaySign){
                const  prePayTn = JSON.parse(wePaySign)
                wx.requestPayment({
                    nonceStr: prePayTn.nonceStr,
                    package: prePayTn.package,
                    paySign: prePayTn.paySign,
                    timeStamp: prePayTn.timeStamp,
                    signType: prePayTn.signType,
                    success: function (res) {
                        console.log(res);
                        if (res.errMsg == "requestPayment:ok") {
                            wx.navigateTo({
                                url: `/pages/order/success/index?orderNo=${orderNo}`
                            })

                        } else {
                            wx.showToast({
                                title: '支付失败',
                                mask: true,
                                duration: 3000
                            })
                            setTimeout(()=>{
                                wx.navigateTo({
                                    url: `/pages/order/detail/index?orderNo=${orderNo}`
                                })
                            },1000)
                        }
                    },
                    fail: function (res) {

                        wx.showToast({
                            title: '支付失败',
                            icon: 'none'
                        })
                        setTimeout(()=>{
                            wx.navigateTo({
                                url: `/pages/order/detail/index?orderNo=${orderNo}`
                            })
                        },1000)
                    }
                })
            }
        })


    }
});
