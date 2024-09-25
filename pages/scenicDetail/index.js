// pages/scenicDetail/index.js
const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const animation = require('../../utils/animation.js');
// 引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: "",//接收语音包
    statusBarHeight:'',
    shuffling:4,
    isVoice:false,
    srcList:[],
    src:"",
    voiceImgUrl:'../../static/images/icon_voice@2x.png',
      hotelList2: [],
      vrUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      language:app.globalData.language
    })
    this.getScenicDetail(options.id);
      this.getHome();
  },
    getHome: function () {
        util.request(api.APPHome, {}, "GET").then(res => {
            console.log(res);
            //this.setData(res)
            this.setData({
                hotelList2: res.HotelList,
            })
        }).catch(res => {
            console.log(res);
            util.showErrorToast("失败")
        })
    },
  handleCollection: function () {
    // 判断是否登陆
    let isLogin = wx.getStorageSync("isLogin");
    if(isLogin){
      if (this.data.isCollection) {//true点击时是为了取消收藏
        util.request(api.APPcollectionRemove, {
          "objID": this.data.id,
        }, "POST").then(res => {
          wx.showToast({
            title: res.message,
          })
          if (res.status) {
            this.setData({
              isCollection: false
            })
          }

        }).catch(res => {
          util.showErrorToast("失败")
        })
      } else {
        util.request(api.APPcollectionAdd, {
          "objID": this.data.id,
          "type": 100
        }, "POST").then(res => {
          if (res.status) {
            wx.showToast({
              title: res.message,
            })
            this.setData({
              isCollection: true
            })
          }

        }).catch(res => {
          util.showErrorToast("失败")
        })
      }
    }else{
      wx.navigateTo({
        url: '/pages/auto_login/login/index'
      });
    }
    
  },
  changeVoiceType:function(){
    let voiceImgUrl = '';
    let isVoice = !this.data.isVoice
    if (isVoice) {
      voiceImgUrl = "../../static/images/icon_voice_select@2x.png";
      // 执行语音播放
      this.yuyinPlay()
    } else {
      voiceImgUrl = "../../static/images/icon_voice@2x.png";
      // 关闭语音播放
      this.end()
    }
    this.setData({
      voiceImgUrl: voiceImgUrl,
      isVoice: isVoice
    })
  },
  getScenicDetail:function(id){
    util.request(api.APPscenicDetail, {
      id:id,
    }, "GET").then(res => {
      this.setData(res)
      this.wordYun()//文字转语音
      app.globalData.markersInfo = res
      }).catch(res => {
      util.showErrorToast("失败")
    })

    util.request(api.APPdetailExtra,{
      id:id,
      lang:0
    }, "GET",1).then(res=>{
      console.log("APPdetailExtra",res);
      if(res.VRUrl){
        this.setData({
          vrUrl:res.VRUrl
        })
      }
    })
  },

  gotoVr:function(e){
    var _url = encodeURIComponent(e.currentTarget.dataset.url);
      var title = e.currentTarget.dataset.title?e.currentTarget.dataset.title:"";
      wx.navigateTo({
          url: "/pages/out/index?url=" + _url+"&title="+title
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
  gotoDetail: function (e) { //查看详情
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
        url: "/pages/hotelDetail/index?id=" + id
    })
  },
  gotoMap:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/mapDetail/index' 
    });
  },
  gotoBack:function(){
    //返回上页
    // wx.navigateBack({
    //   delta: 1
    // })
    let historyPages = getCurrentPages();        //历史页面 路由跳转数
    console.log("historyPages",historyPages);
    if (historyPages.length === 1){
      console.log("只有一个路由")
      wx.switchTab({ url: `/pages/newIndex/index` });
    } else{
      wx.navigateBack({ delta: 1 });             //多页面跳转
    } 
    return;
  },
  routeHop: function (e) { //路由跳转
    var page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url: page
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //创建内部 audio 上下文 InnerAudioContext 对象。
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError(function (res) {
      console.log(res);
      // wx.showToast({
      //   title: '语音播放失败',
      //   icon: 'none',
      // })
    })
  },
  
  // 文字转语音
  wordYun: function (e) {
    var content = this.data.voiceText;
    let array=this.cutStr(content,100);
    
  },
  cutStr: function (str, L) {
    var strArr = [];
    var n = L;
    let lang = wx.getStorageSync("langIndex") == "1" ? "en_US" : "zh_CN";
    for (var i = 0, l = str.length; i < l / n; i++) {
      var content = str.slice(n * i, n * (i + 1));
      strArr.push(content);
      // this.textToSpeech(lang,content)
    }
    // console.log("strArrstrArrstrArr",strArr);
    const allVoice = strArr.map(item=>this.textToSpeech(lang,item));
    // console.log("allVoice",allVoice);
    Promise.all(allVoice).then(res=>{
      // console.log("最终获取到的语音:",res);
      this.setData({
        srcList: res
      })
    })
    
  },
  textToSpeech: async function (lang, content) {
    var that = this;
    // plugin.textToSpeech({
    //   lang: lang,//本文语言
    //   tts: true,
    //   content: content,
    //   success: function (res) {
    //     console.log(res);
    //     console.log("succ tts", res.filename);
    //     let srcList = that.data.srcList;
    //     srcList.push(res.filename);
    //     console.log("srcListsrcListsrcList",srcList);
    //     that.setData({
    //       srcList: srcList
    //     })
    //   },
    //   fail: function (res) {
    //     console.log("fail tts", res)
    //   }
    // })
    // return
    return new Promise((resolve, reject) => {
      plugin.textToSpeech({
        lang: lang,//本文语言
        tts: true,
        content: content,
        success: function (res) {
          // console.log(res);
          // console.log("succ tts", res.filename);
          // let srcList = that.data.srcList;
          // srcList.push(res.filename)
          // that.setData({
          //   srcList: srcList
          // })
          resolve(res.filename)
        },
        fail: function (res) {
          console.log("fail tts", res)
          reject(res);
        }
      })
    })
    
  },
  //播放语音
  yuyinPlay: function (e) {
    if (this.data.srcList.length==0) {
      console.log("暂无语音");
      wx.showToast({
        title: '暂无语音',
        icon: 'none',
      })
      this.setData({
        voiceImgUrl : "../../static/images/icon_voice@2x.png"
      })
      return;
    }
    let length=0;
    let srcList=this.data.srcList;
    this.innerAudioContext.src = this.data.srcList[length] //设置音频地址
    this.innerAudioContext.play(); //播放音频
    console.log(srcList)
    this.ended(length, srcList)
  },
  ended: function (length, srcList){
    var that = this;
    this.innerAudioContext.onEnded(function () {
      console.log("end")
      length++
      if (length < srcList.length) {
        console.log(length, srcList.length )
        that.innerAudioContext.src = srcList[length] //设置音频地址
        that.innerAudioContext.play(); //播放音频
        // that.ended(length, srcList)
      }else{
        this.setData({
          voiceImgUrl: "../../static/images/icon_voice@2x.png"
        })
      }
    })
  },

  // 结束语音
  end: function (e) {
    this.innerAudioContext.pause();//暂停音频
    this.setData({
      voiceImgUrl: "../../static/images/icon_voice@2x.png"
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.end()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.end()
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
    console.log(123)
  }
})