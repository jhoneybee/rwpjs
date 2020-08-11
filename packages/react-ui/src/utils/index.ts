/**
 * 获取全局的class前缀
 */
export const classPrefix = 'rwp'


const countClickMap = new Map<string, Date>()

/**
 * 单击事件转换为双击事件
 * @param key 唯一ID
 */
export const toDoubleClick = (callback: () => void, key?: string) => {
    const realKey = key || 'normal'
    const currentDate = countClickMap.get(realKey)
    if (currentDate && new Date().getTime() - currentDate.getTime() < 900) {
        callback()
        countClickMap.delete(realKey)
    }
    countClickMap.set(realKey, new Date())
}
