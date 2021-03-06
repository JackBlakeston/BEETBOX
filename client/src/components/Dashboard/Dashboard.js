import { child, get, remove } from 'firebase/database';
import { React, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { LoopContext, UserContext } from '../../contexts';
import { dbRef } from '../../firebase/firebaseService';
import Navbar from '../Navbar/Navbar';
import classes from './dashboard.module.css';

async function getLoopList (ref) { // TODO export this to db service
  const snapshot = await get(ref);
  return snapshot.val();
}

async function getLoopByKey (loopKey, userRef) {
  const loopRef = child(userRef, loopKey);
  const snapshot = await get(loopRef);
  return snapshot.val();
}

const Dashboard = () => {

  const navigate = useNavigate();
  const params = useParams();

  const [loopList, setLoopList] = useState(null);

  const { user } = useContext(UserContext);
  const { setLoop } = useContext(LoopContext);

  // TODO? Make this a state?
  const [userRef, setUserRef] = useState(null);

  useEffect(() => {
    if (userRef) {
      getLoopList(userRef).then(data => {
        setLoopList(data);
      });
    }
  }, [userRef]);

  useEffect(() => {
    if (user) {
      setUserRef(child(dbRef, params.uid));
    }
  }, [user, params.uid]);




  function handleLoopCardClick (loopKey) {
    getLoopByKey(loopKey, userRef).then((data) => {
      setLoop(data);
      navigate(`/${params.uid}/sequencer/${loopKey}`);
    });
  }

  function handleClickDelete (e, loopKey) {
    e.preventDefault();
    e.stopPropagation();
    const loopRef = child(userRef, loopKey);
    remove(loopRef).then(() => {
      const loopListCopy = Object.assign({}, loopList);
      delete loopListCopy[loopKey];
      setLoopList(loopListCopy);
    });
  }


  return (
    <div>
      <Navbar userRef={userRef}/>

      <div className={classes.loopListContainer}>
        <ul className={classes.loopList}>
          {loopList && (Object.keys(loopList)?.length > 0 ? Object.keys(loopList).map(loopKey => {
            return (
              <li key={loopKey}>
                <Paper
                  onClick={() => handleLoopCardClick(loopKey)}
                  className={classes.loopListItem}
                  elevation={1}
                  sx={{
                    height: 170,
                    width: 700,
                    transition: '0.4s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      color: 'white',
                      backgroundColor: 'rgb(216 26 96)',
                    }
                  }}
                >
                  <IconButton
                    className={classes.loopDeleteButton}
                    aria-label="delete"
                    size="small"
                    onClick={(e) => handleClickDelete(e, loopKey)}
                    sx={{
                      position: 'absolute',
                      top: 15,
                      right: 15,
                      opacity: 0,
                      transition: '0.6s ease',
                      fill: 'white'
                    }}
                  >
                    <DeleteIcon fontSize="inherit" style={{ color: 'white' }} />
                  </IconButton>

                  <div className={classes.loopInfoContainer}>
                    <h2>{loopList[loopKey].name}</h2>
                    <div className={classes.loopDetailsContainer}>
                      <p>Bpm: {loopList[loopKey].bpm}</p>
                      <p>Duration: {Math.trunc(100 * loopList[loopKey].gridSize / loopList[loopKey].bpm)}s
                      </p>
                    </div>
                  </div>
                </Paper>
              </li>
            );
          })
            : <div className={classes.noLoopsMessageContainer}>
              <h1>You have no beets yet</h1>
              <h1>Drop a fresh beet and bless the world with your rythm!</h1>
            </div>)}
        </ul>
      </div>


    </div>
  );
};

export default Dashboard;