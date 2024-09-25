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
    password:"",
    confirmPassword:'',
    message:'',//提示消息
    verify:false,//是否显示校验结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      language: app.globalData.language
    });
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
    } else if(!this.data.password){
      message = "请输入密码";
      verify = true;
    } else if (!this.data.confirmPassword){
      message = "请输入确认密码";
      verify = true;
    }else if(this.data.password!=this.data.confirmPassword){
      message = "两次密码不同";
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
    util.request(api.APPUserCreate, {
      loginName:this.data.loginName,
      nickname:this.data.nickname,
      password:this.data.password
    }, "POST").then(res => {
      if (res.status){//注册成功
        //返回上页
        wx.navigateBack({
          delta: 1
        })
        
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
    wx.T.setNavigationBarTitle(this.data.language.zc);
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