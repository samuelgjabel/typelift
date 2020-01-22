"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_util_1 = require("./class-util");
const cassandra_driver_1 = require("cassandra-driver");
const interface_util_1 = require("./interface-util");
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
exports.model = (
/**
 * Properties of the model
 * Type: {[key:string]:{type:Types ....}}
 */
properties, 
/**
 * Extend with another model
 */
extend) => {
    let p = {};
    const changableVals = {};
    if (extend) {
        p = { ...p, ...extend.model };
        properties = { ...properties, ...extend.properties };
    }
    const name = 'schema';
    for (const prop in properties) {
        const property = properties[prop];
        if (property.isArray) {
            p[prop] = [];
        }
        else if (typeof property.type === 'function') {
            const t = property.type;
            if (t.model) {
                const m = t.model;
                p[prop] = m;
            }
        }
        else if (typeof property.type === 'object') {
            const t = property.type;
            if (t.enum) {
                const e = t.enum;
                p[prop] = fillBasicType(property, e.length ? e[0] : undefined, e.length ? e[0] : undefined);
            }
        }
        else {
            if (property.type === 'string') {
                p[prop] = fillBasicType(property, '');
            }
            else if (property.type === 'boolean') {
                p[prop] = fillBasicType(property, false);
            }
            else if (property.type === 'Date') {
                p[prop] = fillBasicType(property, Date, undefined, true);
                changableVals[prop] = { property, t: Date, x: undefined, isFN: true };
            }
            else if (property.type === 'number') {
                p[prop] = fillBasicType(property, 0);
            }
            else if (property.type === 'timeUUID') {
                p[prop] = fillBasicType(property, cassandra_driver_1.types.TimeUuid.now, undefined, true);
                changableVals[prop] = { property, t: cassandra_driver_1.types.TimeUuid.now, x: undefined, isFN: true };
            }
            else if (property.type === 'uuid') {
                p[prop] = fillBasicType(property, cassandra_driver_1.types.Uuid.random, undefined, true);
                changableVals[prop] = { property, t: cassandra_driver_1.types.Uuid.random, x: undefined, isFN: true };
            }
        }
    }
    const executeChangableValues = () => {
        const obj = {};
        for (const prop in changableVals) {
            const x = changableVals[prop];
            obj[prop] = fillBasicType(x.property, x.t, x.x, x.isFN);
        }
        return obj;
    };
    p = { ...p };
    const fn = {
        [name]: function (data) {
            const r = { ...p, ...executeChangableValues() };
            class_util_1.fillClassData(r, data);
            return r;
        },
    }[name];
    fn.scheme = interface_util_1.createSchemeFromModel(properties, {});
    fn.model = p;
    fn.naming = name;
    fn.properties = properties;
    return fn;
};
/**
 * Exclude properties from created model
 * @param modela  =>  model
 * @param keys  => string array of exclude keys from model
 */
exports.modelExclude = (modela, keys) => {
    const newProps = {};
    const excludeKeys = {};
    for (let i = 0; i < keys.length; i++) {
        excludeKeys[keys[i]] = true;
    }
    for (const prop in modela.properties) {
        if (!excludeKeys[prop]) {
            newProps[prop] = modela.properties[prop];
        }
    }
    return exports.model({ ...newProps });
};
/**
 * Include properties (types) to model
 * @param modela  => model
 * @param properties => properties with types info
 */
exports.modelInclude = (modela, properties) => {
    return exports.model({ ...modela.properties, ...properties });
};
const fillBasicType = (property, t, x, isFN) => {
    return property.default ||
        property.default === false ||
        property.default === 0 ||
        property.default === null ||
        property.default === ''
        ? property.default
        : property.required
            ? isFN
                ? new t()
                : t
            : x
                ? x
                : undefined;
};
