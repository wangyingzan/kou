let CityUtils = require('../../../utils/city.js');
const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
const app = getApp()
Page({
    data: {
        cityList: {},
        hotCity: [],
        currentCity:{
            name:'石家庄',
            code: 100001
        }
    },
    onLoad: function (options) {
        this.setData({
            cityList: CityUtils.city
        })
        this.getData();
    },
    getData: function(){
        utils.request(api.getHotCity).then((res)=>{
            console.log("res",res.list)
            this.setData({
                hotCity: res.list
            })
        })
    },
    onClick: function({currentTarget:{dataset:{name,code}}}){
        wx.setStorageSync("selectedCity",{name,code})
        wx.navigateBack()
    },
    resetCity: function(){
        app.getCurrentCity().then((res)=>{
            const { cityName } = res;
            this.setData({
                currentCity: { name: cityName}
            })
            wx.removeStorageSync('selectedCity')
        }).catch(()=>{

        })
    }
});
