import axios from "axios";
import { useContext } from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { UserContext } from "../context/UserContext";


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
    <>
    <input type="text" value={friendInput} onChange={(e) => setFriendInput(e.target.value)}></input>
    <button onClick={sendFriendRequest}>ADD</button>
    <LogoutButton />
    </>
  )
}
export default AddFriendPage