import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"

const LogoutButton = () => {

  const { logout } = useContext(UserContext)
  const navigate = useNavigate()

  const logoutAndNavigate = () => {
    logout()
    navigate("/")
  }

  return (
    <div id="logoutButton">
    <button onClick={logoutAndNavigate}>logout</button>
    </div>
  )
}

export default LogoutButton