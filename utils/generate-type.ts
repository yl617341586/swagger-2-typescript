import type { DefinitionsItem, PropertiesItem, Swagger, SwaggerRef } from '../swagger';
import { checkIsEnumType, checkIsRefType } from './type-check';
const enumTypes: Array<string> = [];
const generateEnumType = (item: PropertiesItem) => {
  const arrStr = JSON.stringify(item?.enum).replace(/,/g, ' | ');
  return String(arrStr.substring(1, arrStr.length - 1));
};
const generateRefType = (item: SwaggerRef) => {
  const ref = (
    (Object.prototype.hasOwnProperty.call(item, 'originalRef')
      ? item.originalRef
      : item.$ref?.substring(item.$ref.lastIndexOf('/') + 1)) ?? ''
  ).replace(/\«|\»/g, '');
  return /^\w+$/g.test(ref) ? ref : 'unknown';
};
const handleAttributes = (
  item: PropertiesItem & SwaggerRef,
  interfaceName: string,
  _key: string,
): string => {
  if (checkIsRefType(item)) return generateRefType(item);
  if (checkIsEnumType(item)) {
    const typeName = `Enum${interfaceName.replace(
      /\w/,
      (interfaceName.match(/\w/)?.[0] ?? '').toLocaleUpperCase(),
    )}${_key.replace(/\w/, (_key.match(/\w/)?.[0] ?? '').toLocaleUpperCase())}`;
    const enumType = `export type ${typeName} = ${generateEnumType(item)}`;
    if (!enumTypes.includes(enumType)) enumTypes.push(enumType);
    return typeName;
  }
  switch (item.type) {
    case 'integer':
      return 'number';
    case 'array':
      return `Array<${handleAttributes(
        item.items as PropertiesItem & SwaggerRef,
        interfaceName,
        _key,
      )}>`;
    default:
      return item?.type ?? 'string';
  }
};

const handleItem = (key: string, item: DefinitionsItem) => {
  const interfaceName = key.replace(/\«|\»/g, '');
  if (!/^\w+$/g.test(interfaceName))
    throw new Error(`接口名只能由字母数字下划线组成 错误名称：${key}
    ${JSON.stringify(item.properties)}
    `);
  return `
  export interface ${interfaceName.replace(
    /\w/,
    (interfaceName.match(/\w/)?.[0] ?? '').toLocaleUpperCase(),
  )} {
      ${Object.keys(item.properties)
        .map(_key => {
          const description = item.properties[_key].description;
          const minLength = item.properties[_key]?.minLength;
          const maxLength = item.properties[_key]?.maxLength;
          return `/**${`${description ?? ''} ${minLength ? `minLength: ${minLength}` : ''} ${
            maxLength ? `maxLength: ${maxLength}` : ''
          } */`}
      ${_key}: ${handleAttributes(item.properties[_key], interfaceName, _key)};
      `;
        })
        .join('')}
    }
`;
};

export default (json: Swagger) => {
  const refs = Array.from(new Set(JSON.stringify(json).match(/(?<="#\/)(.+?)(?=\/.+")/g)));
  try {
    let typeData = '';
    refs.forEach(path => {
      const ref = eval(`json.${path.replace('/', '.')}`);
      for (const key in ref) {
        const item = ref[key];
        typeData += handleItem(key, item);
      }
      typeData += enumTypes.join(';\n');
    });
    return typeData;
  } catch (e: any) {
    console.log(`[Swagger2TSFile]: ${e.message}`);
    return '';
  }
};
