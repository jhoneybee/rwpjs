import * as Config from 'webpack-chain';
import { presetBabelReact } from './babel';

test('test presetBabelReact', () => {
    const config = new Config();
    presetBabelReact(config);
    expect(config.toConfig()).toMatchSnapshot();
});
