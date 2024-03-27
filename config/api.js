
//正式
var apiUrl = ""

//测试
var apiUrl = "https://kfx-entrance.ssup.cn/api/Entrance/Authority"


module.exports = {
    apiUrl,
    uploadUrl: 'Service.Document.UploadImg',//上传图片;
    getOpenId: 'Member.SignIn.Wechat',//微信登录;
    unLogin: 'Member.SignOut.Submit',//退出登录;
    getPhoneCode: 'Member.Sms.Send',//获取手机验证码;
    verifyPhoneCode: 'Member.Sms.Verify',//校验手机验证码;
    getCityInfo: 'Service.Gps.ReGeo',//根据经纬度获取城市信息;
    firstVerifyPhoneCode: 'Member.PhoneNumber.BindForSubmit',//首次绑定手机;
    activateMember: 'Applets.Mine.ActivateMember',//激活会员;
    getDistrict: 'Applets.Area.District',//获取地区;
    getGoodsLogList: 'Applets.Basic.OrderData',//获取商品购买记录;
    /*start 首页 start*/
    getHomeData: 'Applets.Basic.Home', //获取首页数据
    getHomeInfo: 'Applets.Mine.Info', //获取首页详情
    getGoodsList: 'Applets.Goods.List', //获取商品列表
    getGoodsCategory: 'Applets.Basic.Category', //获取商品分类
    getGoodsDetail: 'Applets.Goods.Detail', //获取商品详情
    getGoodsCommentList: 'Applets.Comment.GoodsCommentList', //商品评论列表
    getGuestList: 'Applets.Goods.GuestList', //猜你喜欢
    getGoodsNum: 'Applets.ShoppingCart.GoodsCount', //获取购物车数量

    /** 删除订单 */
    DeleteOrder: 'Applets.OrderList.DeleteOrder',
    addCart: 'Applets.ShoppingCart.Add', //添加商品到购物车
    getCartList: 'Applets.ShoppingCart.List', // 获取购物车列表
    cartNumChange: 'Applets.ShoppingCart.ModifyGoodsCount', // 修改购物车商品数量
    delCart: 'Applets.ShoppingCart.Delete', // 修改购物车商品数量
    getDefaultAddress: 'Member.Address.Default', // 获取默认地址
    confirmOrder: 'Applets.OrderSubmit.NormalSubmitConfirm', // 直接购买确认订单
    confirmCartOrder: 'Applets.OrderSubmit.ShoppingCartConfirm', // 购物车确认订单
    submitOrder: 'Applets.OrderSubmit.NormalGoodsSubmit', // 提交订单
    payOrder: 'Service.Pay.AppletsPay', // 提交订单
    orderDetail: 'Applets.OrderList.OrderDetail', // 订单详情
    cancelOrder: 'Applets.OrderList.CloseOrder', // 取消订单
    delOrder: 'Applets.OrderList.DeleteOrder', // 删除订单
    getOrderGoodsData: 'Applets.Comment.OrderCommentInfo', //获取订单商品详情
    moreOrder: 'Applets.OrderList.ReBuy', //再来一单

    confirmReceipt: 'Applets.OrderList.ConfirmOrder', // 确认收货
    urgeReceipt: 'Applets.OrderList.UrgeShipment', // 催促发货
    updateAddress: 'Applets.OrderList.UpdateAddress', // 更改订单地址
    getOrderList: 'Applets.OrderList.List', // 订单列表
    submitOrderComment: 'Applets.Comment.OrderCommentSubmit', // 订单评价
    getAddressList: 'Member.Address.List', // 获取所有地址
    delAddress: 'Member.Address.Remove', // 删除地址
    addAddress: 'Member.Address.Submit', // 新增地址
    getAddressDetail: 'Member.Address.Detail', // 地址详情
    setAddressDefault: 'Member.Address.SetDefault', // 设为默认地址





    getStoreList: 'Applets.StoreInfo.List', // 店铺列表
    getStoreDetail: 'Applets.StoreInfo.Detail', // 店铺详情
    getHotCity: 'Applets.Basic.HotArea', //获取热门城市
    getStoreCommentList: 'Applets.StoreComment.List', // 店铺评价列表
    getStoreCommentHome: 'Applets.StoreComment.Home', // 店铺评价首页
    getStoreLogList: 'Applets.StoreHome.ArrivalRecord', // 会员到店记录
    myStoreLogList: 'Applets.Mine.ArrivalRecord', // 我的到店记录
    getStoreHome: 'Applets.StoreHome.Home', // 店铺首页
    getCommentData: 'Applets.StoreComment.Detail', // 店铺评价
    submitStoreComment: 'Applets.StoreComment.Submit', //提交店铺评论
    memberVerify: 'Applets.StoreInfo.MemberVerify', //会员到店

    // DeleteOrder: 'Applets.OrderList.DeleteOrder',

    /* 我的店铺 */
    getMyStoreDetail: 'Applets.StoreHome.Home', // 我的店铺详情
    entryStore: 'Applets.StoreEntry.EntrySubmit', // 入驻门店
    getStoreEntryData: 'Applets.StoreEntry.EntryInfo', // 门店入驻信息
    getStoreStatus: 'Applets.StoreEntry.EntryQuery', // 门店入驻状态
    getStoreRateStatus: 'Applets.StoreHome.ModifyRateQuery', // 门店折扣修改状态
    getStoreRateInfo: 'Applets.StoreHome.ModifyRateInfo', // 获取门店折扣信息
    getStoreInfoStatus: 'Applets.StoreHome.ModifyBasicQuery', // 获取门店信息修改状态
    getStoreInfo: 'Applets.StoreHome.ModifyBasicInfo', // 获取门店修改的信息
    submitStoreInfo: 'Applets.StoreHome.ModifyBasicSubmit', // 提交门店修改的信息
    getStoreQrcode: 'Applets.StoreHome.StoreCode', // 获取店铺二维码
    editRate: 'Applets.StoreHome.ModifyRateSubmit', // 修改折扣


    /*end 基础数据 end*/
};
