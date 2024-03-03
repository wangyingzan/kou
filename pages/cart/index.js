const app = getApp()
const utils = require("../../utils/util.js")
const api = require("../../config/api.js")
import Dialog from '@vant/weapp/dialog/dialog';
Page({
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuHeight: app.globalData.menuHeight,
        menuTop: app.globalData.menuTop,
        goodsList: [],
        allGoodsFlag: undefined,
        allGoodsMoney: undefined,
        goodsListFlag: [],
        initFlag: true, // 是否第一次加载
        selectedGoodsNum: 0,
        cart:{

        }
    },
    onLoad: function (options) {

    },
    onShow() {
        this.getData();
    },
    getData: function(){
        const {initFlag,goodsListFlag} = this.data;
        utils.request(api.getCartList).then((res)=>{
            const {cartData:goodsList,...cart} = res;
            this.setData({
                cart: cart,
                goodsList,
                // emptyFlag: !list.length
            })
            if(initFlag){
                this.data.initFlag = false
                this.initCart()
            }else{
                this.countAmount()
            }

        })
    },
    initCart: function(){
        const { goodsList } = this.data;
        const goodsListFlag = goodsList.map(item=>{
            return  item.goodsId.toString()
        })
        this.setData({
            goodsListFlag,
        })
        this.countAmount();
    },
    countAmount:function(){
        const { goodsList,goodsListFlag } = this.data;
        let amount = 0,goodsNum = 0;
        goodsList.map((item,index)=>{
            if(goodsListFlag.indexOf(item.goodsId.toString()) !== -1 ){
                amount += Number(item.salePrice) * item.count
                goodsNum += item.count
            }
        })
        this.setData({
            allGoodsMoney: amount,
            selectedGoodsNum: goodsNum,
            allGoodsFlag: goodsList.length === goodsListFlag.length
        })
    },
    selectedGoods: function(event){
        this.setData({
            goodsListFlag: event.detail,
        });
        this.countAmount();
    },

    allGoodsChange: function(e){
        const allGoodsFlag = e.detail;
        if(allGoodsFlag){ //全选
            this.initCart();
        }else{
            this.setData({
                goodsListFlag: [],
                allGoodsMoney: 0
            })
        }
        this.setData({
            allGoodsFlag
        })
    },
    goodsNumChange: function({detail:goodsNum,target:{dataset:{goods,index}}}){
        const { goodsId } = goods;
        if(goodsNum === 0){
            this.delConfirm(goods.goodsId,index)
        }else{
            this.setData({
                [`goodsList[${index}].count`] : goodsNum
            });
            utils.request(api.cartNumChange,{
                GoodsId: goodsId,
                Count: goodsNum
            }).then((res)=>{
                this.countAmount()
            })
        }
    },
    delConfirm: function(goodsId,index){
        Dialog.confirm({
            title: '提示',
            message: '确定删除这件商品吗？',
        }).then(() => {
            const { goodsList } = this.data;
            utils.request(api.delCart,{
                    "GoodsIds":[goodsId]
                }).then((res)=>{
                    goodsList.splice(index,1);
                    this.setData({
                        goodsList
                    },()=>{
                        this.countAmount()
                    })
                })
            }).catch()
    },
    delGoods: function(){

    },
    onPay: function(){
        const { goodsListFlag } = this.data;
        wx.navigateTo({
            url: '/pages/order/index?goodsIds=' + goodsListFlag.join(',')
        })
    },
});
