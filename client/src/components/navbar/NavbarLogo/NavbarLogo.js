import classNames from 'classnames';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../../assets/images/radish.png';

import { UserContext } from '../../../contexts';
import styles from './navbarLogo.module.css';

const title = 'beetbox';

const NavbarLogo = ({ isInSequencer }) => {

  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  function handleLogoClick () {
    navigate(user ? `/${user.uid}` : '/');
  }

  const logoClassNames = classNames({
    [styles.mainContainer]: true,
    [styles.mainContainerSmall]: isInSequencer
  });

  return (
    <div
      onClick={handleLogoClick}
      className={logoClassNames} // TODO make position absolute get rid of extra class
    >
      <img src={logoIcon} alt='logo' />
      <h1>{ title }</h1>
    </div>
  );
};

export default NavbarLogo;