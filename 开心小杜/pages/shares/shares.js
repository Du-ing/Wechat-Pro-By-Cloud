const DB = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareList:[],
    page:1

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDuanzi()

    wx.cloud.callFunction({
      name:"getDuanzi",
      success(res){
        console.log("云函数",res)
      }
    })
  },

  //请求段子数据
  getDuanzi(){
    let that = this
    let shares = app.globalData.share
    let share_list = []

    for(let i=0;i<shares.length;i++){
      let type = shares[i].type
      let index  = shares[i].index
      let page = shares[i].page

      if(type == "duanzi"){
        //云函数调用
        wx.cloud.callFunction({
          name:"getDuanzi",
          data:{page:page},
          success:function(res){
            console.log("share页面查询duanzi成功！",res.result.data[0])
            let items = res.result.data[0].items//响应获取的数据

            share_list.push(items[index])
            that.setData({
              shareList:share_list
            })
          }
        })
      }
      else{
        //云函数调用
        wx.cloud.callFunction({
          name:"getImage",
          data:{page:page},
          success:function(res){
            console.log("share页面查询image成功！",res.result.data[0])
            let items = res.result.data[0].items//响应获取的数据

            share_list.push(items[index])
            that.setData({
              shareList:share_list
            })
          }
        })
      }
    }
  },

})