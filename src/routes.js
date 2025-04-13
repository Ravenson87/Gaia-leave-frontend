import React from 'react'

const Home = React.lazy(() => import("./pages/home/Home"));
const Menu = React.lazy(() => import("./pages/dev_dashboard/menu/Menu"));
const Role = React.lazy(() => import("./pages/dev_dashboard/role/Role"));
const JobPosition = React.lazy(() => import("./pages/dev_dashboard/job_position/JobPosition"));
const User = React.lazy(() => import("./pages/dev_dashboard/user/User"));
const MenuRole = React.lazy(() => import("./pages/dev_dashboard/assigned_accessibility/MenuRole"));
const DaysOffManagement = React.lazy(() => import("./pages/days-off-management/DaysOffManagement"));
const Calendar = React.lazy(() => import("./pages/days-off-management/Calendar"));
const Profile = React.lazy(() => import("./pages/profile/profile"));
const DaysOffManagementDemo = React.lazy(() => import("./pages/days-off-management/DaysOffManagementDemo"));
const Prof = React.lazy(() => import("./pages/days-off-management/ProfileDaysOff"));
const DaysOffBooking = React.lazy(() => import("./pages/days-off-management/DaysOffBooking"));

const routes = [
  {path: '/home', exact: true, name: 'Home', element: Home},
  {path: '/role', exact: true, name: 'Role', element: Role},
  {path: '/menu', exact: true, name: 'Menu', element: Menu},
  {path: '/job-position', exact: true, name: 'Job Position', element: JobPosition},
  {path: '/user', exact: true, name: 'User', element: User},
  {path: '/menu/role', name: 'Menu Role', element: MenuRole},
  {path: 'days-off-management', name: 'Days off management', element: DaysOffManagementDemo},
  {path: 'calendar', name: 'Calendar', element: Calendar},
  {path: '/profile', name: 'Profile', element: Profile},
  {path: '/Prof', name: 'Prof', element: Prof},
  {path: '/days-off-booking', name: 'Days Off Booking', element: DaysOffBooking},
]
export default routes;
