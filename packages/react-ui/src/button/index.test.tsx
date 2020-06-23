import React, { useState } from 'react';
import { render, fireEvent, act } from '@testing-library/react'
import { Button } from '../index';

const TestButton = () => {
    const [title, setTitle] = useState<string>('test click')
    return (
        <Button
            onClick={() => {
                setTitle('click')
            }}
        >
            {title}
        </Button>
    )
}

const AsyncTestButton = () => {
    const [title, setTitle] = useState<string>('test click')
    return (
        <Button
            onClick={async () => {
                setTitle('click')
            }}
        >
            {title}
        </Button>
    )
}

const NoAutoLoadingTestButton = () => {
    const [title, setTitle] = useState<string>('test click')
    return (
        <Button
            autoLoading={false}
            onClick={async () => {
                setTitle('click')
            }}
        >
            {title}
        </Button>
    )
}

const NoClickButton = () => (
    <Button
        autoLoading={false}
    >
    </Button>
)

test('test button click .', async () => {
    const { container, findByText } = render(<TestButton />)
    const button = await findByText('test click')
    fireEvent.click(button)
    expect(button.textContent).toBe('click')
    expect(container).toBeInstanceOf(Element)
    expect(container).toMatchSnapshot()
})

test('test button async click .', async () => {
    const { container, findByText } = render(<AsyncTestButton />)
    const button = await findByText('test click')
    await act(async () => {
        await fireEvent.click(button)
    })
    expect(button.textContent).toBe('click')
    expect(container).toBeInstanceOf(Element)
    expect(container).toMatchSnapshot()
})

test('test button no auto loading', async () => {
    const { container, findByText } = render(<NoAutoLoadingTestButton />)
    const button = await findByText('test click')
    await act(async () => {
        await fireEvent.click(button)
    })
    expect(button.textContent).toBe('click')
    expect(container).toBeInstanceOf(Element)
    expect(container).toMatchSnapshot()
});

test('test button no click', async () => {
    const { container } = render(<NoClickButton />)
    expect(container).toMatchSnapshot()
});
