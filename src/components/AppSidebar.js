import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const secondArray = [
    {
      menu_number: 2,
      name: 'Developer dashboard',
      to: '/role',
    },
    {
      menu_number: 1,
      name: 'Role',
      to: '/role',
    },
    {
      menu_number: 2,
      name: 'Menu',
      to: '/role',
    },
    {
      menu_number: 2,
      name: 'Calendar',
      to: '/role',
    },
  ]

  function filterNavItems(nav, secondArray) {

    let result = [];


    nav.forEach(group => {
      const filteredItems = group.items.filter(item => {
        return secondArray.some(menu => menu.name === item.name);
      });

      if (filteredItems.length > 0) {
        result.push({
          ...group,
          items: filteredItems,
        });
      }
    });

    return result;
  }

  const filteredNav = filterNavItems(navigation, secondArray);
  console.log("filteredNav",filteredNav)
  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
      <h1>Gaia leave</h1>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
