import { Link } from "react-router-dom";



function AuthScreen () {

  return (
    <div>
      <p>Click below</p>
      <Link to={'/dashboard'}>
        <button>
          CONTINUE
        </button>
      </Link>
    </div>
  )
}


export default AuthScreen;