import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import LogoutButton from "../components/LogoutButton";
import GoHomeButton from "../components/GoHomeButton";

const Tinder = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const movies = location.state.movies
  // movies (_id, runtime, posterURL, overview, originalTitle), receiver, sender, pairId

  const [ count, setCount ] = useState(0)
  const [ moreDetails, setMoreDetails ] = useState(false)
  console.log("moredetails", moreDetails);

  useEffect(() => {
    const matchInterval = setInterval( async () => {
      const response = await axios.post('http://localhost:8080/api/pairs/isthereamatch', {
        pairId: location.state.pairId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      console.log("is there a match response", response);
      if (response.status === 200) {
        navigate('/match', {
          state: {
            posterURL: response.data.posterURL,
            title: response.data.originalTitle,
        }})
      }
    }, 3000);
    return () => clearInterval(matchInterval)
  }, [])

  const likeMovie = async (resp) => {
    const response = await axios.post("http://localhost:8080/api/pairs/likemovie", {
      pairId: location.state.pairId,
      movieId: movies[count]._id,
      resp: resp
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
    })
    console.log("like movie response", response);
    if (response.status === 204) setCount(count+1)
    if (response.status === 200) {
      navigate('/match', {
        state: {
          posterURL: movies[count].posterURL,
          title: movies[count].originalTitle,
        }
      })
    }
  }

  const setMore = () => {
    setMoreDetails(!moreDetails)
  }
  return (
    <div id="tinderPage">
      { movies.length === count ? 
        <div className="tinderPageOops">
          <h3>Ooops! We ran out of movies...</h3>
          <div className="tinderButtons">
            <button>GIMME MORE</button>
          </div>
          <div className="buttonsDiv">
            <div className="buttonPositionDiv">
              <GoHomeButton/>
              <LogoutButton/>
            </div>
          </div>
        </div> 
      :
        <div className="tinderPage">
          <div className="movie">
            <div>
              <img src={movies[count].posterURL}></img>
            </div>
            <div>
              <p>{movies[count].originalTitle}</p>
              {movies[count].runtime > 0 && <h5>{movies[count].runtime} min</h5>}
            </div>
          </div>
          <div className="tinderButtons">
            <button onClick={()=> likeMovie(false)}>NO</button>
            <button onClick={() => likeMovie(true)}>GO</button>
          </div>
            {/* <button onClick={setMore}>{moreDetails ? <p>LESS</p> : <p>MORE</p>}</button> */}
          <div className="moreDetailsWrapper">
            { moreDetails && 
              <div className="moreDetails">
                <p>{movies[count].overview}</p>
              </div>
            }
          </div>
          <div className="buttonsDiv">
            <div className="buttonPositionDiv">
              <GoHomeButton/>
              <LogoutButton/>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Tinder