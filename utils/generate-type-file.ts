import { Swagger } from '../swagger';
import generateType from './generate-type';
import { writeFileSync } from 'fs';
import { cwd } from 'process';
import { resolve } from 'path';
export default (json: Swagger, output?: string) => {
  const path = output ? resolve(output) : resolve(cwd(), 'type.ts');
  writeFileSync(path, generateType(json), {
    encoding: 'utf-8',
  });
  console.log(`[Swagger2TSFile] => 文件生成路路径 ${path}`);
};
