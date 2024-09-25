// pages/route/index.js
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
    pageSize: 10,//每页显示记录数量
    pageIndex: 0,//页码，索引从0开始
    days:0,
    isRequest: true,
    routeList:[],
    query:[]
  },

  onTabItemTap(item){
    console.log("触发 onTabItemTap",item)
    wx.removeStorageSync('source');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取相对应语音包
    this.setLanguage();	// (1)
    event.on("languageChanged", this, this.setLanguage); // (2)
  },
  setLanguage() {
    let language = wx.T.getLanguage();
    this.setData({
      language: language
    });
    // app.globalData.language = language;
    this.data.shouldChangeTitle = true;
  },
  getListData(){
    util.request(api.APPRouteListQuery, {
      days:this.data.days,
      page_size: this.data.pageSize,
      page_index: this.data.pageIndex
    }, "GET").then(res => {
      var param = {}, str1 = "routeList";
      if (this.data.pageIndex == 0) {
        param[str1] = res.routeList;
      } else {
        param[str1] = this.data.routeList.concat(res.routeList);
      }
      if (res.query && res.query.length>0){
        param["query"] = res.query
      }
      // 判断是否请求到最后
      if (res.routeList.length == this.data.pageSize) {
        param.isRequest = true
        param.pageIndex = this.data.pageIndex + 1
      } else {
        param.isRequest = false
      }
      this.setData(param)
    }).catch(res => {
      console.log(res)
      util.showErrorToast("失败")
    })
  },
  routeHop: function (e) {//路由跳转
    var page = e.currentTarget.dataset.page;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: page + "?id=" + id
    })
  },
  changeDays(e){
    let days = e.currentTarget.dataset.days;
    this.setData({
      days: days,
      pageSize: 10,
      pageIndex: 0
    });
    this.getListData()
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
      wx.T.setNavigationBarTitle(this.data.language.lx);
      this.setData({
        pageSize: 10,//每页显示记录数量
        pageIndex: 0,//页码，索引从0开始
        days: 0,
      })
      this.getListData() //获取首页数据
    }
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
      this.getListData();
    }
  },

  /**
   * 用户点击右上角分享
   */
    //  分享功能
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            return {
                title: "雅江县旅游导览，看来看看吧",
                path: "/pages/newIndex/index"
            }
        } else {
            return {
                title: "雅江县旅游导览，看来看看吧",
                path: "/pages/newIndex/index"
            }
        }
    },
})