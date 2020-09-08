import React from "react";
import ReactDOM from 'react-dom';
import { isArray } from 'lodash'
import { Router } from '@rwp/react-ui'
import request from 'umi-request';
import ImportRemote from '@shopify/react-import-remote';

import routes from './routes'
import Layout from '../../layouts'

(async () => {
    // 如果是微前端架构, 则优先加载路由信息
    if (RWP_PARTICLE_URL) {
       const particles = await request.get(RWP_PARTICLE_URL)

       if (isArray(particles)) {

        particles.forEach((particle: any) => {
            routes.push({
                path: particle.route,
                routes: [],
                component: <ImportRemote source={`${RWP_PARTICLE_URL}/${particle.library}`} />
            })
        })
       }
    }
    
    ReactDOM.render(
        <Router routes={routes} layout={Layout} />
        ,
        document.getElementById('root')
    )
})()