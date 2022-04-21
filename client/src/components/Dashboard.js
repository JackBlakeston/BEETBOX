import { Link } from "react-router-dom";



function Dashboard () {

  return (
    <div>
      <p>Welcome to the dashboard!!</p>
      <Link to={'/sequencer'}>
        <button>
          CONTINUE
        </button>
      </Link>
    </div>
  )
}



export default Dashboard;