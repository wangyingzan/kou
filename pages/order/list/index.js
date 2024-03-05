Page({
    data: {
        status: 0, //订单状态 0-全部；1-待付款；2-待发货；3-待收货；4-待评价
    },
    onLoad: function (options) {

    },
    onStatusChange: function (event){
        wx.showToast({
            title: `切换到标签 ${event.detail.name}`,
            icon: 'none',
        });
    }
});
