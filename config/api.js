
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
    // DeleteOrder: 'Applets.OrderList.DeleteOrder',

    /*end 基础数据 end*/
};
