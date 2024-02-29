const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
Page({
    data: {
        goods:{},
        page: 1,
        size: 10,
        tab: 0,//评论类型 0-全部；1-好评；2-中评；3-差评
        list: []
    },
    onLoad: function (options) {
        const{ goodsId } = options;
        this.setData({
            goodsId
        })
        this.getData();
    },
    getData: function(){
        const { goodsId,tab,size,page} = this.data;
        utils.request(api.getGoodsCommentList,{
            GoodsId: goodsId,
            CommentType: tab,
            PageSize: size,
            PageIndex: page
        }).then((res)=>{
            let list = this.data.list;
            if(page === 1){
                list = res.commentData;
            }else{
                list = list.concat(res.commentData);
            }
            this.setData({
                goods: res,
                list,
                // emptyFlag: !list.length
            })
        })
    },
    tabsChange: function({currentTarget:{dataset:{tab}}}){
        this.setData({
            tab,
            pageIndex: 1,
        })
        this.getData();
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
            this.getData();
        } else {
            wx.showToast({
                title: '没有更多了',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
    },
});
