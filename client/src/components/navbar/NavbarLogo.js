import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../assets/images/radish.png';

import { UserContext } from '../../contexts';

export default function NavbarLogo ({ isInSequencer }) {

  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  function handleLogoClick () {
    navigate(user ? `/${user.uid}` : '/');
  }

  const logoStyle = {
    padding: isInSequencer ? '0 0 0px 10px' : '0 0 40px 10px',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: 185,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  };

  const logoIconStyle = {
    marginBottom: 10,
    height: 28,
  };

  const logoTextStyle = {
    color: '#d81a60',
    margin: 'unset',
  };


  return (
    <div
      style={logoStyle}
      onClick={handleLogoClick}
    >
      <img
        src={logoIcon}
        alt=''
        style={logoIconStyle}
      />
      <h1 style={logoTextStyle} >BEETBOX</h1>
    </div>
  );
}