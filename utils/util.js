const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET",type) {
  return new Promise(function (resolve, reject) {
    let userID = wx.getStorageSync("userID");
    let placeId = 513325;
    let langIndex = wx.getStorageSync("langIndex");
    userID = userID ? userID:'';
    langIndex = langIndex ? langIndex:0;
    let defaultData={
      area_id: placeId,
      lang: langIndex,
      userID: userID
    }
    if(!type){
      Object.assign(data, defaultData)
    }
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Litemall-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject({ msg: "服务器错误" });
        }
      },
      fail: function (err) {
          console.log(err);
        reject(err)
      }
    })
  });
}
// placeId变换
function requestPlace(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    let userID = wx.getStorageSync("userID");
    let placeId = wx.getStorageSync("placeId") ? wx.getStorageSync("placeId") : 513325;
    let langIndex = wx.getStorageSync("langIndex");
    userID = userID ? userID : '';
    langIndex = langIndex ? langIndex : 0;
    let defaultData = {
      area_id: placeId,
      lang: langIndex,
      userID: userID
    }
    Object.assign(data, defaultData)
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Litemall-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject({ msg: "服务器错误" });
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}
function showErrorToast(msg) {
  wx.showToast({
    mask: true,
    title: msg,
    icon: "none",
    image: '/static/images/icon_error.png'
  })
}
module.exports = {
  formatTime: formatTime,
  request: request,
  requestPlace: requestPlace,
  showErrorToast,
}
