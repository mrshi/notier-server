'use strict';

module.exports = async function m2 (ctx, next) {
  // console.log('come into m2.js middleware');
  await next();
}
