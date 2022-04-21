const Room = require('../models/rooms')
const { PATH, httpStatusCode: statusCode } = require('../config')
const { errorHandler, successHandler, schemaErrorHandler } = require('../helper/responseHandler')

// 依條件取得房型資料
const getRoomsHandler = async (res, urlParser) => {
  const { query, splitUrl } = urlParser

  // 若有ID，則回傳該筆資料
  if (splitUrl.length === 2) {
    try {
      const room = await Room.findById(splitUrl[1]).exec()
      if (room) {
        successHandler(res, room)
      } else {
        errorHandler(res, statusCode.NOT_FOUND, '找不到該筆資料')
      }
    } catch (error) {
      console.error(error)
      errorHandler(res, statusCode.BAD_REQUEST, 'ID未填寫正確')
    }
  }
  // 若沒有ID，則須輸入頁碼及一頁幾筆
  else {
    if (!query.pageSize || !query.currentPage) {
      errorHandler(res, statusCode.BAD_REQUEST, '請輸入正確頁碼資訊')
      return
    } else {
      try {
        const rooms = await Room
          .find()
          .skip(query.pageSize * (query.currentPage - 1))
          .limit(query.pageSize)

        successHandler(
          res,
          rooms,
          `資料取得成功，目前為第 ${query.currentPage} 頁，顯示 ${query.pageSize} 筆`
        )
      } catch (error) {
        console.error(error)
        errorHandler(res, statusCode.BAD_REQUEST, '欄位未填寫正確')
      }
    }
  }
}

// 新增房型資料
const addNewRoomHandler = async (res, reqData) => {
  if (Object.keys(reqData).length !== 0) {
    try {
      const newRoom = await Room.create({
        name: reqData.name,
        price: reqData.price,
        rating: reqData.rating,
        payment: reqData.payment,
      })

      successHandler(res, newRoom, '新增成功')
    } catch (error) {
      console.error('TypeError: ', error)
      const errorMessage = schemaErrorHandler(error.errors)
      errorHandler(
        res,
        statusCode.BAD_REQUEST,
        errorMessage ? errorMessage : '欄位未填寫正確'
      )
    }
  } else {
    errorHandler(res, statusCode.BAD_REQUEST, '欄位不可為空')
  }
}

// 刪除所有房型資料、指定房型資料
const deleteRoomHandler = async (res, urlParser) => {
  const { pathname, splitUrl } = urlParser
  // 刪除全部
  if (pathname === PATH) {
    try {
      const data = await Room.deleteMany({})
      successHandler(
        res,
        [],
        {
          text: `刪除全部資料成功，總計刪除 ${data.deletedCount} 筆`,
          ...data
        }
      )
    } catch (error) {
      console.error(error)
      errorHandler(res, statusCode.INTERNAL_SERVER, '伺服器錯誤')
    }
  }
  // 刪除指定資料
  else if (splitUrl.length === 2) {
    try {
      const deleteData = await Room.findByIdAndDelete({ _id: splitUrl[1] })
      console.log('delete data: ', deleteData)
      successHandler(res, deleteData, `刪除一筆資料: ${deleteData.name}`)
    } catch (error) {
      console.error(error)
      errorHandler(res, statusCode.NOT_FOUND, '無此筆資料')
    }
  }
  else {
    errorHandler(res, statusCode.BAD_REQUEST, '欄位未填寫正確')
  }
}

// 更新指定資料
const updateRoomHandler = async (res, urlParser, reqData) => {
  const { splitUrl } = urlParser
  if (splitUrl.length === 2) {
    try {
      const updateData = await Room.findByIdAndUpdate(
        { _id: splitUrl[1] },
        reqData,
        { new: true }
      )
      successHandler(res, updateData, '更新成功')
    } catch (error) {
      console.error('TypeError: ', error)
      const errorMessage = schemaErrorHandler(error.errors)
      errorHandler(
        res,
        statusCode.BAD_REQUEST,
        errorMessage ? errorMessage : '欄位未填寫正確'
      )
    }
  } else {
    errorHandler(res, statusCode.BAD_REQUEST, '請輸入正確路徑')
  }
}

module.exports = {
  getRoomsHandler,
  addNewRoomHandler,
  deleteRoomHandler,
  updateRoomHandler,
}