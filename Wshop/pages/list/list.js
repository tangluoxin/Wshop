// pages/list/list.js

// 界面：订单详情

Page({

  /**
   * 页面的初始数据
   */
  data: {
   id:'',
    orderlist: [],//订单列表
   hasList: false, // 列表是否有数据
   totalprice:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //修改标题
    wx.setNavigationBarTitle({
      title: '订单详情'
    })

    //接收登录界面传来的用户ID信息，用于请求匹配
    var sid = wx.getStorageSync('id');
    var stime = wx.getStorageSync('time');
    var stotalprice = wx.getStorageSync('totalprice');

    this.setData({
      id:sid,
      time:stime,
      totalprice: stotalprice
    })
    

    console.log(this.data.id);
    console.log(this.data.time);
   //调用请求函数获取数据用于渲染界面
    this.getdata();
  },

// 函数：请求数据函数
// 作用：请求后台，获取当前订单的详情，包括订单内商品、订单时间和总金额
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:02

  getdata: function () {
    var that = this;   
    
    wx.request({
      url: 'http://139.217.130.233/orderdetail',//请求地址
      data: {//发送给后台的数据
        id: JSON.stringify(this.data.id),
        time: JSON.stringify(this.data.time),
       
      },
      header: {//请求头
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      method: "POST",//get为默认方法/POST
      success: function (res) {
        console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
        　　　　　　that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数

          　　　　　　oderlist: res.data,
                  

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

//  函数：前往商品详情函数
//  作用：根据点击事件跳转到相应商品详情界面
//  作者：唐珞鑫
//  最后更新时间：2019.9.9 13:02

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




// 函数：删除订单函数
// 作用：向后台发送用户id以及订单时间，实现在数据库中删除订单的操作
// 作者：唐珞鑫
// 最后更新时间：2019.9.1 8:10

 deleteList: function (e) {
   var that=this;
   wx.showModal({
     title: '确定将订单删除',
     cancelText: "我再想想", //默认是“取消”
     confirmText: "删除", //默认是“确定”
     success: function (res) {
       if (res.confirm) {
         console.log("deleteList");
         console.log(that.data.id);
         console.log(that.data.time);
         wx.request({
           url: 'http://139.217.130.233/deleteorders',
           data: {

             'id': JSON.stringify(that.data.id),  //将数据格式转为JSON
             'times': JSON.stringify(that.data.time),  //将数据格式转为JSON

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

               wx.navigateBack({
                 delta: 0
               })

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
   
  }


})

