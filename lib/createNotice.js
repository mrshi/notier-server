const Notice = require('./../model/Notice.js');
const $15min = 1000 * 60 * 15;
const $1hour = $15min * 4;
const $1day = $1hour * 24;
// time, ticketId, type
module.exports = async function createNotice({_id, wx_type, sms_type, time}) {
  // 目前微信只支持提醒一次
  let wxoffset, snsoffset = [];
  switch (wx_type) {
    case 1:
      wxoffest = 0;
      break;
    case 2:
      wxoffest = $15min;
      break;
    case 4:
      wxoffest = $1hour;
      break;
    case 8:
      wxoffest = $1day;
  }
  if (wx_type) {
    // 添加微信提醒
    let wxnotice = new Notice({
      time: time - wxoffest,
      ticketId: _id,
      type: 1
    });
    await wxnotice.save();
  }
  // 短信提醒
  let tmpString = ("0000" + Number(sms_type).toString(2)).slice(-4);
  for(let i = tmpString.length - 1; i >= 0; i--) {
    if (Number(tmpString[i])) {
      switch (i) {
        case 0:
          snsoffset.push(time - $1day)
          break;
        case 1:
          snsoffset.push(time - $1hour)
          break;
        case 2:
          snsoffset.push(time - $15min)
          break;
        case 3:
          snsoffset.push(time)
          break;
      }
    }
  }
  for (time of snsoffset) {
    let snsnotice = new Notice({
      time: time,
      ticketId: _id,
      type: 2
    })
    await snsnotice.save();
  }
  return 1;
}
