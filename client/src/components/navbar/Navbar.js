import React, { useContext } from 'react';
import classNames from 'classnames';

import NameDisplay from '../NameDisplay/NameDisplay';
import { DarkModeContext } from '../../contexts';
import DarkModeButton from '../DarkModeButton';
import ReturnButton from '../ReturnButton';
import NavbarLogo from '../NavbarLogo/NavbarLogo';
import NewLoopButton from '../NewLoopButton';
import styles from './navbar.module.css';

const Navbar = ({ isInSequencer, userRef }) => {
  const { useDarkMode } = useContext(DarkModeContext);

  const mainContainerClassNames = classNames(
    { [styles.mainContainer]: true },
    { [styles.mainContainerDark]: useDarkMode },
    { [styles.mainContainerSmall]: isInSequencer }
  );

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