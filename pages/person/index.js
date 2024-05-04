const { request } = require('../../request/index')
const { $Toast } = require('../../dist/base/index');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    openid: "",
    userId: "",
    fans: "0",
    attentions: "0",
    commoditys: [],
    isData: 10,
    isFollow: '0',
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const openid = wx.getStorageSync("openid");
    let userId = ""
    if (options.id)
    {
      userId = options.id
    } else
    {
      userId = openid
    }
    this.setData({
      openid,
      userId
    })
    // 获取用户相关信息
    this.getUserData()
    // 获取用户所有宝贝

    // 获取用户粉丝数和关注数
  },
  onShow () {
    if (this.data.openid)
    {
      this.isFollow()
    }
    this.getUserData()
  },
  isFollow () {
    request({
      url: '/api/user_follow',
      data: {
        user_id: this.data.openid,
        my_attention_id: this.data.userId
      },
      method: 'post'
    }).then((res) => {
      this.setData({
        isFollow: res.data.data
      })
    })
  },
  // 用户是否取消关注
  handleCancelFollow () {
    console.log("用户点击取消关注");
    this.setData({
      visible: true
    })
  },
  handleClick ({ detail }) {
    const that = this
    const index = detail.index;
    this.setData({
      visible: false
    })
    if (index === 1)
    {
      request({
        url: '/api/cancel_follow',
        data: {
          user_id: this.data.openid,
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
        that.getUserData()
      })
    }
  },
  handleFollow () {
    console.log("用户点击关注按钮");
    request({
      url: '/api/add_follow',
      data: {
        user_id: this.data.openid,
        my_attention_id: this.data.userId
      },
      method: 'post'
    }).then((res) => {
      this.setData({
        isFollow: res.data.data
      })
      $Toast({
        content: '关注成功~'
      });
      this.getUserData()
    })
  },
  getUserData () {
    const that = this
    request({
      url: "/api/person",
      data: {
        id: this.data.userId
      },
      method: "post"
    }).then((res) => {
      console.log(res.data.data);
      let commoditys = []
      commoditys = res.data.data.commoditys
      if (commoditys.length !== 0)
      {
        this.setData({
          isData: 1
        })
        commoditys.forEach(v => {
          v.imgs = v.imgs.split(']')[0].toString()
        });
      } else {
        this.setData({
          isData: 0
        })
      }
      console.log(commoditys);
      that.setData({
        userInfo: res.data.data.user,
        fans: res.data.data.fans,
        attentions: res.data.data.attentions,
        commoditys: commoditys,
      })
    })
  },
  preview_img: function (e) {
    // var cur_num = e.currentTarget.dataset.num;
    // var img_urls = this.data.imgList
    wx.previewImage({
      current: 'https://img0.baidu.com/it/u=2586336746,188032902&fm=26&fmt=auto',
      urls: ['https://img0.baidu.com/it/u=2586336746,188032902&fm=26&fmt=auto']
    })
  },
 

})