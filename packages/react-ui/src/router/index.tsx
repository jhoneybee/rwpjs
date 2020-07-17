import React, { Suspense, useEffect } from 'react';

import {
    BrowserRouter,
    Switch,
    Route,
    RouteComponentProps,
} from 'react-router-dom';

import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { classPrefix } from '../utils'
import { Result } from '../index';

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
) => (
    components.map(element => (
        <Route
            path={element.path}
            key={element.path}
            exact
            render={
                props => (element.routes && element.routes.length > 0 ? (
                    (
                        <element.component {...props} >
                            <Switch>
                                {RouteComponent(element.routes)}
                            </Switch>
                        </element.component>
                    )
                ) : (
                    <element.component {...props} />
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
    return <span />
}

interface RouterProps {
    // 当前路由的布局信息
    layout: React.FunctionComponent
    // 当前的路由信息
    routes: Component[]
}

export const Router = ({ routes, layout: Layout }: RouterProps) => (
    <BrowserRouter>
        <Layout>
            <Suspense fallback={<Loading />}>
                <Switch>
                    {RouteComponent(routes)}
                    <Route
                        path="*"
                        exact
                    >
                        <Result
                            className={`${classPrefix}-route-error`}
                            status="404"
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Route>
                </Switch>
            </Suspense>
        </Layout>
    </BrowserRouter>
)
