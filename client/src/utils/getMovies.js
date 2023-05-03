// import { useEffect } from 'react'
// import axios from 'axios'
  
  // const options = {
  //   method: 'GET',
  //   url: 'https://streaming-availability.p.rapidapi.com/v2/search/basic',
  //   params: {
  //     country: 'hu',
  //     services: 'netflix',
  //     // output_language: 'en',
  //     show_type: 'movie',
  //     // genre: '18',
  //     show_original_language: 'hu',
  //     // keyword: 'zombie'
  //     cursor: '111036:Swing'
  //   },
  //   headers: {
  //     'X-RapidAPI-Key': '9e69b24598mshe563850cf096fddp1c0172jsn5dd2151b6c9d',
  //     'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
  //   }
  // };
  
  // axios.request(options).then(function (response) {
  //   console.log(response.data);
  //   const data = response.data.result
  //   const newMovies = data.map(movie => {
  //     return {
  //       cast: movie.cast,
  //       countries: movie.countries,
  //       directors: movie.directors,
  //       genres: movie.genres,
  //       imdbId: movie.imdbId,
  //       imdbRating: movie.imdbRating,
  //       originalLanguage: movie.originalLanguage,
  //       originalTitle: movie.originalTitle,
  //       overview: movie.overview,
  //       posterURL: movie.posterURLs.original,
  //       runtime: movie.runtime,
  //       title: movie.title,
  //       year: movie.year
  //     }
  //   })

  //   console.log("newmovie", newMovies);
  //   sendToServer(newMovies)
  // }).catch(function (error) {
  //   console.error(error);
  // });

  // const sendToServer = async (x) => {
  //   const response = await axios.post("http://localhost:8080/api/movies/savetodb", {x})
  //   console.log("sendtoserver response", response);
  // }