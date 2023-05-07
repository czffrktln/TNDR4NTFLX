import axios from "axios"
import { useNavigate } from "react-router-dom"
import noimg from "../picture/noimg.png"

const Friend = ({friend}) => {

  const navigate = useNavigate()


  const sendPairRequest = async () => {
    const response = await axios.post("http://localhost:8080/api/pairs/sendpairrequest", {
      receiverId: friend.friendId._id
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
    })
    console.log("pair request response", response);
    if (response.status === 200) navigate('/pendingrequest', {
      state:{
        friendUsername: friend.friendId.username,
        friendPicture: friend.friendId.picture,
        friendId: friend.friendId._id,
        pairId: response.data.pairId
      }})
  }

  console.log(friend);

  return (
    <div className="oneFriend" onClick={sendPairRequest}>
    {friend.friendId.picture ? <img src={friend.friendId.picture}></img> : <img src={noimg}></img>}
    <h4>{friend.friendId.username}</h4>
    </div>
  )
}
export default Friend