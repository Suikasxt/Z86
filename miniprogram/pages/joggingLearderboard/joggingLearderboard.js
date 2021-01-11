// pages/joggingLearderboard/joggingLearderboard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title
    if (options.type=="0"){
      title = "本月排行榜"
    }else if (options.type=="1"){
      title = "总量排行榜"
    }
    this.setData({
      type: options.type,
      title: title
    })
    const db = wx.cloud.database()
    if (options.type == "0") {
      var now = new Date()
      db.collection('Users').where({
        lastActive: db.command.gt(new Date(now.getFullYear(), now.getMonth(), 1))
      }).orderBy('currentJoggingCount', 'desc').orderBy('lastActive', 'asc').get({
        success: res => {
          var tmp = []
          for (var i in res.data) {
            if (res.data[i].currentJoggingCount > 0) {
              res.data[i].joggingCount = res.data[i].currentJoggingCount
              tmp.push(res.data[i])
            }
          }
          this.setData({
            users: tmp
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    } else if (options.type == '1') {
      db.collection('Users').orderBy('joggingCount', 'desc').orderBy('lastActive', 'asc').get({
        success: res => {
          var tmp = []
          for (var i in res.data) {
            if (res.data[i].joggingCount > 0) {
              tmp.push(res.data[i])
            }
          }
          this.setData({
            users: tmp
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})