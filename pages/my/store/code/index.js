const utils = require("../../../../utils/util.js")
const api = require("../../../../config/api.js")
Page({
    data: {
        QRCodeUrl: undefined,
        img: undefined,
    },
    onLoad: function (options) {
        this.setData({
            storeId: options.storeId
        })
        this.getData()
    },
    getData(){
        utils.request(api.getStoreQrcode).then(res => {
            this.setData({
                QRCodeUrl: res.imgSrc
            })
        })
    },

    drawCode: async function () {
        const { QRCodeUrl } = this.data;
        const canvas = wx.createOffscreenCanvas({type: '2d', width: 275, height: 370})
        const context = canvas.getContext('2d')
        // 创建一个图片
        const bg = canvas.createImage()
        const code = canvas.createImage()
        // 等待图片加载
        await new Promise(resolve => {
            bg.onload = resolve
            bg.src = '/static/images/QRcodeBg_white.png' // 要加载的图片 url
        })
        await new Promise(resolve => {
            bg.onload = resolve
            bg.src = QRCodeUrl // 要加载的图片 url
        })

        // 把图片画到离屏 canvas 上
        context.clearRect(0, 0, 275, 370)
        context.fillStyle = '#05C160';
        context.fillRect(0, 0, 275, 320);
        context.drawImage(bg, 37, 81, 200, 200)
        context.drawImage(code, 37, 81, 200, 200)
        context.font="18px sans-serif"
        context.fillStyle = '#fff';
        context.fillText('口福侠小程序内扫码识别', 38, 50)
        context.fillRect(0, 320, 275, 52);
        context.fillStyle = '#233623';
        context.font="bold 18px sans-serif"
        context.fillText('会员共享店', 93, 352)
        const imgData = canvas.toDataURL()
        const time = new Date().getTime();
        const fs = wx.getFileSystemManager();
        const filePath = wx.env.USER_DATA_PATH + "/poster" + time + 'share.png'
        fs.writeFile({
            filePath,
            data: imgData.replace(/^data:image\/\w+;base64,/,""),
            encoding: 'base64',
            success: res=>{
                console.log("filePath",filePath)
                wx.showShareImageMenu({
                    path: filePath,
                    success: res=>{
                        wx.showToast({title:'保存成功',icon: 'none'})
                    }
                })
            }
        })
    },
    // 保存分享图
    saveShare: function () {
        const {
            qrcodeUrl
        } = this.data;

        var aa = wx.getFileSystemManager();
        // console.log("qrcodeUrl.splice(22)",qrcodeUrl.slice(22));
        aa.writeFile({
            filePath: wx.env.USER_DATA_PATH + '/qrcode.png',
            data: qrcodeUrl,
            encoding: 'base64',
            success: function (res) {
                wx.saveImageToPhotosAlbum({
                    filePath: wx.env.USER_DATA_PATH + '/qrcode.png',
                    success: function (res) {
                        wx.showModal({
                            title: '存图成功',
                            content: '图片成功保存到相册了',
                            showCancel: false,
                            confirmText: '好的',
                            confirmColor: '#a78845',
                            success: function (res) {
                                if (res.confirm) {
                                    console.log('用户点击确定');
                                }
                            }
                        })
                    },
                    fail: function (err) {
                        console.log(err)
                    }
                })

            },
            fail: function (res) {
                console.log('fail')
            }
        })
    },
});
