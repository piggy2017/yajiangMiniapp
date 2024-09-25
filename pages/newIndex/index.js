//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const animation = require('../../utils/animation.js');
import event from '../../utils/event' //引用语言方法
Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: '', //接收语音包
    area: {},
    cultureList: [],
    gesaerList: [],
    hotelList: [],
    messageList: [],
    productList: [],
    restaurantList: [],
    scenicList: [],
    serviceList: [],
    weatherList: [],
    newsList: [],
    isShow: false,
    bannerList: [],
    hotelList2: [],
    scenicList2: [],
    routeList: [],
    restaurantList2: [],
    writePosition: [0, 40], //默认定位参数
    writesize: [0, 0], // X Y 定位
    window: [0, 0], //屏幕尺寸
    write: [0, 0], //定位参数
    scrolltop: 0, //据顶部距离
    leftx: 420,
    commonComplaint: {}, //投诉建议的H5地址,
    handMapUrl: "https://map-yj.gzzjs.net/map.aspx?scenicid=613187D0DAEDB6C7#/?VNK=8986506b", // 手绘地图地址
    swiperIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取相对应语音包
    this.setLanguage(); // (1)
    this.getCommonComplaint();
    event.on("languageChanged", this, this.setLanguage); // (2)
  },

  changeIndex(e) {
    // console.log("changeIndex",e)
    this.setData({
      swiperIndex: e.detail.current
    })
  },

  getCommonComplaint: function () {
    util.request(api.APPCommonComplaint, {}, "GET").then(res => {
      this.setData({
        commonComplaint: res
      })
    }).catch(res => {
      //   util.showErrorToast("失败")
    })
  },

  routeMap(e) {
    const _type = e.currentTarget.dataset.source;
    console.log("点击设置_type", _type)
    wx.setStorageSync('source', _type);
    wx.setStorageSync('shouldUpdate', true);
    wx.switchTab({
      url: '/pages/map/index',
    })
  },

  onTabItemTap(item) {
    console.log("触发 onTabItemTap", item)
    wx.removeStorageSync('source');
  },

  goOutPage(e) {
    var _url = encodeURIComponent(e.currentTarget.dataset.url);
    var title = e.currentTarget.dataset.title ? e.currentTarget.dataset.title : "";
    wx.navigateTo({
      url: "/pages/out/index?url=" + _url + "&title=" + title
    })
  },
  setLanguage() {
    let language = wx.T.getLanguage();
    this.setData({
      language: language
    });
    app.globalData.language = language;
    this.data.shouldChangeTitle = true;
  },
  getHome: function () {
    wx.showLoading({
      title: '数据加载中...',
    })
    util.request(api.APPHome, {}, "GET").then(res => {
      console.log(res);
      //this.setData(res)
      wx.hideLoading();
      this.setData({
        bannerList: res.RollImageList,
        scenicList2: res.ScenicList,
        hotelList2: res.HotelList,
        routeList: res.RouteList,
        restaurantList2: res.RestaurantList,
      })
    }).catch(res => {
      console.log(res);
      util.showErrorToast("失败")
    })
  },
  getIndexData: function () {
    util.request(api.APPIndex, {}, "GET").then(res => {
      console.log(res);
      this.setData(res)
    }).catch(res => {
      //   util.showErrorToast("失败")
    })
  },

  getWeatherData: function () {
    util.request(api.APPweather, {}, "GET").then(res => {
      console.log(res)
      this.setData({
        weatherList: res.data
      })
    }).catch(res => {
      //   util.showErrorToast("失败")
    })
  },

  getNewsData: function () {
    util.request(api.APPnews, {
      page_size: 10,
      page_index: 0
    }, "GET").then(res => {
      let array = res.map(item => {
        return {
          "title": item.title,
          "publishTime": item.publishTime.slice(0, 10)
        }
      })
      this.setData({
        newsList: array
      })
    }).catch(res => {
      //   util.showErrorToast("失败")
    })
  },

  showList() {
    this.setData({
      isShow: true
    })
    animation.slideupshow(this, 'weather_list', 50, 1, 500)
  },

  hideWeather() {

    animation.slideupshow(this, 'weather_list', -110, 1)
    this.setData({
      isShow: false
    })
  },

  routeHop: function (e) { //路由跳转
    var page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url: page
    })
  },
  routeGoround() {
    wx.switchTab({
      url: '/pages/route/index',
    })
  },
  goRouteDetail(e) {
    var page = e.currentTarget.dataset.page;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: page + "?id=" + id
    })
  },
  gotoActivity: function (e) { //使用web-view访问外部页面
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
    console.log(id)
    var _url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: _url + "?id=" + id
    })
  },

  //计算默认定位值
  getSysdata: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (e) {
        that.data.window = [e.windowWidth, e.windowHeight];
        var write = [];
        write[0] = that.data.window[0] * that.data.writePosition[0] / 100;
        write[1] = that.data.window[1] * that.data.writePosition[1] / 140;
        console.log('writh', write)
        that.setData({
          write: write
        }, function () {
          // 获取元素宽高
          wx.createSelectorQuery().select('.recommon-btn').boundingClientRect(function (res) {
            if (res !== null) {
              that.data.writesize = [res.width, res.height];
            }
          }).exec();
        })
      },
      fail: function (e) {
        console.log(e)
      }
    });
  },
  //开始拖拽   
  touchmove: function (e) {
    var that = this;
    var position = [e.touches[0].pageX - that.data.writesize[0] / 2, e.touches[0].pageY - that.data.writesize[1] / 2 - this.data.scrolltop];
    that.setData({
      write: position
    });
  },
  onPageScroll(e) {
    this.data.scrolltop = e.scrollTop;
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
    wx.getSystemInfo({
      success: (res) => {
        console.log(res);
        let _wid = res.screenWidth - 60 * 1
        console.log("_wid_wid_wid", _wid)
        this.setData({
          //leftx: _wid
        })
      },
    })
    wx.setStorageSync("placeId", "")
    this.getSysdata();
    // 切换语音之后重新获取语音包
    if (this.data.shouldChangeTitle) {
      wx.T.setNavigationBarTitle(this.data.language.indexTitle);
      this.data.shouldChangeTitle = false;
      this.getIndexData() //获取首页数据
      this.getWeatherData() //获取天气数据
      this.getNewsData() //获取咨询数据
      this.getHome();
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