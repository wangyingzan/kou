const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
const app = getApp()
Page({
    data: {
        time: '',
        weekDay: '',
        date: '',
        storeId: '',
        lat: '',
        lng: '',
        data:{

        }
    },
    onLoad: function (options) {
        const storeId = options;
        const intervalId = setInterval(()=>{
            this.setData({
                time: utils.formatTimeToClock(new Date())
            })
        },1000)
        this.setData({
            intervalId,
            weekDay: utils.formatTimeWeek(new Date()),
            date: utils.formatTimeDate(new Date()),
            storeId,
        })
    },
    onShow() {
        app.getCurrentCity().then((res)=>{
            const { gpsLat,gpsLng } = res;
            this.setData({
                lat: gpsLat,
                lng: gpsLng
            })
            this.getData();
        }).catch(()=>{
            this.getData();
        })
    },
    getData(){
        const { storeId,lng,lat } = this.data;
        utils.request(api.memberVerify,{StoreId:1,GpsLat:lat,GpsLng:lng}).then(res => {
            this.setData({
                data: res
            })
        })
    },
    onUnload() {
        const {intervalId} = this.data;
        clearInterval(intervalId)
    }
});
