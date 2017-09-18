import Pipeline from './Pipeline';

// const isObject = target =>
//   Object.prototype.toString.call(target) === '[object Object]';

// const typeMap = {
//   'number': Number,
// };

function supplant(string, props) {
  let result = string.replace(/{([^{}]*)}/g, (match, expr) => {
    const value = props[expr];
    return typeof value === 'string' || typeof value === 'number' ? value : match;
  });

  result = result.replace(/"{#([^{}]*)}"/g, (match, expr) => {
    const value = props[expr];
    return typeof value === 'string' || typeof value === 'number' ? value : match;
  });
  return result;
}

function interpolate(obj, props) {
  const str = JSON.stringify(obj);
  return supplant(str, props);
}

// function typeReconcile(input) {
//   const result = {
//     ...input,
//   };

//   Object.keys(input).filter(key => key.endsWith('@number'))
//     .forEach(key => {
//       const propertyValue = input[key];
//       if (isObject(propertyValue)) {
//         result[key] = typeReconcile(propertyValue);
//         return;
//       }

//       const matches = key.match(/(.*)@(.*)$/i);
//       const [property, typeMagic] = matches;
//       const type = typeMagic.slice(1);
//       const typeConstructer = typeMap[type];
//       if (typeConstructer === undefined) {
//         return;
//       }

//       result[property] = new typeConstructer(propertyValue).valueOf();
//     });

//   return result;
// }

class Interpolation extends Pipeline {
  valueGen(data) {
    const { context, content } = data;

    const result = JSON.parse(interpolate(content, {
      ...context,
      time: context.time.getTime(),
    }));

    return {
      ...data,
      content: result,
    };
  }
}

export default Interpolation;
