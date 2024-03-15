const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
import Dialog from '@vant/weapp/dialog/dialog';

Page({
    data: {
        status: '0', //订单状态 0-全部；1-待付款；2-待发货；3-待收货；4-待评价
        page:1,
        size: 10,
        list: [],
    },
    onLoad: function (options) {
        const { status }= options;
        this.setData({
            status
        })
    },
    onShow() {
        this.getList()
    },
    onStatusChange: function ({detail: {name}}){
        this.setData({
            page: 1,
            status: name
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
            wx.showToast({
                title: '没有更多了',
                icon: 'none',
                duration: 2000
            });
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
            })

        }).catch(() => {
                // on cancel
            });

    }
});
