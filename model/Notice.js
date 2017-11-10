const mongoose = require('mongoose');
var noticeSchema = mongoose.Schema({
  // 提醒时间
  time: {
    type: String,
    index: true
  },
  ticketId: {
    type: String,
    default: '',
    index: true
  },
  // 提醒类型 1,微信；2短信..
  type: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Notice', noticeSchema);
