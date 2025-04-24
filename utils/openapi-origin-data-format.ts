import { OpenAPIV3 as OA3 } from 'openapi-types';
import { parse } from 'yaml';
export default (data: OA3.Document | string): OA3.Document => {
  let openapiData: OA3.Document | null = null;
  if (typeof data === 'string') {
    if (data.startsWith('openapi')) openapiData = <OA3.Document>parse(data);
    else throw new Error(`目前仅支持符合openapi3规范的json或者yaml文件`);
  } else openapiData = data;
  return openapiData;
};
