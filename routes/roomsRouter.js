const url = require('url')
const isRouteError = require('../helper/checkRouteError')
const { PATH, httpStatusCode: statusCode } = require('../config')
const { errorHandler, successHandler } = require('../helper/responseHandler')
const {
  getRoomsHandler,
  addNewRoomHandler,
  deleteRoomHandler,
  updateRoomHandler,
} = require('../controllers/roomsController')
const { getRequestBody } = require('../helper/utils')

// Router
const routerHandler = async (req, res) => {
  const { pathname, query } = url.parse(req.url, true)
  const splitUrl = pathname.split('/').filter(e => e)
  const urlParser = {
    pathname,
    query,
    splitUrl
  }
  console.log('url parser: ', urlParser)

  if (isRouteError(req, PATH)) {
    errorHandler(res, statusCode.NOT_FOUND, '請求路徑錯誤')
  }

  // 帶 body 的請求
  let reqData = null
  try {
    const body = await getRequestBody(req)
    if (body) reqData = JSON.parse(body)
    console.log('reqData: ', reqData)
  } catch (error) {
    errorHandler(res, statusCode.BAD_REQUEST, '欄位未填寫正確')
  }

  switch (req.method) {
    case 'GET':
      getRoomsHandler(res, urlParser)
      break

    case 'POST':
      addNewRoomHandler(res, reqData)
      break

    case 'DELETE':
      deleteRoomHandler(res, urlParser)
      break

    case 'PATCH':
      updateRoomHandler(res, urlParser, reqData)
      break

    case 'OPTIONS':
      successHandler(res)
      break

    default:
      errorHandler(res, statusCode.NOT_FOUND, '請求路徑錯誤')
      break
  }
}

module.exports = routerHandler