import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const RWP = {}; RWP.routes = [{path: "/demo",component: require("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\demo\\index.js").default,routes: [{path: "/demo/index",component: require("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\demo\\index.js").default,},{path: "/demo/name",component: require("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\demo\\name.js").default,},{path: "/demo/testts",component: require("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\demo\\testts.tsx").default,},{path: "/demo/testts1",component: require("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\demo\\testts1.tsx").default,},] },{path: "/hello",component: require("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\hello.js").default,},{path: "/hello1",component: require("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\hello1.js").default,},{path: "/hello2",component: require("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\hello2.js").default,},{path: "/name",component: require("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\name.tsx").default,},{path: "/test3",component: require("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\test3.js").default,},{path: "/test4",component: require("D:\\Code\\rwpjs\\packages\\render-react\\example\\src\\pages\\test4.js").default,},];/**
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

const RouteConfig = () => {
    return (
        <Router>
            <Switch>
                {RouteComponent(RWP.routes)}
            </Switch>
        </Router>
    )
}

export default RouteConfig;