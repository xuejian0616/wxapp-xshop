// page/component/list/list.js
const app = getApp();
Page({
  data:{
    goodsList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    wx.request({
      url: app.globalData.host + 'goods/getGoodsByCategory/' + options.categroyId,
      success(res) {
        var tempList = res.data;
        for (var j = 0, len = tempList.length; j < len; j++) {
          tempList[j].price = tempList[j].price / 100.0;
        }
        self.setData({
          goodsList: tempList
        })
      }
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})