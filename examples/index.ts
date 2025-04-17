import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { cwd } from 'node:process';
import { OpenAPIV3 as OA3 } from 'openapi-types';
import { generateType } from '..';

// import openapi from './openapi.json';
const openapi = readFileSync(resolve(cwd(), 'examples', 'openapi.yaml'), 'utf-8');

generateType(openapi as unknown as OA3.Document | string);
