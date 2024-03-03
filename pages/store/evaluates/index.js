const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
Page({
    data: {
        data:{},
        list: [],
        commentTotal: 0,
        page: 1,
        size: 10,
    },
    onLoad: function (options) {
        this.setData({
            id: options.id
        })
        this.getData()
        this.getList()
    },
    getData: function(){
        const { id } = this.data;
        utils.request(api.getStoreCommentHome,{
            StoreId: id
        }).then((res)=>{
            this.setData({
                data: res
            })
        })
    },
    getList: function () {
        const {page, size, id} = this.data;
        utils.request(api.getStoreCommentList, {
            PageIndex: page,
            PageSize: size,
            StoreId: id,
        }).then((res) => {
            let list = this.data.list;
            if (page === 1) {
                list = res.list;
                this.setData({
                    commentTotal: res.total
                })
            } else {
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
        const {size, list, page} = this.data;
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
});
