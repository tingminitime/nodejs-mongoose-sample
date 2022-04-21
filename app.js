const http = require('http')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const routerHandler = require('./routes/roomsRouter')
const PORT = process.env.PORT || '8080'

dotenv.config({ path: './config.env' })
console.log(process.env.PORT)


// mongoDB 連線設定
// const mongoDB = 'mongodb://localhost:27017/hotel'
// const mongoDB = 'mongodb+srv://tim:asd123@cluster0.7k7fr.mongodb.net/hotel?retryWrites=true&w=majority'
const mongoDB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)
const options = {
  serverSelectionTimeoutMS: 5000,
}

// mongoDB 連線
mongoose.connect(mongoDB, options)
  .then(() => {
    console.log('資料庫連線成功')
  })
  .catch(error => console.error(error))

const server = http.createServer(routerHandler)
server.listen(PORT, console.log(`Server is running at PORT ${PORT} ...`))