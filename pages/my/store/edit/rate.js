const utils = require("../../../../utils/util.js")
const api = require("../../../../config/api.js")
Page({
    data: {
        recordId: undefined,
        storeId: undefined,
        summary: undefined,
        rateFocus: false,
        rate: '0.00',
        rateValue: '',
    },
    onLoad: function (options) {
        const { recordId,storeId } = options;
        this.data.recordId = recordId
        this.data.storeId = storeId

    },
    onShow() {
        this.getData()
    },
    getData: function(){
        const { recordId } = this.data;
        utils.request(api.getStoreRateInfo,{RecordId:recordId}).then((res)=>{
            const {rate,summary} = res
            this.setData({
                rate: rate.toFixed(2).toString(),
                summary
            })
           wx.setStorageSync("hideRateStatusFlag",true)
        })
    },

    rateFocus: function(){
        this.setData({
            rateValue: '',
            rateFocus: true
        })
    },

    validateDecimalPoints: function(value) {
        let num = '';
        const reg1 = '/0*[1-9]\d*|0\.\d+)/';
        const reg2 = '/(?:\.0*|(\.\d+?)0+)$/';
        num = value.replace(reg1,'$1').replace(reg2,'$1')
        return num;
    },
    rateChange: function ({detail:{value}}) {
        if(!value || Number.isNaN(parseFloat(value))){
            this.setData({
                rateValue: '',
                rate: '0.00'
            })
            return
        }
        const rate = this.validateDecimalPoints(parseFloat(value).toFixed(2));
        this.setData({
            rateValue: this.validateDecimalPoints(value)
        })
        if(rate > 9 || rate < 5){
            wx.showToast({
                title: '折扣优惠可选区间为5折-9折',
                icon: 'none'
            })
            this.setData({
                rate: '0.00',
                rateValue: null
            })
        }else{
            this.setData({
                rate: rate.toString(),
            })
        }

    },

    submitForm: function () {
        const {rate, summary,storeId} = this.data;
        if (!rate) {
            wx.showToast({
                icon: 'none',
                title: '请输入折扣优惠'
            })
            return
        }else if(rate > 9 || rate < 5){
            wx.showToast({
                title: '折扣优惠可选区间为5折-9折',
                icon: 'none'
            })
        }
        if (!summary) {
            wx.showToast({
                icon: 'none',
                title: '请填写特色介绍'
            })
            return
        }
        utils.request(api.editRate, {
            StoreId: storeId,
            Rate: rate,
            Summary: summary,
        }).then((res) => {
            wx.setStorageSync("hideRateStatusFlag",false)
            wx.reLaunch({
                url: `./rateResult?recordId=${res.recordId}`
            })
        })
    },
    onSummaryChange: function ({detail: {value}}) {
        this.setData({
            summary: value
        })
    }
});
