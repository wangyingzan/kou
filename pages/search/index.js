const utils = require("../../utils/util.js")
const api = require("../../config/api.js")
Page({
    data: {},
    onLoad: function (options) {
        this.setData({

        })
    },
    searchClick: function ({detail:{value:{keyword}}}){
        wx.navigateTo({
            url: '/pages/search/list/index？keyword=' + keyword
        })
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
