const utils = require("../../../../utils/util.js")
const api = require("../../../../config/api.js")

Page({
    data: {
        page:1,
        size: 10,
        list: [],
    },
    onLoad: function (options) {
    },
    onShow() {
        this.data.page =  1;
        this.data.list = []
        this.getList();
    },
    getList: function(){
        const { page, size} = this.data;
        utils.request(api.myStoreLogList,{
            PageIndex: page,
            PageSize: size,
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
