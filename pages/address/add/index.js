Page({
    data: {
        isDefault: false
    },
    onLoad: function (options) {

    },
    defaultChange: function({detail}){
        this.setData({ isDefault: detail });
    },
});
