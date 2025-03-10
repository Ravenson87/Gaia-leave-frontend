import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle
} from '@coreui/react'
import {cilUser} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {logoutUser} from "../../state/slices/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
const AppHeaderDropdown = () => {

  const user = useSelector((state) => state.currentUser.currentUser);

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        {/*<CAvatar src={avatar} size="md"/>*/}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end" style={{minWidth: '300px'}}>
        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
        {user.role !== "super_admin" && (
          <CDropdownItem href="?#/profile">
            <CIcon icon={cilUser} className="me-2"/>
              Profile
          </CDropdownItem>
        )}
        <CDropdownDivider/>
        <CDropdownItem onClick={() => {
          // removeCookies().then(() => {
          //     dispatch(logoutUser(null))
          //     navigate('/login')
          //   }
          // )
        }}>
       Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
