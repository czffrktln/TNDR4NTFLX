import { useLocation, useNavigate } from "react-router-dom"
import LogoutButton from "../components/LogoutButton"
import GoHomeButton from "../components/GoHomeButton"

const Match = () => {

  const location = useLocation()

  return (
    <div className="matchPage">
    <h2>IT'S A MATCH</h2>
    <div className="movie">
      <img src={location.state.posterURL}></img>
      <h3>{location.state.title}</h3>
    </div>
    <GoHomeButton/>
    <LogoutButton/>
    </div>
  )
}

export default Match