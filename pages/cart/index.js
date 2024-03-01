const app = getApp()
const utils = require("../../utils/util.js")
const api = require("../../config/api.js")
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
        goodsNum: 1,
        cart:{

        }
    },
    onLoad: function (options) {

    },
    onShow() {
        this.getData();
    },
    getData: function(){
        const {initFlag} = this.data;
        utils.request(api.getCartList).then((res)=>{
            const {cartData:goodsList,...cart} = res;
            this.setData({
                cart: cart,
                goodsList
                // emptyFlag: !list.length
            })
            if(initFlag){
                this.data.initFlag = false
                this.initCart()
            }

        })
    },
    initCart: function(){
        const { goodsList,cart } = this.data;
        const goodsListFlag = goodsList.map(item=>{
            return  item.goodsId.toString()
        })
        this.setData({
            goodsListFlag,
            allGoodsFlag: true,
        })
        this.countAmount();
    },
    countAmount:function(){
        const { goodsList,goodsListFlag } = this.data;
        let amount = goodsList.reduce((sumData,key,index,arrData)=>{
            // console.log('a',sumData); // 上⼀次调⽤回调时返回的累积值
            // console.log('b',key); // 正在处理的元素
            // console.log('c',index); // 正在处理的当前元素的索引
            // console.log('d',arrData); //源数组(原数组)
            if(goodsListFlag.indexOf(key.goodsId.toString()) !== -1 ){
                return sumData + Number(key.salePrice)
            }else{
                return sumData
            }
        },0)
        this.setData({
            allGoodsMoney: amount
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
    goodsNumChange: function(e){
        this.setData({ goodsNum:e.detail });
    }
});
