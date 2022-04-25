import React, { useContext } from 'react';
import { Modal, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { update } from 'firebase/database';

import { DarkModeContext, LoopContext } from '../../contexts';
import classes from './renameModal.module.css';
import { textFieldProps, inputLabel, modalPadding, enterKey } from './constants';

const NameModal = ({ isModalOpen, handleModalClose }) => {

  const { useDarkMode } = useContext(DarkModeContext);
  const { loop, setLoop } = useContext(LoopContext);

  function handleNameChange (event) {
    const newName = event.target.value;
    setLoop({...loop, name: newName});
    update(loop.ref, { name: newName });
  }

  function handleSubmitName (event) {
    if (event.key === enterKey) {
      handleModalClose();
    }
  }

  const modalSx = {
    ...modalPadding,
    bgcolor: useDarkMode ? '#212121' : '#dcdcdc', // TODO global constants for colors
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleModalClose}
      disableRestoreFocus
    >
      <Box sx={modalSx} className={classes.modalBoxContainer}>
        <h3> {inputLabel} </h3>
        <TextField
          onFocus={event => event.target.select()}
          onChange={handleNameChange}
          onKeyDown={handleSubmitName}
          value={loop?.name}
          inputProps={textFieldProps}
        />
      </Box>
    </Modal>
  );
};

export default NameModal;