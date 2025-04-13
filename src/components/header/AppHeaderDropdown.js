import React from 'react'
import {CAvatar, CDropdown, CDropdownToggle,} from '@coreui/react'
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.currentUser.user);

  return (
    <CDropdown variant="nav-item" onClick={() => navigate('/profile')}>
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false} onClick={() => navigate('/profile')}>
        {
          user?.profile_image && user?.profile_image?.startsWith('http')
            ? <CAvatar src={user?.profile_image} size="md" />
            : initialsAvatar(
              user?.first_name && user?.last_name
                ? user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0).toUpperCase()
                : 'SY'
            )
        }      </CDropdownToggle>
    </CDropdown>
  )
}

function initialsAvatar(initials = 'SY', backgroundColor = '#4A90E2', textColor = 'white', size = 40) {
  const avatarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor,
    color: textColor,
    fontFamily: 'Arial, sans-serif',
    fontSize: `${size * 0.4}px`,
    fontWeight: 'bold',
    userSelect: 'none'
  };

  return (
    <div style={avatarStyle}>
      {initials.substring(0, 2).toUpperCase()}
    </div>
  );
};

export default AppHeaderDropdown
