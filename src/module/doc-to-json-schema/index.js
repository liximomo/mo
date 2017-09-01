import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { URL } from 'url';
import typeToJsonSchema, { parseType } from './type';

function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
}

function getLevel(str) {
  const LEVEL_INTENT = '  ';
  let level = 0;
  while (str.startsWith(LEVEL_INTENT)) {
    level += 1;
    str = str.slice(LEVEL_INTENT.length);
  }
  return level;
}

function getQuery($table) {
  const rows = $table.find('tbody tr');
  const rowArray = toArray(rows);
  const typeList = [];
  const rawKeys = [];
  
  rowArray.forEach(row => {
    const $row = $(row);
    const $key = $row.find('td:nth-child(1)');
    const isOption = $key.find('.label-optional').length > 0;
    const typeString = $row.find('td:nth-child(2)').text().trim();
    const type = parseType(typeString);
    type.meta.required = !isOption;
    typeList.push(type);
    
    $key.find('span').remove('span');
    const key = $key.text().trimRight();
    rawKeys.push(key);
  });

  // console.log(inspect(typeList, { depth: 5 }));
  // console.log(inspect(rawKeys, { depth: 5 }));

  const keyTree = {
    root: true,
    type: 'object',
    properties: {},
  };

  let parents = {
    '-1': keyTree,
  };
  rawKeys.forEach((rawkey, index) => {
    const level = getLevel(rawkey);
    const keyInfo = {};
    const keyName = rawkey.trim();

    parents[level] = keyInfo;
    // if (level < lastLevel) {
    //   console.log('pop', lastkey);
    //   parents.pop();
    // };

    keyInfo.properties = {};
    keyInfo.level = level;
    Object.assign(keyInfo, typeList[index]);
    // keyInfo.type = typeList[index];

    const parent = parents[level - 1];
    parent.properties[keyName] = keyInfo;
  });

  return typeToJsonSchema(keyTree);
  // console.log(inspect(schema, { depth: 10 }));
}

function getBlockInfo($blockTtitle) {
  const titleText = $blockTtitle.text().trim();
  const $table = $blockTtitle.next();
  let payload;
  let type;
  switch (titleText) {
    case '请求参数': {
      type = 'query';
      payload = getQuery($table);
      break;
    }
    case 'Success 200':
    case '响应结果': {
      type = 'respond';
      payload = getQuery($table);
      break;
    }
    default:
     // do nothing
  }

  return {
    type,
    payload,
  };
}

function domToApiInfo($el) {
  const info = {};
  info.method = $el.find('.type').text().trim();
  const apiUrl = $el.find(`[data-type="${info.method}"] .pln`).text().trim();
  const url = new URL(apiUrl);
  
  info.api = url.pathname;
  const blockTitles = $el.find('h2');
  blockTitles.each((_, el) => {
    const block = getBlockInfo($(el));
    info[block.type] = block.payload;
  });
 
  return info;
}

let $;
export default async function getJsonSchema(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  // await page.goto('http://wiki.lanyicj.cn/apidoc/lanyife/wiki/');
  await page.waitForSelector('section[id^="api-"]');
  // await page.waitForSelector('section[id="api-ver-verswitch"]');

  const html = await page.content();
  browser.close();

  $ = cheerio.load(html);
  const apiRootEls = $('div[id^="api-"]');

  let infos = [];
  try {
    infos = toArray(apiRootEls).map((el) => domToApiInfo($(el)));
  } catch (error) {
    console.error(error);
  }

  return infos;
}
