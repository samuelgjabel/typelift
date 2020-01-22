export declare type EnumType = string | number | boolean | undefined | null;
/**
 *  Define enum types for models
 * @param args
 * After creating enum_type you can place it inside model property type like:
 *  const USER_TYPE = enums('ADMIN', 'NORMAL');
 *  const userModel = model({user_id:{type:USER_TYPE}})
 */
export declare const enums: <T extends EnumType[]>(...args: T) => {
    enum: T[number];
};
