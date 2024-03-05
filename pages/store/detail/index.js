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
        wx.makePhoneCall({
            phoneNumber: servicePhone,
        })
    },
    goMap: function(){
        const { gpsLng, gpsLat,storeName,address} = this.data.data;
        return
        const ulocation=this.bMapTransQQMap(gpsLng, gpsLat);

        wx.openLocation({
            latitude: ulocation.lat,
            longitude: ulocation.lng,
            name:storeName,
            address:address,
        })
    },
    /** 百度坐标转腾讯坐标 */
    bMapTransQQMap:function(lng, lat) {
        let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        let x = lng - 0.0065;
        let y = lat - 0.006;
        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        let lngs = z * Math.cos(theta);
        let lats = z * Math.sin(theta);

        return {
            lng: lngs,
            lat: lats
        }
    },
});
