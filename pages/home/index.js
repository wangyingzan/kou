const app = getApp()
const utils = require("../../utils/util.js")
const api = require("../../config/api.js")
Page({
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuHeight: app.globalData.menuHeight,
        menuTop: app.globalData.menuTop,
        list:[],
        homeData:{
            bannerData:[],
        },
        cateList: [],
        page: 1,
        size: 10,
        cateId: 0, //分类ID，0为所有
        recommend: 0, //推荐商品 1-是；0-否
        total: 0,
    },
    onLoad: function (options) {
        this.getData();
        this.getCateList();
        this.getList();
    },
    getData: function(){
        utils.request(api.getHomeData,{}).then((res)=>{
            this.setData({
                homeData: res
            })
        })
    },
    getList: function(){
        const { page, size,cateId} = this.data;
        utils.request(api.getGoodsList,{
            PageIndex: page,
            PageSize: size,
            CateId: cateId,
            Recommend: cateId===0? 1:0
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
    getCateList: function(){
        utils.request(api.getGoodsCategory,{}).then((res)=>{
            console.log("res.list",res.list);
            this.setData({
                cateList: res.list
            })
        })
    },
    tabsChange: function({currentTarget:{dataset:{id}}}){
        this.setData({
            cateId: id,
        })
        this.getList();
    },
    scanCode: function(){
        wx.scanCode({
            success(res){
                console.log(res);
            }
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
