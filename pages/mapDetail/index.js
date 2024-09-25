// pages/map/index.js
const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const animation = require('../../utils/animation.js');
import event from '../../utils/event'//引用语言方法
Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: "",//接收语音包
    markers: [],
    markersArr: [],
    distance: 0,
    detailInfo: "",
  
    resTypeList: [],
    contentShow: false,
    latitude: "",
    longitude: ""
  },
  regionchange(e) {
    console.log(e.type)
  },
  distance: function (la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10;
    this.setData({
      distance: s
    })
  },
  controltap(e) {
    console.log(e.controlId)
  },
  getMarkers(r) {
    this.data.markersArr.push({
      iconPath: "../../static/images/icon_map_scenic_selected@2x.png",
      id: r.id,
      latitude: r.lat,
      longitude: r.lng,
      width: 30,
      height: 30,
      type: "Scenic",
    })
    this.setData({
      markers: this.data.markersArr
    })
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,//纬度 
          longitude: longitude,//经度 
        })
      }
    })
    r.imageUrl = r.imageList[0].imageUrl
    // 获取距离
    this.distance(this.data.latitude, this.data.longitude, r.lat, r.lng)
    this.setData({
      detailInfo: r,
      contentShow: true
    })
  },
  openLocation() {
    console.log(this.data.detailInfo)
    wx.openLocation({
      latitude: this.data.detailInfo.lat,	//维度
      longitude: this.data.detailInfo.lng, //经度
      name: this.data.detailInfo.name,	//目的地定位名称
      scale: 15,	//缩放比例
      address: this.data.detailInfo.address	//导航详细地址
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取相对应语音包
    this.setLanguage();	// (1)
    event.on("languageChanged", this, this.setLanguage); // (2)
    console.log(app.globalData.markersInfo)
    this.getMarkers(app.globalData.markersInfo)
  },
  setLanguage() {
    let language = wx.T.getLanguage();
    this.setData({
      language: language
    });
    // app.globalData.language = language;
    this.data.shouldChangeTitle = true;
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
    // 切换语音之后重新获取语音包
    if (this.data.shouldChangeTitle) {
      console.log(123)
      wx.T.setNavigationBarTitle(this.data.language.dt);
      this.mapCtx = wx.createMapContext('map')
    }
  }, 
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
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