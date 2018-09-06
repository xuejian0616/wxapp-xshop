const app = getApp();
Page({
  data: {
    imgUrls: [
      '/image/b1.jpg',
      '/image/b2.jpg',
      '/image/b3.jpg'
    ],
    salesGoodsList: [],
    newGoodsList: [],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },
  onLoad: function () {
    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    wx.request({
      url: app.globalData.host + 'goods/getSalesGoods',
      success(res) {
        var tempList = res.data;
        for (var j = 0, len = tempList.length; j < len; j++) {
          tempList[j].price = tempList[j].price / 100.0;
        }
        self.setData({
          salesGoodsList: tempList
        })
      }
    });
    wx.request({
      url: app.globalData.host + 'goods/getNewGoods',
      success(res) {
        var tempList = res.data;
        for (var j = 0, len = tempList.length; j < len; j++) {
          tempList[j].price = tempList[j].price / 100.0;
        }
        self.setData({
          newGoodsList: tempList
        })
      }
    });
  }
})