const moment = require('moment');

function isToday (timestamp) {
  return new Date().toDateString() == new Date(timestamp).toDateString();
}

function isTomorrow (timestamp) {
  let today = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow.toDateString() == new Date(timestamp).toDateString();
}

function isAfterTomorrow (timestamp) {
  let today = new Date();
  let afterTomorrow = new Date();
  afterTomorrow.setDate(today.getDate() + 2);
  return afterTomorrow.toDateString() == new Date(timestamp).toDateString();
}

function isYesterday (timestamp) {
  let today = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() - 1);
  return tomorrow.toDateString() == new Date(timestamp).toDateString();
}

function getTime (timestamp) {
  return moment(timestamp).format("HH:mm")
}

function getDate (timestamp) {
  return moment(timestamp).format("MM月DD日")
}

function isDeprecated (timestamp) {
  return timestamp < Date.now()
}

module.exports = function formatTime (timestamp) {
  let localetime = '';
  if (isToday(timestamp)) {
    // 今天
    let now = Date.now()
    if ((timestamp < now) && (timestamp > now - (60 * 60 * 1000))) {
      // 前一小时
      localetime = Math.ceil((now - timestamp) / (60 * 1000)) + '分钟前';
    } else if ((timestamp > now) && (timestamp < now + (60 * 60 * 1000))) {
      // 后一小时
      localetime = Math.ceil((timestamp - now) / (60 * 1000)) + '分钟后';
    } else {
      localetime = '今天 ' + getTime(timestamp)
    }
  } else if (isTomorrow(timestamp)) {
    // 明天
    localetime = '明天 ' + getTime(timestamp)
  } else if (isAfterTomorrow(timestamp)) {
    // 后天
    localetime = '后天 ' + getTime(timestamp)
  } else if (isYesterday(timestamp)) {
    // 昨天
    localetime = '昨天 ' + getTime(timestamp);
  } else {
    localetime = getDate(timestamp) + ' ' + getTime(timestamp)
  }
  return {
    localetime, status: isDeprecated(timestamp)
  }
}
