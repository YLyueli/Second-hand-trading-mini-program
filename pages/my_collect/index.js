import { request } from "../../request/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    goodsInfo: [],
    sellInfo: [],
    isData: 10,
  },
  onShow () {
    const userId = wx.getStorageSync("openid");
    this.setData({
      userId
    })
    this.getGoodsData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },
  getGoodsData () {
    const that = this
    request({
      url: '/api/user_collection',
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
        that.getsellInfo(v.commodity_id)
      })
      this.setData({
        goodsInfo: data
      })
    })
  },
  getsellInfo(id) {
    request({
      url: '/api/user_info',
      data: {
        type: "sell0",
        commodity_id: id
      },
      method: 'post'
    }).then(res => {
      console.log([...this.data.sellInfo]);
      // console.log([...res.data.data]);
      this.setData({
        sellInfo: [...this.data.sellInfo, ...res.data.data]
      })
    })
  },
})