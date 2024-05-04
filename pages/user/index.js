const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    school: "",
    visible: false,
    actions: [
      {
        name: '取消',
      },
      {
        name: '确认',
        color: '#F74C56'
      }
    ],
  },

  onShow: function () {
    const token = wx.getStorageSync("token");
    if (token === '')
    {
      wx.navigateTo({ url: "/pages/login/index" })
    } else
    {
      const userInfo = wx.getStorageSync("user");
      const school = wx.getStorageSync("school");
      this.setData({
        userInfo,
        school
      })
    }
    this.getTabBar().setData({
      current: 'user'
    })
  },
  loginout() {
    this.setData({
      visible: true
    })
  },
  handleClick ({ detail }) {
    const index = detail.index;
    this.setData({
      visible: false
    })
    if (index === 1)
    {
      wx.setStorageSync("openid", '');
      wx.setStorageSync("token", '');
      wx.setStorageSync("user", '');
      wx.setStorageSync("school", '');
      wx.switchTab({
        url: '/pages/index/index'
      })
    }


  },
})