const koaBody = require('koa-body');
const User = require('./../model/User.js');

module.exports = [
  // 修改user信息
  {
    url: '/user',
    method: 'PUT',
    middleware: koaBody(),
    controller: async (ctx) => {
      try {
        let info = ctx.request.body.userInfo;
        await User.findOneAndUpdate({ _id: ctx.user }, info);
        ctx.hbsResponse.json({status: 'ok'})
      } catch (e) {
        ctx.hbsResponse.josn({status: 'update user error'});
        console.error(e)
      }
    }
  },
  {
    url: '/user',
    method: 'GET',
    controller: async (ctx) => {
      try {
        let user = await User.findOne({_id: ctx.user});
        if (user) {
          delete user._id,
          delete user.session_key;
          ctx.hbsResponse.json({status: 'ok', user})
        }
      } catch (e) {
        ctx.hbsResponse.json({status: 'get user info error'});
        console.error(e)
      }
    }
  }
]
