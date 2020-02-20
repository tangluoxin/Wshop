// pages/register/register.js

// 界面：注册
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:10

var zhenzisms = require('../../zhenzisms.js');
//获取应用实例
const app = getApp();

Page({
  data: {
    hidden: false,
    btnValue: '获取验证码',
    btnDisabled: false,
    name: '',
    idname:'',//账号
    sex:'',//性别
    psd:'',//输入的密码
    rpsd:'',//重复输入的密码
    phone: '',//电话
    code: '',//输入的验证码
    scode: '',//随机生成的验证码
    second: 60,

    items: [
      { name: 'man', value: '男' },
      { name: 'woman', value: '女' },

    ]

  },
  onLoad: function () {

  },




  // 函数：获取输入昵称
  // 作用：获取输入框输入昵称
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.15 15:20
  idnameInput(e){
    this.setData({
      idname: e.detail.value
    })
  },




  // 函数：获取单选按钮事件
  // 作用：获取用户在单选框内选择的数据，即男女
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.15 15:20
  radioChange: function (e) {

    this.setData({
      sex: e.detail.value  //单个选中的值
    })
    //console.log('radio发生change事件，携带value值为：', )
  },




  // 函数：获取输入密码
  // 作用：获取输入框用户输入的密码
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.15 15:20
  passwordInput(e) {
    this.setData({
      psd: e.detail.value
    })
  },




  // 函数：获取重新输入密码
  // 作用：获取输入框用户重复输入的密码
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.15 15:20
  rpasswordInput(e) {
    this.setData({
      rpsd: e.detail.value
    })
  },




  // 函数：手机号获取
  // 作用：获取用户输入的手机号，若用户未输入新的手机号
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.15 15:25
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




  // 函数：验证码输入
  // 作用：获取用户输入的验证码
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.15 15:25
  bindCodeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },




  // 函数：生成验证码
  // 作用：生成随机四位验证码
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.15 15:25
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
  // 最后更新时间：2019.8.15 15:25
  getCode(e) {
    console.log('获取验证码');
    if (this.data.phone!=''){
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
  // 最后更新时间：2019.8.15 15:25
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
  // 作用：验证用户输入是否合法，输入的验证码是否匹配，若匹配则显示注册成功跳转到人脸绑定界面，若已注册过跳转到验证码登录界面，失败则发聩用户错误信息
  // 作者：唐珞鑫
  // 最后更新时间：2019.8.15 15:25
  save: function (e) {

    if (this.data.idname.length == 0 ) {

      wx.showToast({

        title: '昵称不能为空',

        icon: 'none',

        duration: 2000

      })

    }

    else if (this.data.sex.length == 0 ) {

      wx.showToast({

        title: '未选择性别',

        icon: 'none',

        duration: 2000

      })

    } 
    else if (this.data.psd.length == 0) {

      wx.showToast({

        title: '密码不能为空',

        icon: 'none',

        duration: 2000

      })

    }

    else if (this.data.psd!=this.data.rpsd) {

      wx.showToast({

        title: '两次输入密码不一致',

        icon: 'none',

        duration: 2000

      })

    }
    else if (this.data.phone == '') {
      wx.showToast({

        title: '手机号不能为空',

        icon: 'none',

        duration: 2000

      })
    }

    else if (this.data.code != this.data.scode || this.data.scode == '') {
      wx.showToast({

        title: '验证码错误',

        icon: 'none',

        duration: 2000

      })
    }

    else {
      var that = this;
      wx.request({
        url: 'http://139.217.130.233/userregister',
        data: {

          'name': JSON.stringify(this.data.idname) ,  //将数据格式转为JSON
          'sex': JSON.stringify(this.data.sex),
          'id': JSON.stringify(this.data.phone),
          'password': JSON.stringify(this.data.psd) ,  //将数据格式转为JSON


        },

        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'chartset': 'utf-8'
        },
        success: function (res) {
          console.log(res.data);

          if (res.data == '注册成功') {
            wx.showToast({
              title: res.data,//这里打印出成功
              icon: 'success',
              duration: 1000
            });

            //缓存
            wx.setStorage({
              key: "id",
              data: that.data.phone
            })

            wx.redirectTo({
              url: '../camera/camera'
            })
          } else if (res.data == '注册失败，手机号已注册'){
            wx.showToast({
              title: "手机号已被注册",
              icon: 'none',
              duration: 2000
            });

            //缓存
            wx.setStorage({
              key: "id",
              data: that.data.phone
            })

            wx.redirectTo({
              url: '../login_y/login_y'
            })
          }else {
            wx.showToast({
              title: "注册失败",
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
    console.log('验证码: ' + this.data.code);

    
  },






})


    



