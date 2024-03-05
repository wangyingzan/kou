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
            const {goodsId} = this.data.data;
            utils.request(api.addCart,{
                GoodsId: goodsId,
                Count: 1
            }).then((res)=>{
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
