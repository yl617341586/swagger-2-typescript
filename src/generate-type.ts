import { OpenAPIV3 as OA3 } from 'openapi-types';
import {
  openapiVersionValidate,
  // handleRef,
  handleSchema,
  openapiOriginDataFormat,
  stringifyProperties,
} from '../utils';

export default async (data: OA3.Document | string): Promise<string> => {
  const exportTypes = '';

  try {
    // const { objectAssign, compositeType, handleSchemaObject } = handleSchema();
    // const { isAllOf } = compositeType();
    // format the incoming parameters to JSON object
    const openapiData = openapiOriginDataFormat(data);
    // validate the openapi JSON version
    openapiVersionValidate(openapiData.openapi);
    if (openapiData.components?.schemas) {
      const propertiesStringMap = new Map<string, string>();
      Object.entries(openapiData.components.schemas).forEach(([key, value]) => {
        propertiesStringMap.set(key, '');
        const { isRef, isAllOf } = handleSchema(value);
        const properties = (<OA3.SchemaObject>value).properties;
        if (!isRef && properties) {
          const propertiesString = stringifyProperties(properties);
          // if (isAllOf) {
          // }
          console.log(propertiesString);
        }
      });
    }
  } catch (e: unknown) {
    console.error(`[Swagger2TSFile]: ${e}`);
  }
  return exportTypes;
};
