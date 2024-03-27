const utils = require('../../utils/util.js');
const api = require('../../config/api.js');

Component({
    properties: {
        data:{
            type: Object,
            value: {}
        }
    },
    data: {
    },
    methods: {
        addCard: function(){
            const {goodsId,purchaseLimit} = this.data.data;
            if( purchaseLimit > 0){
                this.setData({
                    ['data.purchaseLimit']: purchaseLimit - 1
                })
                this.add(goodsId);
            }else if(purchaseLimit === 0){
                wx.showToast({
                    title: '您本月的会员专享菜品已用完，请下月再来',
                    icon: 'none'
                })
            }else{
                this.add(goodsId);
            }
        },
        add: function(goodsId){
            utils.request(api.addCart,{
                GoodsId: goodsId,
                Count: 1
            }).then((res)=>{
                if(this.getTabBar()){
                    this.getTabBar().getGoodsNum()
                }
                wx.showToast({
                    title: '已添加到购物车',
                    icon: 'none'
                })
            })
        },
        goDetail: function(){
            const { goodsId } = this.data.data;
            wx.navigateTo({
                url: `/pages/goods/detail/index?goodsId=${goodsId}`
            })
        }
    }
});
