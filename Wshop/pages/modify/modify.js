// pages/modify/modify.js

// 界面：修改用户信息
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:08

var zhenzisms = require('../../zhenzisms.js');
//获取应用实例
const app = getApp();

Page({
  data: {
    hidden: false,
    btnValue: '获取验证码',
    btnDisabled: false,
    name: '',
    idname: '',//账号
    sex: '',//性别
    psd: '',//输入的密码
    rpsd: '',//重复输入的密码
    phone: '',//电话
    code: '',//输入的验证码
    scode: '',//随机生成的验证码
    second: 60,
    showname: '未命名用户',//显示在界面上的用户昵称，从后台获取

    items: [
      { name: 'man', value: '男' },
      { name: 'woman', value: '女' },

    ]

  },


  onLoad: function () {

    //接收登录界面传来的用户ID信息，用于请求匹配用户名
    var sid = wx.getStorageSync('id');
    this.setData({
      id: sid,
      phone:sid
    })
    console.log(this.data.id);

    this.getdata();

  },


  // 函数：获取已有用户名信息
  // 作用：获取已有昵称，用于渲染输入框
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:40

  getdata: function () {

    var that = this;
    
    wx.request({
      url: 'http://139.217.130.233/mine',//请求地址
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
        if (res.data == "用户昵称为空") { }
        else {
          that.setData({
            showname: res.data
          })
        }
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },



  // 函数：获取输入昵称
  // 作用：获取输入框输入昵称
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:42

  idnameInput(e) {
    this.setData({
      idname: e.detail.value
    })
  },


  // 函数：获取单选按钮事件
  // 作用：获取用户在单选框内选择的数据，即男女
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:43

  radioChange: function (e) {

    this.setData({
      sex: e.detail.value  //单个选中的值
    })
   
  },


  // 函数：获取输入密码
  // 作用：获取输入框用户输入的密码
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:44

  passwordInput(e) {
    this.setData({
      psd: e.detail.value
    })
  },


  // 函数：获取重新输入密码
  // 作用：获取输入框用户重复输入的密码
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:40

  rpasswordInput(e) {
    this.setData({
      rpsd: e.detail.value
    })
  },


  // 函数：手机号获取
  // 作用：获取用户输入的手机号，若用户未输入新的手机号，采用默认的旧手机号
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:40

  bindPhoneInput(e) {
    console.log(e.detail.value);
    var val = e.detail.value;
    var that=this;
    this.setData({
      phone: val
    })
    if (val != '') {
      this.setData({
        hidden: false,
        btnValue: '获取验证码'
      })
    } else {
      this.setData({
        phone: that.data.id
      })
      this.setData({
        hidden: false,
        btnValue: '获取验证码'
      })
    }
  },


  // 函数：验证码输入
  // 作用：获取用户输入的验证码
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:40

  bindCodeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },


  // 函数：生成验证码
  // 作用：生成随机四位验证码
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:40

  createCode() {
    var code;
    code = '';
    //设置长度
    var codeLength = 4;
    //设置随机字符
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    //循环codeLength 4就是循环4次
    for (var i = 0; i < codeLength; i++) {
      //设置随机数范围,这设置为0 ~ 9
      var index = Math.floor(Math.random() * 9);
      //字符串拼接 将每次随机的字符 进行拼接
      code += random[index];
    } this.setData({
      scode: code
    })
  },


  // 函数：获取短信验证码
  // 作用：监听用户点击事件，向用户手机发送验证码
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:40

  getCode(e) {
    console.log('获取验证码');
    this.createCode();
    var that = this;
    zhenzisms.client.init('https://sms_developer.zhenzikj.com', '102435', '2fdc4a4f-6ffd-4bb6-82ca-1a6ab1e0b6b0');
    zhenzisms.client.send(function (res) {
      if (res.data.code == 0) {
        that.timer();
        return;
      }
      wx.showToast({
        title: res.data.data,
        icon: 'none',
        duration: 2000
      })
    }, this.data.phone, '亲爱的用户，感谢使用智简销售，验证码:' + this.data.scode);

  },


  // 函数：倒计时函数
  // 作用：进行60秒倒计时，计时结束前按钮显示计时数据，计时结束才能显示“获取验证码”
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.20 14:40

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + '秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '获取验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

 
  // 函数：提交修改函数
  // 作用：验证用户输入是否合法，输入的验证码是否匹配，若匹配则显示修改成功，失败则发聩用户错误信息
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.10 16:09

  save: function (e) {

    if (this.data.idname.length == 0 ) {
      this.setData({
        idname:this.data.showname
      })
     

    } 
     if (this.data.psd.length == 0){
      wx.showToast({

        title: '密码不能为空',

        icon: 'none',

        duration: 2000

      })
    }

    else if (this.data.sex.length == 0) {

      wx.showToast({

        title: '未选择性别',

        icon: 'none',

        duration: 2000

      })

    }

    else if (this.data.psd != this.data.rpsd) {

      wx.showToast({

        title: '两次输入密码不一致',

        icon: 'none',

        duration: 2000

      })

    } else if (this.data.code != this.data.scode || this.data.scode == '') {
      wx.showToast({

        title: '验证码错误',

        icon: 'none',

        duration: 2000

      })
    }



    else {

      var that = this;
      wx.request({
        url: 'http://139.217.130.233/updatemine',
        data: {

          'name': JSON.stringify(this.data.idname),  //将数据格式转为JSON
          'sex': JSON.stringify(this.data.sex),
          'id': JSON.stringify(this.data.phone),
          'password': JSON.stringify(this.data.psd),  //将数据格式转为JSON


        },

        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'chartset': 'utf-8'
        },
        success: function (res) {
          console.log(res.data);

          if (res.data == '修改成功') {

            wx.showToast({

              title: '修改成功',

              icon: 'none',

              duration: 2000

            })

            
          } else {
            wx.showToast({
              title: "修改失败",
              icon: 'none',
              duration: 2000
            });
          }


        }
      })

      
    }

    console.log('账户名: ' + this.data.idname);
    console.log('性别: ' + this.data.sex);
    console.log('密码: ' + this.data.psd);
    console.log('手机号: ' + this.data.phone);
    
  },


  // 函数：跳转绑定人脸界面
  // 作用：跳转界面
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.10 16:09

  goface:function(e){
    console.log('goface');
    wx.navigateTo({
      url: '../camera/camera',
    })
  }


})






