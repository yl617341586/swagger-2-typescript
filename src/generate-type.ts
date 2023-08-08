import { openapiVersionCheck, handleRef, handleSchema } from '../utils';
import { OpenApi, Reference, Schema } from '../openapi';

export default async (json: OpenApi): Promise<string> => {
  let exportTypes = '';
  try {
    const { objectAssign, compositeType, handleSchemaObject } = handleSchema();
    const { isAllOf } = compositeType();
    // 检查openapi版本
    openapiVersionCheck(json.openapi);

    // 获取需要导出的类型
    Object.entries(json.components?.schemas ?? {}).forEach(([key, item]) => {
      const DFSStack = [];
      const typeQueue = [];
      exportTypes += `export interface ${key} {\n`;
      DFSStack.unshift(item);
      while (DFSStack.length) {
        const top = DFSStack.shift() as Schema | Reference;
        const { name } = handleRef(top);

        if (name) DFSStack.unshift(json.components?.schemas?.[name]);
        if (isAllOf(top as Schema)) {
          for (let index = (top as Schema).allOf?.length ?? 0; index > 0; index--) {
            const item = (top as Schema).allOf?.[index - 1] as Schema | Reference;
            const { name } = handleRef(item);
            if (name) DFSStack.unshift(json.components?.schemas?.[name]);
            if (!name) DFSStack.unshift(item);
          }
        }
        if (!name && !isAllOf(top as Schema)) typeQueue.push(top);
      }
      exportTypes += handleSchemaObject(objectAssign(...(typeQueue as Array<Schema>)));

      exportTypes += `}\n`;
    });
  } catch (e: any) {
    console.error(`[Swagger2TSFile]: ${e}`);
  }
  return exportTypes;
};
