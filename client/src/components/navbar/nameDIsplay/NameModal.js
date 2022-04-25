import React, { useContext } from 'react';
import { Modal, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { update } from 'firebase/database';

import { DarkModeContext, LoopContext } from '../../../contexts';

const modalLabelStyle = { // ?? Is it better to put these outside of function when possible??
  fontSize: 25,
  margin: '10px 0 0 0',
};

const textFieldProps = {
  style: {
    fontSize: 24
  }
};

export default function NameModal ({ isModalOpen, handleModalClose }) {

  const { useDarkMode } = useContext(DarkModeContext);
  const { loop, setLoop } = useContext(LoopContext);


  function handleNameChange (event) {
    const newName = event.target.value;
    setLoop({...loop, name: newName});
    update(loop.ref, { name: newName });
  }

  function handleSubmitName (event) {
    if (event.key === 'Enter') {
      handleModalClose();
    }
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 200,
    bgcolor: useDarkMode ? '#212121' : '#dcdcdc',
    border: '2px solid #d81b60',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
  };


  return (

    <Modal
      open={isModalOpen}
      onClose={handleModalClose}
      disableRestoreFocus
    >
      <Box sx={modalStyle}>
        <h3 style={modalLabelStyle}> Beet name </h3>
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
}