/**
 * 获取全局的class前缀
 */
export const classPrefix = 'rwp'

// 单击次数
let singleClickNumber: number = 0
// 最后单击时间
let lastClickDate: Date | null = null


const clean = () => {
    singleClickNumber = 0
    lastClickDate = null
}



let beforeIdx: number | undefined

/**
 * 单击事件转换为双击事件
 * @param key 唯一ID
 */
export const toDoubleClick = (callback: () => void, idx?: number) => {
    if (idx === beforeIdx || beforeIdx === undefined) {
        singleClickNumber += 1 
        lastClickDate = new Date()
        if (singleClickNumber > 1 && new Date().getTime() - lastClickDate.getTime() < 500) {
            callback()
            clean()
        }
    }else {
        singleClickNumber = 1 
        lastClickDate = new Date()
    }
    beforeIdx = idx
}

/**
 * 判断是否是Promise对象
 * source https://github.com/then/is-promise/blob/master/index.js
 */
export const isPromise = (obj: any) => {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}