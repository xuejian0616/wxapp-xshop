const app = getApp();
Page({
    data: {
        category: [],
        detail:[],
        curIndex: 0,
        isScroll: false,
        toView: 'guowei'
    },
    onLoad() {
      var self = this;
      wx.request({
        url: app.globalData.host + 'goodsCategory/getSubCategoryList',
        success(res) {
          self.setData({
            category: res.data,
            toView: res.data[0].code
          })
        }
      });
    },
    switchTab(e){
      const self = this;
      this.setData({
        isScroll: true
      })
      setTimeout(function(){
        self.setData({
          toView: e.target.dataset.id,
          curIndex: e.target.dataset.index
        })
      },0)
      setTimeout(function () {
        self.setData({
          isScroll: false
        })
      },1)
        
    }
    
})