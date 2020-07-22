import React from "react";
import ReactDOM from 'react-dom';
import { Router } from '@rwp/react-ui'

import routes from './routes'
import Layout from '../../layouts'
import { Context, stores } from './store.ts'

ReactDOM.render(
    <Context.Provider
        value={stores}
    >
        <Router routes={routes} layout={Layout} />
    </Context.Provider>
    ,
    document.getElementById('root')
)