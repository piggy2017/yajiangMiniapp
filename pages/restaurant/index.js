// pages/restaurant/index.js
const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: "",//接收语音包
    pageSize: 10,//每页显示记录数量
    pageIndex: 0,//页码，索引从0开始
    isRequest:true,
    restaurantList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      language: app.globalData.language
    });
    this.getRestaurantData()
  },
  getRestaurantData: function () {
    util.request(api.APPrestaurant, {
      page_size: this.data.pageSize,
      page_index: this.data.pageIndex
    }, "GET").then(res => {
      var param = {}, str1 = "restaurantList";
      if (this.data.pageIndex == 0) {
        param[str1] = res;
      } else {
        param[str1] = this.data.restaurantList.concat(res);
      }
      // 判断是否请求到最后
      if(res.length==this.data.pageSize){
        param.isRequest = true
        param.pageIndex = this.data.pageIndex + 1
      }else{
        param.isRequest = false
      }
      this.setData(param)
    }).catch(res => {
      util.showErrorToast("失败")
    })
  },
  gotoDetail: function (e) {//查看景点详情
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/restaurantDetail/index?id=" + id
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
    wx.T.setNavigationBarTitle(this.data.language.tscy);
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
    if (this.data.isRequest) {
      this.getRestaurantData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})