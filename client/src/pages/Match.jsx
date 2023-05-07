import { useLocation, useNavigate } from "react-router-dom"
import LogoutButton from "../components/LogoutButton"
import GoHomeButton from "../components/GoHomeButton"

const Match = () => {

  const location = useLocation()

  return (
    <div className="matchPage">

      <div id="matchPageWrapper">
        <div>
          <h1>IT'S A MATCH</h1>
        </div>
        <div className="movie">
          <img src={location.state.posterURL}></img>
          <h4>{location.state.title}</h4>
        </div>
      </div>

      <div className="buttonsDiv">
        <div className="buttonPositionDiv">
          <GoHomeButton/>
          <LogoutButton/>
        </div>
      </div>

    </div>
  )
}

export default Match