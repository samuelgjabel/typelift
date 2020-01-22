import { ModelType } from './interface';
import { JSONSchema7 } from 'json-schema';
export declare const removeRequiredKeys: (obj: JSONSchema7) => JSONSchema7;
export declare const removeArrayAndChangeTypesToBoolean: (obj: Object) => Object;
export declare const createSchemeFromModel: (properties: {
    [key: string]: ModelType;
}, schema?: JSONSchema7 | undefined, removeRequired?: boolean | undefined) => JSONSchema7;
