// pages/shop/shop.js

// 界面：商城界面
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:13


var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    ScanCodeMsg: '0',//扫一扫

    "bnrUrl": [{
      "url": "../../images/轮播图1.png"
    }, {
        "url": '../../images/轮播图2.png'
    }, {
        "url": '../../images/轮播图3.png'
    }, {
        "url": '../../images/轮播图4.png'
    }],

    noramalData: [],
    hasnoramalData:true,

    leftList: [],
    rightList: [],
    leftHight: 0,
    rightHight: 0,

    id:'',
    gid:'',
    quantity:'1',
    time:'',

    hot: [],//热销商品推荐

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var sid = wx.getStorageSync('id');
    this.setData({
      id: sid,
    })

    //请求数据获得推荐数据
    this.getdata();
    this.gethotdata();
    

  },




// 函数：跳转到搜索界面
// 作用：监听用户点击事件，跳转到搜索界面
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:13
  suo: function (e) {
    wx.navigateTo({
      url: '../search/search',
    })
  },




// 函数：获取推荐数据
// 作用：获取个性化推荐数据，渲染成双瀑布流形式，显示在界面上
// 作者：唐珞鑫
// 最后更新时间：2019.9.3 11:09
  getdata: function () {
    var that = this;
    
    wx.request({
      url: 'http://139.217.130.233/recommendmain',//请求地址
      data: {//发送给后台的数据
        id: JSON.stringify(this.data.id),

      },
      header: {//请求头
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      method: "POST",//get为默认方法/POST
      success: function (res) {
        console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
        if (res.data=="暂无推荐"){
          that.setData({
            hasnoramalData: false

          })
         
        }else{
        that.setData({

          noramalData: res.data

        })
        }
      
        var allData = that.data.noramalData;

        //定义两个临时的变量来记录左右两栏的高度，避免频繁调用setData方法
        var leftH = that.data.leftHight;
        var rightH = that.data.rightHight;
        var leftData = [];
        var rightData = [];
        for (let i = 0; i < allData.length; i++) {
          var currentItemHeight = 1
          if (leftH == rightH || leftH < rightH) {//判断左右两侧当前的累计高度，来确定item应该放置在左边还是右边
            leftData.push(allData[i]);
            leftH += currentItemHeight;
          } else {
            rightData.push(allData[i]);
            rightH += currentItemHeight;
          }
        }

        //更新左右两栏的数据以及累计高度
        that.setData({
          leftHight: leftH,
          rightHight: rightH,
          leftList: leftData,
          rightList: rightData
        })

       
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },




// 函数：获取热销数据
// 作用：获取热销数据，显示在界面上
// 作者：唐珞鑫
// 最后更新时间：2019.9.3 11:09
  gethotdata: function () {
    var that = this;
   
    wx.request({
     
      url: 'http://139.217.130.233/hotmain',//请求地址
      data: {//发送给后台的数据
        id: JSON.stringify(this.data.id),

      },
      header: {//请求头
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      method: "POST",//get为默认方法/POST
      success: function (res) {
        console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
        that.setData({

          hot: res.data

        })

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
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
    this.getdata();
    this.gethotdata();
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





// 函数：跳转到商品详情界面
// 作用：监听用户点击事件，跳转到相应商品详情界面
// 作者：唐珞鑫
// 最后更新时间：2019.9.3 11:09
  goDet: function (e) {
    console.log("goDet");
    var gid = e.currentTarget.dataset.gid;
    console.log(gid);

    //缓存传给下个界面
    wx.setStorage({
      key: "gid",
      data: gid
    })

    wx.navigateTo({
      url: '../goodsdetails/goodsdetails',
    })

  },




// 函数：跳转到扫码界面
// 作者：吴彤
// 最后更新时间：2019.9.3 11:09
  getScanCode: function () {
    var _this = this;

    wx.scanCode({
      success: function (res) {
      
        var result = res.result;
        _this.setData({
          ScanCodeMsg: result,
        });

        wx.setStorage({
          key: "gid",
          data: _this.data.ScanCodeMsg
        })

        wx.navigateTo({
          url: '../goodsdetails/goodsdetails',
        })

      }
    })

  },




// 函数：加入购物车函数
// 作用：监听用户点击事件，将相应商品加入购物车，默认数量为1
// 作者：唐珞鑫
// 最后更新时间：2019.9.3 11:09
  addcart:function(e){
    console.log("addCart");
    var gid = e.currentTarget.dataset.gid;
    console.log(gid);

    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time,
      gid:gid
    });

    var that = this;
    // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({

      url: 'http://139.217.130.233/cartadd',//请求地址
      data: {//发送给后台的数据
        id: JSON.stringify(this.data.id),
        gid: JSON.stringify(this.data.gid),
        quantity: JSON.stringify(this.data.quantity),
        time: JSON.stringify(this.data.time),
       
      },
      header: {//请求头
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      method: "POST",//get为默认方法/POST
      success: function (res) {
        console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
        if (res.data == '添加成功') {
          wx.showToast({

            title: '已成功添加购物车',

            icon: 'none',

            duration: 2000

          })
        } else if (res.data == '库存不足'){
          wx.showToast({

            title: '库存不足',

            icon: 'none',

            duration: 2000

          })
        }

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })

  },




  /** 
   * 回到顶部功能
   */
  // 函数：获取滚动条当前位置
  // 作用：获取滚动条当前位置
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.3 11:09
  onPageScroll: function (e) {
    // console.log(e.scrollTop)
    if (e.scrollTop > 500) {
      this.setData({
        icoSrc: "../../images/上.png",
      })
    }
    else {
      this.setData({
        icoSrc: "../../images/空.png",
      });
    }
  },




  // 函数：一键回到顶部
  // 作用：监听用户点击事件，回到顶部
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.3 11:09
  goTop: function (e) {

    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },




})