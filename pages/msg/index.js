import { request } from "../../request/index.js";

Page({
  data: {
    msgList: [],
    id: '',
    num: 0,
    noticeNum: 0,
    time: ''
  },
  msgListNum: [],
  onShow: function () {
    this.getTabBar().setData({
      current: 'msg'
    })
    this.getMsgList()
    this.getNoticeNum()
    if (this.data.id)
    {
      const time = setInterval(() => {
        this.getMsgList()
      }, 300);
      this.setData({
        time
      })
    }
  },
  onHide () {
    clearInterval(this.data.time)
  },
  onLoad () {
    const id = wx.getStorageSync("openid");
    this.setData({
      id: id
    })
  },
  getNoticeNum () {
    request({
      url: "/api/get/notice",
      data: {
        user_id: this.data.id
      },
      method: 'post'
    }).then(res => {
      this.setData({
        noticeNum: res.data.data.num
      })
    })
  },
  getMsgUrNum () {
    console.log("获取用户未读消息数");
    const that = this
    request({
      url: '/api/msg_unread_num',
      data: {
        id: this.data.id
      },
      method: 'post'
    }).then(res => {
      console.log(res.data.data);
      const msgListNum = res.data.data
      const msgList = that.data.msgList
      const app = getApp();
      let totalNum = 0
      msgListNum.forEach(v => {
        totalNum += v.num
      })
      if (totalNum != this.data.num)
      {
        this.setData({
          num: totalNum
        })
      }
      app.globalData.msgNum = totalNum;
      this.getTabBar().setData({
        num: totalNum
      })
      console.log('未读消息总数：', totalNum, typeof totalNum, this.data.num);

      this.msgListNum = msgListNum

      msgListNum.forEach(v => {
        console.log(v.num, v.group_id);
        msgList.forEach(m => {
          console.log(m.num, m.group_id);
          if (v.group_id === m.group_id)
          {
            m.num = v.num;
          }
        })
      })
      this.setData({
        msgList
      })
    })
  },
  getMsgList () {
    const id = wx.getStorageSync("openid");
    const that = this
    this.setData({
      id: id
    })
    request({
      url: "/api/msg_list",
      data: {
        buy_id: id
      },
      method: 'post'
    }).then(res => {
      const list = res.data.data
      list.forEach(v => {
        if (v.msg_time)
        {
          v.msg_time = v.msg_time.slice(5, 16)
        }
        let msgListNum = that.msgListNum
        if (msgListNum.length === 0)
        {
          v.num = 0
        } else
        {
          msgListNum.forEach(m => {
            if (v.group_id === m.group_id)
            {
              v.num = m.num;
            }
          })
        }
      });
      this.setData({
        msgList: res.data.data
      })
      that.getMsgUrNum()
    })
  },
  checkMsgDetail (e) {
    console.log(e);
    const good = e.currentTarget.dataset.item
    console.log(good);
    if (good.user_id === this.data.id)
    {
      wx.navigateTo({
        url: `/pages/msg_detail/index?commodityId=${good.commodity_id}&sellId=${good.receive_user_id}&username=${good.receiveUserName}&groupId=${good.group_id}&img=` + encodeURIComponent(good.receiveUserImg)
      });
    } else
    {
      wx.navigateTo({
        url: `/pages/msg_detail/index?commodityId=${good.commodity_id}&sellId=${good.user_id}&username=${good.userName}&groupId=${good.group_id}&img=` + encodeURIComponent(good.userImg)
      });
    }
  },















})