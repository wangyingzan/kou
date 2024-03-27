const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
import Dialog from '@vant/weapp/dialog/dialog';

Page({
    data: {
        status: '0', //订单状态 0-全部；1-待付款；2-待发货；3-待收货；4-待评价
        page:1,
        size: 10,
        list: [],
        dataInfo:{}
    },
    onLoad: function (options) {
        const { status }= options;
        this.setData({
            status
        })
    },
    onShow() {
        this.getList()
        this.getData();
    },
    getData:function(){
        utils.request(api.getHomeInfo).then(res => {
            this.setData({
                dataInfo: res
            })
        })
    },
    onStatusChange: function ({target: {dataset:{status}}}){
        this.setData({
            page: 1,
            status
        })
       this.getList()
    },
    getList: function(){
        const { page, size,status} = this.data;
        utils.request(api.getOrderList,{
            PageIndex: page,
            PageSize: size,
            OrderStatus: status,
        }).then((res)=>{
            let list = this.data.list;
            if(page === 1){
                list = res.list;
            }else{
                list = list.concat(res.list);
            }
            this.setData({
                list,
                // emptyFlag: !list.length
            })
        })
    },
    /** 确认收货 */
    confirmReceipt:function({currentTarget:{dataset:{orderno}}}){
        console.log("1111",orderno);
        utils.request(api.confirmReceipt,{
            OrderNo: orderno,
        }).then((res)=>{
            Dialog.confirm({
                title: '确认收货成功',
                confirmButtonColor:'#4DC185',
                message: '快去参与评价吧',
            }).then(() => {
                // 去评价
                wx.navigateTo({
                    url:`../evaluates/index?orderNo=${orderno}`
                })
            }).catch(() => {
                // on cancel
            });
            this.setData({
                page: 1,
            })
            this.getData()
            this.getList()
        })
    },
    /** 再来一单 */
    moreOrder: function({currentTarget:{dataset:{orderno}}}){
        utils.request(api.moreOrder,{
            OrderNo: orderno,
        }).then((res)=>{
            wx.switchTab({
                url:'/pages/cart/index'
            })
        })
    },
    /** 查看物流 */
    lookLogistics: function({currentTarget:{dataset:{index}}}){
        const { logisticsData=[],...orderData } = this.data.list[index]
        wx.setStorageSync("logisticsData", logisticsData)
        wx.setStorageSync("orderData", orderData)
        wx.navigateTo({
            url: '/pages/order/logistics/index'
        })
    },
    urgeReceipt:function({currentTarget:{dataset:{orderno}}}){
        utils.request(api.urgeReceipt,{
            OrderNo: orderno,
        }).then((res)=>{
            wx.showToast({
                title: '已经帮您催促店家了哦~',
                icon: 'none'
            })
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        const {size,list,page} = this.data;
        if (list.length === size * page) {
            this.setData({
                page: page + 1
            });
            this.getList();
        } else {
            // wx.showToast({
            //     title: '没有更多了',
            //     icon: 'none',
            //     duration: 2000
            // });
            return false;
        }
    },
    goPay: function({currentTarget:{dataset:{orderno}}}){
        wx.navigateTo({
            url: `/pages/order/detail/index?orderNo=${orderno}`
        })
    },
    cancelOrder: function({currentTarget:{dataset:{index,orderno}}}){
        Dialog.confirm({
            title: '取消订单',
            confirmButtonColor:'#4DC185',
            message: '您当前确认取消订单吗？',
        }).then(() => {
            utils.request(api.cancelOrder,{
                OrderNo: orderno,      //订单备注信息
            }).then((res)=>{
                wx.showToast({
                    title: '操作成功',
                    icon: 'none'
                })
                this.setData({
                    [`list[${index}].orderStatusCode`]: 8
                })
                this.getData();
            })

        }).catch(() => {
                // on cancel
            });

    }
});
