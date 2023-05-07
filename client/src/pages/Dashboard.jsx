import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import AddFriend from "../components/AddFriendButton"
import { useNavigate } from "react-router-dom"
import LogoutButton from "../components/LogoutButton"
import Friend from "../components/Friend"
import { useEffect } from "react"
import axios from "axios"

const Dashboard = () => {

  const navigate = useNavigate()
  const user = useContext(UserContext)
  console.log("user",user);
  console.log("friends", user.user.friends);
  const allfriends = user.user.friends
  const userid = user.user.id

  const activeFriends = allfriends.filter(friend => friend.friendshipId.status === "active")
  console.log("activefriends", activeFriends);
  const pendingFriends = allfriends.filter(friend => friend.friendshipId.status === "pending" && friend.friendshipId.sender === userid)
  console.log("pendingfriends", pendingFriends);

  useEffect(() => {
    const friendRequestInterval = setInterval( async () => {
      console.log('friend request interval runs');
      const response = await axios.post('http://localhost:8080/api/friends/istherearequest', {
        userid: userid
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      console.log("is there a friend request response", response);
      if (response.status === 200) {
        navigate('/request', {
          state: 
          {
            friendshipId: response.data.friendshipId,
            username: response.data.username,
            picture: response.data.picture,
            id: response.data.id,
            userid: userid
          }})
      }
    }, 3000);
    return () => clearInterval(friendRequestInterval)
  }, [])

  useEffect(() => {
    const pairRequestInterval = setInterval( async () => {
      console.log('pair request interval runs');
      const response = await axios.post('http://localhost:8080/api/pairs/istherearequest', {
        userid: userid
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      console.log("is there a pair request response", response.data);

      if (response.status === 200) {
        navigate('/pairrequest', {
          state: response.data.pair
        })
      }
    }, 3000);
    return () => clearInterval(pairRequestInterval)
  }, [])
  
  return (
    <div id="dashboard">
      { allfriends.length === 0 ? 
        <div id="noFriendsDiv">
          <h1>Hi {user.user.username} !</h1>
          <p>It seems you don't have any friends. <br/>Do you?</p>
          <div>
            <img id="noFriendsGif" src="https://gifdb.com/images/thumbnail/alone-milhouse-simpsons-playing-frisbee-shttfqffmcvi4h5x.gif"></img>
          </div>
        </div> 
        :
        <div>
          <h1>Hi {user.user.username} !</h1>
          <h4>Who's gonna be your match tonight?</h4>
          <div id="friendsContainer">
              {activeFriends && activeFriends.map(friend => <div className="activeFriend"><Friend key={friend._id} friend={friend}/></div>)} 
              {pendingFriends && pendingFriends.map(friend => <div className="pendingFriend"><Friend key={friend._id} friend={friend}/></div>)} 
          </div>
        </div>
      }
      <div className="buttonsDiv">
        <div className="buttonPositionDiv">
          <button onClick={() => navigate("/addfriend")}>add</button>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
export default Dashboard