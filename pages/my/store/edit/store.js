import WxValidate from "../../../../utils/WxValidate";

const app = getApp();
const utils = require("../../../../utils/util.js")
const api = require("../../../../config/api.js")
Page({
    data: {
        region: [],
        storefrontList: [],//门头照片
        storeInfoList: [], //店内照片
        minHour: '',
        maxHour: '',
        storeId: '',
        currentDate: '',
        currentName: '',
        morningTimeStart: '8:00',
        morningTimeEnd: '12:00',
        afternoonTimeStart: '12:00',
        afternoonTimeEnd: '20:00',
        timeModalFlag: false,
        params:{
            details:'',
            storeName:'',
            servicePhone:'',
        }
    },
    onLoad: function (options) {
        const { recordId,storeId } = options;
        this.setData({
            recordId,
            storeId
        })
        this.initValidate();
    },
    onShow() {
        this.getData();
    },
    getData: function(){
        const { recordId } = this.data;

        utils.request(api.getStoreInfo,{
            RecordId:recordId
        }).then((res)=>{
            const { businessHoursAm,businessHoursPm,storeHeadImg,districtCode,gpsLng,gpsLat,interiorImgs,provinceName,cityName,districtName,...params}= res;
            const businessHoursAmList = businessHoursAm.split('-')
            const businessHoursPmList = businessHoursPm.split('-')
            this.setData({
                region: [provinceName,cityName,districtName],
                gpsLng,
                gpsLat,
                districtCode,
                morningTimeStart: businessHoursAmList[0],
                morningTimeEnd: businessHoursAmList[1],
                afternoonTimeStart: businessHoursPmList[0],
                afternoonTimeEnd: businessHoursPmList[1],
                storefrontList: [{url:storeHeadImg,isImage: true}],
                storeInfoList: interiorImgs.map(i=>{return {url:i,isImage: true}}),
                params:{
                    details: params.details,
                    storeName: params.storeName,
                    servicePhone: params.servicePhone,
                }
            })
            wx.setStorageSync("hideBasicStatusFlag",true)

        })
    },
    //验证函数
    initValidate() {
        const rules = {
            Details: {
                required: true,
                maxlength: 128
            },
            StoreName: {
                required: true,
                maxlength: 30
            },
            ServicePhone: {
                required: true,
                tel: true,
            },

        }
        const messages = {
            Details: {
                required: '请输入详细地址'
            },
            StoreName: {
                required: '请输入店铺名称',
            },
            ServicePhone: {
                required: '请输入联系电话'
            },

        }
        this.WxValidate = new WxValidate(rules, messages)
    },
    confirmTime: function({detail}){
        const { currentName } = this.data;
        this.setData({
            [`${currentName}`]: detail,
            timeModalFlag: false,
        })
    },

    showTimeModal: function({currentTarget:{dataset:{name}}}){
        const time = this.data[name];
        this.setData({
            currentDate: time,
            currentName: name,
            timeModalFlag: true
        })
    },



    openMap: function(){
        wx.chooseLocation({
            success: (res)=>{
                const {latitude, longitude} = res;
                utils.request(api.getCityInfo, {GpsLng: longitude, GpsLat:latitude}).then(res => {
                    const {provinceName,cityName,zoneName,gpsLng,gpsLat,zoneCode} = res;
                    this.setData({
                        region: [provinceName,cityName,zoneName],
                        districtCode:zoneCode,
                        gpsLng,
                        gpsLat
                    })
                });
            }
        })
    },
    timeModalClose: function (){
        this.setData({
            timeModalFlag: false
        })
    },
    formSubmit({detail:{value}}) {
        const { storeId,params,storefrontList,gpsLng,gpsLat,storeInfoList, morningTimeStart,morningTimeEnd,afternoonTimeStart,afternoonTimeEnd,region,districtCode } = this.data;
        if(!districtCode){
            wx.showToast({
                icon: 'none',
                title: '请选择门店地址'
            })
            return
        }else if (!this.WxValidate.checkForm(value)) {
            const error = this.WxValidate.errorList[0]
            wx.showToast({
                icon: 'none',
                title: error.msg
            })
            return false
        }else if(region.length < 3 ){
            wx.showToast({
                icon: 'none',
                title: '请选择门店地址'
            })
            return
        }else if(!storefrontList.length){ //门头照片
            wx.showToast({
                icon: 'none',
                title: '请上传店铺门头照片'
            })
            return

        } else if(!storeInfoList.length){ //环境照片
            wx.showToast({
                icon: 'none',
                title: '请上传店铺内部环境照片'
            })
            return
        }

        utils.request(api.submitStoreInfo, {
            StoreId: storeId,
            ProvinceName: region[0],
            CityName: region[1],
            DistrictName: region[2],
            DistrictCode:districtCode,
            StoreHeadImg: storefrontList.map(item=>{
                return item.url
            })[0],
            InteriorImgs: storeInfoList.map(item=>{
                return item.url
            }),
            BusinessHoursAm: `${morningTimeStart}-${morningTimeEnd}`,
            BusinessHoursPm: `${afternoonTimeStart}-${afternoonTimeEnd}`,
            GpsLng:gpsLng,
            GpsLat:gpsLat,
            ...params,
            ...value,
        }).then((res) => {
            wx.setStorageSync("hideBasicStatusFlag",false)
            wx.reLaunch({
                url: `./storeResult?recordId=${res.recordId}`
            })
        })
    },
    storefrontAfterRead({detail:{file}}) {
        file.map(res=>{
            this.uploadFile(res).then((res)=>{
                // 上传完成需要更新 fileList
                const { storefrontList = [] } = this.data;
                const {imgDomain ,imgUrl } =res;
                storefrontList.push({ ...file, url: imgDomain+imgUrl });
                this.setData({ storefrontList });
            });
        })
    },
    afterRead({detail:{file}}) {
        file.map(res=>{
            this.uploadFile(res).then((res)=>{
                // 上传完成需要更新 fileList
                const { storeInfoList = [] } = this.data;
                const {imgDomain ,imgUrl } =res;
                storeInfoList.push({ ...file, url: imgDomain+imgUrl });
                this.setData({ storeInfoList });
            });
        })
    },

    uploadFile: function(file){
        return new Promise((resolve, reject)=>{
            wx.getFileSystemManager().readFile({
                filePath: file.tempFilePath,
                success:(res)=>{
                    const base64 = wx.arrayBufferToBase64(res.data)
                    utils.request(api.uploadUrl,{
                        "FileName": "微信图片.png",   //图片名称
                        "ImageType": 2,               //图片类型 0-普通；1-商品；2-评论；3-头像；4-微信头像;8-小程序码
                        "FileBase": base64               //图片 base64
                    }).then((res)=>{
                        resolve(res)
                    })
                }
            })
        })

    },
    deleteImg: function({detail}){
        let { storeInfoList } = this.data;
        storeInfoList.splice(detail.index,1)
        this.setData({
            storeInfoList
        })
    },
    storefrontDelete: function(detail){
        let { storefrontList } = this.data;
        storefrontList.splice(detail.index,1)
        this.setData({
            storefrontList
        })
    },
});
