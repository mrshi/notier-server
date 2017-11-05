const request = require('request-promise');
const User = require('./../model/User.js');
const md5 = require('md5');
const config = require('../config.js');

module.exports = [
  {
    url: '/getOpenid',
    method: 'get',
    controller: async (ctx) => {
      try {
        let {openid, session_key} = await request({
          uri: 'https://api.weixin.qq.com/sns/jscode2session',
          qs: {
            appid: config.appid,
            secret: config.secret,
            js_code: ctx.query.code,
            grant_type: 'authorization_code'
          },
          json: true
        });
        let user = await User.findOne({
          _id: openid
        });
        let clientSession = md5(session_key + openid + 'sunxxdage');
        if (user) {
          // 老用户，更新session_key, clientSession
          user.session_key = session_key;
          user.clientSession = clientSession;
          await user.save();
        } else {
          // 新用户
          let newUser = new User({
            _id: openid,
            session_key: session_key,
            clientSession: clientSession,
            createdAt: Date.now()
          })
          await newUser.save();
        }
        ctx.hbsResponse.json({status: 'ok', data: {
          clientSession: clientSession,
          openid: openid
        }})
      } catch (e) {
        console.log(e)
        ctx.hbsResponse.json({status: 'oauth2 error'})
      }
    }
  }
];
