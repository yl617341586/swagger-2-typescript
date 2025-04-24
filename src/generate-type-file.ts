import { writeFileSync, constants, accessSync, mkdirSync } from 'fs';
import { cwd } from 'process';
import { resolve, dirname } from 'path';
import generateType from './generate-type';
import { OpenAPIV3 as OA3 } from 'openapi-types';
export default async (data: OA3.Document | string, output = resolve(cwd(), 'type.d.ts')) => {
  const path = dirname(output);
  const exportData = generateType(data);
  const write = () => writeFileSync(output, exportData, { encoding: 'utf-8' });
  try {
    accessSync(path, constants.F_OK);
  } catch (e: unknown) {
    if (e instanceof Error) {
      const error = <NodeJS.ErrnoException>e;
      if (error.code === 'ENOENT') mkdirSync(path, { recursive: true });
      else return console.error(`[Swagger2TSFile]: ${error}`);
    }
  }
  try {
    accessSync(output, constants.F_OK);
    write();
  } catch (e: unknown) {
    if (e instanceof Error) {
      const error = <NodeJS.ErrnoException>e;
      if (error.code === 'ENOENT') return write();
      else return console.error(`[Swagger2TSFile]: ${error}`);
    }
  }
};
