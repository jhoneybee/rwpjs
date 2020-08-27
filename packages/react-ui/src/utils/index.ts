/**
 * 获取全局的class前缀
 */
export const classPrefix = 'rwp'

// 单击次数
let singleClickNumber: number = 0
// 最后单击时间
let lastClickDate: Date | null = null

/**
 * 单击事件转换为双击事件
 * @param key 唯一ID
 */
export const toDoubleClick = (callback: () => void) => {
    singleClickNumber += 1 
    lastClickDate = new Date()
    if (singleClickNumber > 1 && new Date().getTime() - lastClickDate.getTime() < 900) {
        callback()
        singleClickNumber = 0
        lastClickDate = null
    }
}
