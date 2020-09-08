// pages/home/home.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:null,
    userInfo:null,
    hasUserInfo: false,
    dzList:[]
  },

  //获取用户openid
  get_openid(){
    let that = this
    //调用云函数
    wx.cloud.callFunction({
      name:"get_openid",
      success(res){
        //console.log('获取用户id成功',res.result.openid)
        that.setData({
          openid:res.result.openid
        })
      }
    })
  },

  //跳转到喜欢的页面
  goLikes(){
    wx.navigateTo({
      url: '/pages/likes/likes'
    })
  },

  //跳转到分享的页面
  goShares(){
    wx.navigateTo({
      url: '/pages/shares/shares'
    })
  },

  //授权登录
  login(e){
    let that = this
    if (app.globalData.userInfo != null) {
      this.get_openid()//获取openid
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } 
    else {
      this.get_openid()//获取openid
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        //授权成功
        success(res){
          app.globalData.userInfo = res.userInfo
          //弹出提示框
          wx.showToast({
            title:"授权成功！",
            icon:"success",
            duration:1500
          })

          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        //授权失败
        fail(res){
          //提示框
          wx.showToast({
            title:"授权失败！",
            image:"/pages/images/fail.png",
            duration:1500
          })
        }
      })
    }
  },

  //------------------------------------------！！！
  //授权后将用户信息保存到数据库
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    //检查是否已授权登录
    if (app.globalData.userInfo != null) {
      this.get_openid()//获取openid
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } 
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function()
    {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1500);
    
    let that = this

    //检查是否已授权登录
    if (app.globalData.userInfo != null) {
      this.get_openid()//获取openid
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})