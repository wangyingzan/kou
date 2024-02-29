const app = getApp()
Page({
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuHeight: app.globalData.menuHeight,
        menuTop: app.globalData.menuTop,
        result: [],
        allGoods: false,
        goodsNum: 1,
    },
    onLoad: function (options) {

    },
    selectedGoods: function(event){
        this.setData({
            result: event.detail,
        });
    },
    allGoodsChange: function(event){

        console.log(event.detail)
        this.setData({
            allGoods: event.detail
        })
    },
    goodsNumChange: function(e){
        console.log(e);
        this.setData({ goodsNum:e.detail });
    }
});
