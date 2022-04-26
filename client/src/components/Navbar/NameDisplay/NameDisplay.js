import classNames from 'classnames';
import React, { useContext, useState } from 'react';

import { DarkModeContext, LoopContext } from '../../../contexts';

import NameModal from './RenameModal/RenameModal';
import RenameButton from './RenameButton/RenameButton';
import classes from './nameDisplay.module.css';

export default function NameBox () {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { useDarkMode } = useContext(DarkModeContext);
  const { loop } = useContext(LoopContext);

  function handleModalOpen () {
    setIsModalOpen(true);
  }

  function handleModalClose () {
    setIsModalOpen(false);
  }

  const loopNameClassNames = classNames({
    [classes.loopName]: true,
    [classes.loopNameDark]: useDarkMode,
  });

  return (
    <>
      <NameModal
        handleModalClose={handleModalClose}
        isModalOpen={isModalOpen}
      />

      <div className={classes.nameContainer}>
        <h4 className={loopNameClassNames}>
          { loop?.name }
        </h4>
        <RenameButton handleModalOpen={handleModalOpen} />
      </div>
    </>
  );
}