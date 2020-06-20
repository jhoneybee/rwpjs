
/**
 * 判断是否是Promise对象
 * @param obj 要判断的对象
 */
export const isPromise = (obj: any): boolean => {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export const classPrefix = () => 'rpw'