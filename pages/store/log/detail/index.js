const utils = require("../../../../utils/util.js")
const api = require("../../../../config/api.js")
import Dialog from '@vant/weapp/dialog/dialog';
Page({
    data: {
        num: 0,
        imgNum: 0,
        fileList: [],
        rate: 0,
        commentId: undefined,
        content: undefined,
        data:{},
        tabs: [{
            name: '菜量较大',
            isActive: false
        },{
            name: '服务态度好',
            isActive: false
        },{
            name: '店内干净',
            isActive: false
        },{
            name: '菜量较小',
            isActive: false
        },{
            name: '服务态度一般',
            isActive: false
        },{
            name: '店内环境一般',
            isActive: false
        },
        ]
    },
    onLoad: function (options) {
        const {recordId,commentId} = options
        if(recordId){
            this.setData({
                recordId
            })
        }else if(commentId){
            this.setData({
                commentId
            })
            this.getData();
        }
    },
    getData(){
        const { commentId,tabs } = this.data;
        utils.request(api.getCommentData,{commentId}).then(res => {
            console.log("=====",tabs)
            const { score,content,imgs } = res;
            tabs.filter(item=>{
                if(res.features.includes(item.name)){
                    item.isActive = true
                }
            })
            console.log("tabs",tabs);
            this.setData({
                tabs,
                rate:score,
                content,
                fileList: imgs.map(i=>{return {url:i,isImage: true}})
            })
        })
    },
    tabChange: function({currentTarget:{dataset:{index}}}){
        const { commentId } =this.data;
        if(!commentId){
            this.setData({
                [`tabs[${index}].isActive`]: !this.data.tabs[index].isActive
            })
        }
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
                confirmButtonColor:'#4DC185',
                cancelButtonText: '返回',
            }).then(() => {

            }).catch(()=>{
                wx.navigateBack()
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
});
