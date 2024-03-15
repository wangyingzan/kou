const utils = require("../../utils/util.js")
const api = require("../../config/api.js")

Component({
    properties: {
            goodsId:{
                type: String,
                value: ''
            }
        },
    data: {
        guestList: [],
    },

    ready: function() {
        console.log("====3333=");
        this.getGuestList()
    },
    methods: {
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
    }
});
