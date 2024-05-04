import { request } from "../../request/index.js"

import { handleDate } from "../../utils/util.js"

const { $Toast } = require('../../dist/base/index');
const { $Message } = require('../../dist/base/index');


Page({


    data: {
        clickCommentBtn: false,
        userId: '',
        commodityId: 0,
        goodInfo: {},
        imgList: [],
        groupId: '',
        buyId: "",
        sendText: "",//发送的消息
        serverMsg: [],//接受的服务端的消息
        commentType: '',
        commentList: [],
        groupId1: 0,
        receiveId: '',
        isFollow: '0',
        isCollection: 0,
        visible: false, //是否显示取消关注提示框
        actions: [
            {
                name: '取消',
            },
            {
                name: '确认',
                color: '#33CC99'
            }
        ],
        visible1: false,
        actions1: [
            {
                name: '编辑'
            },
            {
                name: '删除'
            },
            {
                name: '取消'
            }
        ],
        actions2: [
            {
                name: '删除'
            },
            {
                name: '上架'
            },
            {
                name: '取消'
            }
        ],
        displayAll: -1,
        isDelete: false
    },

    onShow () {
        this.getData()
        this.wssInit()
        if (this.data.buyId)
        {
            this.isFollow()
        }
        getApp().globalData.isEdit = 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        const buyId = wx.getStorageSync('openid');

        this.setData({
            userId: options.userId,
            commodityId: options.commodityId,
            buyId: buyId
        })
        this.getOtherData()
    },
    // 查看用户是否已经关注卖家
    isFollow () {
        request({
            url: '/api/user_follow',
            data: {
                user_id: this.data.buyId,
                my_attention_id: this.data.userId
            },
            method: 'post'
        }).then((res) => {
            this.setData({
                isFollow: res.data.data
            })
        })
        request({
            url: '/api/user/collection',
            data: {
                my_id: this.data.buyId,
                commodity_id: this.data.commodityId
            },
            method: 'post'
        }).then((res) => {
            this.setData({
                isCollection: res.data.data
            })
        })
    },
    handleGudge () {
        this.setData({
            visible1: true
        })
    },
    handleGoodDetail () {
        this.setData({
            displayAll: 1
        })
    },
    handleClick1 ({ detail }) {
        console.log(detail);
        let ind = this.data.goodInfo.sell
        let type = ''
        if (detail.index === 0 && ind === 0)
        {
            type = "编辑"
        } else if (detail.index === 1 && ind === 0)
        {
            type = "删除"
        } else if (detail.index === 2 && ind === 0)
        {
            type = "取消"
        } else if (detail.index === 0 && ind === 1)
        {
            type = "删除"
        } else if (detail.index === 1 && ind === 1)
        {
            type = "上架"
        } else if (detail.index === 2 && ind === 1)
        {
            type = "取消"
        }
        // console.log(type);
        if (type === '编辑')
        {
            console.log('点击编辑');
            getApp().globalData.isEdit = this.data.commodityId
            wx.switchTab({
                url: `/pages/release/index`,
            })
        } else if (type === '删除')
        {
            console.log('点击删除');
            request({
                url: '/api/delete/goods',
                data: {
                    commodity_id: this.data.commodityId
                },
                method: 'post'
            }).then((res) => {
                if (res.data.status === 0)
                {
                    $Toast({
                        content: '删除成功~'
                    });
                    wx.navigateBack({
                        delta: 1
                    });
                }
            })
        } else if (type === '取消')
        {
            console.log('点击取消');
            this.setData({
                visible1: false
            })
        } else if (type === '上架')
        {
            request({
                url: "/api/add/wants",
                data: {
                    buy_id: this.data.buyId,
                    sell_id: this.data.userId,
                    commodity_id: this.data.commodityId
                },
                method: "post"
            }).then(res => {
                console.log(res.data.data.id);
                request({
                    url: '/api/reset/goods',
                    data: {
                        commodity_id: this.data.commodityId,
                        group_id: res.data.data.id

                    },
                    method: 'post'
                }).then((res) => {
                    if (res.data.status === 0)
                    {
                        this.setData({
                            visible1: false
                        })
                        $Toast({
                            content: '上架成功~'
                        });
                    }
                })
            })
        }



    },
    handleCollection () {
        if (this.data.buyId === this.data.userId)
        {
            $Toast({
                content: '不能收藏自己的宝贝哦'
            })
            return
        }
        if (this.data.isCollection === 0)
        {
            request({
                url: '/api/add_collection',
                data: {
                    my_id: this.data.buyId,
                    commodity_id: this.data.commodityId
                },
                method: 'post'
            }).then((res) => {
                this.setData({
                    isCollection: res.data.data
                })
                if (res.data.status === 0)
                {
                    $Toast({
                        content: '收藏成功~'
                    });
                }
            })
        } else
        {
            request({
                url: '/api/cancel_collection',
                data: {
                    my_id: this.data.buyId,
                    commodity_id: this.data.commodityId
                },
                method: 'post'
            }).then((res) => {
                this.setData({
                    isCollection: res.data.data
                })
                if (res.data.status === 0)
                {
                    $Toast({
                        content: '取消收藏'
                    });
                }
            })
        }
    },
    getData () {
        request({
            url: '/api1/goods_detail',
            data: {
                user_id: '',
                commodity_id: this.data.commodityId
            },
            method: 'post'
        }).then((res) => {
            console.log(res.data);
            if (res.data.data[0].sell == 2)
            {
                this.setData({
                    isDelete: true
                })
                return
            }
            let imgList = res.data.data[0].imgs.split(']')
            // console.log(imgList);
            res.data.data[0].time = res.data.data[0].time.slice(0, 16)
            this.setData({
                goodInfo: res.data.data[0],
                imgList
            })
            if (res.data.data[0].sell === 1)
            {
                this.setData({
                    displayAll: 0
                })
            } else
            {
                this.setData({
                    displayAll: 1
                })
            }
        })
    },
    getOtherData () {

    },
    handleClickComment (e) {

        // wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
        //   // 使页面滚动到底部
        //   wx.pageScrollTo({
        //     scrollTop: rect.bottom,
        //     duration: 1000
        //   })
        // }).exec(

        // );
        const openid = wx.getStorageSync("openid")
        if (openid)
        {
            console.log('回复哪个id：', e.currentTarget.dataset.receive);
            this.setData({
                clickCommentBtn: true,
                commentType: e.currentTarget.dataset.type,
                groupId1: e.currentTarget.dataset.id,
                receiveId: e.currentTarget.dataset.receive,
            })
        } else
        {
            wx.navigateTo({ url: '/pages/login/index' })
        }
    },
    handleBindBlur () {
        // console.log('失去焦点');
        // this.setData({
        //   clickCommentBtn: false,
        //   // sendText: ''
        // })
    },
    handleBuy () {
        console.log("用户点击我想要");
        const that = this
        // 接口：传入用户id和卖家id，商品id，创建一个对话，携带者三个消息进入msg页面
        request({
            url: "/api/add/wants",
            data: {
                buy_id: this.data.buyId,
                sell_id: this.data.userId,
                commodity_id: this.data.commodityId
            },
            method: "post"
        }).then(res => {
            console.log(res.data.data.id);
            that.setData({
                groupId: res.data.data.id
            })
            wx.navigateTo({
                url: `/pages/msg_detail/index?commodityId=${that.data.commodityId}&sellId=${that.data.userId}&username=${that.data.goodInfo.user_name}&groupId=${that.data.groupId}&img=` + encodeURIComponent(that.data.goodInfo.user_img)
            });
        })
    },
    // 用户是否取消关注
    handleCancelFollow () {
        console.log("用户点击取消关注");
        this.setData({
            visible: true
        })
    },
    handleFollow () {
        console.log("用户点击关注按钮");
        request({
            url: '/api/add_follow',
            data: {
                user_id: this.data.buyId,
                my_attention_id: this.data.userId
            },
            method: 'post'
        }).then((res) => {
            if (res.data.status == 0)
            {
                this.setData({
                    isFollow: res.data.data
                })
                $Toast({
                    content: '关注成功'
                });
            }
        })
    },
    handleClick ({ detail }) {
        const index = detail.index;
        this.setData({
            visible: false
        })
        if (index === 1)
        {
            request({
                url: '/api/cancel_follow',
                data: {
                    user_id: this.data.buyId,
                    my_attention_id: this.data.userId
                },
                method: 'post'
            }).then((res) => {
                this.setData({
                    isFollow: res.data.data
                })
                $Toast({
                    content: '已取消关注'
                });
            })
        }


    },
    preview_img: function (e) {
        var cur_num = e.currentTarget.dataset.num;
        var img_urls = this.data.imgList
        wx.previewImage({
            current: img_urls[cur_num],
            urls: img_urls
        })
    },
    handleJumpPerson () {
        if (!this.data.userId)
        {
            return
        }
        wx.navigateTo({
            url: `/pages/person/index?id=` + this.data.userId
        });
    },
    sendTextBind: function (e) {
        this.setData({
            sendText: e.detail.value
        });
        console.log(this.data.sendText);
    },
    /**发送消息 */
    sendBtn: function (e) {
        console.log('用户点击发送按钮');
        var msgJson = {}
        const user_id = wx.getStorageSync("openid");
        console.log('this.data.commentType:', this.data.commentType);
        if (this.data.commentType == '1')
        {
            msgJson = {
                type: 'comment',
                user_id: user_id,
                receive_user_id: '',
                content: this.data.sendText,//发送的消息
                commodity_id: this.data.commodityId,
                time: new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " "),
                group_id: user_id + Math.random()
            }
        } else if (this.data.commentType == '2')
        {
            msgJson = {
                type: 'comment',
                user_id: user_id,
                receive_user_id: this.data.receiveId,
                content: this.data.sendText,//发送的消息
                commodity_id: this.data.commodityId,
                time: new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " "),
                group_id: this.data.groupId1,
            }
        }
        //发送消息
        console.log(JSON.stringify(msgJson));
        this.send_socket_message(JSON.stringify(msgJson));
        this.setData({
            sendText: "",//发送消息后，清空文本框
            clickCommentBtn: false
        });
    },


    wssInit () {
        var that = this;
        console.log('获取商品所有评论...');
        const sendData = {
            type: 'historycomment',
            commodity_id: this.data.commodityId,
        }
        this.send_socket_message(JSON.stringify(sendData))

        //监听WebSocket接受到服务器的消息事件。
        wx.onSocketMessage(function (res) {
            console.log('收到服务器内容(评论)：', res, JSON.parse(res.data));
            // console.log(res.data, typeof res.data);
            var server_msg = JSON.parse(res.data);
            if (server_msg != null)
            {
                var msgnew = [];
                for (var i = 0; i < server_msg.length; i++)
                {
                    console.log(server_msg[i].comment_id);
                    server_msg[i].time = handleDate(new Date(server_msg[i].time))
                    msgnew.push({
                        commentId: parseInt(server_msg[i].comment_id),
                        user_id: server_msg[i].user_id,
                        receive_user_id: server_msg[i].receive_user_id,
                        content: server_msg[i].content,
                        time: server_msg[i].time,
                        user_name: server_msg[i].user_name,
                        user_img: server_msg[i].user_img,
                        group_id: server_msg[i].group_id,
                        name: server_msg[i].name,
                    })
                    if (server_msg.length == 1 && server_msg[i].commodity_id == that.data.commodityId)
                    {
                        msgnew = that.data.commentList.concat(msgnew)
                    }
                }
                that.setData({
                    commentList: msgnew
                });
                if (server_msg.length == 1)
                {
                    that.pageScrollToBottom()
                }
            }
        });
        //监听WebSocket错误。
        wx.onSocketError(function (res) {
            console.log('WebSocket连接打开失败，请检查！', res)
        });

    },
    send_socket_message: function (msg) {
        const that = this
        const socket_open = wx.getStorageSync('socket_open')
        console.log('发送的消息：', msg);
        if (socket_open)
        {
            wx.sendSocketMessage({
                data: msg
            }).catch(err => {
                console.log('websocket出错啦，即将重连...', err);
                wx.setStorageSync('socket_open', false)
                that.wssInit()
            })
        } else
        {
            wx.connectSocket({
                url: 'ws://124.221.67.34:8085'
                // url: 'ws://192.168.104.80:8085'
                // url: 'ws://localhost:8085'
                // url: 'ws://www.mintyy.site:8085'

            })
            //监听WebSocket连接打开事件。
            wx.onSocketOpen(function (res) {
                console.log('WebSocket连接已打开！');
                wx.setStorageSync('socket_open', true)
                const user_id = wx.getStorageSync("openid");

                wx.sendSocketMessage({
                    data: JSON.stringify({ id: user_id, type: 'clientId' }),
                    success: () => {
                        that.wssInit()
                    }
                })
            })
        }
    },
    pageScrollToBottom: function () {
        wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
            // 使页面滚动到底部
            if (rect.height)
            {
                wx.pageScrollTo({
                    scrollTop: rect.height
                })
            }
        }).exec()
    },
})