import React, { Suspense, useEffect } from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const routes = [{path: "/demo",component: React.lazy(() => import("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\demo\\index.js")),routes: [{path: "/demo/index",component: React.lazy(() => import("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\demo\\index.js")),},{path: "/demo/name",component: React.lazy(() => import("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\demo\\name.js")),},] },{path: "/hello",component: React.lazy(() => import("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\hello.js")),},{path: "/",component: React.lazy(() => import("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\index.js")),},{path: "/test",component: React.lazy(() => import("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\test.js")),},];/**
 *  path       路由路径
 *  routes     子路由信息
 *  component  如果存在routes，那么component就作为布局信息
 */
const RouteComponent = (components) => (
    components.map((element) => (
        <Route
            path={element.path}
            key={element.path}
            render={
                (props) => element.routes && element.routes.length > 0 ? (
                    (
                        <element.component {...props} >
                            <Switch>
                                {RouteComponent(element.routes)}
                            </Switch>
                        </element.component>
                    )
                ):  <element.component {...props} />
            }
        />
    ))
)


const Loading = () => {
    useEffect(()=>{
        nprogress.start()
        return () => {
            nprogress.done()
        }
    }, [])
    return <span />
}


const Bootstrap = () => {
    
    return (
        <Router>
            <Suspense fallback={<Loading/>}>
                <Switch>
                    {RouteComponent(routes)}
                </Switch>
            </Suspense>
        </Router>
    )
}

export default Bootstrap;