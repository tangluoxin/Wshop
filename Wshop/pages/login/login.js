// pages/login/login.js

// 界面：手机号密码登录界面
// 作用：通过一系列函数实现手机号密码登录功能
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:04

var app = getApp()

Page({

  data: {

    id: '',

    password: '',

    userInfo: {},

    //img:'../images/logo.png'

  },


// 函数：监听页面加载函数
// 作用：获取全局数据、更新数据
// 作者：唐珞鑫
// 最后更新时间：2019.9.1 9:20

  onLoad: function () {

    var that = this

    //调用应用实例的方法获取全局数据

    app.getUserInfo(function (userInfo) {

      //更新数据

      that.setData({

        userInfo: userInfo

      })

    })

  },


  // 函数：获取输入账号函数
  // 作用：监听输入事件，获取输入框内用户输入的手机号
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.15 13:08

  idInput: function (e) {

    this.setData({

      id: e.detail.value

    })

  },


  // 函数：获取输入密码函数
  // 作用：监听输入事件，获取输入框内用户输入的密码
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.15 13:08

  passwordInput: function (e) {

    this.setData({

      password: e.detail.value

    })

  },


  // 函数：登录函数
  // 作用：对不合法输入进行监控反馈，合法输入向后台发送信息并获取反馈给用户
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.15 13:08

  login: function () {
   
    if (this.data.id.length == 0 || this.data.password.length == 0) {

      wx.showToast({

        title: '用户名和密码不能为空',

        icon: 'none',

        duration: 2000

      })

    } else {
      var that = this;   
      wx.request({
        url: 'http://139.217.130.233/userlogin',
        data: {
         
          'id': JSON.stringify(that.data.id),  //将数据格式转为JSON
          'password': JSON.stringify(that.data.password),  //将数据格式转为JSON
          
        },
        
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'chartset': 'utf-8'
        },
        success: function (res) {
          console.log(res.data);

          if(res.data=='登录成功'){
          wx.showToast({
            title: res.data,//这里打印出登录成功
            icon: 'success',
            duration: 1000
          });
          
          //缓存
          wx.setStorage({
            key: "id",
            data: that.data.id
          })

          wx.switchTab({
            url: '../mine/mine'
          })
          } else if (res.data == '账号未注册'){
            wx.showToast({
              title: "账号未注册",//这里打印出登录成功
              icon: 'none',
              duration: 2000
            });
          } else if (res.data == '密码错误') {
            wx.showToast({
              title: "密码错误",//这里打印出登录成功
              icon: 'none',
              duration: 2000
            });
          }


        }
      })
      
    }
    console.log('手机号: ' + this.data.id);
    
    console.log('密码: ' + this.data.password);

  }

})
