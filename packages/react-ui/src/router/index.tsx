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
    path: string
    routes: Component[]
    component: React.FunctionComponent<RouteComponentProps>
}
/**
 *  path       路由路径
 *  routes     子路由信息
 *  component  如果存在routes，那么component就作为布局信息
 */
const RouteComponent = (components: Component[]) => (
    components.map(element => (
        <Route
            path={element.path}
            key={element.path}
            render={
                props => (element.routes && element.routes.length > 0 ? (
                    (
                        <element.component {...props} >
                            <Switch>
                                {RouteComponent(element.routes)}
                            </Switch>
                        </element.component>
                    )
                ) : <element.component {...props} />)
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
    layout: React.FunctionComponent
    routes: Component[]
}

export const Router = (props: RouterProps) => (
    <BrowserRouter>
        <Suspense fallback={<Loading />}>
            <Switch>
                <props.layout>
                    {RouteComponent(props.routes)}
                </props.layout>
            </Switch>
        </Suspense>
    </BrowserRouter>
)
