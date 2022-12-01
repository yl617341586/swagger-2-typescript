export type Type = 'object' | 'string' | 'array' | 'integer' | 'boolean';
export interface Swagger {
  swagger: string;
  info: Info;
  host: string;
  basePath: string;
  tags: any[];
  paths: Path;
  // securityDefinitions: SecurityDefinition;
  definitions: Definition;
}

export interface License {
  name: string;
  url: string;
}

export interface Info {
  description: string;
  version: string;
  title: string;
  termsOfService: string;
  contact: Record<any, any>;
  license: License;
}

export type Definition = Record<string, DefinitionsItem>;
export interface DefinitionsItem {
  type: Type;
  required: Array<string>;
  properties: Properties;
}

export type Properties = Record<string, SwaggerRef & PropertiesItem>;
export interface PropertiesItem {
  type?: Type;
  format?: string;
  description?: string;
  minLength?: number;
  maxLength?: number;
  enum?: Array<string | number | boolean>;
  items?: SwaggerRef & { type?: Type; enum?: Array<string | number | boolean> };
}
export interface SwaggerRef {
  $ref?: string;
  originalRef?: string;
}
export type Path = Record<string, PathItem>;
export type PathItem = Record<'post' | 'get' | 'delete' | 'put', EntityItem>;
export interface EntityItem {
  tags: Array<string>;
  summary: string;
  operationId: string;
  parameters: Array<Parameters>;
}
export interface Parameters {
  name: string;
  in: 'header' | 'body' | 'path';
  description: string;
  required: boolean;
  type: Type;
  enum?: Array<string | number>;
  schema?: SwaggerRef;
}
