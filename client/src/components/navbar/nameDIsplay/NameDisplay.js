import React, { useContext, useState } from 'react';

import { DarkModeContext, LoopContext } from '../../../contexts';

import NameModal from './NameModal';
import RenameButton from './RenameButton';

const nameDisplayStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 60,
  gap: 5,
};

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

  const nameTextStyle = {
    color: useDarkMode ? 'rgb(180 180 180)' : 'rgb(70, 70, 70)',
    backgroundColor: useDarkMode ? 'rgb(57 57 57)' : 'rgb(190 190 190)',
    padding: '2px 30px 2px 30px',
    borderRadius: 7,
  };


  return (
    <>
      <NameModal
        handleModalClose={handleModalClose}
        isModalOpen={isModalOpen}
      />

      <div style={nameDisplayStyle}>
        <h4 style={nameTextStyle}>
          {loop?.name}
        </h4>
        <RenameButton handleModalOpen={handleModalOpen} />
      </div>
    </>
  );
}