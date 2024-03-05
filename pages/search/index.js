const utils = require("../../utils/util.js")
const api = require("../../config/api.js")
Page({
    data: {
        logs: []
    },
    onLoad: function (options) {
        this.setData({

        })
    },
    onShow() {
       const logs =  wx.getStorageSync('goodsLogs')
        if(logs.length){
            this.setData({
                logs
            })
        }
    },
    searchClick: function ({detail:{value:{keyword}}}){
        if(keyword){
            const { logs } = this.data;
            logs.unshift(keyword)
            wx.setStorageSync('goodsLogs',logs.slice(0,50))
            wx.navigateTo({
                url: '/pages/search/list/index?keyword=' + keyword
            })
        }else{
            wx.showToast({
                title: '请输入商品名称',
                icon: 'none'
            })
        }

    },
    getList: function(){
        const { page, size,keyword} = this.data;
        utils.request(api.getGoodsList,{
            PageIndex: page,
            PageSize:size,
            Keyword:keyword,
            Recommend: 0
        }).then((res)=>{
            this.setData({
                goodsList: res.list,
                total: res.total
            })
        })
    },
});
