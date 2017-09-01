function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { URL } from 'url';
import typeToJsonSchema, { parseType } from './type';

function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
}

function getLevel(str) {
  var LEVEL_INTENT = '  ';
  var level = 0;
  while (str.startsWith(LEVEL_INTENT)) {
    level += 1;
    str = str.slice(LEVEL_INTENT.length);
  }
  return level;
}

function getQuery($table) {
  var rows = $table.find('tbody tr');
  var rowArray = toArray(rows);
  var typeList = [];
  var rawKeys = [];

  rowArray.forEach(function (row) {
    var $row = $(row);
    var $key = $row.find('td:nth-child(1)');
    var isOption = $key.find('.label-optional').length > 0;
    var typeString = $row.find('td:nth-child(2)').text().trim();
    var type = parseType(typeString);
    type.meta.required = !isOption;
    typeList.push(type);

    $key.find('span').remove('span');
    var key = $key.text().trimRight();
    rawKeys.push(key);
  });

  // console.log(inspect(typeList, { depth: 5 }));
  // console.log(inspect(rawKeys, { depth: 5 }));

  var keyTree = {
    root: true,
    type: 'object',
    properties: {}
  };

  var parents = {
    '-1': keyTree
  };
  rawKeys.forEach(function (rawkey, index) {
    var level = getLevel(rawkey);
    var keyInfo = {};
    var keyName = rawkey.trim();

    parents[level] = keyInfo;
    // if (level < lastLevel) {
    //   console.log('pop', lastkey);
    //   parents.pop();
    // };

    keyInfo.properties = {};
    keyInfo.level = level;
    Object.assign(keyInfo, typeList[index]);
    // keyInfo.type = typeList[index];

    var parent = parents[level - 1];
    parent.properties[keyName] = keyInfo;
  });

  return typeToJsonSchema(keyTree);
  // console.log(inspect(schema, { depth: 10 }));
}

function getBlockInfo($blockTtitle) {
  var titleText = $blockTtitle.text().trim();
  var $table = $blockTtitle.next();
  var payload = void 0;
  var type = void 0;
  switch (titleText) {
    case '请求参数':
      {
        type = 'query';
        payload = getQuery($table);
        break;
      }
    case 'Success 200':
    case '响应结果':
      {
        type = 'respond';
        payload = getQuery($table);
        break;
      }
    default:
    // do nothing
  }

  return {
    type: type,
    payload: payload
  };
}

function domToApiInfo($el) {
  var info = {};
  info.method = $el.find('.type').text().trim();
  var apiUrl = $el.find('[data-type="' + info.method + '"] .pln').text().trim();
  var url = new URL(apiUrl);

  info.api = url.pathname;
  var blockTitles = $el.find('h2');
  blockTitles.each(function (_, el) {
    var block = getBlockInfo($(el));
    info[block.type] = block.payload;
  });

  return info;
}

var $ = void 0;
export default (function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
    var browser, page, html, apiRootEls, infos;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return puppeteer.launch();

          case 2:
            browser = _context.sent;
            _context.next = 5;
            return browser.newPage();

          case 5:
            page = _context.sent;
            _context.next = 8;
            return page.goto(url);

          case 8:
            _context.next = 10;
            return page.waitForSelector('section[id^="api-"]');

          case 10:
            _context.next = 12;
            return page.content();

          case 12:
            html = _context.sent;

            browser.close();

            $ = cheerio.load(html);
            apiRootEls = $('div[id^="api-"]');
            infos = [];

            try {
              infos = toArray(apiRootEls).map(function (el) {
                return domToApiInfo($(el));
              });
            } catch (error) {
              console.error(error);
            }

            return _context.abrupt('return', infos);

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function getJsonSchema(_x) {
    return _ref.apply(this, arguments);
  }

  return getJsonSchema;
})();