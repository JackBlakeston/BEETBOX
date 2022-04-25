import React, { useContext } from 'react';
import classNames from 'classnames';

import NameDisplay from './NameDisplay/NameDisplay';
import { DarkModeContext } from '../../contexts';
import DarkModeButton from '../DarkModeButton/DarkModeButton';
import ReturnButton from './ReturnButton/ReturnButton';
import NavbarLogo from './NavbarLogo/NavbarLogo';
import NewLoopButton from './NewLoopButton/NewLoopButton';
import classes from './navbar.module.css';

const Navbar = ({ isInSequencer, userRef }) => {
  const { useDarkMode } = useContext(DarkModeContext);

  const mainContainerClassNames = classNames({
    [classes.mainContainer]: true,
    [classes.mainContainerDark]: useDarkMode,
    [classes.mainContainerSmall]: isInSequencer,
  });

  return (
    <div className={mainContainerClassNames}>
      <NavbarLogo isInSequencer={isInSequencer}/>
      {isInSequencer ?
        <NameDisplay/> :
        <NewLoopButton userRef={userRef} />
      }
      <DarkModeButton/>
      <ReturnButton isInSequencer={isInSequencer}/>
    </div>
  );
};

export default Navbar;