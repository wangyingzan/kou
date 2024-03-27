const utils = require("../../../../utils/util.js")
const api = require("../../../../config/api.js")
Page({
    data: {
        entryStatus: '',           //入驻状态 0-未提交；1-审核中；2-审核通过；3-审核拒绝
        refuseReason: ''         //审核失败原因，只有当状态为3时，有值
    },
    onLoad: function (options) {
        this.getData();
    },
    getData: function(){
        utils.request(api.getStoreStatus).then((res)=>{
            const {entryStatus,refuseReason }= res;

            this.setData({
                entryStatus,           //入驻状态 0-未提交；1-审核中；2-审核通过；3-审核拒绝
                refuseReason         //审核失败原因，只有当状态为3时，有值
            })
        })
    },
});
