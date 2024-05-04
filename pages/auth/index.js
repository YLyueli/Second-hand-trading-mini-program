const { request } = require('../../request/index')
const { $Message } = require('../../dist/base/index');
const { $Toast } = require('../../dist/base/index');

Page({
  data: {
    school: '',
    type: ''
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      type: options.type
    })
  },
  onUnload() {
    console.log("认证学校：返回");
    const school = wx.getStorageSync("school");
    if(!school) {
      wx.navigateTo({url: '/pages/auth/index'})
    }
  },
  // 确认认证数据
  async handleSchool () {
    // console.log('认证学校');
    const that = this
    const openid = wx.getStorageSync("openid");
    if (this.data.school === '')
    {
      $Message({
        content: "学校名不能为空，请选择学校",
        type: "error"
      })
      return
    }
    const res = await request({
      url: "/api/add/school",
      method: "post",
      data: {
        user_id: openid,
        school: this.data.school
      }
    })
    console.log(res);
    if (res.data.status === 0)
    {
      wx.setStorageSync("school", that.data.school)
      $Toast({
        content: '绑定成功',
        type: 'success'
      });
      if(!that.data.type) {
        wx.navigateBack({
          delta: 2
        });
      } else {
        wx.switchTab({
          url: '/pages/' + that.data.type + '/index'
        })
      }
        
    }
  }
});