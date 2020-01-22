"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filling class data array in construcotr
 * @param a
 * @param obj
 * @param dest
 */
exports.fillClassDataArray = (a, obj, dest) => {
    //   console.log(a.length)
    if (obj) {
        for (let i = 0; i < a.length; i++) {
            if (obj[a[i].key]) {
                dest[a[i].key] = obj[a[i].key];
            }
        }
    }
};
/**
 * Filling class data
 * @param a
 * @param obj
 * @param dest
 */
exports.fillClassData = (_this, obj) => {
    if (obj) {
        for (const prop in obj) {
            if (_this[prop] ||
                _this[prop] === '' ||
                _this[prop] === 0 ||
                _this[prop] === false ||
                _this[prop] === null ||
                _this[prop] === undefined) {
                _this[prop] = obj[prop];
            }
        }
    }
};
