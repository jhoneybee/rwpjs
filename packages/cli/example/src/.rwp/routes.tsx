import React from "react"
export default [
	{
		component: React.lazy(() => import('../pages/index.route')),
		path: '/'
	},
]