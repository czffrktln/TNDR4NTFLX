import axios from "axios"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import LogoutButton from "../components/LogoutButton"

const SetUsername = () => {

  const { token, setUser, user, setToken } = useContext(UserContext)
  const navigate = useNavigate()

  const [ usernameInput, setUsernameInput ] = useState("")
  const [ usernameNotAvailable, setUsernameNotAvailable ] = useState(false)

  const checkUsername = async (e) => {
    setUsernameInput(e)
    const response = await axios.post('http://localhost:8080/api/user/usernameavailable', {username: e})
    console.log("checkusername", response.data);
    if (response.data.alreadyInUse) {
      setUsernameNotAvailable(true)
    } else {
      setUsernameNotAvailable(false)
    }
  }

  const sendUsername = async () => {
    const response = await axios.post('http://localhost:8080/api/user/setusername', {
      username: usernameInput
    }, {
      headers: { Authorization: `Bearer ${token}`}
    })
    
    if (response.status === 200) navigate("/dashboard")
    const newToken = response.data   
    setUser({ ...user, username: usernameInput})
    setToken(newToken)
    localStorage.setItem("token", newToken)

    // !!!!! ha nem 200 jon
  }

  return (
    <div id="setUsername">
      {/* <div id="setUsernameWrapper"> */}
        <h2>Set your username</h2>
        <input type="text" value={usernameInput} onChange={(e) => checkUsername(e.target.value)}></input>
        {usernameNotAvailable && <p>this username has already found a match</p>}
      {/* </div> */}
      <div className="buttonsDiv">
        <div className="buttonPositionDiv">
          <button disabled={usernameNotAvailable} onClick={sendUsername}>set</button>
          <LogoutButton/>
        </div>
      </div>
    </div>
  )
}
export default SetUsername