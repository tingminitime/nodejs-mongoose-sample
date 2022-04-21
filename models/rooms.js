const mongoose = require('mongoose')
const { Schema } = mongoose

const schemaOptions = {
  collection: 'rooms',
  versionKey: false,
}

const roomSchema = new Schema({
  name: {
    type: String,
    required: [true, '房型名稱必填']
  },
  price: {
    type: Number,
    required: [true, '價格必填'],
  },
  rating: {
    type: Number,
    default: 0,
  },
  payment: {
    type: [String],
    default: undefined,
    required: [true, '付款方式必填']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  }
}, schemaOptions)

const Room = mongoose.model('rooms', roomSchema)

module.exports = Room
