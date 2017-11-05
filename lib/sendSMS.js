const request = require('request-promise');
const crypto = require('crypto');

const appid = '1400046548';
const appkey = 'f5bef570bced5133db6343de6517ec77';
const random = Math.floor(Math.random() * 99999);
const url = `https://yun.tim.qq.com/v5/tlssmssvr/sendsms?sdkappid=${appid}&random=${random}`
const time = Math.round(Date.now() / 1000);

function genSig({appkey, random, time, mobile}) {
  return crypto.createHash('sha256').update(`appkey=${appkey}&random=${random}&time=${time}&mobile=${mobile}`, 'utf-8').digest('hex');
}

module.exports = async function sendSMS (mobile, title, offest) {
  console.log(mobile, title, offest)
  let body = {
    "tel": {
        "nationcode": "86", //国家码
        "mobile": mobile //手机号码
    },
    type: "0",
    "msg": `您设置的提醒：【${title}】，还有【${offest}】到达指定时间，请尽快完成任务。`,
    "extend": "",
    "sig": genSig({appkey, random, time, mobile}), // 凭证
    "time": time + "", //unix时间戳，请求发起时间，如果和系统时间相差超过10分钟则会返回失败
    "ext": "" //用户的session内容，腾讯server回包中会原样返回，可选字段，不需要就填空。
  }

  let rst = await request({
    url: url,
    method: 'post',
    body: body,
    json: true
  })

  console.log(rst)
  return (rst.errmsg == 'ok');
}
