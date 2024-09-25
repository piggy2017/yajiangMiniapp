// pages/map/index.js
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
    language: "", //接收语音包
    markers: [],
    markersArr: [],
    distance: 0,
    detailInfo: "",
    tabList: [{
        id: "0",
        imgUrl: "../../static/images/icon_map_scenic_float@2x.png",
        activeImg: "../../static/images/icon_map_scenic_float_selected@2x.png",
        type: 1,
        clickSource: "Scenic"
      },
      {
        id: "1",
        imgUrl: "../../static/images/icon_map_restaurant_float@2x.png",
        activeImg: "../../static/images/icon_map_restaurant_float_selectedt@2x.png",
        type: 0,
        clickSource: "Restaurant,Hotel,ENT"
      },
      {
        id: "2",
        imgUrl: "../../static/images/icon_map_busstation_float@2x.png",
        activeImg: "../../static/images/icon_map_busstation_float_selectedt@2x.png",
        type: 0,
        clickSource: "PetrolStation,RepairShop,BusStation,Airport"
      },
      {
        id: "3",
        imgUrl: "../../static/images/icon_map_publicrestroom_float@2x.png",
        activeImg: "../../static/images/icon_map_publicrestroom_float_selected@2x.png",
        type: 0,
        clickSource: "PublicRestroom"
      },
      {
        id: "4",
        imgUrl: "../../static/images/icon_map_hospital_float@2x.png",
        activeImg: "../../static/images/icon_map_hospital_float_selected@2x.png",
        type: 0,
        clickSource: "Hospital"
      }
    ],
    resTypeList: [],
    contentShow: false,
    latitude: "",
    longitude: "",
    handMapUrl: "https://map-yj.gzzjs.net/map.aspx?scenicid=613187D0DAEDB6C7#/?VNK=8986506b", // 手绘地图地址
  },


  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log("markertap_markertap", e);
    // if (!e.markerId.imageUrl){   // !e.imageUrl
    //   e.markerId.imageUrl ="../../static/images/icon_map_scenic_float@2x.png"
    // }
    // 获取距离
    this.distance(this.data.latitude, this.data.longitude, e.markerId.lat, e.markerId.lng)
    this.setData({
      detailInfo: e.markerId,
      contentShow: true
    })

    // animation.slideupshow(this, 'weather_list', 50, 1, 500)
  },
  distance: function (la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137; //地球半径
    s = Math.round(s * 10000) / 10;
    this.setData({
      distance: s
    })
  },
  controltap(e) {
    console.log(e.controlId)
  },

  changeTab(e) {
    // Scenic      Airport RepairShop Restaurant Other Hospital BusStation
    // Hotel   ENT    PublicRestroom  PetrolStation 加油站
    var mText = 'tabList[' + e.currentTarget.dataset.index + '].type';
    if (this.data.tabList[e.currentTarget.dataset.index].type == 1) {
      this.setData({
        [mText]: 0 // this.data.tabList[e.currentTarget.dataset.index].type - 1
      })
    } else {
      this.setData({
        [mText]: 1 // this.data.tabList[e.currentTarget.dataset.index].type + 1
      })
    }
    this.getEveryMarkers(e.currentTarget.dataset.source, this.data.tabList[e.currentTarget.dataset.index].type)
  },
  getMarkers: async function () {
    const list = await util.request(api.APPMapInfo + "?area_id=513328&lang=0", {}, "GET");
    // console.log("list", list);
    const petrolList = await util.request(api.APPMapPetrolInfo + "?area_id=513328&lang=0&page_index=0&page_size=1000", {}, "GET");
    // console.log("petrolList", petrolList);
    this.setData({
      resTypeList: [...list, ...petrolList]
    })
    const source = wx.getStorageSync('source');
    console.log("map页面获取到的source", source)
    if (source) {
      // this.getEveryMarkers(source, 1,1)
      this.customChangeTab(source);
    } else {
      this.getEveryMarkers("Scenic", 1);
    }

    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log("获取当前的地理定位，", res)
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude, //纬度 
          longitude: longitude, //经度 
        })
      }
    })
  },

  customChangeTab(source) {
    const _index = source === 'PublicRestroom' ? 3 : source === 'Hospital' ? 4 : '';
    if (_index) {
      var mText = 'tabList[' + _index + '].type';
      this.setData({
        [mText]: 1
      })
    }
    this.getEveryMarkers(source, 1, 1)
  },

  getEveryMarkers(source, type, subType) {
    console.log("getEveryMarkers---source,type", source, type)
    this.data.resTypeList.forEach(r => {
      if (source.indexOf(r.resType) != -1 && type == 1) {
        let iconPath = ""
        if (r.resType == "PublicRestroom" && source.indexOf(r.resType) != -1) {
          iconPath = "../../static/images/icon_map_publicrestroom@2x.png"
        } else if (r.resType == "Scenic" && source.indexOf(r.resType) != -1) {
          iconPath = "../../static/images/icon_map_scenic_selected@2x.png"
        } else if (r.resType == "PetrolStation" && source.indexOf(r.resType) != -1) {
          iconPath = "../../static/images/icon_map_petrolstation_selected@2x.png"
        } else if (r.resType == "Hotel" && source.indexOf(r.resType) != -1) {
          iconPath = "../../static/images/icon_map_scenic_selected@2x(1).png"
        } else if (r.resType == "Hospital" && source.indexOf(r.resType) != -1) {
          iconPath = "../../static/images/icon_map_hospital@2x.png"
        } else if (r.resType == "Restaurant" && source.indexOf(r.resType) != -1) {
          iconPath = "../../static/images/icon_map_restaurant@2x.png"
        } else if (r.resType == "RepairShop" && source.indexOf(r.resType) != -1) {
          iconPath = "../../static/images/icon_map_repairshop@2x.png"
        } else if (r.resType == "BusStation" && source.indexOf(r.resType) != -1) {
          iconPath = "../../static/images/icon_map_busstation@2x.png"
        } else if (r.resType == "Airport" && source.indexOf(r.resType) != -1) {
          iconPath = "../../static/images/icon_map_airport@2x.png"
        } else if (r.resType == "ENT" && source.indexOf(r.resType) != -1) {
          iconPath = "../../static/images/icon_map_ent@2x.png"
        } else if (r.resType == "Other" && source.indexOf(r.resType) != -1) {
          iconPath = "../../static/images/icon_map_other@2x.png"
        }
        this.data.markersArr.push({
          iconPath: iconPath,
          id: r,
          latitude: r.lat,
          longitude: r.lng,
          width: 30,
          height: 30,
          type: r.resType,
        })
      } else if (source.indexOf(r.resType) != -1 && type == 0) {
        let a = this.data.markersArr.filter((item, i) => {
          return source.indexOf(item.type) == -1;
        })
        this.data.markersArr = a
      }
    })
    console.log("this.data.markersArr", this.data.markersArr);
    if (subType && this.data.markersArr.length > 0) {
      this.data.markersArr = this.data.markersArr.filter(item => {
        if (item.type.includes(source)) {
          return item
        }
      })
      const currentItem = this.data.markersArr.find(m => m.id.resType === source);
      console.log("找到第一个符合条件的item", currentItem);
      this.distance(this.data.latitude, this.data.longitude, currentItem.id.lat, currentItem.id.lng)
      this.setData({
        detailInfo: currentItem.id,
        contentShow: true
      })
    }
    this.setData({
      markers: this.data.markersArr
    })
  },
  checkDetail() {
    let detailUrl = ""
    if (this.data.detailInfo.resType == "Restaurant") {
      detailUrl = "/pages/restaurantDetail/index?id=" + this.data.detailInfo.id
    } else if (this.data.detailInfo.resType == "Scenic") {
      detailUrl = "/pages/scenicDetail/index?id=" + this.data.detailInfo.id
    } else if (this.data.detailInfo.resType == "Hotel") {
      detailUrl = "/pages/hotelDetail/index?id=" + this.data.detailInfo.id
    } else {
      wx.showToast({
        title: "暂无详情",
        icon: "none"
      })
      return
    }
    wx.navigateTo({
      url: detailUrl
    })
  },
  openLocation() {
    wx.openLocation({
      latitude: this.data.detailInfo.lat, //维度
      longitude: this.data.detailInfo.lng, //经度
      name: this.data.detailInfo.name, //目的地定位名称
      scale: 15, //缩放比例
      address: this.data.detailInfo.address //导航详细地址
    })
  },
  closeContent: function () {
    this.setData({
      contentShow: false
    })
  },

  goToHandleMap(e) {
    var _url = encodeURIComponent(e.currentTarget.dataset.url);
    var title = e.currentTarget.dataset.title ? e.currentTarget.dataset.title : "";
    wx.navigateTo({
      url: "/pages/out/index?url=" + _url + "&title=" + title
    })
  },

  onTabItemTap(item) {
    console.log("触发 onTabItemTap", item)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取相对应语音包
    console.log("触发 map onLoad")
    this.setLanguage(); // (1)
    event.on("languageChanged", this, this.setLanguage); // (2)
    this.getMarkers()
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.shouldChangeTitle) {
      wx.T.setNavigationBarTitle(this.data.language.dt);
      this.mapCtx = wx.createMapContext('map')
      // this.getMarkers()
      // this.setData({
      //   contentShow: false
      // })
    }
    const source = wx.getStorageSync('source');
    const shouldUpdate = wx.getStorageSync('shouldUpdate');
    console.log("map页面onshow事件获取到的source,shouldUpdate", source, shouldUpdate)
    if (source && shouldUpdate) { //   PublicRestroom    Hospital  PetrolStation
      let _list = this.data.tabList.map(item => {
        if (item.clickSource.includes(source)) {
          item.type = 1;
        } else {
          item.type = 0;
        }
        return item
      })
      this.setData({
        tabList: _list
      })
      this.getMarkers();
    }

  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("触发页面隐藏")
    // wx.removeStorageSync('source');
    wx.removeStorageSync('shouldUpdate');
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