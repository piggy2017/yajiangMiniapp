// pages/auto_login/login/index.js
const app = getApp()
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: "",//接收语音包
    loginName:'',
    nickname:'',
    oldPassword:"",
    newPassword:"",
    confirmNewPassword:'',
    timer:'',//定时器
    message:'',//提示消息
    verify:false,//是否显示校验结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nickname = wx.getStorageSync("nickname");
    let loginName = wx.getStorageSync("loginName");
    this.setData({
      language: app.globalData.language
    });
    this.setData({
      nickname: nickname,
      loginName: loginName
    })
  },
  bindBlur:function(e){
    let { field} = e.currentTarget.dataset;
    this.setData({
      [`${field}`]:e.detail.value
    })
  },
  handleLogin:function(){

    let message="";
    let verify=false;
    if(!this.data.loginName){
      message = "请输入登陆名";
      verify = true;
    }else if(!this.data.nickname){
      message = "请输入昵称";
      verify = true;
    } else if(!this.data.oldPassword){
      message = "请输入旧密码";
      verify = true;
    } else if (!this.data.newPassword) {
      message = "请输入新密码";
      verify = true;
    } else if (!this.data.confirmNewPassword){
      message = "请输入确认新密码";
      verify = true;
    } else if (this.data.newPassword != this.data.confirmNewPassword){
      message = "两次新密码不同";
      verify = true;
    } else{
      this.submitLogin()
    }
    if(verify){
      let _this=this;
      let timer = setTimeout(function () {
        _this.setData({
          message: '',
          verify: false
        })
        clearTimeout(timer)//关闭定时器
      }, 1500)

      this.setData({
        message: message,
        verify: verify
      })
      
    }
    
  },
  submitLogin:function(){
    util.request(api.APPUserUpdate, {
      loginName:this.data.loginName,
      nickname:this.data.nickname,
      oldPassword: this.data.oldPassword,
      newPassword: this.data.newPassword
    }, "POST").then(res => {
      if (res.status){//注册成功
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 2000
        })
        let _this = this;
        let timer = setTimeout(function () {
          wx.setStorageSync("isLogin", false)
          wx.removeStorageSync("loginName")
          wx.removeStorageSync("password")
          wx.removeStorageSync("nickname")
          _this.setData({
            timer: timer
          })
          wx.navigateTo({
            url: '/pages/auto_login/login/index',
          })
          
        }, 2000)
        
        
      }else{
        util.showErrorToast(res.message)
      }
    }).catch(res => {
      util.showErrorToast("失败")
    })
  },
  gotoPage:function(){
    wx.navigateTo({
      url: "/pages/auto_login/login/index"
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
    wx.T.setNavigationBarTitle(this.data.language.xgxx);
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
    if(this.data.timer){
      clearTimeout(this.data.timer)//关闭定时器
    }
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