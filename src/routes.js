import React from 'react'

const Home = React.lazy(() => import("./pages/home/Home"));
const Menu = React.lazy(() => import("./pages/dev_dashboard/menu/Menu"));
const Role = React.lazy(() => import("./pages/dev_dashboard/role/Role"));

const routes = [
    {path: '/home', exact: true, name: 'Home', element: Home},
    {path: '/role', exact: true, name: 'Role', element: Role},
    {path: '/menu', exact: true, name: 'Menu', element: Menu}
]


export default routes;