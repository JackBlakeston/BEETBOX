import { signOut } from "firebase/auth";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';



import { DarkModeContext, UserContext } from "../contexts";
import { auth } from "../FirebaseService";



function Dashboard () {

  const navigate = useNavigate(); // TODO will need this for jumping out of this page after logging out

  const { user } = useContext(UserContext)
  const {useDarkMode, setUseDarkMode} = useContext(DarkModeContext);


  function handleLogoutClick () {
    signOut(auth).then(() => {
      navigate('/');
    });
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

      <div className='navbar-title'>
        <h1>BEETBOX</h1>
      </div>
      <p>Welcome to the dashboard!! {user?.displayName} Logged in with {user?.email}</p>
      <Link to={'/sequencer'}>
        <button>
          CONTINUE
        </button>
      </Link>
    </div>
  )
}



export default Dashboard;