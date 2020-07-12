import React, { Suspense, useEffect } from 'react';

import {
    BrowserRouter,
    Switch,
    Route,
    RouteComponentProps,
} from 'react-router-dom';

import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

interface Component {
    // 当前的路由路径
    path: string
    // 子路由信息
    routes: Component[]
    // 当前的组件
    component: React.FunctionComponent<RouteComponentProps>
}

/**
 *  path       路由路径
 *  routes     子路由信息
 *  component  如果存在routes，那么component就作为布局信息
 */
const RouteComponent = (
    components: Component[],
    Layout: React.FunctionComponent<RouteComponentProps>,
) => (
    components.map(element => (
        <Route
            path={element.path}
            key={element.path}
            render={
                props => (element.routes && element.routes.length > 0 ? (
                    (
                        <Layout {...props}>
                            <element.component {...props} >
                                <Switch>
                                    {RouteComponent(element.routes, Layout)}
                                </Switch>
                            </element.component>
                        </Layout>
                    )
                ) : (
                    <Layout {...props}>
                        <element.component {...props} />
                    </Layout>
                ))
            }
        />
    ))
)

const Loading = () => {
    useEffect(() => {
        nprogress.start()
        return () => {
            nprogress.done()
        }
    }, [])
    return <></>
}

interface RouterProps {
    // 当前路由的布局信息
    layout: React.FunctionComponent<RouteComponentProps>
    // 当前的路由信息
    routes: Component[]
}

export const Router = (props: RouterProps) => (
    <BrowserRouter>
        <Suspense fallback={<Loading />}>
            <Switch>
                {RouteComponent(props.routes, props.layout)}
            </Switch>
        </Suspense>
    </BrowserRouter>
)
