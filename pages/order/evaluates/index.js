const utils = require("../../../../utils/util.js")
const api = require("../../../../config/api.js")
import Dialog from '@vant/weapp/dialog/dialog';
Page({
    data: {
        num: 0,
        imgNum: 0,
        orderNo: undefined,
        fileList: [],
        rate: 0,
    },
    onLoad: function (options) {
        const {orderNo} = options
        this.setData({
            orderNo
        })
        this.getData();
    },
    getData(){
        const { orderNo } = this.data;
        utils.request(api.getOrderGoodsData,{OrderNo:orderNo}).then(res => {
            this.setData({
                data: res
            })
        })
    },
    deleteImg: function({detail}){
        let { fileList } = this.data;
        fileList.splice(detail.index,1)
        this.setData({
            fileList
        })
    },
    tabChange: function({currentTarget:{dataset:{index}}}){
        this.setData({
            [`tabs[${index}].isActive`]: !this.data.tabs[index].isActive
        })
    },
    submitData: function({detail:{value}}){
        const { Content } = value;
        const { rate,tabs,fileList,recordId } = this.data;
        let features = [],imgs=[];

        tabs.map(item=>{
            if(item.isActive){
                features.push(item.name)
            }
        })
        fileList.map(item=>{
            imgs.push(item.url)
        })
        if(!rate){
            wx.showToast({
                title: '请输入评分！',
                icon: 'none'
            })
        }else if(!features.length){
            wx.showToast({
                title: '请选择店铺特色！',
                icon: 'none'
            })
        }else if(!Content){
            wx.showToast({
                title: '请输入评价！',
                icon: 'none'
            })
        }
        utils.request(api.submitStoreComment,{
            RecordId: recordId,
            Imgs: imgs,
            Score: rate,
            Content,
            Features:features
        }).then((res)=>{
            this.setData({
                commentId: res
            })
            Dialog.confirm({
                title: '评价成功',
                message: '感谢您的评价',
                cancelButtonText: '返回',
            }).then(() => {

            }).catch(()=>{
                wx.navigateBack()
            })

        })



    },
    onRateChange: function({detail}){
        this.setData({
            rate: detail
        })
    },
    onChange: function({detail:{value}}){
        this.setData({
            num: value.length
        })
    },
    afterRead(event) {
        const { file } = event.detail;
        file.map(res=>{
            this.uploadFile(res);
        })
    },
    uploadFile: function(file){
        wx.request(({
            url: file.tempFilePath,
            method: 'GET',
            responseType: 'arraybuffer',
            success: (res)=>{
                console.log("123213",res.data);
                const base64 = wx.arrayBufferToBase64(res.data)
                utils.request(api.uploadUrl,{
                    "FileName": "图片名称.png",   //图片名称
                    "ImageType": 2,               //图片类型 0-普通；1-商品；2-评论；3-头像；4-微信头像;8-小程序码
                    "FileBase": base64               //图片 base64
                }).then((res)=>{
                    // 上传完成需要更新 fileList
                    const { fileList = [] } = this.data;
                    const {imgDomain ,imgUrl } =res;
                    fileList.push({ ...file, url: imgDomain+imgUrl });
                    this.setData({ fileList });
                })
            }
        }))
    },
});
