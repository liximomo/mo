var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import './polyfills';

import Express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import createMiddleWare from './middleware/spec-to-controler';

var host = '0.0.0.0';
var defaultOption = {
  specs: 'specs',
  port: 9000,
  mount: '/'
};

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  var error = {
    data: err,
    error: true,
    message: err.message,
    trace: err.stack
  };
  return res.send(error);
}

function getLocalIpAddress() {
  var os = require('os');
  var ifaces = os.networkInterfaces();
  var ips = [];
  Object.keys(ifaces).forEach(function (ifname) {

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      ips.push(iface.address);
    });
  });
  return ips;
}

var getAvaliableAdress = function getAvaliableAdress(host) {
  var address = [host];
  if (~['0.0.0.0', 'localhost', '127.0.0.1'].indexOf(host)) {
    return ['localhost'].concat(getLocalIpAddress());
  }

  return address;
};

function startApp(userOption) {
  var option = _extends({}, defaultOption, userOption);

  var app = new Express();

  app.use(cors({
    'origin': function origin(_origin, cb) {
      return cb(null, true);
    },
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'allowedHeaders': ['Content-Type', 'TOKEN'],
    'credentials': true,
    'preflightContinue': false
  }));
  app.use(bodyParser());

  app.use(option.mount, createMiddleWare(option.specs));
  app.use(errorHandler);

  app.listen(option.port, host, function (error) {
    if (error) {
      throw error;
    }

    console.log('app is running on:');
    getAvaliableAdress(host).forEach(function (host) {
      console.log('  http://' + host + ':' + option.port);
    });
  });
}

// startApp();

module.exports = startApp;