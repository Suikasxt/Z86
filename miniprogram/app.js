//app.js
App({
  globalData: {
    clockL: 5 * 60 + 45,
    clockR: 6 * 60 + 45,
    latitudeL: 40.007790,
    latitudeR: 40.009560,
    longitudeL: 116.322320,
    longitudeR: 116.324421,
    rules: ""
  },
  getSettings: function(){
    const db = wx.cloud.database()
    db.collection('Settings').get({
      success: res => {
        var settings = res.data[0]

        if (settings.clockL) {
          this.globalData.clockL = settings.clockL
        }
        if (settings.clockR) {
          this.globalData.clockR = settings.clockR
        }
        if (settings.latitudeL) {
          this.globalData.latitudeL = settings.latitudeL
        }
        if (settings.latitudeR) {
          this.globalData.latitudeR = settings.latitudeR
        }
        if (settings.longitudeL) {
          this.globalData.longitudeL = settings.longitudeL
        }
        if (settings.longitudeR) {
          this.globalData.longitudeR = settings.longitudeR
        }
        if (settings.rules) {
          this.globalData.rules = settings.rules
        }
        if (settings.prizeList) {
          this.globalData.prizeList = settings.prizeList
        }


        console.log('Settings [数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('Settings [数据库] [查询记录] 失败：', err)
      }
    })
  },
  tryLogin: function (personal) {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        that.setUserInfo(res.userInfo)
        if (personal) {
          personal.setData({
            userInfo: res.userInfo
          })
        }
      }
    })
  },
  setUserInfo: function (user) {
    if (!wx.cloud) {
      return
    }
    this.globalData.userInfo = user
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('Login Successfully', res.result)
        this.globalData.openid = res.result.openid
        this.newUser()
      },
      fail: err => {
        console.error("Login Error", err)
      }
    })
  },

  newUser: function () {
    const db = wx.cloud.database()
    db.collection('Users').where({
      _openid: this.globalData.openid
    }).get({
      success: res => {
        if (res.data.length == 0) {
          db.collection('Users').add({
            data: {
              userInfo: this.globalData.userInfo,
              joggingCheckin: [],
              joggingCount: 0,
              currentJoggingCount: 0,
              lastActive: new Date(0)
            },
            success: res => {
              this.globalData.userInfo.id = res._id
              this.globalData.joggingCheckin = []
              this.globalData.joggingCount = 0
              this.globalData.currentJoggingCount = 0
              this.globalData.lastActive = new Date(0)
              console.log('[数据库] [新增记录] 成功： ', res)
            },
            fail: err => {
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
        } else {
          this.globalData.userInfo.id = res.data[0]._id
          this.globalData.joggingCheckin = res.data[0].joggingCheckin
          this.globalData.joggingCount = res.data[0].joggingCount
          this.globalData.currentJoggingCount = res.data[0].currentJoggingCount
          this.globalData.lastActive = res.data[0].lastActive
        }
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.tryLogin()
    this.getSettings()
  },
  updatePersonalData: function () {
    const db = wx.cloud.database()
    db.collection('Users').doc(this.globalData.userInfo.id).update({
      data:{
        userInfo: this.globalData.userInfo,
        joggingCheckin: this.globalData.joggingCheckin,
        joggingCount: this.globalData.joggingCount,
        currentJoggingCount: this.globalData.currentJoggingCount,
        lastActive: this.globalData.lastActive
      },
      success: res => {
        console.log('[数据库] [更新记录] 成功：', res)
      },
      fail: err => {
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  }
})
