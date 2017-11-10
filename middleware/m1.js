'use strict';
const bypass = ['/getOpenid', '/', '/favicon.ico', '/robots.txt'];
const User = require('./../model/User.js');

module.exports = async function m1 (ctx, next) {
  console.log('go into ' + ctx.path);
  if (!bypass.includes(ctx.path)) {
    let user = await User.findOne({
      clientSession: ctx.headers.clientsession
    })
    ctx.user = user._id
  }
  await next();
}
