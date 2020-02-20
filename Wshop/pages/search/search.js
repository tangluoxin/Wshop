
// 界面：搜索界面
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:12


const app = getApp()
var util = require('../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '', //输入框value值
    noData: false, //暂无数据
    carList: [],//搜索列表
    history: false, //搜索记录
    historyData: [], //历史记录列表

    hasnoramalData: true,
    has:false,
    noramalData: [],

    leftList: [],
    rightList: [],
    leftHight: 0,
    rightHight: 0,

    snoramalData: [],

    sleftList: [],
    srightList: [],
    sleftHight: 0,
    srightHight: 0,

    id: '',
    gid: '',
    quantity: '1',
    time: '',

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

    var that = this
    wx.getStorage({ //获取历史记录缓存
      key: 'history',
      success(res) {
        console.log(res.data)
        if (res.data == '') {
          that.setData({
            history: false
          })
        } else {
          that.setData({
            historyData: res.data,
            history: true
          })
        }
      }
    })
  },




// 函数：获取推荐商品
// 作用：获取个性化推荐商品，渲染成双瀑布流形式显示在界面上，若无推荐，则不显示
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:12
  getdata: function () {
    var that = this;
    // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({
      // url: 'http://www.phonegap100.com/appapi.php?a=getPortalCate',//请求地址
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
        if (res.data == "暂无推荐") {
          that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数

            hasnoramalData: false

          })

        } else {
          that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数

            noramalData: res.data

          })
        }

        var allData = that.data.noramalData;

        //定义两个临时的变量来记录左右两栏的高度，避免频繁调用setData方法
        var leftH = 0;
        var rightH = 0;
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





// 函数：跳转到商品详情界面
// 作用：监听用户点击事件，跳转到相应商品详情界面
// 作者：唐珞鑫
// 最后更新时间：2019.9.1 10:22
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




// 函数：加入购物车函数
// 作用：监听用户点击事件，将相应商品加入购物车，默认数量为1
// 作者：唐珞鑫
// 最后更新时间：2019.9.1 10:22
  addcart: function (e) {
    console.log("addCart");
    var gid = e.currentTarget.dataset.gid;
    console.log(gid);

    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time,
      gid: gid
    });

    var that = this;
    
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
        }

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })




  },





// 函数：搜索框搜索
// 作用：获取搜索框输入内容，向后台发送信息，获取后台返回信息，进行页面渲染
// 作者：唐珞鑫
// 最后更新时间：2019.9.1 10:22
  search: function (e) {
    var that = this
    if (e.detail.value == '') { //输入框value为空
      that.setData({
        noData: false,
        carList: '',
        closeImg: false,
        history: true
      })
    } else { //输入框value不为空
      that.setData({
        closeImg: true,
        history: false
      })
      
      console.log(e.detail.value);
      var so = e.detail.value;
      var that = this;
      wx.request({
        url: 'http://139.217.130.233/searchgoods',
        data: {

          search: JSON.stringify(so),
          
        },
        
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'chartset': 'utf-8'
        },
        success: function (res) {
          console.log(res.data);
          if (res.data!='空'){
          that.setData({

            snoramalData: res.data,
            noData: false,
            has: true

          })
          }else{
            that.setData({

              snoramalData: res.data,
              noData: true,
              has: false

            })
          }

          var allData = that.data.snoramalData;

          //定义两个临时的变量来记录左右两栏的高度，避免频繁调用setData方法
          var sleftH = 0;
          var srightH = 0;
          var sleftData = [];
          var srightData = [];
          for (let i = 0; i < allData.length; i++) {
            var currentItemHeight = 1
            if (sleftH == srightH || sleftH < srightH) {//判断左右两侧当前的累计高度，来确定item应该放置在左边还是右边
              sleftData.push(allData[i]);
              sleftH += currentItemHeight;
            } else {
              srightData.push(allData[i]);
              srightH += currentItemHeight;
            }
          }

          //更新左右两栏的数据以及累计高度
          that.setData({
            sleftHight: sleftH,
            srightHight: srightH,
            sleftList: sleftData,
            srightList: srightData
          })

          
          
        }
      })


    }
  },




  // 函数：点击X取消输入框内容事件
  // 作用：点击x图标取消输入框内容
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 10:22
  close: function () {
    var that = this
    that.setData({
      inputValue: '',
      carList: '',
      noData: false,
      closeImg: false,
      history: true
    })
  },




  // 函数：返回商城
  // 作用：点击取消按钮，放弃搜索，返回商城界面
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 10:22
  cancel: function () {
    var that = this
    wx.switchTab({
      url: '/pages/shop/shop'
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