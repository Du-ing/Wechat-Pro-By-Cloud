const DB = wx.cloud.database().collection('duanzi')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dzList:[],
    page:1,
    class_list:[],//点赞情况列表
    up_list:[],//点赞数列表
    share_list:[]//转发数列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDuanzi()
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
    //刷新数据
    this.setData({
      dzList:[],
      page:this.data.page+1
    })
    this.getDuanzi()
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (event) {
    //请求页面+1
    this.setData({
      page:this.data.page+1
    })
    //调用请求
    this.getDuanzi()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //请求段子数据
  getDuanzi(){
    let that = this
    let dzs = this.data.dzList
    let page = this.data.page
    let flags = this.data.class_list
    let ups = this.data.up_list
    //云函数调用 
    wx.cloud.callFunction({
      name:"getDuanzi",
      data:{page:page},
      success:function(res){
        console.log("查询成功！",res.result.data[0])
        let items = res.result.data[0].items//响应获取的数据
        for(let i=0;i<items.length;i++){
          dzs.push(items[i])
          flags.push("heart")
          ups.push(items[i].votes.up)
        }
  
        that.setData({
          dzList:dzs,
          class_list:flags,
          up_list:ups
        })
      }
    })

    //云数据库调用
    //DB.where({
    //  page:page
    //}).get({})
  },

  //点赞
  clickHeart(event) {
    let index = event.currentTarget.dataset.index //获取点击的元素的标识
    let list = this.data.class_list
    let ups = this.data.up_list

    //点赞
    if(list[index] == 'heart') {
      list[index] = 'heart-active'
      ups[index]++
      this.setData({
        class_list: list,
        up_list:ups
      })

      //主页加入点赞的项
      if(app.globalData.userInfo != null){
        let page1 = this.data.page
        
        console.log(page1,"============",index)
        app.globalData.like.push({
          type:"duanzi",
          page:page1,
          index:index
        })
      }
    } 
    //取消点赞
    else if(list[index] == 'heart-active') {
      list[index] = 'heart'
      ups[index]--
      this.setData({
        class_list: list,
        up_list:ups
      })
      setTimeout(() => {
        this.setData({
          class_list: list,
          up_list:ups
        })
      }, 200);
      //主页取消点赞的项
      if(app.globalData.userInfo != null){
        let page1 = this.data.page
        
        console.log(page1,"============",index)

        let like_list = app.globalData.like
        for(let i=0;i<like_list.length;i++){
          if(like_list[i].page == page1 && like_list[i].index == index){
            app.globalData.like.splice(i,1)
          }
        }
      }
    }
  },

  //转发
  clickShare(event) {
    let index = event.currentTarget.dataset.index //获取点击的元素的标识

    //主页加入转发的项
    if(app.globalData.userInfo != null){
      let page1 = this.data.page
      
      console.log(page1,"============",index)
      app.globalData.share.push({
        type:"duanzi",
        page:page1,
        index:index
      })
    }
  },

  //跳转到个人主页
  goHome(){
    wx.navigateTo({
      url:"/pages/home/home"
    })
  },


})