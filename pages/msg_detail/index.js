const { request } = require('../../request/index')

Page({
  data: {
    sendText: "",//发送的消息
    serverMsg: [],//接受的服务端的消息
    userInfo: { userId: 1, userName: "花花", userImg: '头像' },
    receiveUserInfo: { userId: 2, userName: "呵呵", userImg: '头像' },
    commodityId: 1,
    scrolltop: 999,
    commodityInfo: {},
    groupId: '',
    dialogueInfo: {}
  },

  /**输入内容 */
  sendTextBind: function (e) {
    this.setData({
      sendText: e.detail.value
    });
    console.log(this.data.sendText);
  },
  /**发送消息 */
  sendBtn: function (e) {
    console.log('用户点击发送按钮');
    var msgJson = {
      user_id: this.data.userInfo.userId,
      receive_user_id: this.data.receiveUserInfo.userId,
      msg: this.data.sendText,//发送的消息
      commodity_id: this.data.commodityId,
      msg_time: new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " "),
      group_id: this.data.groupId,
      is_read: '0'
    }
    //发送消息
    console.log(JSON.stringify(msgJson));
    this.send_socket_message(JSON.stringify(msgJson));
    this.setData({
      sendText: ""//发送消息后，清空文本框
    });
  },
  onLoad: function (options) {
    console.log(options);

    let user = wx.getStorageSync('user')
    let user_id = wx.getStorageSync('openid')
    const obj1 = {
      userId: options.sellId, userName: options.username, userImg: decodeURIComponent(options.img)
    }
    const obj2 = {
      userId: user_id, userName: user.nickName, userImg: user.avatarUrl
    }
    this.setData({
      commodityId: options.commodityId,
      receiveUserInfo: obj1,
      userInfo: obj2,
      groupId: options.groupId
    })
    wx.setNavigationBarTitle({
      title: options.username
    })
    this.wssInit()
  },
  onShow () {
    this.getCommodityData()
  },
  handleGoodDetail () {
    console.log("查看商品详情");
    wx.navigateTo({
      url: `/pages/goods_detail/index?userId=${this.data.dialogueInfo.sell_id}&commodityId=${this.data.commodityId}`,
    });
  },
  // 获取商品信息
  getCommodityData () {
    request({
      url: '/api1/goods_detail',
      data: {
        user_id: '',
        commodity_id: this.data.commodityId
      },
      method: 'post'
    }).then((res) => {
      console.log(res.data);
      let img = res.data.data[0].imgs.split(']')[0]
      const commodityInfo = {
        img: img,
        price: res.data.data[0].price,
        sell: res.data.data[0].sell,
      }
      this.setData({
        commodityInfo
      })
    })
    request({
      url: '/api/user_info',
      data: {
        group_id: this.data.groupId
      },
      method: 'post'
    }).then((res) => {
      console.log(res.data);
      this.setData({
        dialogueInfo: res.data.data[0]
      })
    })
  },
  wssInit () {
    var that = this;
    console.log('获取聊天记录...');
    const sendData = {
      type: 'history',
      user_id: this.data.userInfo.userId,
      // commodity_id: this.data.commodityId,
      // receive_user_id: this.data.receiveUserInfo.userId,
      group_id: this.data.groupId
    }
    this.send_socket_message(JSON.stringify(sendData))



    //监听WebSocket接受到服务器的消息事件。
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：', res);
      console.log(res.data, typeof res.data);
      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 1] //获取当前页面的对象 修改数量可以获取之前跳转页面的地址
      var urll = '/' + currentPage.route //当前页面url
      console.log('当前页面地址：',urll);
      if (res.data == '[]')
      {
        console.log("没有历史记录");
        that.setData({
          serverMsg: [],
        });
        var msgJson = {
          receive_user_id: that.data.userInfo.userId,
          user_id: that.data.receiveUserInfo.userId,
          msg: "你好，宝贝还在哦，想要就赶紧拍下哦",//发送的消息
          commodity_id: that.data.commodityId,
          msg_time: new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " "),
          group_id: that.data.groupId,
          is_read: '1'
        }
        that.send_socket_message(JSON.stringify(msgJson));
      }
      var server_msg = JSON.parse(res.data);
      if (server_msg != null)
      {
        var msgnew = [];
        for (var i = 0; i < server_msg.length; i++)
        {
          console.log('获取的消息：', server_msg[i]);
          if(server_msg[i].group_id == that.data.groupId || server_msg[i].loginName) {
            msgnew.push({
              user_id: server_msg[i].user_id,
              receive_user_id: server_msg[i].receive_user_id,
              msg: server_msg[i].msg_content,
              time: server_msg[i].msg_time
            })
            if (urll === "/pages/msg_detail/index")
            {
              request({
                url: '/api/msg/read',
                data: {
                  user_id: that.data.userInfo.userId,
                  msg_time: server_msg[i].msg_time
                },
                method: 'post'
              })
            }
          }
        }
        msgnew = that.data.serverMsg.concat(msgnew)
        that.setData({
          serverMsg: msgnew,
          scrolltop: msgnew.length * 100
        });
        console.log(that.data.serverMsg);
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
    //socket_open，连接打开的回调后才会为true，然后才能发送消息
    if (socket_open)
    {
      // console.log(msg);
      wx.sendSocketMessage({
        data: msg
      }).catch(err => {
        console.log('websocket出错啦，即将重连...', err);
        wx.setStorageSync('socket_open', false)
        this.wssInit()
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
        wx.sendSocketMessage({
          data: JSON.stringify({ id: that.data.userInfo.userId, type: 'clientId' }),
          success: () => {
            console.log("连接成功，发送唯一标识")
            that.wssInit()
            that.setData({
              socket_open: true
            })
          }
        })
      })
    }
  },
  /**
     * 生命周期函数--监听页面卸载
     */
  onUnload: function () {
    console.log('当前页面关闭');
  },
})