// pages/search/index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const animation = require('../../utils/animation.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: "",//接收语音包
    searchValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      language: app.globalData.language
    });
  },
  handleInputObjectName: function (e) {
    
    let value = e.detail.value;
    this.setData({
      searchValue: value
    })

    this.getDataList()
  },
  handleInputBlur(e){
    let value = e.detail.value;
    this.setData({
      searchValue: value
    })
  },
  handleSearch(){
    this.getDataList()
  },
  getDataList:function(){
    util.request(api.APPsearch, {
      area_id: 513328,
      lang: 0,
      queryStr:this.data.searchValue
    }, "GET").then(res => {
      this.setData(res)
    }).catch(res => {
      util.showErrorToast("失败")
    })
  },
  gotoActivity: function (e) {//使用web-view访问外部页面
    var _url = encodeURIComponent(e.currentTarget.dataset.url);
    var title = e.currentTarget.dataset.title;
    if (_url) {
      wx.navigateTo({
        url: "/pages/out/index?title=" + title + "&url=" + _url
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
    wx.T.setNavigationBarTitle(this.data.language.rsgz);
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