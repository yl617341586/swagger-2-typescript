import { generateType, generateTypeFile } from '..';

fetch('https://petstore3.swagger.io/api/v3/openapi.json')
  .then(res => res.json())
  // .then(generateType)
  .then(generateTypeFile);
