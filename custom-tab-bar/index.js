import { request } from '../request/index'
Component({
  data: {
    //当前页索引
    num: 0,
    current: 'index',
    list: [{
      pagePath: "pages/index/index",
      text: "首页",
      status: 'index',
      iconPath: 'homepage',
      selectedIconPath: 'homepage_fill',
    },
    {
      pagePath: "pages/release/index",
      text: "发布",
      status: 'release',
      iconPath: 'service',
      selectedIconPath: 'service_fill'
    },
    {
      pagePath: "pages/msg/index",
      text: "消息",
      status: 'msg',
      iconPath: 'interactive',
      selectedIconPath: 'interactive_fill'
    },
    {
      pagePath: "pages/user/index",
      text: "我的",
      status: 'user',
      iconPath: 'group',
      selectedIconPath: 'group_fill'
    }
    ]

  },
  methods: {
    handleChange (e) {
      console.log(e);
      let index = e.detail.key;
      const app = getApp()
      this.setData({
        current: index,
        num: app.globalData.msgNum
      })
      console.log('切换tabbar:', this.data.num)
      const openid = wx.getStorageSync("openid")
      if (openid || index === 'index')
      {
        wx.switchTab({
          url: '/pages/' + e.detail.key + '/index',
        })
      } else
      {
        wx.navigateTo({ url: `/pages/login/index?type=${index}` })
      }

    },
  },
  attached() {
    this.setData({
      num: getApp().globalData.msgNum
    })
    console.log('切换tabbar:', this.data.num)
  },
  ready: function () {
    //在page页面引入app，同时声明变量，获得所需要的全局变量
    console.log(this.data.current);
    const id = wx.getStorageSync("openid");
    const that = this
    if(this.data.current === 'msg') {
      request({
        url: '/api/msg_unread_num',
        data: {
          id: id
        },
        method: 'post'
      }).then(res => {
        console.log(res.data.data);
        const msgNumList = res.data.data
        let totalNum = 0
        msgNumList.forEach(v => {
          totalNum += v.num
        })
        const app = getApp();
        app.globalData.msgNum = totalNum;
        that.setData({
          num: totalNum
        })
      })
    }
  },
})
