
//正式
var apiUrl = ""

//测试
var apiUrl = "https://kfx-entrance.ssup.cn/api/Entrance/Authority"


module.exports = {
    apiUrl,
    getOpenId: 'Member.SignIn.Wechat',//获取OpenId;
    /*start 首页 start*/
    getHomeData: 'Applets.Basic.Home', //获取首页数据
    getGoodsList: 'Applets.Goods.List', //获取商品列表
    getGoodsCategory: 'Applets.Basic.Category', //获取商品分类
    getGoodsDetail: 'Applets.Goods.Detail', //获取商品详情
    getGoodsCommentList: 'Applets.Comment.GoodsCommentList', //商品评论列表
    getGuestList: 'Applets.Goods.GuestList', //猜你喜欢

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
    getAddressList: 'Member.Address.List', // 获取所有地址
    delAddress: 'Member.Address.Remove', // 删除地址
    addAddress: 'Member.Address.Submit', // 新增地址
    getAddressDetail: 'Member.Address.Detail', // 地址详情





    getStoreList: 'Applets.StoreInfo.List', // 店铺列表
    getStoreDetail: 'Applets.StoreInfo.Detail', // 店铺详情
    getStoreCommentList: 'Applets.StoreComment.List', // 店铺评价列表
    getStoreCommentHome: 'Applets.StoreComment.Home', // 店铺评价首页
    getStoreLog: 'Applets.StoreHome.ArrivalRecord', // 会员到店记录
    getStoreHome: 'Applets.StoreHome.Home', // 店铺首页
    // DeleteOrder: 'Applets.OrderList.DeleteOrder',




    /*end 基础数据 end*/
};
