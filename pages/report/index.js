import { request } from '../../request/index'

Page({
    data: {
        content: '',
        userId: '',
        commodityId: '',
        myId: '',
        isOk: 2
    },
    //options(Object)
    onLoad: function (options) {
        console.log(options);
        const id = wx.getStorageSync("openid");

        this.setData({
            userId: options.userId,
            commodityId: options.commodityId,
            myId: id
        })
    },
    onShow: function () {
        this.getReport()
    },
    getReport () {
        const that = this
        request({
            url: '/api/report/info',
            data: {
                user_id: this.data.userId,
                commodity_id: this.data.commodityId,
                my_id: this.data.myId
            },
            method: 'post'
        }).then(res => {
            if (res.data.status == 0)
            {
                if (res.data.data.length !== 0)
                {
                    that.setData({
                        content: res.data.data[0].content,
                        isOk: 1
                    })
                } else {
                    that.setData({
                        isOk: 0
                    })
                }

            }
        })
    },
    handleInput (e) {
        let data = e.detail.value

        this.setData({
            content: data
        })
    },
    handleReport () {
        request({
            url: '/api/report/set',
            data: {
                content: this.data.content,
                user_id: this.data.userId,
                commodity_id: this.data.commodityId,
                my_id: this.data.myId
            },
            method: 'post'
        }).then(res => {
            if (res.data.status === 0)
            {
                this.setData({
                    isOk: 1
                })
            }
        })
    }
});