const app = getApp()
const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
Page({
    data: {
        goodsId: '',
        goodsNum: 1,
        goods:{
            goodsId: undefined,
            imgData:[],
            goodsName: ''
        },
        guestList: [],
        addType: undefined, //1加入购物车 2立即购买
        modalFlag: false,
    },
    onLoad: function (options) {
        const{ goodsId,inviteCode } = options;
        if(inviteCode){
            wx.setStorageSync("inviteCode",inviteCode)
        }
        this.setData({
            goodsId
        })

        this.getData();
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
            Count: goodsNum
        }).then((res)=>{
            wx.showToast({
                title: ''
            })
            this.modalClose()
        })
    },
    /** 立即购买 */
    buy: function(){
        const { goodsId ,goodsNum} = this.data;
        wx.navigateTo({
            url: `/pages/order/index?goodsIds=${goodsId}&goodsNum=${goodsNum}`
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        const {goods } = this.data;
        const { inviteCode } = wx.getStorageSync('userInfo')
        return {
            title: goods.goodsName,
            path: `/pages/goods/detail/index?goodsId=${goods.goodsId}&inviteCode=${inviteCode? inviteCode:''}`,
            imageUrl: goods.imgData[0]
        }
    }
});
