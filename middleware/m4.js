'use strict';

module.exports = async function m4 (ctx, next) {
  // console.log('come into m4.js middleware');
  await next();
}
