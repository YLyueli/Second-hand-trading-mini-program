
const { request } = require('../../request/index')
Page({
  data: {
    visible: true,
    actions: [
      {
        name: '去绑定',
        color: '#33CC99'
      }
    ],
    goodsList: [],
    pagenum: 1,
    totalPages: 1,
    openid: '',
    imgUrls: [
      'https://img1.baidu.com/it/u=1724157493,2813978428&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800',
      'https://img2.baidu.com/it/u=1169482024,1701332774&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
      'https://img2.baidu.com/it/u=220078466,2140435627&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500'
    ],
    swiperCurrent: 0
  },
  onShow () {
    this.getTabBar().setData({
      current: 'index'
    })
    const openid = wx.getStorageSync("openid");
    this.setData({
      openid
    })
    if(getApp().globalData.isFresh) {
      this.setData({
        goodsList: [],
        pagenum: 1,
      })
      this.getGoodsList();
    }
    getApp().globalData.isFresh = false
    // var app = getApp()
    // app.globalData.isClose = false
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      goodsList: [],
      pagenum: 1,
    })
    this.getGoodsList();
    
  },
  handleGoodDetail (e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/goods_detail/index?userId=${item.user_id}&commodityId=${item.commodity_id}`
    })
  },
  onReachBottom () {
    //  1 判断还有没有下一页数据
    if (this.data.pagenum >= this.data.totalPages)
    {
      console.log("没有下一页");
      wx.showToast({ title: '已加载所有数据' });
    } else
    {
      let num = this.data.pagenum
      num++;
      console.log(num);
      this.setData({
        pagenum: num
      })
      this.getGoodsList();
    }
  },
  // 下拉刷新事件 
  onPullDownRefresh () {
    // 1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.setData({
      pagenum: 1
    })
    // 3 发送请求
    this.getGoodsList();
  },
  handleSameSchool () {
    const school = wx.getStorageSync("school");
    const openid = wx.getStorageSync("openid");
    if (!openid)
    {
      wx.navigateTo({ url: "/pages/login/index" })
      return
    }
    if (school)
    {
      wx.navigateTo({
        url: "/pages/goods_list/index?type=同校"
      })
    } else
    {
      wx.navigateTo({ url: "/pages/auth/index" })
    }
  },
  getGoodsList () {
    const that = this
    request({
      url: "/api1/goods_list/" + this.data.pagenum
    })
      .then((res) => {
        console.log(res);
        let goods = res.data.data
        goods.forEach(v => {
          if (v.imgs)
          {
            v.imgs = v.imgs.split(']')[0].toString()
          }
        })
        that.setData({
          goodsList: [...this.data.goodsList, ...goods],
          totalPages: res.data.totalPages
        })
      })
  },

  //轮播图的切换事件

  swiperChange: function (e) {
    // console.log(e);
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击图片触发事件
  swipclick: function (e) {
    console.log('点击图片');
  }
})