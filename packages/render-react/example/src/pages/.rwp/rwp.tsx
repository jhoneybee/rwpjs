import React/* , { Suspense, useEffect } */ from "react";
import ReactDOM from 'react-dom';

import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";

// import nprogress from 'nprogress'
// import 'nprogress/nprogress.css'


const routes = []

/**
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


// const Loading = () => {
//     useEffect(()=>{
//         nprogress.start()
//         return () => {
//             nprogress.done()
//         }
//     }, [])
//     return <span />
// }

const Bootstrap = () => {
    return (
        <Router>
            {/* <Suspense fallback={<Loading/>}>
                <Layout>
                    
                </Layout>
            </Suspense> */}
            <Switch>
                {RouteComponent(routes)}
            </Switch>
        </Router>
    )
}

ReactDOM.render(
    <Bootstrap />,
    document.getElementById('root')
  )