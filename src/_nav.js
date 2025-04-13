import React from 'react'
import CIcon from '@coreui/icons-react'
import {cilCalendar, cilSpeedometer} from '@coreui/icons'
import {CNavGroup, CNavItem} from '@coreui/react'

const _nav = [
  {
    component: CNavGroup,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Role',
        to: '/role',
      },
      {
        component: CNavItem,
        name: 'Menu',
        to: '/menu',
      },
      {
        component: CNavItem,
        name: 'Job Position',
        to: '/job-position',
      },
      {
        component: CNavItem,
        name: 'User',
        to: '/user',
      },
      {
        component: CNavItem,
        name: 'Role Access',
        to: '/menu/role',
      }
    ],
  },
  {
    component: CNavGroup,
    name: 'Schedule',
    to: '/calendar',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon"/>,
    items: [
      {
        component: CNavItem,
        name: 'Leave Requests',
        to: '/days-off-management',
      },
      {
        component: CNavItem,
        name: 'Team Calendar',
        to: '/calendar',
      },
      {
        component: CNavItem,
        name: 'Days Off Booking',
        to: '/days-off-booking',
      },
    ],
  }

]

export default _nav
