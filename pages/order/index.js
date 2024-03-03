const app = getApp()
const utils = require("../../utils/util.js")
const api = require("../../config/api.js")

Page({
    data: {
        goodsIds: [],
        goodsNum: undefined,
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
        console.log("goodsIDs",goodsIds)
        this.data.goodsIds = goodsIds.split(',');
        this.data.goodsNum = goodsNum;
        // this.createOrder();
        // this.getAddress();
    },
    onShow() {
        const address = wx.getStorageSync("address");
        if(address){
           this.setData({
               address
           })
        }
    },
    createOrder: function(){
        const { goodsIds,goodsNum } = this.data;
        console.log("ccon",goodsIds.join(','));
        if(goodsNum){ //直接购买商品
            utils.request(api.confirmOrder,{
                GoodsId: goodsIds.join(','),
                Count: goodsNum
            }).then((res)=>{
                const {cartData:goodsList} = res;

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
    onUnload() {
        wx.removeStorageSync("address")
    },
    onPay: function(){

        utils.request(api.getCartList).then((res)=>{
            const {cartData:goodsList} = res;
            this.setData({
                goodsList
                // emptyFlag: !list.length
            })
            if(initFlag){
                this.data.initFlag = false
                this.initCart()
            }

        })


        wx.requestPayment({
            nonceStr: prePayTn.nonceStr + '',
            package: prePayTn.package,
            paySign: prePayTn.paySign,
            timeStamp: prePayTn.timeStamp + '',
            signType: prePayTn.signType,
            success: function (res) {
                console.log(res);
                if (res.errMsg == "requestPayment:ok") {
                    wx.showToast({
                        title: '支付成功',
                        mask: true,
                        duration: 3000
                    })
                    var reqData = that.data.reqData;
                    reqData.status = 1;
                    that.setData({
                        reqData: reqData
                    })
                    that.setData({
                        note: '支付成功'
                    })
                } else {
                    var reqData = that.data.reqData;
                    reqData.status = 2;
                    that.setData({
                        reqData: reqData
                    })
                    wx.showToast({
                        title: '支付失败',
                        mask: true,
                        duration: 3000
                    })
                    that.setData({
                        note: '支付失败'
                    })
                }
            },
            fail: function (res) {
                var reqData = that.data.reqData;
                reqData.status = 2;
                that.setData({
                    reqData: reqData
                })
                that.setData({
                    note: '支付失败'
                })
            }
        })
    },
});
