// pages/goodsdetails/goodsdetails.js

// 界面：商品详情
// 作用：显示商品详细信息，可将商品加入购物车
// 作者：吴彤
// 最后更新时间：2019.9.9 13:30

var util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    inputValue: '',
    num:1,
    minusStatus:'disabled',
    plusStatus:'normal',
    goodsDetails: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sid = wx.getStorageSync('id');
    this.setData({
      id: sid,
    })


    var bc = wx.getStorageSync('gid');
    this.setData({
      barCode: bc,
    })
    console.log(this.data.barCode);

    //向数据库获取商品信息
    console.log('onLoad')
    var that = this;
    // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({
      url: 'http://139.217.130.233/goodsdetail',//请求地址
      data: {//发送给后台的数据

        gid: JSON.stringify(that.data.barCode),
        

      },

      header: {//请求头
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      method: "POST",//get为默认方法/POST

      success: function (res) {
        console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数

          goodsDetails: res.data


        })

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })

    console.log(this.data.goodsDetails);
  },



  // 函数：减少商品数量
  // 作用：点击减号时，商品数量减一
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:30

  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus,
      plusStatus:'normal'
    });
  },


  // 函数：增加商品数量
  // 作用：点击加号时，商品数量加一
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:30

  bindPlus: function () {
    var num = this.data.num;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var plusStatus = num >= this.data.goodsDetails[0].storage ? 'disabled' : 'normal';
    // 不作过多考虑自增1
    if (num < this.data.goodsDetails[0].storage)
      num++;
    else{
      wx.showToast({
        title: '库存不足，无法再增加',
        icon:'none',
        duration: 1000
      })
    }
    
    // 将数值与状态写回
    if (this.data.goodsDetails[0].storage>1)
    {
      this.setData({
        num: num,
        plusStatus: plusStatus,
        minusStatus: 'normal'
      })
    }
    else
    {
      this.setData({
        num: num,
        plusStatus: plusStatus
      })
    }
  },


  // 函数：修改商品数量
  // 作用：在输入框里输入数字，直接修改商品数量
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:30

  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回
    if(num<1)
      wx.showModal({
        content: '请至少加入一件商品',
      })
    if (num > this.data.goodsDetails[0].storage)
    {
      this.setData({
        num: this.data.goodsDetails[0].storage
      })
      wx.showModal({
        content: '库存不足',
      })
    }
    else
    {
      this.setData({
        num: num,
        minusStatus: 'normal',
        plusStatus: 'normal'
      })
    }
    
  },

  

  // 函数：将商品加入购物车
  // 作用：把当前界面显示的商品及其对应数量加入购物车
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:30

  addtoShoppingCart:function(){
    console.log("addtoShoppingCart");
    var time=util.formatTime(new Date());
    this.setData({
      time:time
    })
    var that=this;
    wx.request({
      url: 'http://139.217.130.233/cartadd',
      data:{
        id: JSON.stringify(this.data.id),
        // id:'18851662029',
        gid: JSON.stringify(this.data.barCode),
        quantity: JSON.stringify(this.data.num),
        time:JSON.stringify(this.data.time)
      },
      header: {//请求头
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      method: "POST",//get为默认方法/POST

      success: function (res) {
        console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
        if(res.data=='添加成功')
        {
          wx.showToast({
            title: '已成功添加购物车',
            icon: 'success',
            duration: 1000
          }) 
        }
        if (res.data == '添加失败') {
          wx.showToast({
            title: '添加购物车失败，请重试',
            icon: 'none',
            duration: 1000
          })
        }
        if (res.data == '库存不足') {
          wx.showToast({
            title: '库存不足',
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
    
  },


  // 函数：查看购物车
  // 作用：跳转到购物车界面
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:30

  goToShoppingCart:function(){
    wx.switchTab({
      url: '../shoppingcar/shoppingcar'
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