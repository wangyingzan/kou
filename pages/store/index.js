const utils = require("../../utils/util.js")
const api = require("../../config/api.js")
const app = getApp()
Page({
    data: {
        option1: [
            { text: '全市', value: '' },
            { text: '长安区', value: 1 },
            { text: '桥西区', value: 2 },
        ],
        option2: [
            { text: '默认', value: 0 },
            { text: '好评优先', value: 1 },
        ],
        option3: [
            { text: '全部', value: 0 },
            { text: '9折以下', value: 9 },
            { text: '7折以下', value: 7 },
        ],
        districtCode: '', //SortField
        sortField: 0,
        rate: 0,
        list: [],
        page: 1,
        size: 10,
        currentCity: {
            name: '石家庄'
        },
        storeName: ''
    },
    onLoad: function (options) {

    },
    onShow() {
        const selectedCity = wx.getStorageSync("selectedCity")
        const dingwei = wx.getStorageSync("dingwei")
        if(selectedCity){
            this.setData({
                currentCity: selectedCity
            })
        }else if(dingwei){
            this.setData({
                currentCity: dingwei
            })
        }else{
            app.getCurrentCity().then(res=>{
                const { cityName } = res;
                this.setData({
                    currentCity: { name: cityName}
                })
                wx.removeStorageSync('selectedCity')
            })
        }
        this.getList();
    },
    storeNameChange: function({detail:{value}}){
        this.setData({
            storeName: value
        })
    },
    getList: function () {
        const {page, size, cateId,sortField,rate,districtCode,currentCity,storeName } = this.data;
        const {lat=0,lng=0  } = wx.getStorageSync('dingwei')
        utils.request(api.getStoreList, {
            PageIndex: page,
            PageSize: size,
            Keywords: storeName,
            CityName: currentCity.name,
            SortField: sortField,
            DistrictCode: districtCode,
            Rate: rate,
            CateId: cateId,
            GpsLat:lat,
            GpsLng:lng,
        }).then((res) => {
            let list = this.data.list;
            if (page === 1) {
                list = res.list;
            } else {
                list = list.concat(res.list);
            }
            this.setData({
                list,
                // emptyFlag: !list.length
            })
        })
    },
    selectedChange: function({detail,currentTarget:{dataset:{name}}}){
        this.setData({
            [ `${name}` ]: detail
        })
        this.getList()
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        const {size, list, page} = this.data;
        if (list.length === size * page) {
            this.setData({
                page: page + 1
            });
            this.getList();
        } else {
            wx.showToast({
                title: '没有更多了',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
    },
});
