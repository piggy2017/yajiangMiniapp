// pages/videoList/index.js
const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList:[],
    playIndex:'0'
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    var videoContext = wx.createVideoContext("index"+this.data.playIndex, this) //这里对应的视频id
    videoContext.play()
  },
  getData: function () {
    util.request(api.APPVideoList, {}, "GET").then(res => {
      this.setData({
        videoList:res
      })
    }).catch(res => {
      util.showErrorToast("失败")
    })
  },// 点击cover播放，其它视频结束
  videoPlay: function (e) {
    var id = e.currentTarget.id;
    clearTimeout(this.timerId);
    //console.log(this.data.playIndex, id) // 当前播放与当前点击
    if (!this.data.playIndex) { // 当前没有正在播放的视频时
      this.setData({
        playIndex: id
      })
      var videoContext = wx.createVideoContext('index' + id)
      videoContext.play()
    } else {                    // 当前有正在播放的视频先将prev暂停到0s，再播放当前点击的current
      var videoContextPrev = wx.createVideoContext('index' + this.data.playIndex,this)
      videoContextPrev.seek(0)
      videoContextPrev.pause()
      this.setData({
        playIndex: id
      })
      var videoContextCurrent = wx.createVideoContext('index' + this.data.playIndex,this)
      
      this.timerId= setTimeout(function(){
        videoContextCurrent.play()
      },500)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onPageScroll:function(){
    console.log(213)
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
    clearTimeout(this.timerId);
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