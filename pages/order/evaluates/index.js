const utils = require("../../../utils/util.js")
const api = require("../../../config/api.js")
import Dialog from '@vant/weapp/dialog/dialog';
Page({
    data: {
        num: 0,
        imgNum: 0,
        orderNo: undefined,
        fileList: [],
        goodsList: [],
        commentData: [],
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
                goodsList: res.list,
                commentData: res.list.map(res=>{return {subOrderId:res.subOrderId,goodsId:res.goodsId,rate: 0,fileList:[],content:'',num:0}})
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
    submitData: function(){
        const { commentData,orderNo } = this.data;
        let ContentData = [];
       const flag = commentData.every(res=>{
            const {rate,fileList,content,goodsId,subOrderId} = res;
            if(!rate){
                wx.showToast({
                    title: '请输入评分！',
                    icon: 'none'
                })

                return false
            }else  if(!content){
                wx.showToast({
                    title: '请输入评价！',
                    icon: 'none'
                })
                return false
            }
            ContentData.push({
                Mark: rate,
                GoodsId:goodsId,
                SubOrderId:subOrderId,
                Content:content,
                Images: fileList.map(res=> {return res.url})
            })
           return true
        })
        if(flag){
            utils.request(api.submitOrderComment,{
                OrderNo:orderNo,
                ContentData
            }).then((res)=>{
                Dialog.confirm({
                    title: '评价成功',
                    confirmButtonColor:'#4DC185',
                    message: '感谢您的评价',
                    cancelButtonText: '返回',
                }).then(() => {
                    wx.navigateBack()
                }).catch(()=>{
                    wx.navigateBack()
                })

            })
        }




    },
    onRateChange: function({detail,target:{dataset:{index}}}){
        this.setData({
            [`commentData[${index}].rate`]: detail
        })
    },
    onChange: function({detail:{value},target:{dataset:{index}}}){
        this.setData({
            [`commentData[${index}].num`]: value.length,
            [`commentData[${index}].content`]: value,
        })
    },
    afterRead({detail:{file},target:{dataset:{index}}}) {
        file.map(res=>{
            this.uploadFile(res).then((res)=>{
                // 上传完成需要更新 fileList
                let { fileList = [] } = this.data.commentData[index];
                const {imgDomain ,imgUrl } =res;
                fileList.push({ ...file, url: imgDomain+imgUrl });
                this.setData({
                    [`commentData[${index}].fileList`]: fileList,
                });
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
});
