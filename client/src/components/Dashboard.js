import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../FirebaseService";



function Dashboard () {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      navigate('/');
    }
  });

  function handleLogoutClick () {
    signOut(auth);
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