import { request } from "../../request/index"
const { $Toast } = require('../../dist/base/index');
Page({
  data: {
    userId: '',
    releaseInfo: [],
    isData: 10,
    visible: false, //是否显示取消关注提示框
    actions: [
      {
        name: '取消',
      },
      {
        name: '确认',
        color: '#FC4643'
      }
    ],
    commodityId: 0,
  },
  //options(Object)
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    const userId = wx.getStorageSync("openid");
    this.setData({
      userId
    })
    // console.log(this.data.releaseInfo.length);
    this.getReleaseData()
  },
  getReleaseData () {
    request({
      url: '/api/user_release',
      data: {
        user_id: this.data.userId
      },
      method: 'post'
    }).then(res => {
      const data = res.data.data
      if(data.length !== 0) {
        this.setData({
          isData: 1
        })
      } else {
        this.setData({
          isData: 0
        })
        return
      }
      data.forEach(v => {
        v.imgs = v.imgs.split(']')[0]
      })
      this.setData({
        releaseInfo: data
      })
    })
  },
  handleEdit (e) {
    // console.log(e);
    getApp().globalData.isEdit = e.currentTarget.dataset.commodityid
    wx.switchTab({
      url: `/pages/release/index`,
    })
  },
  handleDelete (e) {
    console.log(e);
    this.setData({
      visible: true,
      commodityId: e.currentTarget.dataset.commodityid
    })
  },
  handleClick ({detail}) {
    this.setData({
      visible: false
    })
    if(detail.index === 1) {
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
          this.onShow()
        }
      })
    }
  }
});