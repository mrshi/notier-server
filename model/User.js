const mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    _id: {
      type: String, //openid
      default: ''
    },
    nickName: {
      type: String,
      default: ''
    },
    gender: {
      type: Number
    },
    language: {
      type: String
    },
    city: {
      type: String
    },
    province: {
      type: String
    },
    country: {
      type: String
    },
    avatarUrl: {
      type: String
    },
    phone: {
      type: String
    },
    session_key: {
      type: String,
      default: ''
    },
    mobile: {
      type: String
    },
    unionid: {
      type: String,
      default: ''
    },
    clientSession: {
      type: String,
      default: '',
      index: true
    },
    createdAt: {
      type: String
    }
});

module.exports = mongoose.model('User', userSchema);
