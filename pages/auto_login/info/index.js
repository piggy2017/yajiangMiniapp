// pages/auto_login/info/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:'',
    loginName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nickname = wx.getStorageSync("nickname");
    let loginName = wx.getStorageSync("loginName");
    this.setData({
      nickname: nickname,
      loginName:loginName
    })
  },
  gotoPage: function (e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },
  handleOutput:function(){
    wx.showModal({
      title: '退出登陆',
      content: '确定要退出吗',
      success(res) {
        if (res.confirm) {
          wx.setStorageSync("isLogin", false)
          wx.removeStorageSync("loginName")
          wx.removeStorageSync("password")
          wx.removeStorageSync("nickname")
          wx.removeStorageSync("userID")
          //返回上页
          wx.navigateBack({
            delta: 1
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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