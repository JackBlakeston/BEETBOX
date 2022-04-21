import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../FirebaseService";



function Dashboard () {

  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log('SIGNED IN: ', user.email);
      setUser(user);

    } else {
      console.log('SIGNED OUT');
    }
  });

  return (
    <div>
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