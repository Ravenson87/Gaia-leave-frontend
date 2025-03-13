import React from 'react'

const Home = React.lazy(() => import("./pages/home/Home"));
const Menu = React.lazy(() => import("./pages/dev_dashboard/menu/Menu"));
const Role = React.lazy(() => import("./pages/dev_dashboard/role/Role"));
const JobPosition = React.lazy(() => import("./pages/dev_dashboard/job_position/JobPosition"));
const User = React.lazy(() => import("./pages/dev_dashboard/user/User"));

const routes = [
  {path: '/home', exact: true, name: 'Home', element: Home},
  {path: '/role', exact: true, name: 'Role', element: Role},
  {path: '/menu', exact: true, name: 'Menu', element: Menu},
  {path: '/job-position', exact: true, name: 'Job Position', element: JobPosition},
  {path: '/user', exact: true, name: 'User', element: User},
]
export default routes;
