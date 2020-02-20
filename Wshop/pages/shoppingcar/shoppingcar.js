// pages/shoppingcar/shoppingcar.js


// 界面：购物车
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:14


var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAllSelect: false,
    totalMoney: 0,
    time:'',
    id:'',
    hascart:false,

    scart:[],


    startX: 0, //开始坐标
    startY: 0,

    
    carts:[]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //接收登录界面传来的用户ID信息，用于请求匹配
    var sid = wx.getStorageSync('id');
    this.setData({
      id: sid,
    })
    this.setData({
      isAllSelect: false
    })
    
    //请求数据
    this.getdata();

    this.getTotalPrice();
  },




// 函数：监听触摸事件
// 作用：监听用户触摸商品模块时间
// 作者：唐珞鑫
// 最后更新时间：2019.9.10 16:14
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.carts.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      carts: this.data.carts
    })
  },




  // 函数：滑动事件处理
  // 作用：监听用户滑动时间，并进行处理，显示出动态效果和删除按钮
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.10 16:14
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    that.data.carts.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      carts: that.data.carts
    })
  },




  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.10 16:14
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },




  // 函数：删除事件
  // 作用：监听用户点击事件，删除购物车内单个商品
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:14
  del: function (e) {
    
    var str = e.currentTarget.dataset.gid;
    
    let cart = this.data.carts; // 获取购物车列表
    var scart = [];

    if (true) {
      var that = this;
      wx.showModal({
        title: '确定将宝贝删除',

        cancelText: "我再想想", //默认是“取消”
        confirmText: "删除", //默认是“确定”
      
        success: function (res) {
          if (res.confirm) {
         
            for (let i = 0, j = 0; i < cart.length; i++) { // 循环列表得到每个数据
              if (cart[i].gid == str) { // 判断选中才将内容填入发送给后台的表里
                var obj = {};
                // obj.title = cart[i].title;
                obj.gid = cart[i].gid;
                obj.price = cart[i].price;
                obj.quantity = cart[i].quantity;
                scart.push(obj);
                j++;
              }
            }
            
            console.log(scart)

            wx.request({

              url: 'http://139.217.130.233/cartdelete',//请求地址
              data: {//发送给后台的数据
                id: JSON.stringify(that.data.id),
                scart: JSON.stringify(scart),
              },
              header: {//请求头
                'content-type': 'application/x-www-form-urlencoded',
                'chartset': 'utf-8'
              },
              method: "POST",//get为默认方法/POST
              success: function (res) {
                console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
                if (res.data == '删除成功') {
                  wx.showToast({

                    title: '成功删除',

                    icon: 'none',

                    duration: 2000

                  })
                  that.getdata();
                  that.setData({
                    isAllSelect: false,
                    totalMoney: 0
                  }); // 重新获取总价
                }

              },
              fail: function (err) { },//请求失败
              complete: function () { }//请求完成后执行的函数
            })


          } else {

          }

        }
      })

    } else {
 
    }

    
  },




