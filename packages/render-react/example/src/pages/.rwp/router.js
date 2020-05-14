import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

// @RWP-TEMPLATE ROUTES

// RWP.routes
const RouteConfig = () => {
    
    return (
        <Router>
            <Switch>
                {RWP.routes.map((element)=>{
                    const Component = element.component
                    return (
                      <Route 
                        path={element.path}
                        key={element.path}
                        render={(props) => (
                            <Component {...props}/>
                        )}
                      />
                    )
                })}
            </Switch>
        </Router>
    )
}

export default RouteConfig;