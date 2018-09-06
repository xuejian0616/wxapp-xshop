// page/component/new-pages/cart/cart.js
const app = getApp();

var specLists = [];//选择的大规格key
var normLists = [];//规格
var sizeLists = [];//尺码
var carList = [];
Page({
  data: {
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus:false,    // 全选状态，默认全选
    obj:{
        name:"hello"
    },
    normList: [],
    sizeList: [],
    choose_modal: "none",    // 是否显示规格页面，默认不显示
    selectName: "",//已选的属性名字
    selectAttrid: '',//选择的属性id
    default_spe_img: '',//规格图片
    specNum: 100,//初始数量
    updateSpecCarId: -1,//初始数量
    userId: 0,//用户id
    amount: 0 //规格页价格
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
    var self = this;
    wx.request({
      url: app.globalData.host + 'car/getShopcarList/' + self.data.userId,
      header: {
        'Content-type':
        'application/json'
      },
      success: function (res) {
        carList = res.data;
        if (carList.length > 0) {
          for (var i = 0; i < carList.length; i++) {
            carList[i].price = carList[i].price / 100.0;
            carList[i].oldPrice = carList[i].oldPrice / 100.0;
            carList[i].selected = false;
          }
          self.setData({
            hasList: true,
            carts: carList,
          })
        }
      }
    })
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onShow: function () {
    var self = this;
    wx.request({
      url: app.globalData.host + 'car/getShopcarList/' + self.data.userId,
      header: {
        'Content-type':
        'application/json'
      },
      success: function (res) {
        carList = res.data;
        if (carList.length > 0) {
          for (var i = 0; i < carList.length; i++) {
            carList[i].price = carList[i].price / 100.0;
            carList[i].oldPrice = carList[i].oldPrice / 100.0;
            carList[i].selected = false;
          }
          self.setData({
            hasList: true,
            carts: carList,
            totalPrice: 0, 
            selectAllStatus: false,
          })
        }
      }
    })
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  goOrderPage(){
    var self = this;
    let carts = self.data.carts;
    var carIds = [];
    var j = 0;
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected){
        carIds[j] = carts[i].id;
        j++;
      }
    }

    wx.navigateTo({
      url: '../orders/orders?userId=' + self.data.userId + '&carIds=' + carIds
    })
  },
  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    var self = this;
    let carts = this.data.carts;
    const index = e.currentTarget.dataset.index;
    var carId = carts[index].id;

    wx.request({
      url: app.globalData.host + 'car/delShopcarById/' + carId,
      header: {
        'Content-type':
        'application/json'
      },
      success: function (res) {
        var count = res.data;
        if (count > 0) {
          carts.splice(index, 1);
          self.setData({
            carts: carts
          });
          if (!carts.length) {
            self.setData({
              hasList: false
            });
          } else {
            self.getTotalPrice();
          }
        }
      }
    })
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    var self = this;
    let carts = this.data.carts;
    const index = e.currentTarget.dataset.index;
    var carId = carts[index].id;
    let num = carts[index].num;

    wx.request({
      url: app.globalData.host + 'car/updateNum/' + carId +'/'+1,
      header: {
        'Content-type':
        'application/json'
      },
      success: function (res) {
        var count = res.data;
        if (count > 0){
          num = num + 1;
          carts[index].num = num;
          self.setData({
            carts: carts
          });
          self.getTotalPrice();
        }
      }
    })
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    var self = this;
    let carts = this.data.carts;
    const index = e.currentTarget.dataset.index;
    var carId = carts[index].id;
    let num = carts[index].num;

    if (num <= 1) {
      return false;
    }
    wx.request({
      url: app.globalData.host + 'car/updateNum/' + carId + '/' + -1,
      header: {
        'Content-type':
        'application/json'
      },
      success: function (res) {
        var count = res.data;
        if (count > 0) {
          num = num - 1;
          carts[index].num = num;
          self.setData({
            carts: carts
          });
          self.getTotalPrice();
        }
      }
    })
  },
  /**
     * 绑定修改规格事件
     */
  updateSpec(e) {
    var self = this;
    var carId = self.data.updateSpecCarId;
    var specId = self.data.selectAttrid;
    wx.request({
      url: app.globalData.host + 'car/updateSpec/' + carId + '/' + specId,
      header: {
        'Content-type':
        'application/json'
      },
      success: function (res) {
        var count = res.data;
        wx.request({
          url: app.globalData.host + 'car/getShopcarList/' + self.data.userId,
          header: {
            'Content-type':
            'application/json'
          },
          success: function (res) {
            carList = res.data;
            if (carList.length > 0) {
              for (var i = 0; i < carList.length; i++) {
                carList[i].price = carList[i].price / 100.0;
                carList[i].oldPrice = carList[i].oldPrice / 100.0;
                carList[i].selected = false;
              }
              self.setData({
                hasList: true,
                carts: carList,
              })
            }
          }
        })
        self.getTotalPrice();
      }
    })
    //关闭规格
    self.modal_none();
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },

  /**
  * 规格页面弹出
  */
  modal_show: function (e) {
    var self = this;
    let carts = self.data.carts;
    console.log("carts::" + carts);
    const index = e.currentTarget.dataset.index;
    var goodsId = carts[index].goodsId;
    var specId = carts[index].specId;
    var carId = carts[index].id;
    var priceAmount = carts[index].price;
    wx.request({
      url: app.globalData.host + 'goods/getGoodsSpec/' + goodsId,
      header: {
        'Content-type':
        'application/json'
      },
      success: function (res) {
        var goodsSpec = res.data;
        specLists = goodsSpec.goodsSpec;
        normLists = goodsSpec.norms;
        sizeLists = goodsSpec.sizes;
        //点击过，修改属性
        var selectName ;
        var selectSpecimg;
        var selectSpecNum;
        for (var i = 0; i < specLists.length; i++){
          if (specId == specLists[i].id){
            var norm = specLists[i].norm;
            var size = specLists[i].size;
            selectSpecimg = specLists[i].img;
            selectSpecNum = specLists[i].num;
            selectName = '"' + norm + '" ' + '"' + size + '"';
            for (var j = 0; j < normLists.length; j++){
              if (norm == normLists[j].norm){
                normLists[j].isSelect = 'active';
              }
            }
            for (var j = 0; j < sizeLists.length; j++) {
              if (size == sizeLists[j].size) {
                sizeLists[j].isSelect = 'active';
              }
            }
          }
          
        }

        self.setData({
          choose_modal: "block",
          amount: priceAmount,
          normList: normLists,
          sizeList: sizeLists,
          selectName: selectName,
          selectAttrid: specId,
          default_spe_img: selectSpecimg,
          specNum: selectSpecNum,
          updateSpecCarId: carId
        })
      }
    })
  },
  //消失
  modal_none: function () {
    this.setData({
      choose_modal: "none",
      updateSpecCarId: -1
    });
  },
  /**
  * 选择规格
  */
  clickAttr: function (e) {
    // console.log(e);return;
    var selectIndex = e.currentTarget.dataset.selectIndex; // 0,1
    var attrIndex = e.currentTarget.dataset.attrIndex;
    var attrId = e.currentTarget.dataset.attrId;  //name


    var selectNorm = '选规格';
    var selectSize = '选尺码';
    var selectAttrid;
    var priceAmount;
    var selectSpecimg = this.data.default_spe_img;
    var selectSpecNum = this.data.specNum;
    sizeLists = this.data.sizeList;
    normLists = this.data.normList;
    var sizeCount = sizeLists.length;
    var normCount = normLists.length;


    var count = specLists.length;
    if (selectIndex == 0) { //点击的规格
      if (normLists[attrIndex].isSelect == 'none') {
        return;
      }
      for (var i = 0; i < normCount; i++) {
        if (normLists[i].isSelect == 'active') {
          normLists[i].isSelect = '';
        }
      }
      normLists[attrIndex].isSelect = 'active';
      selectNorm = attrId;
      //尺码处理
      for (var i = 0; i < sizeCount; i++) {
        var size = sizeLists[i].size;
        if (sizeLists[i].isSelect == 'active') {
          selectSize = size;
        } else {
          sizeLists[i].isSelect = 'none';
        }
        for (var j = 0; j < count; j++) {
          if (attrId == specLists[j].norm && size == specLists[j].size && sizeLists[i].isSelect == 'active') {
            selectAttrid = specLists[j].id;
            selectSpecimg = specLists[j].img;
            selectSpecNum = specLists[j].num;
            priceAmount = specLists[j].price;
          } else if (attrId == specLists[j].norm && size == specLists[j].size && specLists[j].num > 0) {
            sizeLists[i].isSelect = '';
          }
        }
      }
    } else {//点击的尺码
      if (sizeLists[attrIndex].isSelect == 'none') {
        return;
      }
      for (var i = 0; i < normCount; i++) {
        if (sizeLists[i].isSelect == 'active') {
          sizeLists[i].isSelect = '';
        }
      }
      sizeLists[attrIndex].isSelect = 'active';
      selectSize = attrId;

      for (var i = 0; i < normCount; i++) {
        var norm = normLists[i].norm;
        if (normLists[i].isSelect == 'active') {
          selectNorm = norm;
        } else {
          normLists[i].isSelect = 'none';
        }
        for (var j = 0; j < count; j++) {
          if (attrId == specLists[j].size && norm == specLists[j].norm && normLists[i].isSelect == 'active') {
            selectAttrid = specLists[j].id;
            selectSpecimg = specLists[j].img;
            selectSpecNum = specLists[j].num;
            priceAmount = specLists[j].price;
          } else if (attrId == specLists[j].size && norm == specLists[j].norm && specLists[j].num > 0) {
            normLists[i].isSelect = '';
          }
        }
      }
    }

    //点击过，修改属性
    var selectName = '"' + selectNorm + '" ' + '"' + selectSize + '"';

    this.setData({
      amount: priceAmount,
      normList: normLists,
      sizeList: sizeLists,
      selectName: selectName,
      selectAttrid: selectAttrid,
      default_spe_img: selectSpecimg,
      specNum: selectSpecNum
    });
  },

})