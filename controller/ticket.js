const koaBody = require('koa-body');
const User = require('./../model/User.js');
const Ticket = require('./../model/Ticket.js');
const mongoose = require('mongoose');
const createNotice = require('./../lib/createNotice.js')
const formatTime = require('./../lib/formatTime.js')
const moment = require('moment');
moment.locale('zh-cn')

module.exports = [
  {
    url: '/ticket',
    method: 'GET',
    controller: async (ctx) => {
      // 查看提醒, 参数type = null, deprecated, comming, finished, notfinish, deleted
      // skip, limit 必选
      let {type, skip=0, limit=10} = ctx.query;
      let rst = [];
      if (skip < 0 || limit > 20 ) {
        return ctx.hbsResponse.json({status: 'illegal query'});
      }
      if (type == 'comming') {
        rst = await Ticket
          .find({
            creator: ctx.user,
            time: {
              "$gte": Date.now()
            },
            isDelete: false
          })
          .skip(Number(skip))
          .limit(Number(limit))
          .sort('time')
          .lean()
      } else if (type == 'deprecated') {
        rst = await Ticket
          .find({
            creator: ctx.user,
            time: {
              "$lte": Date.now()
            },
            isDelete: false
          })
          .skip(Number(skip))
          .limit(Number(limit))
          .sort('-time')
          .lean()
      } else if ((type == 'finished') || (type == 'notfinish')) {
        rst = await Ticket
          .find({
            creator: ctx.user,
            isFinish: type === 'finished',
            isDelete: false
          })
          .skip(Number(skip))
          .limit(Number(limit))
          .sort(type === 'finished' ? '-time' : 'time')
          .lean()
      } else if (type == 'deleted') {
        rst = await Ticket
          .find({
            creator: ctx.user,
            isDelete: true
          })
          .skip(Number(skip))
          .limit(Number(limit))
          .sort('-time')
          .lean()
      } else {
          rst = await Ticket
            .find({
              creator: ctx.user,
              isDelete: false
            })
            .skip(Number(skip))
            .limit(Number(limit))
            .sort('time')
            .lean()
      }

      ctx.hbsResponse.json({
        status: 'ok',
        data: rst.map(item => {
          let tmp = formatTime(Number(item.time));
          item.localetime = tmp.localetime;
          item.status = tmp.status; // true代表已经过期，false代表未过期
          return item;
        })
      })
    }
  },
  {
    url: '/ticket',
    method: 'DELETE',
    controller: async (ctx) => {
      // 删除提醒, 目前不支持批量
      let id = ctx.query.id;
      if (!id) return ctx.hbsResponse.json({status: 'illegal query'});
      try {
        let ticket = await Ticket
          .findOne({
            _id: id
          })
        if (!ticket.creator == ctx.user &&
           !ticket.noti_to.indexOf(ctx.user)) {
              throw Error('auth error')
        }
        ticket.isDelete = true;
        await ticket.save();
        ctx.hbsResponse.json({status: 'ok'})
      } catch (e) {
        ctx.hbsResponse.json({status: 'delete ticket error'})
      }
    }
  },
  {
    url: '/ticket',
    method: 'PUT',
    middleware: koaBody(),
    controller: async (ctx) => {
      // 修改提醒，（包括已完成），目前不支持批量, put方法body?
      let id = ctx.query.id;
      if (!id) return ctx.hbsResponse.json({status: 'illegal query'});
      try {
        let ticket = await Ticket
          .findOne({
            _id: id
          })
        if (!ticket.creator == ctx.user &&
           !ticket.noti_to.indexOf(ctx.user)) {
              throw Error('auth error')
        }
        Object.assign(ticket, ctx.request.body)
        await ticket.save();
        ctx.hbsResponse.json({ status: 'ok'})
      } catch (e) {
        ctx.hbsResponse.json({ status: 'change ticket error'})
      }
    }
  },
  {
    url: '/ticket',
    method: 'POST',
    middleware: koaBody(),
    controller: async (ctx) => {
      // request's Content-Type: application/json
      // 目前默认noti_to为用户本人
      // time为提醒时间 '2016-03-12 13:00:00'
      let {title, body, time, wx_type, sms_type, form_id} = ctx.request.body;
      let _id = new mongoose.mongo.ObjectId();
      let timestamp = +moment(time);
      // 创建提醒单据
      let newTicket = new Ticket({
        _id, title, body, wx_type, sms_type, form_id,
        time: timestamp,
        noti_to: [ctx.user],
        creator: ctx.user,
      })
      try {
        await newTicket.save();
        await createNotice({
          _id, wx_type, sms_type, time: timestamp
        });
        ctx.hbsResponse.json({
          status: 'ok'
        })
      } catch(e) {
        console.log(error)
        ctx.hbsResponse.json({
          status: 'error'
        })
      }
    }
  }
];
