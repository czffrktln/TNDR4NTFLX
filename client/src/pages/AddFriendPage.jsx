import axios from "axios";
import { useContext } from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { UserContext } from "../context/UserContext";
import BackButton from "../components/BackButton";


const AddFriendPage = () => {

  const { setUser, user } = useContext(UserContext)
  const navigate = useNavigate()

  const [ friendInput, setFriendInput ] = useState("")
  console.log("friendinput", friendInput);

  const sendFriendRequest = async () => {
    const response = await axios.post('http://localhost:8080/api/friends/friendrequest', {
      username: friendInput
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
    })
    console.log("friend request response", response.data);
    setUser({...user, friends: response.data})
    navigate("/dashboard")
  }
  console.log("user", user);

  return (
    <div id="addFriendPage">
      <div id="addFriendPageInput">
        <input type="text" placeholder="username" value={friendInput} onChange={(e) => setFriendInput(e.target.value)}></input>
      </div>
      <div className="buttonsDiv">
        <div className="buttonPositionDiv">
          <button onClick={sendFriendRequest}>add</button>
          <BackButton/>
          {/* <LogoutButton /> */}
        </div>
      </div>
    </div>
  )
}
export default AddFriendPage