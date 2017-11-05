'use strict';

module.exports = async function m3 (ctx, next) {
  console.log('come into m3.js middleware');
  await next();
}