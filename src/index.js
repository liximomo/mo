const Express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const { createMiddleWare } = require('./middleware/spec-to-controler');

const host = '0.0.0.0';
const defaultOption = {
  specs: 'specs',
  port: 9000,
  mount: '/',
};

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const error = {
    data: err,
    error: true,
    message: err.message,
    trace: err.stack,
  };
  return res.send(error);
}

function getLocalIpAddress() {
  const os = require('os');
  const ifaces = os.networkInterfaces();
  const ips = [];
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

const getAvaliableAdress = host => {
  const address = [host];
  if (~['0.0.0.0', 'localhost', '127.0.0.1'].indexOf(host)) {
    return ['localhost'].concat(getLocalIpAddress());
  }

  return address;
};

function startApp(userOption) {
  const option = {
    ...defaultOption,
    userOption,
  };

  const app = new Express();
  
  app.use(cors({
    'origin': (origin, cb) => {
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
  
  app.listen(option.port, host, (error) => {
    if (error) {
      throw error;
    }

    console.log('app is running on:');
    getAvaliableAdress(host).forEach(host => {
      console.log(`  http://${host}:${option.port}`);
    });
  });
}

// startApp();

module.exports = startApp;
