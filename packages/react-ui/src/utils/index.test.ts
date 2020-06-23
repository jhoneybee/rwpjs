import { isPromise, classPrefix } from './index';

/**
 * 测试当前是否是isPromise对象
 */
test('test isPromise', () => {
    expect(isPromise(new Promise<void>(resolve => {
        resolve()
    }))).toBe(true)
    expect(isPromise(true)).toBe(false)
    expect(isPromise({})).toBe(false)
    expect(isPromise([])).toBe(false)
    expect(isPromise(false)).toBe(false)
    expect(isPromise(undefined)).toBe(false)
    expect(isPromise(null)).toBe(false)
})

/**
 * 测试获className的前缀名称
 */
test('test classPrefix', () => {
    expect(classPrefix()).toBe('rpw')
})
