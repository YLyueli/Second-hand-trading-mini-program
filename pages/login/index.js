const { request } = require('../../request/index')
const { $Toast } = require('../../dist/base/index');

Page({
  data: {
    userInfo: {},
    isUnload: true,
    type: ''
  },
  onUnload () {
    console.log('点击返回');
    var pages = getCurrentPages();
    console.log(pages);
    // var app = getApp()

    // app.globalData.isClose = true
    // wx.switchTab({
    //   url: '/pages/index/index'
    // })
    console.log(this.data.isUnload);
    if (this.data.isUnload)
    {
      console.log('返回上一路由');
      // wx.navigateBack({
      //   delta: 1
      // });
    }
  },
  onLoad (options) {
    console.log(options.type, typeof options.type);
    this.setData({
      type: options.type
    })
  },
  async getUserProfile (e) {
    const that = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    const res1 = await wx.getUserProfile({ desc: '用于完善用户资料', })
    this.setData({
      userInfo: res1.userInfo,
    })
    wx.setStorageSync("user", res1.userInfo);
    const res2 = await wx.login({})

    if (res2.code)
    {
      //调用request请求api转换登录凭证
      wx.request({

        url: 'https://api.weixin.qq.com/sns/jscode2session',
        data: {
          appid: 'wx6a9a93e4cd2a78bd',
          secret: '71244b923130f44255847c191efde043',
          grant_type: 'authorization_code',
          js_code: res2.code
        },
        method: 'GET',
        header: { 'content-type': 'application/json' },

        success: function (res) {
          console.log(res.data.openid) //获取openid
          wx.setStorageSync("openid", res.data.openid);
          request({
            url: '/api1/login',
            data: {
              user_id: res.data.openid,
              user_name: that.data.userInfo.nickName,
              user_img: that.data.userInfo.avatarUrl
            },
            method: 'post'
          }).then(res => {
              if(res.data.status === 2) {
                $Toast({
                    content: '您的账号已被封禁'
                  });
                  return
              }
            wx.setStorageSync("token", res.data.data.token);
            wx.setStorageSync("school", res.data.data.school);
            const school = wx.getStorageSync("school");
            if (school)
            {
              that.setData({
                isUnload: false
              })
              if (that.data.type)
              {
                console.log(that.data.type);
                wx.switchTab({
                  url: '/pages/' + that.data.type + '/index'
                })
              } else
              {
                wx.navigateBack({
                  delta: 1
                });
              }
            } else
            {
              console.log("跳转学校认证");
              if (that.data.type)
              {
                console.log(that.data.type);
                wx.navigateTo({
                  url: `/pages/auth/index?type=${that.data.type}`
                })
              } else
              {
                wx.navigateTo({
                  url: '/pages/auth/index'
                })
              }
              
            }
          })
        }
      })
    }
  }
});