const App = require('./../model/App.js');
const request = require('request-promise');
const config = require('../config.js');

module.exports = async function getServerToken () {
  let token = await App.findOne({});
  // 如果距离过期还剩10分钟，也被认为是无效
  if (token && token.access_token.length > 0 && (token.expires - 600000) > Date.now()) {
    return token.access_token
  }
  let resp = await request({
    uri: 'https://api.weixin.qq.com/cgi-bin/token',
    qs: {
      grant_type: 'client_credential',
      appid: config.appid,
      secret: config.secret
    }
  });
  let {access_token, expires_in} = JSON.parse(resp);
  let expires = Date.now() + expires_in * 1000;
  if (token) {
    token.access_token = access_token;
    token.expires = expires;
    await token.save()
  } else {
    let newApp = new App({access_token, expires})
    await newApp.save()
  }
  return access_token;
}
