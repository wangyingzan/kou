const utils = require("../../utils/util.js")
const api = require("../../config/api.js")
Page({
    data: {
        list: [],
        address:{

        },
        currentAddress: undefined,
        defaultId: undefined, //当前地址
    },
    onLoad: function (options) {
        const {id} = options
        if(id){
            this.setData({
                currentAddress: Number(id)
            })
        }
    },
    onShow: function () {
       const address =  wx.getStorageSync('selectAddress')
        this.setData({
            address
        })
        this.getList()
    },
    onUnload() {
        const { list,currentAddress } = this.data;
        let address = {};
        list.map((item)=>{
            if(item.addressId === currentAddress){
                address = item;
            }
        })
        console.log("address",address);
        wx.setStorageSync('selectAddress',address)
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
