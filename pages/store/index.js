const utils = require("../../utils/util.js")
const api = require("../../config/api.js")
Page({
    data: {
        option1: [
            { text: '全市', value: '' },
            { text: '长安区', value: 1 },
            { text: '桥西区', value: 2 },
        ],
        option2: [
            { text: '默认', value: 0 },
            { text: '好评优先', value: 1 },
        ],
        option3: [
            { text: '全部', value: 0 },
            { text: '9折以下', value: 9 },
            { text: '7折以下', value: 7 },
        ],
        districtCode: '', //SortField
        sortField: 0,
        rate: 0,
        list: [],
        page: 1,
        size: 10,
    },
    onLoad: function (options) {
        this.getList();
    },
    getList: function () {
        const {page, size, cateId,sortField,rate,districtCode } = this.data;
        utils.request(api.getStoreList, {
            PageIndex: page,
            PageSize: size,
            Keywords: '',
            SortField: sortField,
            DistrictCode: districtCode,
            Rate: rate,
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
    selectedChange: function({detail,currentTarget:{dataset:{name}}}){
        this.setData({
            [ `${name}` ]: detail
        })
        this.getList()
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
