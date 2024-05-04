//Page Object
Page({
  data: {
    inputValue: '',
    searchSchool: ['hahaha'
    ],
    school: [
      '安徽大学', '合肥工业大学', '黑龙江职业学院', '星际幼儿园', '反派修真学院', '羊村', '灰太狼的城堡'
    ]
  },
  //options(Object)
  onLoad: function (options) {

  },
  handleSearchSchool (e) {
    this.setData({
      inputValue: e.detail.value
    })
    var schoolList = this.data.school
    const value = this.data.inputValue
    console.log(schoolList);
    const searchSchool = schoolList.filter((item) => {
      // console.log(item.includes(value));
      return item.includes(value)
    })
    console.log(searchSchool);
    this.setData({
      searchSchool
    })
  },
  handleSelectSchool (e) {

    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      school: e.currentTarget.dataset.school,
    })
    wx.navigateBack({
      delta: 1
    });

  }

})