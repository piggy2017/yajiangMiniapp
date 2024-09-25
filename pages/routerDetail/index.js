// pages/routerDetail/index.js
const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
import event from '../../utils/event'//引用语言方法
var WxParse = require("../../wxParse/wxParse.js");
Page({
  data: {
    mapShow:false,
    statusBarHeight: '',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navData: [],
    currentTab: 0,
    currentTabContent:0,
    navScrollLeft: 0,
    navScrollLeftContent:0,
    router_list:[],
    markers: [],
    markersArr: [],
    distance: 0,
    detailInfo: "",
    tabList: [
      { id: "0", imgUrl: "../../static/images/icon_map_scenic_float@2x.png", activeImg: "../../static/images/icon_map_scenic_float_selected@2x.png", type: 1, clickSource: "Scenic" },
      { id: "1", imgUrl: "../../static/images/icon_map_restaurant_float@2x.png", activeImg: "../../static/images/icon_map_restaurant_float_selectedt@2x.png", type: 0, clickSource: "Restaurant,Hotel,ENT" }, { id: "2", imgUrl: "../../static/images/icon_map_busstation_float@2x.png", activeImg: "../../static/images/icon_map_busstation_float_selectedt@2x.png", type: 0, clickSource: "PetrolStation,RepairShop,BusStation,Airport" },
      { id: "3", imgUrl: "../../static/images/icon_map_publicrestroom_float@2x.png", activeImg: "../../static/images/icon_map_publicrestroom_float_selected@2x.png", type: 0, clickSource: "PublicRestroom" },
      { id: "4", imgUrl: "../../static/images/icon_map_hospital_float@2x.png", activeImg: "../../static/images/icon_map_hospital_float_selected@2x.png", type: 0, clickSource: "Hospital" }
    ],
    resTypeList: [],
    latitude: "",
    longitude: "",
    centerLng:"100.01419",
    centerLat: "31.60884",
    placeData:[],
    language:"",
    id:"",
    navbarHeight:80
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    if (!e.markerId.imageUrl) {
      e.markerId.imageUrl = "../../static/images/icon_map_scenic_float@2x.png"
    }
    var index = this.data.dayList[this.data.currentTab - 1].routeSiteList.findIndex((item,i)=>{
      return item.placeID === e.markerId.placeID;
    });
    this.setData({
      currentTabContent: index
    })
    this.bottomMapContent(this.data.dayList[this.data.currentTab - 1].routeSiteList)
  },
  distance: function (la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10;
    return s
  },
  controltap(e) {
    console.log(e.controlId)
  },
  checkDetail(e) {
    console.log(e.currentTarget.dataset.palceitem.placeType)
    if (e.currentTarget.dataset.palceitem.placeType=="Area"){
      wx.setStorageSync("placeId", e.currentTarget.dataset.palceitem.placeID)
      wx.navigateTo({
        url: "/pages/areaDetail/index?id=" + e.currentTarget.dataset.palceitem.placeID
      })
    }else{
      wx.navigateTo({
        url: "/pages/scenicDetail/index?id=" + e.currentTarget.dataset.palceitem.placeID
      })
    }
    
  },
  checkMap(){
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
    
    this.changeMap(this.data.dayList[this.data.currentTab - 1].routeSiteList)
    // this.bottomMapContent(this.data.dayList[this.data.currentTab - 1].routeSiteList)
    this.setData({
      mapShow: !this.data.mapShow
    })
  },
  bottomMapContent(routeSiteList){
    routeSiteList.forEach(r => {
      // 获取距离
      r.distance = this.distance(this.data.latitude, this.data.longitude, r.lat, r.lng)
    })
    this.setData({
      placeData: routeSiteList
    })
  },
  openLocation(e) {
    console.log(e.currentTarget.dataset.palceitem)
    let detail = e.currentTarget.dataset.palceitem
    wx.openLocation({
      latitude: detail.lat,	//维度
      longitude: detail.lng, //经度
      name: detail.name,	//目的地定位名称
      scale: 15,	//缩放比例
      address: detail.address	//导航详细地址
    })
  },
  setLanguage() {
    let language = wx.T.getLanguage();
    this.setData({
      language: language
    });
    // app.globalData.language = language;
    this.data.shouldChangeTitle = true;
  },
  //事件处理函数
  onLoad: function (data) {
    const getWindowInfo = wx.getWindowInfo();
    console.log("getWindowInfo",getWindowInfo);
    const _meau=wx.getMenuButtonBoundingClientRect();
    console.log("_meau",_meau);
    this.navbarHeight=_meau.top+_meau.height
      this.id=data.id
    // 获取相对应语音包
    this.setLanguage();	// (1)
    event.on("languageChanged", this, this.setLanguage); // (2)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    this.getDataDetail(data) //获取首页数据
  },
  onShow: function () {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
    })
    this.mapCtx = wx.createMapContext('map')
    // 切换语音之后重新获取语音包
    if (this.data.shouldChangeTitle) {
      wx.T.setNavigationBarTitle(this.data.language.dt);
      this.mapCtx = wx.createMapContext('map')
    }
  },
  onUnload: function () {
    wx.setStorageSync("placeId", "")
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  gotoBack: function () {
    //返回上页
    // wx.navigateBack({
    //   delta: 1
    // })
    
    let historyPages = getCurrentPages();        //历史页面 路由跳转数
    console.log("historyPages",historyPages);
    if (historyPages.length === 1) wx.switchTab({ url: `/pages/newIndex/index` });
    else wx.navigateBack({ delta: 1 });             //多页面跳转
    return;
  },
  handleCollection: function () {
    let isLogin = wx.getStorageSync("isLogin");
    if (isLogin){
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
          "type": 200
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
  switchTab(event) {
    var cur = event.detail.currentTab;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeftContent: (cur - 2) * singleNavWidth
    });
  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中      
    wx.pageScrollTo({
      scrollTop: 0
    })                      
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth,
      currentTabContent:0,
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
      if (cur == 0)return
      this.changeMap(this.data.dayList[cur - 1].routeSiteList)
      this.bottomMapContent(this.data.dayList[cur - 1].routeSiteList)
    }
  },
  changeMap(routeSiteList){
    this.data.markersArr=[]
    routeSiteList.forEach((r,i) => {
      let iconPath = ""
      this.data.markersArr.push({
        iconPath: "../../static/images/icon_line_anchor@2x.png",
        id: r,
        latitude: r.lat,
        longitude: r.lng,
        width: 30,
        height: 30,
        type: r.resType,
        label: {
          content: String(i + 1),  //文本
          color: '#000000',  //文本颜色
          anchorX: -3,
          anchorY: -24,
          fontSize: 10,
          textAlign: 'center'  //文本对齐方式。有效值: left, right, center
        },
      })
      if(i==0){
        this.data.markersArr[i].width = 50
        this.data.markersArr[i].height = 50
        this.data.markersArr[i].label.anchorY = -35
        this.setData({
          centerLat: r.lat,
          centerLng: r.lng
        })
      }else{
        this.data.markersArr[i].width = 30
        this.data.markersArr[i].height = 30
        this.data.markersArr[i].label.anchorY = -24
      }
      
    })
    this.setData({
      markers: this.data.markersArr
    })
  },
  switchTabContent(event) {
    var cur = event.detail.current;
    this.data.markers.forEach((r,i)=>{
      this.data.markers[i].width = 30
      this.data.markers[i].height = 30
      this.data.markers[i].label.anchorY = -24
    })
    this.data.markers[cur].width=50
    this.data.markers[cur].height = 50
    this.data.markers[cur].label.anchorY= -35
    var singleNavWidth = this.data.windowWidth / 5;
    console.log(this.data.markers[cur].lat)
    this.setData({
      currentTabContent: cur,
      navScrollLeft: (cur - 2) * singleNavWidth,
      markers: this.data.markers,
      centerLat: this.data.markers[cur].latitude,
      centerLng: this.data.markers[cur].longitude
    });
  },
  goToDetail(event){
    if (event.currentTarget.dataset.item.placeType == "Scenic"){
      wx.navigateTo({
        url: "/pages/scenicDetail/index?id=" + event.currentTarget.dataset.placeid
      })
    } else if (event.currentTarget.dataset.item.placeType == "Area"){
      wx.setStorageSync("placeId", event.currentTarget.dataset.placeid)
      wx.navigateTo({
        url: "/pages/areaDetail/index?id=" + event.currentTarget.dataset.placeid
      })
    }
    
  },
  getDataDetail(data){
    let parmas={
      route_id: data.id
    }
    util.request(api.APPRouterDetail, parmas, "GET").then(res => {
      let data = res.summary;
      WxParse.wxParse('article', 'html', res.summary.contentHtml, this, 5);
      let navData = [{
        title: '概述'
      }];
      res.dayList.map(item=>{
        navData.push({
          title: item.title
        })
      })
      data.dayList = res.dayList;
      data.navData = navData
      this.setData(data)
    }).catch(res => {
      util.showErrorToast("失败")
    })
  },
    //  分享功能
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            return {
                title: "雅江县旅游导览，看来看看吧",
                path: "/pages/routerDetail/index?id="+this.id
            }
        } else {
            return {
                title: "雅江县旅游导览，看来看看吧",
                path: "/pages/routerDetail/index?id=" + this.id
            }
        }
    },
})