let getServerToken = require('./getServerToken.js');
const request = require('request-promise');

module.exports = async function sendWXMessage(opts) {
  let serverToken = await getServerToken();
  /**
   * body示例
   */
  // {
  //   "touser": "OPENID",
  //   "template_id": "TEMPLATE_ID",
  //   "page": "index",
  //   "form_id": "FORMID",
  //   "data": {
  //       "keyword1": {
  //           "value": "339208499",
  //           "color": "#173177"
  //       },
  //       "keyword2": {
  //           "value": "2015年01月05日 12:30",
  //           "color": "#173177"
  //       },
  //       "keyword3": {
  //           "value": "粤海喜来登酒店",
  //           "color": "#173177"
  //       } ,
  //       "keyword4": {
  //           "value": "广州市天河区天河路208号",
  //           "color": "#173177"
  //       }
  //   },
  //   "emphasis_keyword": "keyword1.DATA"
  // }
  console.log(opts.form_id)
  let {errcode, errmsg} = await request({
    uri: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send',
    method: 'POST',
    qs: {
      access_token: serverToken
    },
    body: {
      touser: opts.openid,
      template_id: opts.templateid,
      page: opts.redirect,
      form_id: opts.form_id || opts.prepay_id,
      data: opts.data,
      color: opts.color,
      emphasis_keyword: opts.isEmphasis
    },
    json: true
  })
  return !errcode;
}
