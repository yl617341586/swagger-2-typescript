import { generateType, generateTypeFile } from '../lib/es';

fetch('https://petstore3.swagger.io/api/v3/openapi.json')
  .then(res => res.json())
  // .then(generateType)
  .then(generateTypeFile);
