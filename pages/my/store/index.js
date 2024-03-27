const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
Page({
    data: {
        data:{
            hideBasicStatusFlag: false,
            hideRateStatusFlag: false,
        }
    },
    onLoad: function (options) {

    },
    onShow() {
        const hideBasicStatusFlag = wx.getStorageSync("hideBasicStatusFlag");
        const hideRateStatusFlag = wx.getStorageSync("hideRateStatusFlag");
        this.setData({
            hideBasicStatusFlag,
            hideRateStatusFlag
        })
        this.getData();
    },
    getData(){
        utils.request(api.getMyStoreDetail).then(res => {
            this.setData({
                data: res
            })
        })
    },
    editStore:function(){
        const { basicModifyRecordId,basicModifyStatus,storeId } = this.data.data;
        if(basicModifyStatus === 0 || basicModifyStatus === 2){
            wx.navigateTo({
                url: `./edit/store?recordId=${basicModifyRecordId}&storeId=${storeId}`
            })
        }else{
            wx.navigateTo({
                url: `./edit/storeResult?recordId=${basicModifyRecordId}`
            })
        }

    },
    editRate:function(){
        const {rateMoidfyRecordId,storeId ,rateModifyStatus} = this.data.data;
        if(rateModifyStatus === 0 || rateModifyStatus === 2){
            wx.navigateTo({
                url: `./edit/rate?recordId=${rateMoidfyRecordId}&storeId=${storeId}`
            })
        }else{
            wx.navigateTo({
                url: `./edit/rateResult?recordId=${rateMoidfyRecordId}`
            })
        }

    }
});
