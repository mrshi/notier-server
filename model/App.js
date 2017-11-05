const mongoose = require('mongoose');
var appSchema = mongoose.Schema({
  access_token: {
    type: String,
    default: ''
  },
  // 过期时间戳
  expires: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('App', appSchema);
