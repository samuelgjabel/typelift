"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRequiredKeys = (obj) => {
    for (const prop in obj) {
        if (typeof obj[prop] === 'object') {
            obj[prop] = this.removeRequiredKeys(obj[prop]);
        }
        if (obj.required && obj.required.length) {
            delete obj.required;
        }
    }
    return obj;
};
exports.removeArrayAndChangeTypesToBoolean = (obj) => {
    for (const prop in obj) {
        if (typeof obj[prop] === 'object') {
            exports.removeArrayAndChangeTypesToBoolean(obj[prop]);
        }
        if (obj[prop].type === 'array') {
            obj[prop] = exports.removeArrayAndChangeTypesToBoolean(obj[prop].items);
        }
        else if (obj[prop].type &&
            (obj[prop].type === 'string' ||
                obj[prop].type === 'number' ||
                obj[prop].type === 'null' ||
                obj[prop].type === 'integer' ||
                obj[prop].type === 'boolean')) {
            delete obj[prop].enum;
            delete obj[prop].format;
            obj[prop].type = 'boolean';
        }
    }
    return obj;
};
exports.createSchemeFromModel = (properties, schema, removeRequired) => {
    if (!schema) {
        schema = {};
    }
    schema.type = 'object';
    schema.properties = {};
    schema.additionalProperties = false;
    if (!(schema.required && !removeRequired)) {
        schema.required = [];
    }
    for (const prop in properties) {
        schema.properties[prop] = {};
        if (!removeRequired && properties[prop].required) {
            schema.required.push(prop);
        }
        checkIfArray(properties[prop].isArray ? true : false, properties[prop].anyOf ? true : false, properties[prop].type, prop, schema.properties, properties[prop]);
    }
    return schema;
};
const checkIfArray = (isArray, isAnyOf, type, name, schema, typeParent) => {
    if (isArray) {
        const schemaName = schema[name];
        schemaName.type = 'array';
        schemaName.items = {};
        checkifAnyOf(isAnyOf, type, name, schemaName.items, true, typeParent);
    }
    else {
        checkifAnyOf(isAnyOf, type, name, schema, undefined, typeParent);
    }
};
const checkifAnyOf = (anyof, type, name, schema, notNormal, typeParent) => {
    if (anyof) {
        if (notNormal) {
            schema.anyOf = [{}];
            const schemar = schema.anyOf[0];
            schemar.type = 'object';
            schemar.properties = {};
            checkIfEnum(type, name, schemar.properties, notNormal, typeParent);
        }
        else {
            schema[name] = {};
            schema[name].anyOf = [{}];
            const schemar = schema[name].anyOf[0];
            schemar.type = 'object';
            schemar.properties = {};
            checkIfEnum(type, name, schemar.properties, true, typeParent);
        }
    }
    else {
        checkIfEnum(type, name, schema, notNormal, typeParent);
    }
};
const checkIfEnum = (type, name, schema, notNormal, typeParent) => {
    let schemaName = schema[name];
    if (notNormal) {
        schemaName = schema;
    }
    if (typeof type === 'object' && type['enum']) {
        schemaName.enum = type['enum'];
        schemaName.type = 'string';
    }
    else if (type['model'] && type['properties']) {
        const nestedProps = type['properties'];
        schemaName.type = 'object';
        exports.createSchemeFromModel(nestedProps, schemaName);
    }
    else {
        const typeCheck = extractType(type);
        if (typeCheck.type === 'string' && typeCheck.format) {
            schemaName.format = typeCheck.format;
        }
        if (typeCheck.type === 'string' && typeParent) {
            if (typeParent.minLength) {
                schemaName.minLength = typeParent.minLength;
            }
            if (typeParent.maxLength) {
                schemaName.maxLength = typeParent.maxLength;
            }
            if (typeParent.pattern) {
                schemaName.pattern = typeParent.pattern;
            }
            if (typeParent.format) {
                schemaName.format = typeParent.format;
            }
        }
        if (typeCheck.type === 'number' && typeParent) {
            if (typeParent.maximum) {
                schemaName.maximum = typeParent.maximum;
            }
            if (typeParent.minimum) {
                schemaName.minimum = typeParent.minimum;
            }
        }
        schemaName.type = typeCheck.type;
    }
};
const extractType = (type) => {
    const _ret = {
        type: 'string',
        format: undefined,
    };
    switch (type) {
        case 'Date':
            _ret.type = 'string';
            _ret.format = 'date';
            break;
        case 'boolean':
            _ret.type = 'boolean';
            break;
        case 'timeUUID':
        case 'uuid':
            _ret.type = 'string';
            _ret.format = 'uuid';
            break;
        case 'number':
            _ret.type = 'integer';
            break;
    }
    return _ret;
};
