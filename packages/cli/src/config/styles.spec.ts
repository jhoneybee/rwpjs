import * as Config from 'webpack-chain'
import { presetCss, presetLess } from './styles'

test('test presetCss', () => {
    const config = new Config()
    presetCss(config)
    expect(config.toConfig()).toMatchSnapshot()
})

test('test presetLess', () => {
    const config = new Config()
    presetLess(config)
    expect(config.toConfig()).toMatchSnapshot()
})