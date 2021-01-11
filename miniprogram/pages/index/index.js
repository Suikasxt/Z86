//index.js
var app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
  },
  joggingCheckin: function (e, time_online) {
    var that = this
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var that = this
    if (time_online == undefined) {
      wx.cloud.callFunction({
        name: 'getDate',
        data: {},
        success: res => {
          console.log('GetDate Successfully', res)
          that.joggingCheckin(e, res.result)
        },
        fail: err => {
          console.error("GetDate Error", err)
        }
      })
      return
    }
    var today = new Date(time_online)
    var clockNow = today.getHours() * 60 + today.getMinutes()
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    if (!(clockNow >= app.globalData.clockL && clockNow <= app.globalData.clockR)) {
      wx.showToast({
        title: '请在指定时间区间内打卡',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        if (res.latitude > app.globalData.latitudeL && res.latitude < app.globalData.latitudeR && res.longitude > app.globalData.longitudeL && res.longitude < app.globalData.longitudeR) {
          var checkinList = app.globalData.joggingCheckin
          if (checkinList.length == 0 || checkinList[checkinList.length - 1] < today) {
            var now = new Date(time_online)
            checkinList.push(now)
            app.globalData.joggingCount += 1
            if (now.getYear() == app.globalData.lastActive.getYear() && now.getMonth() == app.globalData.lastActive.getMonth()) {
              app.globalData.currentJoggingCount += 1
            } else {
              app.globalData.currentJoggingCount = 1
            }
            app.globalData.lastActive = now 
            app.updatePersonalData()
            that.setData({
              joggingCount: app.globalData.joggingCount
            })
            wx.showToast({
              title: '打开成功，累计' + app.globalData.joggingCount + '次',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '今天已经打过卡了哦',
              icon: 'none',
              duration: 2000
            })
            return
          }
        } else {
          wx.showToast({
            title: '请在指定区域(紫荆操场)内打卡',
            icon: 'none',
            duration: 2000
          })
          return
        }
      }
    })
  },
  toJoggingLeaderboard: function (e) {
    wx.navigateTo({
      url: '/pages/joggingLearderboard/joggingLearderboard?type=' + e.currentTarget.dataset.type
    })
  },
  toJoggingRules: function () {
    wx.navigateTo({
      url: '/pages/joggingRules/joggingRules'
    })
  }
})
