// pages/restaurantDetail/index.js
const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const animation = require('../../utils/animation.js');
var WxParse = require("../../wxParse/wxParse.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shuffling: 4
    },

    /** 
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getRestaurantDetail(options.id)

        // this.getRestaurantDetail("26bbec4e-ecd3-4fd7-8e7b-1fc1968d0fc1")
    },
    getRestaurantDetail: function (id) {
        util.request(api.APPYuleDetail, {
            id: id
        }, "GET").then(res => {
            console.log(res);
            if (res.Name != undefined || res.Name != null) {
                wx.setNavigationBarTitle({
                    title: res.Name
                })
            }
            res.shuffling = res.ImageList.length
            this.setData(res);
            app.globalData.markersInfo = res
            WxParse.wxParse('article', 'html', this.data.ContentHtml, this, 5);
        }).catch(res => {
            util.showErrorToast("失败")
        })
    },
    gotoMap: function () {
        console.log("进入地图", this.data.Lat, this.data.Lng)
        wx.navigateTo({
            url: '/pages/mapDetail/index'
        });
    },
    makePhoneCall: function () {
        wx.makePhoneCall({
            phoneNumber: this.data.Telephone //仅为示例，并非真实的电话号码
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