const app = getApp()
const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
Page({
    data: {
        goodsId: '',
        goods:{
            imgData:[],
        },
        guestList: [],
    },
    onLoad: function (options) {
        const{ goodsId } = options;
        this.setData({
            goodsId
        })
        this.getData();
        this.getGuestList()
    },
    getData: function(){
        const { goodsId }=this.data;
        utils.request(api.getGoodsDetail,{
            GoodsId: goodsId
        }).then((res)=>{
            if(res.description){
                res.description = utils.replaceSpecialChar(res.description)
            }
            this.setData({
                goods: res
            })
        })
    },
    getGuestList: function(){
        const { goodsId }=this.data;
        utils.request(api.getGuestList,{
            GoodsId: goodsId
        }).then((res)=>{
            this.setData({
                guestList: res.list
            })
        })
    },

});
