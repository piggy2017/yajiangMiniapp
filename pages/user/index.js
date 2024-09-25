// pages/user/index.js
const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
import event from '../../utils/event'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    nickname:"",
    loginName:'',
    commonComplaint:{},//投诉建议
    commonAbout:{},//关于应用
    language:'',
    languageList: ['中文', 'English', 'རྒྱ་ཡིག'],
    langIndex:0
  },


  onTabItemTap(item){
    console.log("触发 onTabItemTap",item)
    wx.removeStorageSync('source');
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let langIndex = wx.getStorageSync("langIndex");
    if (langIndex && langIndex!=0){
      this.setData({
        langIndex: langIndex
      })
    }
    this.setLanguage();
    
    this.getCommonComplaint();
    this.getCommonAbout();
  },
  bindPickerChange:function(e){
    let index = e.detail.value
    this.setData({
      langIndex: index
    })
    wx.setStorageSync("langIndex",index);
    wx.T.setLocaleByIndex(index);
    this.setLanguage();
    event.emit('languageChanged');
  },
  setLanguage() {
    let language=wx.T.getLanguage()
    this.setData({
      language: language,
    });
    app.globalData.language = language;
    wx.T.setNavigationBarTitle(this.data.language.myTitle);
    this.changeList();
  },
  changeList:function(){
    if (this.data.language) {
      let languageList = [this.data.language.zw, this.data.language.yw, this.data.language.zy];
      this.setData({
        languageList: languageList
      })
    }
  },
  getCommonComplaint: function () {
    util.request(api.APPCommonComplaint, {
    }, "GET").then(res => {
      this.setData({
        commonComplaint:res
      })
    }).catch(res => {
    //   util.showErrorToast("失败")
    })
  }, 
  getCommonAbout: function () {
    util.request(api.APPCommonAbout, {
    }, "GET").then(res => {
      this.setData({
        commonAbout: res
      })
    }).catch(res => {
    //   util.showErrorToast("失败")
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
  gotoPage:function(e){
    var url=''
    // 判断是否登陆
    if (this.data.isLogin) {
      url = e.currentTarget.dataset.url;
    } else {
      url = "/pages/auto_login/login/index"
    }
    wx.navigateTo({
      url: url
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
    let isLogin = wx.getStorageSync("isLogin");
    let nickname = wx.getStorageSync("nickname");
    let loginName = wx.getStorageSync("loginName");
    this.setData({
      isLogin: isLogin,
      nickname: nickname,
      loginName: loginName
    })
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