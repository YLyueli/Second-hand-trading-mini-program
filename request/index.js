// 同时发送异步代码的次数
let ajaxTimes = 0;
export const request = (params) => {
  // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token

  let header = { ...params.header };
  if (params.url.includes("/api/"))
  {
    header["Authorization"] = wx.getStorageSync("token");
    ajaxTimes++;
    console.log('1', ajaxTimes);
    // wx.checkSession({
    //   success: () => {
    //     ajaxTimes--;
    //     console.log('3', ajaxTimes);
    //     if (ajaxTimes === 0)
    //     {
    //       const school = wx.getStorageSync("school");
    //       if (school == '' || school == null)
    //       {
    //         wx.navigateTo({
    //           url: '/pages/auth/index',
    //         });
    //       }
    //     }
    //   },
    //   fail: () => {
    //     ajaxTimes--;
    //     console.log('2',ajaxTimes);
    //     // if (ajaxTimes === 0)
    //     // {
    //     //   wx.navigateTo({ url: "/pages/login/index" })
    //     // }
    //   },
    // })
  }
  // 定义公共url
//   const baseUrl = "http://192.168.104.80:3009"
  // const baseUrl = "http://localhost:3009"
  const baseUrl = "http://124.221.67.34:3009"
  // const baseUrl = "http://www.mintyy.site:3009"
  
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header: header,
      url: baseUrl + params.url,
      success: (result) => {
        console.log(result)
        if(result.data.message === "身份认证失败！") {
          console.log('身份认证失败')
          wx.navigateTo({ url: "/pages/login/index" })
        }
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
      }
    })
  })
}