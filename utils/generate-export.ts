/*
 * @author: Lew
 * @e-mail: yl617341586@163.com
 * @date: 2025/04/18 11:26:05
 * @description: generate export string
 */
import { OpenAPIV3 as OA3 } from 'openapi-types';
import { handleSchema, openapiTypeFormat } from '.';
const path = (name: string, schema: OA3.SchemaObject) => {
  console.log(schema);
  return `export interface ${name}\n {
  
  }`;
};
const schema = (isRoot: boolean) => {
  const ref = (key: string, name: string, depth: number) => {
    return isRoot ? `export type ${key} = ${name}\n` : `${'  '.repeat(depth)}${key}: ${name}\n`;
  };
  const allOf = (key: string, allOf: (OA3.SchemaObject | OA3.ReferenceObject)[], depth: number) => {
    const names = allOf.map(_schema => handleSchema(_schema).refName);
    return isRoot
      ? `export interface ${key} extends ${String(names)}\n`
      : `${'  '.repeat(depth)}${key}: ${names.concat(['']).join(' & ')}`;
  };
  const baseObject = (key: string, schema: OA3.SchemaObject, depth: number) => {
    return isRoot
      ? `export interface ${key} \n`
      : `${'  '.repeat(depth)}${key}: ${openapiTypeFormat(schema)}\n`;
  };
  const complexObject = (key: string, schema: OA3.SchemaObject, depth: number) => {
    return isRoot
      ? `export type ${key} = ${openapiTypeFormat(schema)}\n`
      : `${'  '.repeat(depth)}${key}: ${openapiTypeFormat(schema)}\n`;
  };
  return {
    ref,
    allOf,
    baseObject,
    complexObject,
  };
};
export default {
  path,
  schema,
};
