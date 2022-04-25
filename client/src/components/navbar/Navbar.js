import React, { useContext } from 'react';

import NameBox from './nameDIsplay/NameDisplay';
import { DarkModeContext } from '../../contexts';
import DarkModeButton from './DarkModeButton';
import ReturnButton from './ReturnButton';
import NavbarLogo from './NavbarLogo';
import NewLoopButton from './NewLoopButton';

export default function Navbar ({ isInSequencer, userRef }) {

  const { useDarkMode } = useContext(DarkModeContext);

  const navbarStyle = {
    backgroundColor: useDarkMode ? 'rgb(35, 35, 35)' : 'rgb(220 220 220)',
    zIndex: 5,
    position: 'sticky',
    top: 0,
    minHeight: isInSequencer ? 60 : 100
  };

  return (
    <div
      style={navbarStyle}
    >

      <NavbarLogo isInSequencer={isInSequencer}/>

      {isInSequencer ?
        <NameBox/> :
        <NewLoopButton userRef={userRef} />
      }

      <DarkModeButton/>

      <ReturnButton isInSequencer={isInSequencer}/>

    </div>
  );
}