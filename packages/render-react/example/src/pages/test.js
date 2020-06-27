import React from 'react'

const Hello = () =>{
    const data = {
        ...{a: '1'}
    }
    
    return <h1> Hello {JSON.stringify(data)} </h1>
}

export default Hello