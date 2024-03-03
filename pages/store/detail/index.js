const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
Page({
    data: {
        id: undefined,
        data: {},
    },
    onLoad: function (options) {
        this.setData({
            id: options.id
        })
        this.getData()
    },
    getData: function(){
        const { id } = this.data;
        utils.request(api.getStoreDetail,{
            StoreId: id
        }).then((res)=>{
            this.setData({
                data: res
            })
        })
    },
    goPhone: function(){
      const { servicePhone } = this.data.data;
    },
});
