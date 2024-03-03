const utils = require("../../utils/util.js")
const api = require("../../config/api.js")
Page({
    data: {
        option1: [
            { text: '全市', value: 0 },
            { text: '新款商品', value: 1 },
            { text: '活动商品', value: 2 },
        ],
        option2: [
            { text: '默认', value: 'a' },
            { text: '好评优先', value: 'b' },
        ],
        option3: [
            { text: '全部', value: 'a' },
            { text: '9折以下', value: 'b' },
            { text: '7折以下', value: 'c' },
        ],
        value1: 0,
        value2: 'a',
        value3: 'a',
        list: [],
        page: 1,
        size: 10,
    },
    onLoad: function (options) {
        this.getList();
    },
    getList: function () {
        const {page, size, cateId} = this.data;
        utils.request(api.getStoreList, {
            PageIndex: page,
            PageSize: size,
            Keywords: '',
            CateId: cateId,
        }).then((res) => {
            let list = this.data.list;
            if (page === 1) {
                list = res.list;
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
