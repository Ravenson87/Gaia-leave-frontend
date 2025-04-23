import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilAccountLogout, cilMenu} from '@coreui/icons'

import {AppBreadcrumb} from './index'
import {AppHeaderDropdown} from './header/index'
import {logo} from 'src/assets/brand/logo'
import Cookies from "universal-cookie";
import {setUser} from "../state/slices/user/userSlice";

const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const cookies = new Cookies();

  function logout() {
    cookies.remove("token");
    cookies.remove("refresh_token");
    dispatch(setUser(null));
    navigate('/login');
  }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({type: 'set', sidebarShow: !sidebarShow})}
        >
          <CIcon icon={cilMenu} size="lg"/>
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo"/>
        </CHeaderBrand>
        <div className="d-flex flex-lg-row-reverse align-items-center">
          <CHeaderNav style={{cursor: 'pointer'}}>
            <CNavItem>
              <CNavLink onClick={() => logout()}>
                <span className="mx-lg-2">LOGOUT</span>
                <CIcon icon={cilAccountLogout} size="lg"/>
              </CNavLink>
            </CNavItem>
          </CHeaderNav>
          <CHeaderNav className="ms-3">
            <AppHeaderDropdown/>
          </CHeaderNav>
        </div>
      </CContainer>
      <CHeaderDivider/>
      <CContainer fluid>
        {/*<AppBreadcrumb/>*/}
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
