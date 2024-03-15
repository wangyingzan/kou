Page({
    data: {
        orderNo:undefined
    },
    onLoad: function (options) {
        const {orderNo} = options;
        this.setData({
            orderNo
        })
    }
});
