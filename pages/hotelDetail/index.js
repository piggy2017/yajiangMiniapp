// pages/hotelDetail/index.js
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
    shuffling:4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      language: app.globalData.language
    });
    this.getHotelDetail(options.id)
    
    // this.getHotelDetail("26bbec4e-ecd3-4fd7-8e7b-1fc1968d0fc1")
  },
  getHotelDetail:function(id){
    util.request(api.APPhotelDetail, {
      id:id
    }, "GET").then(res => {
      this.setData(res)
      app.globalData.markersInfo = res
      if (res.name != undefined || res.name != null) {
        wx.setNavigationBarTitle({
          title: res.name
        })
      }
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
  makePhoneCall(e){
    console.log(e)
    let phone = e.currentTarget.dataset.phone;
    if(phone){
      wx.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
    }
  },
  gotoMap(){
    console.log(1111)
    wx.navigateTo({
      url: '/pages/mapDetail/index'
    });
  },
  gotoDetail: function (e) { //查看详情
    var id = e.currentTarget.dataset.id;
    console.log(id)
    var _url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: _url + "?id=" + id
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