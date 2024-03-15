Page({
    data: {
        list:[],
        orderData: {}
    },
    onLoad: function (options) {

    },
    onShow() {
        const list = wx.getStorageSync('logistics');
        const orderData = wx.getStorageSync('orderData');
        this.setData({
            list,
            orderData
        })

    }
});
