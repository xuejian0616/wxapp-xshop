// page/component/orders/orders.js
const app = getApp();
Page({
  data:{
    address:{},
    hasAddress: false,
    total: 0,
    userId: 0,
    orders:[]
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var self = this;
    var userId = options.userId;
    wx.request({
      url: app.globalData.host + 'car/getOrderShopcarList?userId=' + options.userId + '&carIds=' + options.carIds,
      header: {
        'Content-type':
        'application/json'
      },
      success: function (res) {
        var orderList = res.data;
        console.log("orderList" + orderList);
        if (orderList.length > 0) {
          for (var i = 0; i < orderList.length; i++) {
            orderList[i].price = orderList[i].price / 100.0;
            orderList[i].oldPrice = orderList[i].oldPrice / 100.0;
          }
          self.setData({
            orders: orderList
          })
        }
      }
    })
    self.getTotalPrice();
  },
  onReady() {
    this.getTotalPrice();
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onShow:function(){
    const self = this;
    wx.getStorage({
      key:'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for(let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total
    })
  },

  toPay() {
    wx.showModal({
      title: '提示',
      content: '本系统只做演示，支付系统已屏蔽',
      text:'center',
      complete() {
        wx.switchTab({
          url: '/page/component/user/user'
        })
      }
    })
  }
})