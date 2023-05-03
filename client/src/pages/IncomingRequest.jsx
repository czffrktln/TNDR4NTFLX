import { useLocation, useNavigate } from "react-router-dom"
import LogoutButton from "../components/LogoutButton"
import noimg from '../picture/noimg.png'
import axios from "axios"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"

const IncomingRequest = () => {

  const location = useLocation()
  const { setUser, user } = useContext(UserContext)
  const navigate = useNavigate()
  
  const updateFriendship = (resp) => {
    const newState = user.friends.map((friend) => {
      if (friend.friendshipId._id === location.state.friendshipId) {
        return {...friend, friendshipId: resp}
      }
      console.log("friend", friend);
      return friend
    })
    console.log("newstate", newState);
    setUser({...user, friends: newState})
  }

  const responseToFriendRequest = async (resp) => {
    const response = await axios.post("http://localhost:8080/api/friends/responsetorequest", {
      resp: resp,
      friendshipId: location.state.friendshipId
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
    })
    console.log("response to friend request response", response);
    // if (response.status === 202) {
    // }
    updateFriendship(response.data)
    navigate('/dashboard')
  }


  return (
    <>
      {location.state.picture ? <img src={location.state.picture}></img> : <img src={noimg}></img>}
      <h2>{location.state.username}</h2>
      <p>wants to be your friend</p>
      <button onClick={() => responseToFriendRequest(true)}>ACCEPT</button>
      <button onClick={() => responseToFriendRequest(false)}>DENY</button>
      <LogoutButton />
    </>
  )
}

export default IncomingRequest