//  函数：获取数据函数
//  作用：获取后台传输的购物车内商品数据，渲染界面
//  作者：唐珞鑫
// 最后更新时间：2019.9.1 13:14
  getdata: function () {
    var that = this;
    
    wx.request({
      
      url: 'http://139.217.130.233/shoppingcart',//请求地址
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
        that.setData({

          carts: res.data

        })
        if (res.data!='空'){
          that.setData({

            hascart: true

          })
          
        }else{
          that.setData({
            hascart:false

          })
        }

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },



  

  // 函数：选择商品函数
  // 作用：监听点击事件，改变商品选中状态
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:14
  switchSelect: function (e) {
    const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
    let carts = this.data.carts; // 获取购物车列表
    let selectNum = 0; //统计选中商品
    const isSelect = carts[index].isSelect; // 获取当前商品的选中状态
    carts[index].isSelect = !isSelect; // 改变状态
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].isSelect) {
        selectNum++
      }
    }
    if (selectNum == carts.length) {
      this.setData({
        isAllSelect: true
      })
    } else {
      this.setData({
        isAllSelect: false
      })
    }
    this.setData({
      carts: carts
    })
    this.getTotalPrice()
  },




  // 函数：商品增加或减少
  // 作用：监听点击事件，改变商品数量，对错误操作进行提示反馈，并向后端发送数据
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:14
  quantityChange(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let quantity = carts[index].quantity;
    if (e.target.id == 'sub') {
      if (quantity <= 1) {
        wx.showToast({

          title: '宝贝不能再减少了哦',

          icon: 'none',

          duration: 2000

        })
        return}
      quantity -= 1
    } else if (e.target.id == 'add') {
      if (carts[index].max > carts[index].quantity){
      quantity += 1}
      else{
        wx.showToast({

          title: '超过最大库存',

          icon: 'none',

          duration: 2000

        })
      }
    }
    carts[index].quantity = quantity
    this.setData({
      carts: carts
    })
    this.getTotalPrice();

    var gid = e.currentTarget.dataset.gid;
    console.log(gid);

    var that = this;
   
    wx.request({

      url: 'http://139.217.130.233/cartchange',//请求地址
      data: {//发送给后台的数据
        id: JSON.stringify(that.data.id),
        gid: JSON.stringify(gid),
        quantity: JSON.stringify(quantity),
      },
      header: {//请求头
        'content-type': 'application/x-www-form-urlencoded',
        'chartset': 'utf-8'
      },
      method: "POST",//get为默认方法/POST
      success: function (res) {
        console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
        if (res.data == '修改成功') {

        } else  {
         
        }

      }
    })

  },


  bindManual: function (e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let quantity = carts[index].quantity;
    var num = e.detail.value;
    // 将数值与状态写回
    if (num < 1)
      wx.showModal({
        content: '请至少加入一件商品',
      })
    if (num > carts[index].max)
      wx.showModal({
        content: '库存不足',
      })
   
    carts[index].quantity = num
    this.setData({
      carts: carts
    })
    this.getTotalPrice()
  },




  // 函数：计算总价函数
  // 作用：计算选中商品总价
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:14
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].isSelect) { // 判断选中才会计算价格
        total += carts[i].quantity * carts[i].price; // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalMoney: total.toFixed(1)
    });
  },




  // 函数：商品全选
  // 作用：监听点击事件，确定商品全选状态
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:14
  selectAll(e) {
    let isAllSelect = this.data.isAllSelect; // 是否全选状态
    isAllSelect = !isAllSelect;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].isSelect = isAllSelect; // 改变所有商品状态
    }
    this.setData({
      isAllSelect: isAllSelect,
      carts: carts
    });
    this.getTotalPrice(); // 重新获取总价
  },




  //函数：结账
  // 作用：结算购物车类商品，并向后端发送数据
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:14
  settle:function(e){
    let cart = this.data.carts; // 获取购物车列表
    
    var scart=[];
    if (this.data.totalMoney!=0){
      for (let i = 0, j = 0; i < cart.length; i++) { // 循环列表得到每个数据
        if (cart[i].isSelect) { // 判断选中才将内容填入发送给后台的表里
          var obj={};
          // obj.title = cart[i].title;
          obj.gid = cart[i].gid;
          obj.price = cart[i].price;
          obj.quantity = cart[i].quantity;
          scart.push(obj);
          j++;
        }
      }
      this.setData({
        scart:scart,
      })

      // 调用函数时，传入new Date()参数，返回值是日期和时间
      var time = util.formatTime(new Date());
      // 再通过setData更改Page()里面的data，动态更新页面的数据
      this.setData({
        time: time
      });

      var that = this;
      
      wx.request({
       
        url: 'http://139.217.130.233/cartsettle',//请求地址
        data: {//发送给后台的数据
          id: JSON.stringify(this.data.id),
          time: JSON.stringify(this.data.time),
          scart: JSON.stringify(scart),
        },
        header: {//请求头
          'content-type': 'application/x-www-form-urlencoded',
          'chartset': 'utf-8'
        },
        method: "POST",//get为默认方法/POST
        success: function (res) {
          console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
          if (res.data == '结算成功'){
            wx.showToast({

              title: '成功结算',

              icon: 'none',

              duration: 2000

            })

           
          }else if(res.data=='库存不足'){
            wx.showToast({

              title: '库存不足',

              icon: 'none',

              duration: 2000

            })
          }
          that.getdata(); 
          that.setData({ 
            isAllSelect: false,
            totalMoney: 0
          }); // 重新获取总价

        },
        fail: function (err) { },//请求失败
        complete: function () { }//请求完成后执行的函数
      })
      
   

    }else{
      wx.showToast({

        title: '您尚未选择商品',

        icon: 'none',

        duration: 2000

      })
    }
    

    console.log(this.data.scart);
    console.log(this.data.time);

  },





  //函数：删除物品
  // 作用：监听用户点击事件，批量删除选中商品
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:14
  deletegood:function(e){
    let cart = this.data.carts; // 获取购物车列表
    var scart = [];

    if (this.data.totalMoney != 0) {
      var that = this;
      wx.showModal({
        title: '确定将宝贝删除',
      
        cancelText: "我再想想", //默认是“取消”
        confirmText: "删除", //默认是“确定”
        success: function (res) {
          if (res.confirm) {
            for (let i = 0, j = 0; i < cart.length; i++) { // 循环列表得到每个数据
              if (cart[i].isSelect) { // 判断选中才将内容填入发送给后台的表里
                var obj = {};
                // obj.title = cart[i].title;
                obj.gid = cart[i].gid;
                obj.price = cart[i].price;
                obj.quantity = cart[i].quantity;
                scart.push(obj);
                j++;
              }
            }
            console.log(scart)
           
            wx.request({

              url: 'http://139.217.130.233/cartdelete',//请求地址
              data: {//发送给后台的数据
                id: JSON.stringify(that.data.id),
                scart: JSON.stringify(scart),
              },
              header: {//请求头
                'content-type': 'application/x-www-form-urlencoded',
                'chartset': 'utf-8'
              },
              method: "POST",//get为默认方法/POST
              success: function (res) {
                console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
                if (res.data == '删除成功') {
                  wx.showToast({

                    title: '成功删除',

                    icon: 'none',

                    duration: 2000

                  })
                  that.getdata();
                  that.setData({
                    isAllSelect: false,
                    totalMoney: 0
                  }); // 重新获取总价
                }

              },
              fail: function (err) { },//请求失败
              complete: function () { }//请求完成后执行的函数
            })

          } else {
           
          }

        }
      })
     
    } else {
      wx.showToast({

        title: '您尚未选择商品',

        icon: 'none',

        duration: 2000

      })
    }

  },




  // 函数：前往商品详情
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:14
  goDet:function(e){
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




  // 函数：前往商城
  // 作者：唐珞鑫
  // 最后更新时间：2019.9.1 13:14
  goshop: function (e){
    wx.switchTab({
      url: '../shop/shop'
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getdata();

    this.setData({
     isAllSelect:false
    })

  }
})