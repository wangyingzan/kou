const utils = require("../utils/util.js")
const api = require("../config/api.js")
Component({
	data: {
		active: 0,
		goodsNum: undefined,
		list: [
			{
				pagePath: "/pages/home/index",
				iconPath: "/static/images/tabBar/home.png",
				selectedIconPath: "/static/images/tabBar/home@selected.png",
				text: "首页"
			},
			{
				pagePath: "/pages/store/index",
				iconPath: "/static/images/tabBar/store.png",
				selectedIconPath: "/static/images/tabBar/store@selected.png",
				text: "共享店"
			},
			{
				pagePath: "/pages/cart/index",
				iconPath: "/static/images/tabBar/car.png",
				selectedIconPath: "/static/images/tabBar/car@selected.png",
				text: "购物车"
			},
			{
				pagePath: "/pages/my/index",
				iconPath: "/static/images/tabBar/my.png",
				selectedIconPath: "/static/images/tabBar/my@selected.png",
				text: "我的"
			}
		]
	},
	methods: {
		onChange(event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].pagePath
			});
		},

		init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.pagePath === `/${page.route}`)
			});
			this.getGoodsNum();
		},
		getGoodsNum(){
			return new Promise((resolve, reject)=>{
				utils.request(api.getGoodsNum,).then((res)=>{
					this.setData({
						goodsNum: res.goodsCount
					})
					wx.setStorageSync("goodsNum",res.goodsCount)
					resolve(res.goodsCount)
				})
			})

		}
	}
});
