import {request} from '../../request/index'

Page({
  data: {
    noticeList: []
  },
  //options(Object)
  onLoad: function(options){
    
  },
  onShow: function(){
    this.getNoticeNum()
  },
  getNoticeNum () {
    const id = wx.getStorageSync("openid");
      
    request({
      url: "/api/get/notice",
      data: {
        user_id: id
      },
      method: 'post'
    }).then(res => {
      this.setData({
        noticeList: res.data.data.results
      })
    })

    request({
      url: "/api/set/notice",
      data: {
        user_id: id
      },
      method: 'post'
    }).then(res => {
     
    })
  },
});