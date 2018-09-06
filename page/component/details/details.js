// page/component/detail/detail.js
const app = getApp();
var selectIndex;//选择的大规格key
var attrIndex;//选择的小规格的key
var selectIndexArray = [];//选择属性名字的数组
var selectAttrid = [];//选择的属性id
var specLists = [];//选择的大规格key
var normLists = [];//规格
var sizeLists = [];//尺码
Page({
  /**
  * 页面的初始数据
  */
  data: {
    //商品信息
    goods_info: {},
    normList: [],
    sizeList: [],
    //swiper相关
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    //选择的规格
    num: 1,//初始数量
    amount: 0,//初始金额
    minusStatus: 'disabled',
    // 使用data数据对象设置样式名
    choose_modal: "none",
    // 规格数量框
    flag: 0,//点选规格时来源 0：规格点 1：立即购买 2：加入购物车
    selectName: "",//已选的属性名字
    selectAttrid: '',//选择的属性id
    default_spe_img: '',//规格图片
    specNum: 100,//初始数量
    userId: 0
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var self = this;
    wx.request({
      url: app.globalData.host + 'goods/getGoodsInfo/' + options.goodsId,
      header: {
        'Content-type':
        'application/json'
      },
      success: function (res) {
        var goodsInfo = res.data;
        goodsInfo.oldPrice = goodsInfo.oldPrice / 100.0;
        goodsInfo.price = goodsInfo.price / 100.0;
        goodsInfo.lowerPrice = goodsInfo.lowerPrice / 100.0;
        var showOldPrice = false;
        if (goodsInfo.price < goodsInfo.oldPrice) {
          showOldPrice = true;
        }
        self.setData({
          goods_info: goodsInfo,
          hasOldPrice: showOldPrice,
          default_spe_img: goodsInfo.smallPic,
          amount: goodsInfo.price
        })
      }
    })

    wx.request({
      url: app.globalData.host + 'goods/getGoodsSpec/' + options.goodsId,
      header: {
        'Content-type':
        'application/json'
      },
      success: function (res) {
        var goodsSpec = res.data;
        specLists = goodsSpec.goodsSpec;
        normLists = goodsSpec.norms;
        sizeLists = goodsSpec.sizes;
        self.setData({
          normList: normLists,
          sizeList: sizeLists
        })
      }
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
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <=
      1 ? 'disabled' :
      'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <
      1 ? 'disabled' :
      'normal';
    // 将数值与状态写回
    if (num > this.data.specNum){
      num = this.data.specNum;
    }
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    if (isNaN(num)) {
      num = 1;
    }
    if (num > this.data.specNum) {
      num = this.data.specNum;
    }
    // 将数值与状态写回
    this.setData({
      num: parseInt(num)
    });
    //this.change_spec();
    //this.change_price();
  },
  /**
  * 规格页面弹出
  */
  modal_show: function (e) {
    var flag = e.currentTarget.dataset.flag;
    this.setData({
      flag: flag,
      choose_modal: "block",
    });
  },
  //消失
  modal_none: function () {
    this.setData({
      choose_modal: "none",
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
          normLists[i].isSelect ='';
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
          }else if (attrId == specLists[j].norm && size == specLists[j].size && specLists[j].num > 0){
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
          }else if (attrId == specLists[j].size && norm == specLists[j].norm && specLists[j].num > 0) {
            normLists[i].isSelect = '';
          }
        }
      }
    }

    //点击过，修改属性
    var selectName = '"' + selectNorm + '" ' + '"' + selectSize + '"';

    this.setData({
      normList: normLists,
      sizeList: sizeLists,
      selectName: selectName,
      selectAttrid: selectAttrid,
      default_spe_img: selectSpecimg,
      specNum: selectSpecNum
    });
  },
  /**
  * 规格页面添加购物车
  */
  addCar: function (e) {
    var dataInfo = this.data;
    console.log(dataInfo);
    if (dataInfo.selectAttrid == ''){
      wx.showToast({
        title: '请选择商品规格',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return ;
    } 
    if (dataInfo.num < 1) {
      wx.showToast({
        title: '请增加商品数量',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return;
    }
    wx.request({
      url: app.globalData.host + 'car/addCar',
      method: 'POST',
      header: {
        'Content-type':
        'application/json'
      },
      data:{
        userId: 0,
        goodsId: dataInfo.goods_info.id,
        goodsName: dataInfo.goods_info.name,
        specId: dataInfo.selectAttrid,
        spec: dataInfo.selectName,
        img: dataInfo.default_spe_img,
        num: dataInfo.num,
        price: dataInfo.goods_info.price,
        oldPrice: dataInfo.goods_info.oldPrice,
        lowerPrice: dataInfo.goods_info.lowerPrice,
        type: 3
      },
      success: function (res) {
        var count = res.data;
        console.log(count);
      }
    })
    //关闭规格
    this.modal_none();
  },
  /**
  * 用户点击右上角分享
  */
  goBuy: function () {


  },
  /**
  * 用户点击右上角分享
  */
  submitBtn: function () {
  }
  


})