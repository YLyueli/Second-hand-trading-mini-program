const { request } = require('../../request/index')

const { $Message } = require('../../dist/base/index');
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图片路径
    imgList: [],
    // 是否选择分类
    chooseClassify: false,
    // 有哪几种分类
    classifyTitle: ['学习', '生活', '衣物', '饰品', '运动', '数码', '美妆', '饮食', '其他'],
    // 当前选中分类
    currentChoose: 0,
    title: '',
    content: '',
    price: '',
    commodityId: 0,
    school: '',
    isPic: false,
  },
  onLoad () {
    console.log(getApp().globalData.isEdit);
    const id = wx.getStorageSync("openid");
    const school = wx.getStorageSync("school");

    this.setData({
      userId: id,
      school
    })
    this.getTabBar().setData({
      current: 'release'
    })
  },
  onShow: function () {
    const token = wx.getStorageSync("token");
    this.setData({
      commodityId: getApp().globalData.isEdit,
    })
    if (token === '')
    {
      wx.navigateTo({ url: "/pages/login/index" })
    }
    if (this.data.commodityId)
    {
      request({
        url: '/api1/goods_detail',
        data: {
          user_id: this.data.userId,
          commodity_id: this.data.commodityId
        },
        method: 'post'
      }).then((res) => {
        console.log(res.data);
        let imgList = res.data.data[0].imgs.split(']')
        // console.log(imgList);
        res.data.data[0].time = res.data.data[0].time.slice(0, 16)
        let index = this.data.classifyTitle.indexOf(res.data.data[0].classify) + 1
        if (this.data.title === '' && this.data.content === '' && this.data.price === '' && this.data.currentChoose === 0)
        {
          this.setData({
            title: res.data.data[0].title,
            content: res.data.data[0].content,
            price: res.data.data[0].price,
            currentChoose: index,
          })
        }
        if (this.data.imgList.length === 0 && imgList.length !== 0)
        {
          this.setData({
            imgList
          })
        }
      })
    }
    if (!this.data.isPic)
    {
      this.setData({
        // commodityId: 0,
        currentChoose: 0,
        title: '',
        content: '',
        price: '',
        imgList: [],
      })
    }
    this.getTabBar().setData({
      current: 'release'
    })
  },
  handleInputTitle (e) {
    let data = e.detail.value
    this.setData({
      title: data
    })
  },
  handleInputContent (e) {
    let data = e.detail.value
    this.setData({
      content: data
    })
  },
  handleInputPrice (e) {
    let data = e.detail.value
    this.setData({
      price: data
    })
  },
  // 从本地相册中选择图片
  handleChooseImg () {
    const _this = this
    this.setData({
      isPic: true
    })
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // _this.data.imgList.push(res.tempFilePaths.toString())
        
        // _this.setData({
          //   imgList: [..._this.data.imgList, ...res.tempFilePaths],
          // })
          console.log(_this.data.imgList);
          console.log(res.tempFilePaths);
          res.tempFilePaths.forEach( v => {
          wx.uploadFile({
            url: 'http://124.221.67.34:3009/api1/upload', //服务器接口地址
            filePath: v,
            name: 'file',
            success: function (res) {
              let result = 'http://124.221.67.34:3009/' + JSON.parse(res.data).data.replace(/\\/g,'/')
              console.log(result);
              _this.setData({
                imgList: [..._this.data.imgList, result],
              })
            },
            fail: function (e) {
              console.log(e.stack);
            }
          })
        })
        console.log(_this.data.imgList);
        
        // urls.forEach(v => {
        //   wx.getFileSystemManager().readFile({
        //     filePath: v, //选择图片返回的相对路径
        //     encoding: 'base64', //编码格式
        //     success: res => { //成功的回调
        //       console.log('data:image/png;base64,' + res.data)
        //       let url = 'data:image/png;base64,' + res.data
        //       url = url.replace(/[\r\n]/g, "")
        //       _this.data.imgList.push(url)
        //       console.log(_this.data.imgList);
        //       _this.setData({
        //         imgList: _this.data.imgList
        //       })
        //     }
        //   });
        // })

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  delete_th: function (e) {
    var num = e.currentTarget.dataset.num;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm)
        {
          that.data.imgList.splice(num, 1)
          that.setData({
            imgList: that.data.imgList
          })
        } else if (res.cancel)
        {
          console.log('用户点击取消')
        }
      }
    })
  },
  preview_img: function (e) {
    var cur_num = e.currentTarget.dataset.num;
    var img_urls = this.data.imgList
    console.log("查看图片：", img_urls, cur_num);
    wx.previewImage({
      current: img_urls[cur_num],
      urls: img_urls
    })
  },
  handleChooseClassify () {
    this.setData({
      chooseClassify: !this.data.chooseClassify
    })
  },
  chooseClassifyTitle (e) {
    console.log(e);
    const title = e.currentTarget.dataset.title
    const index = e.currentTarget.dataset.index
    this.setData({
      currentChoose: index
    })
    console.log(this.data.currentChoose);
  },
  async handleRelease () {
    console.log('点击发布');
    const openid = wx.getStorageSync("openid");
    const that = this
    let releaseInfo = {
      user_id: openid,
      title: this.data.title,
      content: this.data.content,
      imgList: this.data.imgList.join(']'),
      classify: this.data.classifyTitle[this.data.currentChoose - 1],
      price: this.data.price,
      time: new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " ")
    }
    if (this.data.title === '')
    {
      $Message({
        content: "请填写标题",
        type: "error"
      })
      return
    } if (this.data.content === '')
    {
      $Message({
        content: "请填写发布内容",
        type: "error"
      })
      return
    } if (this.data.imgList.length === 0)
    {
      $Message({
        content: "请添加图片",
        type: "error"
      })
      return
    } if (this.data.currentChoose === 0)
    {
      $Message({
        content: "请选择分类",
        type: "error"
      })
      return
    } if (this.data.price === '')
    {
      $Message({
        content: "请填写价格",
        type: "error"
      })
      return
    }
    console.log("发布信息", releaseInfo);
    if (this.data.commodityId !== 0)
    {
      releaseInfo.commodity_id = this.data.commodityId
      const res = await request({
        url: '/api/update/goods',
        data: releaseInfo,
        method: 'post'
      })
      if (res.data.status === 0)
      {
        $Toast({
          content: '商品修改成功~',
        });
        const id = this.data.commodityId
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/goods_detail/index?userId=${this.data.userId}&commodityId=${id}`
          });
          that.setData({
            isPic: false
          })

        }, 300);

      }
    } else
    {
      const res = await request({
        url: '/api/release/goods',
        data: releaseInfo,
        method: 'post'
      })
      if (res.data.status === 0)
      {
        $Toast({
          content: '发布成功',
          type: 'success'
        });
        const commodityId = res.data.data[0].commodity_id
        console.log(commodityId);
        that.setData({
          isPic: false
        })
        getApp().globalData.isFresh = true
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/goods_detail/index?userId=${this.data.userId}&commodityId=${commodityId}`
          });
        }, 300);
      }
    }
  }
})

