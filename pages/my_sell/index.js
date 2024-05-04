import { request } from "../../request/index"
const { $Toast } = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    releaseInfo: [],
    buyInfo: [],
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
  },
  onShow () {
    const userId = wx.getStorageSync("openid");
    this.setData({
      userId
    })
    this.getReleaseData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },
  getReleaseData () {
    const that = this
    request({
      url: '/api/user_sell',
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
        that.getBuyInfo(v.commodity_id)
      })
      this.setData({
        releaseInfo: data,
      })
    })
    
  },
  getBuyInfo(id) {
    request({
      url: '/api/user_info',
      data: {
        type: "buy",
        commodity_id: id
      },
      method: 'post'
    }).then(res => {
      console.log([...this.data.buyInfo]);
      // console.log([...res.data.data]);
      this.setData({
        buyInfo: [...this.data.buyInfo, ...res.data.data]
      })
    })
  },
  handleEdit (e) {
    // console.log(e);
    const commodityId = e.currentTarget.dataset.commodityid
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/msg_detail/index?commodityId=${commodityId}&sellId=${this.data.buyInfo[index].buy_id}&username=${this.data.buyInfo[index].user_name}&groupId=${this.data.buyInfo[index].id}&img=` + encodeURIComponent(this.data.buyInfo[index].user_img)
    });
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


})