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
    onClick: function({currentTarget:{dataset:{id}}}){
        this.data.currentAddress = id;
        wx.navigateBack()
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
    setDefault: function({currentTarget:{dataset:{id}}}){
        utils.request(api.setAddressDefault,{
            AddressId:id
        }).then((res)=>{
            wx.showToast({
                title: '操作成功',
                icon: 'none'
            })
            this.getList();
        })
    },
    delAddress: function({currentTarget:{dataset:{id}}}){
        utils.request(api.delAddress,{
            AddressId:id
        }).then((res)=>{
            wx.showToast({
                title: '操作成功',
                icon: 'none'
            })
            this.getList();
        })
    },
    editAddress: function({currentTarget:{dataset:{id}}}){
        wx.navigateTo({
            url: `./addOrEdit/index?id=${id}`
        })
    },
});
