import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createRequire } from 'module';
import { Alert } from '../src/alert';

jest.mock('antd', () => ({ Alert: jest.requireActual('antd/lib/alert').default }));

// Run the installed docs compiler without Jest transforming Babel itself.
const transformDemo = createRequire(__filename)('@umijs/preset-dumi/lib/transformer/demo').default;

function compileDemo(source: string) {
    const result = transformDemo(source, {
        isTSX: true,
        fileAbsPath: resolve(__dirname, '../src/alert/index.md'),
    });
    const demoRequire = (name: string) => name === '@rwp/react-ui' ? { Alert } : require(name);
    return new Function('require', 'React', `${result.content}; return DumiDemo;`)(demoRequire, React);
}

afterEach(cleanup);

test('the real Alert markdown demo renders all four alert types without CommonJS globals', () => {
    const markdown = readFileSync(resolve(__dirname, '../src/alert/index.md'), 'utf8');
    const source = markdown.match(/```tsx[^\n]*\n([\s\S]*?)```/)![1];
    const Demo = compileDemo(source);
    const view = render(<Demo />);

    expect(view.getAllByRole('alert')).toHaveLength(4);
    ['成功', '信息', '警告', '错误'].forEach(message => {
        expect(view.getByText(message)).toBeTruthy();
    });
});

test.each([
    'export default () => <span>demo works</span>;',
    'export default function Demo() { return <span>demo works</span>; }',
    'const Demo = () => <span>demo works</span>; export default Demo;',
])('dumi renders supported default-export syntax: %s', source => {
    const Demo = compileDemo(`import React from 'react'; ${source}`);
    const view = render(<Demo />);

    expect(view.getByText('demo works')).toBeTruthy();
});
