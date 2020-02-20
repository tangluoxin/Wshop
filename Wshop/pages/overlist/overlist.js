// pages/overlist/overlist.js

// 界面：全部订单界面
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:10

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    id: '',
    time: '',
    overlist: [],//订单列表
    haslist:false

  },



  /**
   * 生命周期函数--监听页面加载
   */
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.10 16:10
  onLoad: function (options) {
    //修改title
    wx.setNavigationBarTitle({
      title: '全部订单'
    })

    //接收登录界面传来的用户ID信息，用于请求匹配
    var sid = wx.getStorageSync('id');
    this.setData({
      id: sid,
    })
    console.log(this.data.id);
    //请求数据
    this.getdata();
  },




  // 函数：请求数据函数
  // 作用：向后台发送请求获取全部订单列表
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.10 16:10
  getdata: function () {
    var that = this;
    // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({
      
      url: 'http://139.217.130.233/allorders',//请求地址
      data: {//发送给后台的数据
        id: JSON.stringify(this.data.id),


      },
      header: {//请求头
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      method: "POST",//方法/POST
      success: function (res) {
        console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
        that.setData({

          overlist: res.data

        })
        if (res.data!='暂无订单'){
          
          that.setData({

            haslist: true

          })
        }else{
          that.setData({

            haslist: false

          })
        }

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




  // 函数：前往订单详情
  // 作用：监听用户点击事件，前往相应的订单的详情界面
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.10 16:10
  inList: function (e) {
    console.log("go to innerlist");
    console.log(e);
    var time = e.currentTarget.dataset.time;
    console.log(time);
    var totalprice = e.currentTarget.dataset.totalprice;
    console.log(totalprice);
   
    //缓存传给下个界面
    wx.setStorage({
      key: "time",
      data: time
    })

    //缓存传给下个界面
    wx.setStorage({
      key: "totalprice",
      data: totalprice
    })

    wx.navigateTo({
      url: '../list/list',
    })
  },

  


  // 函数：删除订单
  // 作用：监听用户点击事件，删除相应订单
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.10 16:10
  deleteList: function (e) {
    console.log("deleteList");

    var that=this;
    console.log(e);

    var time = e.currentTarget.dataset.time; 

    var that = this;

    wx.showModal({
      title: '确定将订单删除',
      cancelText: "我再想想", //默认是“取消”
      confirmText: "删除", //默认是“确定”
      success: function (res) {
        if (res.confirm) {
          console.log("deleteList");
          console.log(that.data.id);
          console.log(time);
          
          wx.request({
            url: 'http://139.217.130.233/deleteorders',
            data: {

              'id': JSON.stringify(that.data.id),  //将数据格式转为JSON
              'times': JSON.stringify(time),  //将数据格式转为JSON

            },

            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'chartset': 'utf-8'
            },
            success: function (res) {
              console.log(res.data);

              if (res.data == '删除成功') {
                wx.showToast({
                  title: res.data,//这里打印出成功
                  icon: 'none',
                  duration: 1000
                });

                that.getdata();

               
              } else {
                wx.showToast({
                  title: "删除失败",
                  icon: 'none',
                  duration: 2000
                });
              }

            }
          })
          
        } else { }

      }
    })
   
  },




// 函数：前往商城
// 作用：在订单为空时，点击界面中部图片触发前往商城的事件
// 作者：唐珞鑫
// 最后更新时间：2019.8.20 9:00
  goshop: function (e) {
    wx.switchTab({
      url: '../shop/shop'
    })
  },


})
