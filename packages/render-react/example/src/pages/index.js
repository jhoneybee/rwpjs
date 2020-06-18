import React from 'react'
import { Button } from 'antd'
import { Form } from 'kotomi-ui'

const Index = () =>{
    
    return (
        <>
          <Button>test</Button>
          <Form script={`[name|Field1 input 8-8-16][code|Field2 input 8-8-16 ][code1|Field3 input 8-8-16] `} />
        </>
    )
}

export default Index