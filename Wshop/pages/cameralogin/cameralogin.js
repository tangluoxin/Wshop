// pages/cameralogin/cameralogin.js

// 界面：通过人脸登录账号
// 作用：用户通过人脸验证登录对应的账号
// 作者：吴彤
// 最后更新时间：2019.9.9 13:25

Page({
  data: {
    base64: "",
    token: "",
    msg: null,
    src: '',
    userID:"",
    validID:[],
    index:0,
    idx:0,
    chooseFlag:false,
    cameraFlag:false,
    touchFlag:false
  },


  // 函数：拍照
  // 作用：调用相机进行拍照，将图片转为base64格式的编码
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:25

  takePhoto() {
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
          src: res.tempImagePath
        })
        //图片base64编码
        wx.getFileSystemManager().readFile({
          filePath: that.data.src, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            that.setData({
              base64: res.data
            })
            that.myRequest();//调用函数进行token获取和图片上传验证
          }
        })
      }
    })

  },


  // 函数：获取拍照按钮状态
  // 作用：拍照按钮被按下时改变样式
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:25

  start:function(){
    var that=this
    that.setData({
      touchFlag: true
    })
  },


  // 函数：获取拍照按钮状态
  // 作用：拍照按钮弹起时改变样式
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:25

  end: function () {
    var that = this
    that.setData({
      touchFlag: false
    })
  },



  // 函数：上传人脸进行验证
  // 作用：上传人脸，调用人脸识别API，搜索人脸库中匹配的人脸并返回结果
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:25

  myRequest: function () {
    var that = this;

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
          token: res.data.access_token //获取到token
        })

        //上传人脸进行比对
        wx.request({
          url: 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' + that.data.token,
          method: 'POST',
          data: {
            image: that.data.base64,
            image_type: 'BASE64',
            group_id_list: 'face', //用户组id
            max_user_num:5
          },
          header: {
            'Content-Type': 'application/json' // 默认值
          },
          success(res) {
            
            var errorcode = res.data.error_code
            if (errorcode == 0) //访问成功
            {
              var ulist = res.data.result
              //打印返回msg看看
              if (ulist.user_list != null) {
                // console.log('ulist存在');
                for(var i=0;i<ulist.user_list.length;i++)
                {
                  var obj = {};
                  obj = ulist.user_list[i].user_id;
                  let validID=that.data.validID;
                  var result = ulist.user_list[i].score
                  if(result>80){
                    validID.push(obj);
                    that.setData({ validID });
                  }
                }
                console.log(that.data.validID)
           
                if (that.data.validID.length>0)
                {
                  that.setData({
                    chooseFlag: true,
                    cameraFlag: true
                  })
                }else
                {
                  console.log('不匹配')
                  wx.showModal({
                    content: '验证失败',
                    showCancel: false
                  })
                }

                
              }
            } else {
              console.log('访问失败')
              wx.showModal({
                content: '验证失败',
                showCancel: false
              })
            }
          },
          fail: () => { },
          complete: () => {
            wx.hideLoading()
          }
        });
      } 
    })
  },


  error(e) {
    console.log(e.detail)
  },




  // 函数：登录所选账号
  // 作用：同一张人脸有多个账号时，根据用户的选择登录相应账号
  // 作者：吴彤
  // 最后更新时间：2019.9.9 13:25

  confirm: function (e) {
    var that = this
    that.setData({
      idx: e.currentTarget.dataset.idx,
    })
    console.log(that.data.idx)
    console.log('选择账户为：', that.data.validID[that.data.idx])

    var id = that.data.validID[that.data.idx]
    that.setData({
      userID: id
    })

    //向主页界面发送用户id
    wx.setStorage({
      key: "id",
      data: that.data.userID
    })

    wx.showToast({
      title: '验证通过',
      icon: 'success',
      duration: 500
    })

    wx.switchTab({
      url: '../mine/mine'
    })

  },






  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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