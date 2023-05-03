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
    }, 50000);
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
    <div >
      { movies.length === count ? 
        <div className="tinderPage">
          <h3>Ooops! We ran out of movies...</h3>
          <button>GIMME MORE</button>
          <GoHomeButton/>
          <LogoutButton/>
        </div> 
      :
        <div className="tinderPage">
          <div className="movie">
            <img src={movies[count].posterURL}></img>
            <h2>{movies[count].originalTitle}</h2>
            {movies[count].runtime > 0 && <h4>{movies[count].runtime} min</h4>}
          </div>
          <div>
            <button onClick={()=> likeMovie(false)}>NO</button>
            <button onClick={() => likeMovie(true)}>GO</button>
          </div>
            <button onClick={setMore}>{moreDetails ? <p>LESS</p> : <p>MORE</p>}</button>
          <div className="moreDetailsWrapper">
            { moreDetails && 
              <div className="moreDetails">
                <p>{movies[count].overview}</p>
              </div>
            }
          </div>
            <GoHomeButton/>
            <LogoutButton/>
        </div>
      }
    </div>
  )
}

export default Tinder