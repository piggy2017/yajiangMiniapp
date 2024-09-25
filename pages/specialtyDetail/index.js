// pages/specialtyDetail/index.js
const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var WxParse = require("../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shuffling:4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSpecialtyDetail(options.id)
    
  },
  getSpecialtyDetail:function(id){
    util.request(api.APPspecialtyDetail, {
      id:id
    }, "GET").then(res => {
      res.shuffling=res.imageList.length
      if (res.name != undefined || res.name != null) {
        wx.setNavigationBarTitle({
          title: res.name
        })
      }
      this.setData(res);
      WxParse.wxParse('article', 'html', this.data.contentHtml, this, 5);
    }).catch(res => {
      util.showErrorToast("失败")
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