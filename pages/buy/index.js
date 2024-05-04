import {request} from "../../request/index"
const { $Toast } = require('../../dist/base/index');
const { $Message } = require('../../dist/base/index');
Page({
  data: {
    commodityId: 0,
    groupId: 0,
    visible: false,
    actions: [
      {
        name: '取消',
      },
      {
        name: '确认',
        color: '#F74C56'
      }
    ],
    commodityInfo: {}
  },
  onShow () {
    this.getCommodityData()
  },
  onLoad(options) {
    console.log(options);
    this.setData({
      commodityId: options.commodityId,
      groupId: options.groupId
    })
  },
  // 获取商品信息
  getCommodityData () {
    request({
      url: '/api1/goods_detail',
      data: {
        user_id: '',
        commodity_id: this.data.commodityId
      },
      method: 'post'
    }).then((res) => {
      console.log(res.data);
      let img = res.data.data[0].imgs.split(']')[0]
      const commodityInfo = {
        img: img,
        price: res.data.data[0].price,
        title: res.data.data[0].title,
      }
      this.setData({
        commodityInfo
      })
    })
  },
  buyBtn () {
    this.setData({
      visible: true
    })

  },
  handleClick ({ detail }) {
    const index = detail.index;
    this.setData({
      visible: false
    })
    if (index === 1)
    {
      request({
        url: '/api/purchase',
        data: {
          commodity_id: this.data.commodityId,
          group_id: this.data.groupId
        },
        method: 'post'
      }).then(res => {
        $Toast({
          content: '购买成功',
          type: 'success'
        }); 
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/my_buy/index'
          })
          // wx.navigateBack({
          //   delta: 1
          // });
        }, 2000)
      })

    }


  },
})
