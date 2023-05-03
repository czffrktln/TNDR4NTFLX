import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"
import noimg from "../picture/noimg.png"
import LogoutButton from "../components/LogoutButton"
import { shuffleArray } from "../utils/shuffleMovies"


const PendingRequest = () => {

  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    const pairRequestInterval = setInterval( async () => {
      console.log('pair request interval runs');
      const response = await axios.post('http://localhost:8080/api/pairs/isrequestaccepted', {
        pairid: location.state.pairId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      console.log("is pair request accepted response", response);
      if (response.status === 200) {
        navigate('/tinder', {
          state: 
          { movies: shuffleArray(response.data.moviesTheyChoosingFrom),
            receiver: response.data.receiver,
            sender: response.data.sender,
            pairId: response.data._id
          }})
      }
    }, 1000);
    return () => clearInterval(pairRequestInterval)
  }, [])

  return (
    <>
      <h3>Waiting for</h3>
      {location.state.friendPicture ? <img src={location.state.friendPicture}></img> : <img src={noimg}></img>}
      <h2>{location.state.friendUsername}</h2>
      <h3>to accept</h3>
      <LogoutButton/>
    </>
  )
}
export default PendingRequest