import { useLocation, useNavigate } from "react-router-dom"
import noimg from "../picture/noimg.png"
import LogoutButton from "../components/LogoutButton"
import axios from "axios"

const IncomingPairRequest = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const pair = location.state
  
  const responseToPairRequest = async (resp) => {
    const response = await axios.post('http://localhost:8080/api/pairs/responsetopairrequest', {
      pairId: pair._id,
      resp: resp
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
    })
    console.log("response to pair request response", response);
    if (response.data === "Pairing denied") navigate('/dashboard')
    navigate('/tinder', {
      state: 
      { movies: response.data.moviesTheyChoosingFrom,
        receiver: response.data.receiver,
        sender: response.data.sender,
        pairId: response.data._id
      }})
  }
  
  return (
    <>
      {pair.sender.picture ? <img src={pair.sender.picture}></img> : <img src={noimg}></img>}
      <h2>{pair.sender.username}</h2>
      <p>wants to match with you</p>
      <button onClick={() => responseToPairRequest("accept")}>ACCEPT</button>
      <button onClick={() => responseToPairRequest("denied")}>DENY</button>
      <LogoutButton />
    </>
  )
}

export default IncomingPairRequest