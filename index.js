const koa = require('koa-next');
const path = require('path');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let app = koa({
  watch: true,
  base: __dirname,
  path: {
    middleware: path.join(__dirname, 'middleware'),
    controller: path.join(__dirname, 'controller'),
    service: path.join(__dirname, 'service')
  },
  port: 8080,
  tplPath: path.join(__dirname, 'template'),
  middleware: async (ctx, next) => {
    console.log('out');
    await next();
  }
})

mongoose.connect('mongodb://localhost/test', { useMongoClient: true })
    .then(() => {
      require('./cock/index.js');
      app.start();
    })
    .catch(err => console.error(err));
