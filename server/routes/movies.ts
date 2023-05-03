// import express, { Response, Request } from "express"
// import { Movie } from "../models/movie";
// import { z } from "zod";
// import { verify } from "../middlewares/verify";

// const router = express.Router()

// const NewMovieSchema = z.object({
//   cast: z.array(z.string()),
//   countries: z.array(z.string()),
//   directors: z.array(z.string()),
//   genres: z.array(z.object({
//     id: z.number(),
//     name: z.string()
//   })),
//   imdbId: z.string(),
//   imdbRating: z.number(),
//   originalLanguage: z.string(),
//   originalTitle: z.string(),
//   overview: z.string(),
//   posterURL: z.string(),
//   runtime: z.number(),
//   title: z.string(),
//   year: z.number()
// })

// router.post('/savetodb', async (req: Request, res: Response) => {
//   console.log("savetodb reqbody", req.body.x);
//   const moviesArray = req.body.x
//   const nemtudom = await moviesArray.map((movie: object) => {
//     return Movie.create(movie)
//   })
//   console.log("nemtudom", nemtudom);
  
//   return res.sendStatus(200)
// })
  
// export default router