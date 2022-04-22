import { signOut } from "firebase/auth";
import { get, push } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';


import { DarkModeContext, LoopContext, UserContext } from "../contexts";
import { auth, dbRef } from "../FirebaseService";

async function getLoopList () { // TODO export this to db service
  const snapshot = await get(dbRef);
  return snapshot.val();
}

function Dashboard () {

  const navigate = useNavigate();

  const [loopList, setLoopList] = useState({});

  const { user } = useContext(UserContext)
  const {useDarkMode, setUseDarkMode} = useContext(DarkModeContext);
  const { setLoop } = useContext(LoopContext);

  useEffect(() => {
    getLoopList().then(data => {
      setLoopList(data);
    });
  }, []);


  function handleLogoutClick () {
    signOut(auth);
  }

  // function handleLoopSelect (event) {
  //   // get all loop info from db
  //   setLoop();
  //   navigate('/sequencer');
  // }

  function handleNewLoopClick () {
    const newLoop = {
      name: 'Untitled Beet',
      bpm: 220,
      gridSize: 16,
      precision: 1,
      pads: [],
      trackList: {},
      trackCounter: 0,
    }
    const loopRef = push(dbRef, newLoop);

    setLoop({...newLoop, ref: loopRef});
    navigate(`/sequencer/${loopRef.key}`);
  }


  return (
    <div>

      <Button
        onClick={handleLogoutClick}
        variant='contained'
        size='small'
        sx={{
          backgroundColor: useDarkMode ? 'rgb(60 60 60)' : 'rgb(101 101 101)',
          position: 'absolute',
          top: 15,
          right: 120,
          width: 99,
        }}
      >
        LOG OUT
      </Button>

      <IconButton
        aria-label="dark-mode"
        size="small"
        onClick={() => setUseDarkMode(!useDarkMode) }
        sx={{
          position: 'absolute',
          top: 14,
          right: 40
        }}
      >
        <DarkModeIcon/>
      </IconButton>

      <div
        className='title-container'
        style={{
          backgroundColor: useDarkMode ? 'rgb(35, 35, 35)' : 'rgb(220 220 220)',
        }}
      >
        <h1 className='title' >BEETBOX</h1>
      </div>
      <p>Welcome to the dashboard!! {user?.displayName} Logged in with {user?.email}</p>
      <Link to={'/sequencer'}>
        <button>
          CONTINUE
        </button>
      </Link>

      <button onClick={handleNewLoopClick}>
          NEW LOOP
      </button>
    </div>
  )
}



export default Dashboard;