import { request } from "../../request/index"

Page({
  data: {
    friends: [],
    userId: '',
    isData: 10,
  },
  //options(Object)
  onLoad: function(options){
    
  },
  onReady: function(){
    
  },
  onShow: function(){
    const userId = wx.getStorageSync("openid");
    this.setData({
      userId
    })
    this.getFriendData()
  },
  getFriendData() {
    const that = this
    request({
      url: '/api/user_friend',
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
      this.setData({
        friends: data
      })
    })
  },

});