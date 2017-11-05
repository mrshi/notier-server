const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ticketSchema = Schema({
    title: {
      type: String,
      default: '',
      trim: true
    },
    body: {
      type: String,
      default: '',
      trim: true
    },
    time: {
      type: String
    },
    // 微信提醒时间，二进制 0000,四位数分别代表提前1天，提前1小时，提前15分钟，当时
    wx_type: {
      type: Number,
      default: 0
    },
    // 短信提醒时间，二进制 0000,四位数分别代表提前1天，提前1小时，提前15分钟，当时
    sms_type: {
      type: Number,
      default: 0
    },
    noti_to: [{
      type: String,
      ref: 'User'
    }],
    isFinish: {
      type: Boolean,
      default: false
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    form_id: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    creator: {
      type: String,
      ref: 'User'
    },
    createdAt: {
      type: String,
      default : Date.now()
    }
});

ticketSchema.set('toObject', { getters: true });

module.exports = mongoose.model('Ticket', ticketSchema);
