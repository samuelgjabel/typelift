import { EnumType } from './enums';
import { JSONSchema7 } from 'json-schema';
export declare type AdvanceType = {
    enum: EnumType;
} | {
    model: {};
    properties: {};
};
export declare type BasicTypes = 'boolean' | 'Date' | 'timeUUID' | 'uuid';
export declare type Formats = 'date' | 'time' | 'date-time' | 'uri' | 'uri-reference' | 'uri-template' | 'email' | 'hostname' | 'ipv4' | 'uuid' | {
    regex: RegExp;
};
declare type requiredCheck<t, r> = r extends true ? t : t | undefined;
declare type basicTypeWrap<t> = t extends 'string' ? string : t extends 'boolean' ? boolean : t extends 'number' ? number : t extends 'Date' ? Date : t extends {
    enum: EnumType;
} ? t['enum'] : t extends {
    model: {};
} ? t['model'] : t extends 'uuid' | 'email' | 'ipv4' | 'uri' | 'date-time' ? string : t;
declare type checkIfArray<isArray, type> = isArray extends true ? type[] : type;
declare type checkIfAnyOf<anyOf, type> = anyOf extends true ? {
    [key: string]: type;
} : type;
interface ModelTypeParent {
    isArray?: boolean;
    anyOf?: boolean;
    required?: boolean;
    default?: string | number | boolean | null | Date;
}
interface ModelTypeString extends ModelTypeParent {
    type: 'string';
    format?: Formats;
    minLength?: number;
    maxLength?: number;
    /**
     * Regex expression as string
     */
    pattern?: string;
}
interface ModelTypeNumber extends ModelTypeParent {
    type: 'number';
    maximum?: number;
    minimum?: number;
}
interface ModelTypeAll extends ModelTypeParent {
    type: BasicTypes | AdvanceType;
}
export declare type ModelType = ModelTypeString | ModelTypeAll | ModelTypeNumber;
declare type ModelWrap<t, c> = {
    [k in keyof t]: ModelType;
};
declare type ModelWrapReturn<t extends {
    [key: string]: ModelType;
}> = {
    [k in keyof t]: checkIfArray<t[k]['isArray'], checkIfAnyOf<t[k]['anyOf'], requiredCheck<basicTypeWrap<t[k]['type']>, t[k]['required']>>>;
};
export interface modelReturn {
    properties: {};
    naming: string;
    model: {};
    scheme: JSONSchema7;
}
interface modelGeneric<t extends {
    [key: string]: ModelType;
}, name, e extends modelReturn, properties> extends modelReturn {
    properties: properties;
    naming: string & name;
    model: ModelWrapReturn<t> & e['model'];
    scheme: JSONSchema7;
    new (dat?: Partial<ModelWrapReturn<t> & e['model']>): ModelWrapReturn<t> & e['model'];
}
/**
 * Creating of a model with properties & extend
 * @param properties Properties of model
 * @param extend  extend another model
 * Example:
 * const userModel = model({
 * user_id: { type: 'uuid', required },
 * comment_id: { type: 'uuid', required },
 * email:{type:'string', format:'email'}
 * })
 */
export declare const model: <t, c, a extends ModelWrap<t, c>, n extends string, e extends modelReturn>(properties: ModelWrap<t, c> | a, extend?: (modelReturn & e) | undefined) => modelGeneric<a, n, e, a>;
declare type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
declare type Exluder<T, withoutEnum> = Without<T, withoutEnum>;
interface modelExcludeReturn<t extends modelReturn, excludeEnum> {
    model: Exluder<t['model'], excludeEnum>;
    properties: Exluder<t['properties'], excludeEnum>;
    naming: string;
    name: string;
    new (dat?: Partial<Exluder<t['model'], excludeEnum>>): Exluder<t['model'], excludeEnum>;
}
/**
 * Exclude properties from created model
 * @param modela  =>  model
 * @param keys  => string array of exclude keys from model
 */
export declare const modelExclude: <t extends modelReturn, x, keys extends (keyof t["model"])[]>(modela: t, keys: keys) => modelExcludeReturn<t, keys[number]>;
interface modelGenericInclude<t extends {
    [key: string]: ModelType;
}, name, e extends modelReturn, properties> extends modelReturn {
    properties: properties & e['properties'];
    naming: string & name;
    model: ModelWrapReturn<t> & e['model'];
    new (dat?: Partial<ModelWrapReturn<t> | e['model']>): ModelWrapReturn<t> & e['model'];
}
/**
 * Include properties (types) to model
 * @param modela  => model
 * @param properties => properties with types info
 */
export declare const modelInclude: <t, c, a extends ModelWrap<t, c>, n extends string, e extends modelReturn>(modela: e, properties: ModelWrap<t, c> & a) => modelGenericInclude<a, n, e, a>;
export {};
