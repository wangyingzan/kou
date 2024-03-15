const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
Page({
    data: {
        data:{

        }
    },
    onLoad: function (options) {

    },
    onShow() {
        this.getData();
    },
    getData(){
        utils.request(api.getMyStoreDetail).then(res => {
            this.setData({
                data: res
            })
        })
    },
});
