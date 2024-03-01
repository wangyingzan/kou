const app = getApp()
const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
Page({
    data: {
        goodsId: '',
        goodsNum: 1,
        goods:{
            imgData:[],
        },
        guestList: [],
        addType: undefined, //1加入购物车 2立即购买
        modalFlag: false,
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
    goodsNumChange: function(e){
        this.setData({ goodsNum:e.detail });
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
    showModal: function({currentTarget:{dataset:{type}}}){
        console.log("type",type)
      this.setData({
          addType: type,
          modalFlag: true
      })
    },
    confirmOrder: function(){
        const { addType }=this.data;
        if(addType === '1'){
            this.addCard()
        }else{
            this.buy()
        }
    },
    modalClose: function (){
        this.setData({
            modalFlag: false
        })
    },
    addCard: function(){
        const { goodsId,goodsNum }=this.data;
        utils.request(api.addCart,{
            GoodsId: goodsId,
            Count: 1
        }).then((res)=>{
            wx.showToast({
                title: ''
            })
            this.modalClose()
        })
    },
    /** 立即购买 */
    buy: function(){

    }
});
