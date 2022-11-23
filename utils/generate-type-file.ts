import { Swagger } from '../swagger';
import generateType from './generate-type';
import { writeFileSync } from 'fs';
import { cwd } from 'process';
import { resolve } from 'path';
export default (json: Swagger, output?: string) => {
  writeFileSync(resolve(output ? output : cwd(), 'type.d.ts'), generateType(json), {
    encoding: 'utf-8',
  });
};
