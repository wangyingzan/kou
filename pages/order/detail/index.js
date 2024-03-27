const app = getApp()
const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
import Dialog from '@vant/weapp/dialog/dialog';
Page({
    data: {
        goodsIds: [],
        logisticsData:[],
        active: 1,
        goodsNum: undefined,
        timeFlag: false,
        remark: undefined,
        time: 0,
        orderData: {
            orderStatusCode: undefined,
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
        const { orderNo } = options
        this.data.orderNo = orderNo;
        this.getData();
    },
    onShow() {
        const address = wx.getStorageSync("selectAddress");
        if(address){
            this.updateAddress(address);
        }
    },
    getData: function(){
        const { orderNo } = this.data;
        utils.request(api.orderDetail,{
            OrderNo: orderNo,
        }).then((res)=>{
            const { addressInfo,logisticsData,...orderData } = res;
            const createTime = new Date(orderData.submitTime).getTime();
            const currentTime = new Date().getTime()
            const time = createTime+ 24*60*60*1000 - currentTime;
            if( time > 0 ){
                this.setData({
                    time
                })
            }
            this.setData({
                orderData,
                logisticsData: logisticsData.map((item)=>{return {desc:item.info}}),
                address: addressInfo
            })
            this.setTitle();
        })
    },
    setTitle:function(){
        const {orderData}=this.data;
        wx.setNavigationBarTitle({
            title:  {1:'待付款',2:'待发货',3:'待收货',4:'待评价',5:'已完成',6:'退款中',7:'已退款',8:'已取消',9:'待自提'}[orderData.orderStatusCode]
        })
    },
    timeFinish: function(){
        this.setData({
            ['orderData.orderStatusCode'] :8
        })
        this.setTitle();
    },
    goLogisticsDetail: function(){
        const { logisticsData,orderData } = this.data;
        wx.setStorageSync('logistics',logisticsData);
        wx.setStorageSync('orderData',orderData);
        wx.navigateTo({
            url: '../logistics/index'
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
    updateAddress: function(address){
        const { orderNo } = this.data;
        utils.request(api.updateAddress,{
            OrderNo: orderNo,      //订单备注信息
            "AddressId":address.addressId,        //收货地址ID
        }).then((res)=>{
            this.setData({
                address
            })
        })
    },
    pay: function(){
        const { orderNo } = this.data
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


    },
    cancelOrder: function(){
        const { orderNo } = this.data;
        Dialog.confirm({
            title: '取消订单',
            confirmButtonColor:'#4DC185',
            message: '您当前确认取消订单吗？',
        }).then(() => {
            utils.request(api.cancelOrder,{
                OrderNo: orderNo,      //订单备注信息
            }).then((res)=>{
                wx.showToast({
                    title: '取消成功',
                    icon: 'none'
                })
                this.setData({
                    'orderData.orderStatusCode': 8
                })
                this.setTitle();
            })
        }).catch(() => {
            // on cancel
        });

    },
    urgeReceipt:function(){
        const { orderNo } = this.data;
        utils.request(api.urgeReceipt,{
            OrderNo: orderNo,
        }).then((res)=>{
            wx.showToast({
                title: '已经帮您催促店家了哦~',
                icon: 'none'
            })
        })
    },
    /** 查看物流 */
    lookLogistics: function(){
        const { logisticsData,...orderData } = this.data.orderData
        wx.setStorageSync("logisticsData", logisticsData)
        wx.setStorageSync("orderData", orderData)
        wx.navigateTo({
            url: '/pages/order/logistics/index'
        })
    },
    confirmReceipt:function(){
        const { orderNo } = this.data;
        utils.request(api.confirmReceipt,{
            OrderNo: orderNo,
        }).then((res)=>{
            Dialog.confirm({
                title: '确认收货成功',
                confirmButtonColor:'#4DC185',
                message: '快去参与评价吧',
            }).then(() => {
                // 去评价
                wx.navigateTo({
                    url:`../evaluates/index?orderNo=${orderNo}`
                })
            }).catch(() => {
                // on cancel
            });
            this.getData()
        })


    },
    moreOrder: function(){
        const { orderNo } = this.data;
        utils.request(api.moreOrder,{
            OrderNo: orderNo,
        }).then((res)=>{
            wx.setStorageSync("selectedGoodsIds",res.selectIds)
            wx.switchTab({
                url:'/pages/cart/index'
            })
        })
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
});
