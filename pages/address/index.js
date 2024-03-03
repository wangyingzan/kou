const utils = require("../../utils/util.js")
const api = require("../../config/api.js")
Page({
    data: {
        list: [{

        },{}],
        currentAddress: '',
    },
    onLoad: function (options) {
        // this.getList()
    },
    selectedAddress: function(event){
        this.setData({
            currentAddress: event.detail,
        });
    },
    getList: function(){
        utils.request(api.getAddressList).then((res)=>{
            this.setData({
                list: res.list,
            })
        })
    },
});
