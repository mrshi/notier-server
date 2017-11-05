'use strict';
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
let cache = {};

module.exports = function (ctx) {
  return {
    render(data, tplName) {
      if (!ctx.config.tplPath || !tplName) {
        ctx.body = 'cannot find correct tpl';
        return;
      }
      let p = path.join(ctx.config.tplPath, tplName);
      let template = cache[p];
      if (!template || ctx.watch) {
        template = cache[p] = Handlebars.compile(fs.readFileSync(p, 'utf8'));
      }
      ctx.body = template(data);
    },
    json(data) {
      ctx.type = 'application/json';
      ctx.body = JSON.stringify(data, null, 2);
    },
    jsonp(data, callback="__callback__") {
      ctx.type = 'application/javascript';
      ctx.body = `${callback}(${JSON.stringify(data)})`
    }
  };
};