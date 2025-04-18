/*
 * @author: Lew
 * @e-mail: yl617341586@163.com
 * @date: 2025/04/17 15:48:30
 * @description: stringify json object to typescript string eg. {"id": { "type": "integer", "format": "int64", "example": 1 }} ===> { id: number; }
 */

import { OpenAPIV3 as OA3 } from 'openapi-types';
import { handleSchema, openapiTypeFormat } from '.';
export default (schema: OA3.SchemaObject): string => {
  const baseStr: string[] = [];
  Object.entries(schema).forEach(([key, property]) => {
    const { isRef, comment, refName } = handleSchema(property);
    baseStr.push(comment);
    baseStr.push(`${key}: ${isRef ? refName : openapiTypeFormat(property)};\n`);
  });
  return baseStr.join('');
};
