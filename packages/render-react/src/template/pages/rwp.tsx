import React from "react"
import ReactDOM from 'react-dom'
import { Router } from '@rwp/react-ui'

import routes from './routes'
import Layout from '../../layouts'


ReactDOM.render(
    <Router routes={routes} layout={Layout} />
    ,
    document.getElementById('root')
)