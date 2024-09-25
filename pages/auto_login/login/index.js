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
    password: "",
    timer: '',//定时器
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
      message = "登陆名不能为空";
      verify = true;
    }else if(!this.data.password){
      message = "密码不能为空";
      verify = true;
    }else{
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
    util.request(api.APPUserLogin, {
      loginName:this.data.loginName,
      password:this.data.password
    }, "POST").then(res => {
      if (res.status){//登陆成功
        // 存储登陆数据
        wx.setStorageSync("isLogin", true)
        wx.setStorageSync("loginName", res.user.loginName)
        wx.setStorageSync("password", res.user.password)
        wx.setStorageSync("nickname", res.user.nickname)
        wx.setStorageSync("userID", res.user.id)
        //返回上页
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 2000
        })
        let _this=this;
        let timer = setTimeout(function () {
          console.log(123)
          wx.switchTab({
            url: '/pages/user/index',
          })
          _this.setData({
            timer: timer
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
      url: "/pages/auto_login/create/index"
    })
  },
  gotoUpdate:function(){
    wx.navigateTo({
      url: "/pages/auto_login/update/index"
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
    wx.T.setNavigationBarTitle(this.data.language.dl);
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
    if (this.data.timer) {
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