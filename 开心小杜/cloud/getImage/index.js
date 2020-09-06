// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const DB = cloud.database().collection("image")

  return DB.where({
    page:event.page
  }).get()
}