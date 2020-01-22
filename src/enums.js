"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  Define enum types for models
 * @param args
 * After creating enum_type you can place it inside model property type like:
 *  const USER_TYPE = enums('ADMIN', 'NORMAL');
 *  const userModel = model({user_id:{type:USER_TYPE}})
 */
exports.enums = (...args) => ({ enum: args });
