import { DefinitionsItem, PropertiesItem, Swagger } from '../swagger';

const handleAttributes = (item: PropertiesItem) => {
  // 有引用
  // 对象嵌套
  //   if (item.type)
  //     switch (item.type) {
  //       case 'string':
  //         return 'string';
  //       case 'boolean':
  //         return 'boolean';
  //       case 'integer':
  //         return 'number';
  //     }
  //     else
};

const handleItem = (key: string, item: DefinitionsItem) => {
  return `
      export interface ${key.replace(/\«|\»/g, '')} {
      ${Object.keys(item.properties)
        .map(
          inlineKey => `${
            item.properties[inlineKey].description
              ? `/**${item.properties[inlineKey].description} */`
              : ''
          }
          ${inlineKey}: ${handleAttributes(item.properties[inlineKey])};
          `,
        )
        .join('')}
        }
      `;
};

export default (json: Swagger) => {
  let typeData = '';
  for (const key in json.definitions) {
    const item = json.definitions[key];
    typeData += handleItem(key, item);
  }
  return typeData;
};
