import { signOut } from "firebase/auth";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts";
import { auth } from "../FirebaseService";



function Dashboard () {

  const navigate = useNavigate(); // TODO will need this for jumping out of this page after logging out

  const { user } = useContext(UserContext)

  function handleLogoutClick () {
    signOut(auth).then(() => {
      navigate('/');
    });
  }

  return (
    <div>
      <div className='dashboard-navbar'>
        <h1>BEETBOX</h1>
        <button onClick={handleLogoutClick}>LOG OUT</button>
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