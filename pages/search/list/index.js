const app = getApp()
const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
Page({
    data: {
        goodsList:[],
        page:1,
        size: 10,
        keyword: '',
    },
    onLoad: function (options) {
        const {keyword} = options;
        this.setData({
            keyword
        })
        this.getList();
    },
    search: function ({detail:{value:{keyword}}}){
        this.setData({
            page: 1,
            keyword
        })
        this.getList()
    },
    getList: function(){
        const { page, size,keyword} = this.data;
        utils.request(api.getGoodsList,{
            PageIndex: page,
            PageSize: size,
            Keyword: keyword,
            Recommend: 0
        }).then((res)=>{
            let list = this.data.list;
            if(page === 1){
                list = res.list;
            }else{
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
        const {size,list,page} = this.data;
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
