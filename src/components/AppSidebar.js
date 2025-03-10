import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler} from '@coreui/react'

import {AppSidebarNav} from './AppSidebarNav'


import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
// sidebar nav config
import navigation from '../_nav'
import {setShowSidebar} from "../state/slices/sidebar/sidebarSlice";


const AppSidebar = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow);
  const user = useSelector((state) => state.currentUser.currentUser);
  const [filteredMenuData, setFilteredMenuData] = useState(null);

  useEffect(() => {

  }, []);

  return (
    <>
      <CSidebar
        position="fixed"
        visible={sidebarShow}
      >
        <CSidebarBrand className="d-none d-md-flex" to="/">

        </CSidebarBrand>
        <CSidebarNav>
          <SimpleBar>
            <AppSidebarNav items={navigation} />
          </SimpleBar>
        </CSidebarNav>
        <CSidebarToggler
          className="d-none d-lg-flex"
          onClick={() => {
            dispatch(setShowSidebar(!sidebarShow))
          }}
        />
      </CSidebar>
    </>
  )
}

export default React.memo(AppSidebar)
