import express, { Request, Response } from "express"
import { verifyToken } from "../middlewares/verifyToken"
import { User } from "../models/user"
import { Movie } from "../models/movie"
import { Pair } from "../models/pair"

const router = express.Router()


router.post('/sendpairrequest', verifyToken, async (req: Request, res: Response) => {
  const receiverId = req.body.receiverId
  const senderId = res.locals.user

  const findReceiver = await User.findById(receiverId)
  if (!findReceiver) return res.sendStatus(500)

  const findSender = await User.findById(senderId)
  if (!findSender) return res.sendStatus(500)
 
  const movies = await Movie.find().sort({ imdbRatings: -1 }).limit(10)
  if (!movies) return res.sendStatus(500) // !!!
  const moviesIds = movies.map(movie => movie._id)

  const newPair = await Pair.create(
    {
      sender: senderId,
      receiver: receiverId,
      moviesTheyChoosingFrom: moviesIds,
      status: "pending"
    }
  )
  if (!newPair) return res.sendStatus(500)
  
  return res.status(200).json({pairId: newPair._id})
})


router.post('/istherearequest', verifyToken, async (req: Request, res: Response) => {
  const userid = req.body.userid
  const isReceiver = await Pair.findOne({receiver: userid, status: "pending"}).populate('sender')
  if (!isReceiver) return res.sendStatus(204)
  
  return res.status(200).json({pair: isReceiver})
})


router.post('/isrequestaccepted', verifyToken, async (req: Request, res: Response) => {
  const pairId = req.body.pairid
 
  // const findPair = await Pair.findOne({_id: pairId, status: "pending"})
  // if (!findPair) return res.sendStatus(500) 

  const pair = await Pair.findOne({_id: pairId, status: "active"}).populate([
    { 
      path: 'moviesTheyChoosingFrom', 
      select: ['_id', 'originalTitle', 'runtime', 'posterURL', 'overview']}, 
  ])
  if (!pair) return res.sendStatus(204)
  return res.status(200).json(pair)
})


router.post('/responsetopairrequest', verifyToken, async (req: Request, res: Response) => {
  const response = req.body.resp
  const pairId = req.body.pairId
 
  const findPair = await Pair.findOne({_id: pairId, status: "pending"})
  if (!findPair) return res.sendStatus(500)
    
  if (response === "accept") {
    const updatePair = await Pair.findOneAndUpdate(
      { _id: pairId }, 
      { $set: {status: "active"}}, 
      { new: true })
      .populate([
        { 
          path: 'moviesTheyChoosingFrom', 
          select: ['_id', 'originalTitle', 'runtime', 'posterURL', 'overview']
        }, 
    ])
    if (!updatePair) return res.sendStatus(500)
    return res.status(200).json(updatePair)
  }
  const updatePair = await Pair.updateOne({_id: pairId}, { status: "denied"}, {new: true})
  if (!updatePair) return res.sendStatus(500)
  return res.status(200).json("Pairing denied")
})


router.post('/likemovie', verifyToken, async (req: Request, res: Response) => {
  const response = req.body.resp
  const pairId = req.body.pairId
  const movieId = req.body.movieId
  const userId = res.locals.user

  const findPair = await Pair.findById(pairId)
  if (!findPair) return res.sendStatus(500)
  
  if (findPair.sender == userId) {
    if (response) {
      const updatePair = await Pair.findByIdAndUpdate(pairId, 
        { $addToSet: { moviesSenderLiked: movieId}},
        { new: true }
      )
      if (!updatePair) return res.sendStatus(500)
        
      const isItAMatch = updatePair.moviesReceiverLiked.find(movie => movie == movieId)
      if (!isItAMatch) return res.sendStatus(204)
      
      return res.status(200).json("it's a match")
    }
    const updatePair = await Pair.findByIdAndUpdate(pairId, 
      { $addToSet: { moviesSenderDisliked: movieId}},
      { new: true }
    )
    if (!updatePair) return res.sendStatus(500)

    return res.sendStatus(204)
  }

  if (findPair.receiver == userId) {
    if (response) {
      const updatePair = await Pair.findByIdAndUpdate(pairId, 
        { $addToSet: { moviesReceiverLiked: movieId}},
        { new: true }
      )
      if (!updatePair) return res.sendStatus(500)
        
      const isItAMatch = updatePair.moviesSenderLiked.find(movie => movie == movieId)
      if (!isItAMatch) return res.sendStatus(204)
      
      return res.status(200).json("it's a match")
    }
    const updatePair = await Pair.findByIdAndUpdate(pairId, 
      { $addToSet: { moviesReceiverDisliked: movieId}},
      { new: true }
    )
    if (!updatePair) return res.sendStatus(500)

    return res.sendStatus(204)
  }
})


router.post('/isthereamatch', verifyToken, async (req: Request, res: Response) => {
  const pairId = req.body.pairId
  const findPair = await Pair.findById(pairId)
  if (!findPair) return res.sendStatus(500)
  
  const match = findPair.moviesSenderLiked.filter(movieId => findPair.moviesReceiverLiked.indexOf(movieId) !== -1);
  if (match.length === 0) return res.sendStatus(204)

  const movie = await Movie.findById(match)
  if (!movie) return res.sendStatus(500)
    
  return res.status(200).json(movie)
})

export default router