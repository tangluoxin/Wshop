// pages/mine/mine.js

// 界面：用户主页
// 作用：提供用户可对个人账号进行的各种操作如完善信息、联系客服等
// 作者：唐珞鑫，吴彤
// 最后更新时间：2019.9.9 16:07

const wxCharts = require('../../utils/charts/wxcharts.js'); // 引入wx-charts.js文件
var app = getApp();
var ringChart = null;
var util = require('../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // post:[],
    id:'',
    showname:'未命名用户',//显示在界面上的用户昵称，从后台获取
    consumption:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */

  // 函数：界面渲染
  // 作用：调用请求函数，渲染界面显示用户名
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.9 16:07

  onLoad: function (options) {
    
    //接收登录界面传来的用户ID信息，用于请求匹配用户名
    var sid = wx.getStorageSync('id');
    this.setData({
      id: sid,
    })
    console.log(this.data.id);
    this.getdata();

  },



  // 函数：绘制本月消费环状图
  // 作用：按商品类型生成用户本月消费环状图
  // 作者：吴彤
  // 最后更新时间：2019.9.9 16:07

  getChart:function(){
    //请求消费记录
    var that = this;
    var time = util.formatTime(new Date());
    this.setData({
      time: time
    })

    wx.request({
      url: 'http://139.217.130.233/sortchart',
      data: {
        id: JSON.stringify(that.data.id),
        time: JSON.stringify(that.data.time)
      },
      header: {//请求头
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      method: "POST",//get为默认方法/POST

      success: function (res) {
        console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
        that.setData({
          consumption: res.data,
        })


        if (that.data.consumption.totalprice != 0) {
          //有消费记录，画出图表
          new wxCharts({

            animation: true,
            canvasId: 'ringCanvas',
            type: 'ring',

            extra: {
              ringWidth: 25,
              pie: {
                offsetAngle: -45
              }
            },

            title: {
              name: that.data.consumption.totalprice,
              color: '#043aa0',
              fontSize: 35
            },

            subtitle: {
              name: '本月消费',
              color: '#043aa0',
              fontSize: 15
            },



            series: [
              {
                name: that.data.consumption.result[0].sort,
                data: that.data.consumption.result[0].total,
                stroke: false,
                color: '#7bccec'
              },
              {
                name: that.data.consumption.result[1].sort,
                data: that.data.consumption.result[1].total,
                stroke: false,
                color: '#fae3ae'
              },
              {
                name: that.data.consumption.result[2].sort,
                data: that.data.consumption.result[2].total,
                stroke: false,
                color: '#f2bcd4'
              },
              {
                name: that.data.consumption.result[3].sort,
                data: that.data.consumption.result[3].total,
                stroke: false,
                color: '#85cbcd'
              },
              {
                name: that.data.consumption.result[4].sort,
                data: that.data.consumption.result[4].total,
                stroke: false,
                color: '#c7a9d1'
              },
              {
                name: that.data.consumption.result[5].sort,
                data: that.data.consumption.result[5].total,
                stroke: false,
                color: '#ec7079'
              }
            ],

            disablePieStroke: true,
            width: 370,
            height: 370,
            dataLabel: true,
            legend: true,
            padding: 0

          });
        } else
        //没有消费记录
        {
          console.log("没有消费记录")
          new wxCharts({

            animation: true,
            canvasId: 'ringCanvas',
            type: 'ring',

            extra: {
              ringWidth: 25,
              pie: {
                offsetAngle: -45
              }
            },

            title: {
              name: '0',
              color: '#043aa0',
              fontSize: 35
            },

            subtitle: {
              name: '本月消费',
              color: '#043aa0',
              fontSize: 15
            },

            series: [
              {
                name: 'none',
                data: 1,
                stroke: false,
                color: '#7bccec'
              }
            ],

            disablePieStroke: true,
            width: 370,
            height: 370,
            dataLabel: false,
            legend: false,
            padding: 0

          });
        }

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

// 函数：请求数据函数
// 作用：向后台请求数据，获取用户名，用于渲染界面
// 作者：唐珞鑫
// 最后更新时间：2019.8.20 14:32

  getdata: function () {
    var that = this;
    // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({
      url: 'http://139.217.130.233/mine',//请求地址
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
        if (res.data=="用户昵称为空"){}
        else{
          that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
            showname: res.data
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
    this.getChart();
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

  //函数：跳转完善信息界面
  // 作用：跳转
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:32

  Modify:function(e){

    wx.navigateTo({
      url: '../modify/modify',
    })

  },
  golist: function (e) {
    
    wx.navigateTo({
      url: '../overlist/overlist',
    })

  },

  //函数：跳转绑定人脸界面
  // 作用：跳转
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:32
  
  face:function(e){
    wx.navigateTo({
      url: '../camera/camera',
    })

  }


})