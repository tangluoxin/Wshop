// pages/login_y/login_y.js

// 界面：验证码登录
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:06

var zhenzisms = require('../../zhenzisms.js');
//获取应用实例
const app = getApp();

Page({
  data: {
    hidden: false,
    btnValue: '获取验证码',
    btnDisabled: false,
    name: '',
    phone: '',
    code: '',
    scode:'',
    second: 60
  },
  onLoad: function () {

  },
 


//  函数：获取手机号
//  作用：获取用户输入手机号
//  作者：唐珞鑫
// 最后更新时间：2019.9.10 16:06

  bindPhoneInput(e) {
    console.log(e.detail.value);
    var val = e.detail.value;
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
        hidden: true
      })
    }
  },

  // 函数：生成验证码
  // 作用：生成四位随机数，作为验证码
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:08

  bindCodeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
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

   
    
  //函数：获取验证码
  // 作用：监听点击事件，调用API向用户手机发送随机验证码，并调用计时函数开始倒计时
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:10

  getCode(e) {

    console.log('获取验证码');
    
    this.createCode();
    if (this.data.phone!=''){
    var that = this;

    //调用倒计时函数，倒计时结束前不能进行下一次点击
    that.timer();

    //调用API向用户手机发送随机码
    zhenzisms.client.init('https://sms_developer.zhenzikj.com', '102435', '2fdc4a4f-6ffd-4bb6-82ca-1a6ab1e0b6b0');
    zhenzisms.client.send(function (res) {
      if (res.data.code == 0) {
        
        return;
      }
      wx.showToast({
        title: res.data.data,
        icon: 'none',
        duration: 2000
      })
    }, this.data.phone, '亲爱的用户，感谢使用智简销售，验证码:' + this.data.scode);
    }else{
      wx.showToast({

        title: '手机号不能为空',

        icon: 'none',

        duration: 2000

      })
    }

  },

  // 函数：倒计时函数
  // 作用：进行60秒倒计时，计时结束前按钮显示计时数据，计时结束才能显示“获取验证码”
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:16

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

  // 函数：登录函数
  // 作用：验证用户输入的验证码是否匹配，若匹配则显示登录成功进行页面跳转，失败则发聩用户错误信息
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.10 16:06

  save:function(e) {
    if (this.data.code == this.data.scode&&this.data.code!=''){
      //缓存传给下个界面
      wx.setStorage({
        key: "id",
        data:this.data.phone
      })
     
      //向后端传数据
      var that = this;
      wx.request({
        url: 'http://139.217.130.233/idcodelogin',//请求地址
        data: {//发送给后台的数据

          id: JSON.stringify(this.data.id),

        },
        header: {//请求头
          'content-type': 'application/x-www-form-urlencoded',
          'chartset': 'utf-8'
        },
        method: "POST",//方法
        success: function (res) {
          console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
         
        },
        fail: function (err) { },//请求失败
        complete: function () { }//请求完成后执行的函数
      })

     //成功则进行页面跳转
     wx.switchTab({
      url: '../mine/mine'
     })
    }

    //失败反馈用户错误信息
    if (this.data.code != this.data.scode || this.data.code == ''){
      wx.showToast({

        title: '验证码错误',

        icon: 'none',

        duration: 2000

      })
    }
    
  }
})
