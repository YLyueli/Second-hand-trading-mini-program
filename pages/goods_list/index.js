// pages/index/index.js
import { request } from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    input: '',
    pagenum: 1,
    totalPages: 1,
    action: '全部',
    classifySelect: ['全部', '同校', '学习', '生活', '衣物', '饰品', '运动', '数码', '美妆', '饮食', '其他'],
    scrollLeft: ''
  },
  type: 'search',
  classifyName: "全部",
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.type)
    {
      // console.log('分类搜索');
      this.setData({
        action: options.type,
        input: options.type
      })
      this.type = "classify"
      this.classifyName = options.type
      this.getDataByClassify(options.type)
      if(options.type === "同校") {
        this.setData({
          input: ""
        })
      }
      // this.type = "classify"
      if (options.type == "运动" || options.type == "数码" || options.type == "美妆" || options.type == "其他" || options.type == "饮食")
      {
        this.setData({
          scrollLeft: "600rpx"
        })
      }
    } else
    {
      this.getData()
    }
  },
  handleSelect (e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      action: item,
      pagenum: 1,
      goodsList: [],
      input: ''
    })
    console.log(this.data.action);
    if (this.data.action == "全部")
    {
      this.getData()
    } else
    {
      this.type = "classify"
      this.classifyName = this.data.action
      console.log(this.classifyName);
      this.getDataByClassify(this.data.action)
    }
  },
  handleInput (e) {
    let data = e.detail.value

    this.setData({
      input: data
    })
  },
  getData () {
    const that = this
    request({
      url: "/api1/goods_list/" + this.data.pagenum,
    })
      .then((res) => {
        console.log(res);
        let goods = res.data.data
        if(goods.length !== 0) {
          this.setData({
            isData: 1
          })
        } else {
          this.setData({
            isData: 0
          })
          return
        }
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
  getDataByClassify (type) {
    const that = this
    let type1 = 0
    const school = wx.getStorageSync("school");
    if (this.classifyName === "同校")
    {
      type1 = 1
    }
    request({
      url: "/api1/goods_list/classify/" + this.data.pagenum,
      method: "post",
      data: {
        classify: type,
        school: school,
        type: type1
      }
    })
      .then((res) => {
        console.log(res);
        let goods = res.data.data
        if(goods.length !== 0) {
          this.setData({
            isData: 1
          })
        } else {
          this.setData({
            isData: 0
          })
          return
        }
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
  getDataByBtn () {
    const that = this
    console.log('点击搜索按钮');
    console.log(this.data.input);
    request({
      url: "/api1/goods_list/search/" + this.data.pagenum,
      data: {
        search: this.data.input
      },
      method: "post"
    }).then((res) => {
      let goods = res.data.data
      if(goods.length !== 0) {
        this.setData({
          isData: 1
        })
      } else {
        this.setData({
          isData: 0
        })
        return
      }
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
  handleSearch () {
    if (this.data.input)
    {
      this.type = "input"
    }
    this.setData({
      goodsList: [],
      action: "全部",
      scrollLeft: ''
    })

    this.setData({
      pagenum: 1
    })
    this.getDataByBtn()
  },
  handleGoodDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url:`/pages/goods_detail/index?userId=${item.user_id}&commodityId=${item.commodity_id}`
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
      console.log(this.type);
      if (this.type === "search")
      {
        this.getData()
      } else if (this.type === "classify")
      {
        this.getDataByClassify(this.classifyName)
      } else
      {
        this.getDataByBtn()
      }
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
    if (this.type === "search")
    {
      this.getData()
    } else if (this.type === "classify")
    {
      this.getDataByClassify(this.classifyName)
    } else
    {
      this.handleSearch()
    }
  },


})
