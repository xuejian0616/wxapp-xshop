// page/component/details/details.js
Page({
  data:{
    goods: {
      id: 1,
      image: '/image/goods1.png',
      title: '新鲜梨花带雨',
      price: 0.01,
      stock: '有货',
      detail: '这里是梨花带雨详情。',
      parameter: '125g/个',
      service: '不支持退货'
    },
    num: 1,
    totalNum: 0,
    hasCarts: false,
    hasOldPrice: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  }, 
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    wx.request({
      url: 'http://localhost/goods/getGoodsInfo/' + options.goodsId,
      success(res) {
        var goodsInfo = res.data;
        goodsInfo.oldPrice = goodsInfo.oldPrice / 100.0;
        goodsInfo.price = goodsInfo.price / 100.0;
        goodsInfo.lowerPrice = goodsInfo.lowerPrice / 100.0;
        var showOldPrice = false;
        if (goodsInfo.price < goodsInfo.oldPrice){
          showOldPrice = true;
        }
        self.setData({
          goods: goodsInfo,
          hasOldPrice: showOldPrice
        })
      }
    });
  },
  subCount() {
    let num = this.data.num;
    num--;
    if (num < 1)
      num = 1;
    this.setData({
      num: num
    })
  },
  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },

  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;

    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
 
})