const grant_type = 'client_credentials'
const client_id = 'OltKdzfbeDDzR6HR5EOtagcQ'
const client_secret = 'igcA3g4rMLGiznE06Q9ejqvc6RAI7chD'

Page({
  // 隐藏弹窗
  hideModal: function () {
    this.setData({
       isShow: false,
      })
    },
  data: {
    imageUrl: null,
    token: null,
    base64: null,
    results: [{
        keyword: "人物特写",
        score: 0.813571,
        root: "人物-人物特写"
      },
      {
        keyword: "男孩",
        score: 0.630612,
        root: "人物活动-人物特写"
      },
      {
        keyword: "女孩",
        score: 0.353866,
        root: "人物-人物特写"
      }
    ],
  },

  //获取access_token
  get_access_token: function () {
    var that = this
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=' + grant_type + '&client_id=' + client_id + '&client_secret=' + client_secret,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      complete: function (res) {
        console.log('Request complete')
      },
      success: function (res) {
        console.log(res)
        const getToken = res.data.access_token
        that.setData({
          token: getToken,
          tokenInfo: "token获取成功"
        })
      },
      fail: function (res) {
        console.log('Fail to request !')
        console.log(res)
      }
    })
  },

  //上传图片
  get_image: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          imageUrl: tempFilePaths
        })
        console.log('Image path is', tempFilePaths)
        //转换成base64编码
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: 'base64',
          complete: res => {
            console.log(res)
          },
          success: res => {
            console.log('base64', res.data)
            that.setData({
              base64: res.data
            })
          },
          fail: function (res) {
            console.log('Fail to read file !')
            console.log(res)
          }
        })
      }
    })
  },

  //识别图片
  recognition: function () {
    var that = this; // 定义that变量并赋值为当前Page实例
    console.log(that.data.token)
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' + that.data.token,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        image: that.data.base64
      },
      complete: res => {
        console.log('complete recognition')
      },
      success: res => {
        console.log('success recognition')
        console.log(res)
        let results = res.data.result
        if (results != undefined && results != null) {
          that.setData({
            isShow: true,
            results: results
          })
          console.log("识别到的结果", results)
        } else {
          wx.clearStorageSync("access_token")
          wx.showToast({
            icon: 'error',
            title: '识别失败,请重试',
          })
        }
      }
    })
  }
})
