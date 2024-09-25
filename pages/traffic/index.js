// pages/service/index.js
const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const animation = require('../../utils/animation.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        language: "",//接收语音包
        list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            language: app.globalData.language
        });
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
        wx.T.setNavigationBarTitle(this.data.language.jt);
        this.getHome();
    },
    goDetail(e){
        console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
            url: `/pages/trafficDetail/index?id=${e.currentTarget.dataset.id}`,
        })
    },

    getHome: function () {
        util.request(api.APPTraffic, {}, "GET").then(res => {
            console.log(res);
            //this.setData(res)
            this.setData({
                list:res
            })
        }).catch(res => {
            console.log(res);
            util.showErrorToast("失败")
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