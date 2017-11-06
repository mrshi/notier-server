async function noticer() {
  const Notice = require('./../model/Notice.js');
  const Ticket = require('./../model/Ticket.js');
  const User = require('./../model/User.js');
  const moment = require('moment');
  moment.locale('zh-cn')
  const sendWXMessage = require('./../lib/sendWXMessage.js');
  const tplId = 'ZUxbqNKaCyPdZESZGEIkC2Da0PeJIYJEb3c-L8sCsyQ';
  const sendSMS = require('./../lib/sendSMS.js');
  let now = Date.now();
  let notices = await Notice.find({
    time: {
      $gt: now - 30000,
      $lt: now + 30000,
    }
  });
  console.log('will send these:')
  console.log(notices)
  for (notice of notices) {
    let {time, ticketId, type} = notice;
    let ticket = await Ticket.findOne({_id: ticketId});
    let localeTime = new Date(Number(ticket.time)).toLocaleString();
    let timeoffset = require('./../lib/formatTime.js')(Number(ticket.time)).localetime;
    if (type == 1) {
      // 微信提醒
      await sendWXMessage({
        openid: ticket.creator, //目前只支持给自己进行提醒
        templateid: tplId,
        form_id: ticket.form_id,
        data: {
          // 主题
          keyword1: {
            value: `${ticket.title}`,
            color: '#09BB07'
          },
          // 时间
          keyword2: {
            value: `${timeoffset}(${localeTime})`,
            color: '#e64340'
          },
          // 地点
          keyword3: {
            value: ticket.location,
            color: '#353535'
          },
          // 描述
          keyword4: {
            value: ticket.body,
            color: '#888888'
          },
        }
      })
    } else if (type == 2) {
      // 短信提醒, 目前仅支持给自己提醒
      let {mobile} = await User.findOne({
        _id: ticket.creator
      });
      if (mobile && mobile.length == 11) {
        await sendSMS(mobile, ticket.title, timeoffset);
      }
    }
    // 清空这个notice
    await notice.remove();
  }
}
// 30秒执行一次的提醒器，提醒当前30秒前后的提醒
setInterval(noticer, 30000);
