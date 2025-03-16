import React from 'react'
import CIcon from '@coreui/icons-react'
import {cilSpeedometer} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavGroup,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
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
  }
]

export default _nav
