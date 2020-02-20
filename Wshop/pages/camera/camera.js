// pages/camera/camera.js

// 界面：账号绑定人脸
// 作用：将用户的人脸信息与账号绑定，使用户能够通过人脸登录
// 作者：吴彤
// 最后更新时间：2019.9.9 13:14

const app = getApp()

Page({
  data: {
    nickName: "",
    src: "",
    token: "",
    base64: "",
    msg: "",
    userID:"",
    touchFlag:false
  },

  // 函数：获取拍照按钮状态
  // 作用：拍照按钮被按下时改变样式
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:14
  
  start: function () {
    var that = this
    that.setData({
      touchFlag: true
    })
  },


  // 函数：获取拍照按钮状态
  // 作用：拍照按钮弹起时改变样式
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:14

  end: function () {
    var that = this
    that.setData({
      touchFlag: false
    })
  },


  // 函数：拍照上传人脸进行绑定
  // 作用：调用相机拍照，并将图片转成base64格式的编码，调用人脸识别API，将符合要求的人脸与账户进行绑定并返回结果
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:14

  takePhoto() {
    console.log("拍照")
    var that = this;
    wx.showLoading({
      title: '验证中',
    })
    //拍照
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        that.setData({
          src: res.tempImagePath//获取图片
        })

        //图片base64编码
        wx.getFileSystemManager().readFile({
          filePath: this.data.src, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            that.setData({
              base64: res.data
            })

          }
        })
      }//拍照成功结束

    })//调用相机结束

    wx.showLoading({
      title: '验证中',
    })

    //acess_token获取
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token', 
      data: {
        grant_type: 'client_credentials',
        client_id: 'EKB1H0AG2iUNZF8ZAeT6GuY9',
        client_secret: 'HkiLvzlTVn0TWnTaoePT5Xk9wG6WoSct'
      },
      header: {
        'Content-Type': 'application/json'
      },
      success(res) {
        that.setData({
          token: res.data.access_token,//获取到token
        })


        wx.request({
          url: 'https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add?access_token=' + that.data.token,
          method: 'POST',
          data: {
            image: that.data.base64,
            image_type: 'BASE64',
            group_id: 'face',//自己建的用户组id
            user_id: that.data.userID,
            action_type: 'REPLACE'
          },
          header: {
            'Content-Type': 'application/json'
          },

          success(res) {
            that.setData({
              msg: res.data.error_msg
            })
            console.log(that.data.msg)

            //做成功判断
            if (that.data.msg == 'SUCCESS') {
              
              wx.showModal({
                content: '绑定成功',
                showCancel:false,
                success(res){
                  if(res.confirm){
                    wx.switchTab({
                      url: '../mine/mine'
                    })
                  }
                }
              })
              
            }
            else {
              //失败尝试
              wx.showToast({
                title: '未检测到人脸，请重试',
                icon: 'none',
                duration: 4000
              })
            }
          },
          fail: () => { },
          complete: () => {
            wx.hideLoading()
          }
        })

      }
    })


  },
  error(e) {
    console.log(e.detail)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = wx.getStorageSync('id');
    this.setData({
      userID: id,
    })
    console.log(this.data.userID)
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